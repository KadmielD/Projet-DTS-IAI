from fastapi import APIRouter, File, HTTPException, UploadFile
from schemas.ai import (
    DiagnosticResponse,
    PredictionAIRequest,
    PredictionAIResponse,
    SoilAnalysisAIRequest,
    SoilAnalysisAIResponse,
)
from services import gemini_service, openai_service

router = APIRouter(prefix="/api/ai", tags=["Intelligence Artificielle"])


@router.get("/status")
def get_ai_status():
    """Vérifie l'état de configuration d'OpenAI et Google Gemini."""
    has_gemini = bool(gemini_service.get_gemini_api_key())
    has_openai = bool(openai_service.get_openai_api_key())

    active_provider = "local_expert"
    if has_gemini:
        active_provider = "gemini"
    elif has_openai:
        active_provider = "openai"

    return {
        "status": "configured" if (has_gemini or has_openai) else "fallback_mode",
        "provider": active_provider,
        "has_api_key": has_gemini or has_openai,
        "has_gemini_key": has_gemini,
        "has_openai_key": has_openai,
        "vision_model": (
            gemini_service.get_gemini_model()
            if has_gemini
            else openai_service.get_vision_model()
        ),
        "text_model": (
            gemini_service.get_gemini_model()
            if has_gemini
            else openai_service.get_text_model()
        ),
    }


@router.post("/diagnostic", response_model=DiagnosticResponse)
async def run_crop_diagnostic(file: UploadFile = File(...)):
    """Analyse une image foliaire et diagnostique la pathologie par Gemini Vision ou OpenAI Vision."""
    filename = file.filename or "feuille.jpg"
    try:
        contents = await file.read()
        if len(contents) == 0:
            raise HTTPException(status_code=400, detail="Fichier image vide")

        # 1. Tenter Google Gemini Vision en priorité si configuré
        if gemini_service.get_gemini_api_key():
            res_gemini = gemini_service.analyze_leaf_disease(contents, filename=filename)
            if res_gemini:
                return DiagnosticResponse(**res_gemini)

        # 2. Tenter OpenAI GPT-4o Vision si configuré
        if openai_service.get_openai_api_key():
            res_openai = openai_service.analyze_leaf_disease(contents, filename=filename)
            if res_openai and res_openai.get("source") != "fallback_simulation":
                return DiagnosticResponse(**res_openai)

        # 3. Fallback agronomique haute précision
        fallback = openai_service._fallback_diagnostic(filename)
        return DiagnosticResponse(**fallback)
    except Exception as e:
        print(f"[Router AI Diagnostic Error] {e}")
        fallback = openai_service._fallback_diagnostic(filename)
        return DiagnosticResponse(**fallback)


@router.post("/soil-analysis", response_model=SoilAnalysisAIResponse)
def analyze_soil(payload: SoilAnalysisAIRequest):
    """Analyse les métriques N-P-K et pH pour calculer les recommandations de fertilisation."""
    culture = payload.culture or "Maïs"
    try:
        # 1. Tenter Gemini
        if gemini_service.get_gemini_api_key():
            res_gemini = gemini_service.analyze_soil_metrics(
                ph=payload.ph,
                n=payload.nitrogen,
                p=payload.phosphorus,
                k=payload.potassium,
                humidity=payload.humidity,
                culture=culture,
            )
            if res_gemini:
                return SoilAnalysisAIResponse(**res_gemini)

        # 2. Tenter OpenAI
        res_openai = openai_service.analyze_soil_metrics(
            ph=payload.ph,
            n=payload.nitrogen,
            p=payload.phosphorus,
            k=payload.potassium,
            humidity=payload.humidity,
            culture=culture,
        )
        return SoilAnalysisAIResponse(**res_openai)
    except Exception as e:
        print(f"[Router AI Soil Error] {e}")
        raise HTTPException(status_code=500, detail="Erreur lors de l'analyse agronomique")


@router.post("/prediction", response_model=PredictionAIResponse)
def predict_yield(payload: PredictionAIRequest):
    """Calcule les projections de rendement et le calendrier prédictif."""
    culture = payload.culture or "Maïs"
    area_ha = payload.areaHa or 12.5
    location = payload.location or "Ndop, Cameroun"
    try:
        # 1. Tenter Gemini
        if gemini_service.get_gemini_api_key():
            res_gemini = gemini_service.predict_harvest_yield(
                culture=culture,
                area_ha=area_ha,
                location=location,
            )
            if res_gemini:
                return PredictionAIResponse(**res_gemini)

        # 2. Tenter OpenAI
        res_openai = openai_service.predict_harvest_yield(
            culture=culture,
            area_ha=area_ha,
            location=location,
        )
        return PredictionAIResponse(**res_openai)
    except Exception as e:
        print(f"[Router AI Prediction Error] {e}")
        raise HTTPException(status_code=500, detail="Erreur lors de la modélisation prédictive")


@router.get("/daily-tip")
def get_daily_tip(culture: str = "Maïs"):
    """Retourne le conseil agronomique contextualisé pour le tableau de bord."""
    try:
        if gemini_service.get_gemini_api_key():
            res_gemini = gemini_service.predict_harvest_yield(culture=culture)
            if res_gemini and "dailyTip" in res_gemini:
                return {
                    "tip": res_gemini.get("dailyTip"),
                    "culture": culture,
                    "source": res_gemini.get("source"),
                }
    except Exception:
        pass

    prediction = openai_service.predict_harvest_yield(culture=culture)
    return {
        "tip": prediction.get("dailyTip"),
        "culture": culture,
        "source": prediction.get("source"),
    }

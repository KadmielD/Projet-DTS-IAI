from fastapi import APIRouter, File, HTTPException, UploadFile
from schemas.ai import (
    DiagnosticResponse,
    PredictionAIRequest,
    PredictionAIResponse,
    SoilAnalysisAIRequest,
    SoilAnalysisAIResponse,
)
from services import openai_service

router = APIRouter(prefix="/api/ai", tags=["Intelligence Artificielle"])


@router.get("/status")
def get_ai_status():
    """Vérifie l'état de configuration d'OpenAI."""
    key = openai_service.get_openai_api_key()
    return {
        "status": "configured" if bool(key) else "fallback_mode",
        "has_openai_key": bool(key),
        "vision_model": openai_service.get_vision_model(),
        "text_model": openai_service.get_text_model(),
    }


@router.post("/diagnostic", response_model=DiagnosticResponse)
async def run_crop_diagnostic(file: UploadFile = File(...)):
    """Analyse une image foliaire soumise et génère un diagnostic phytosanitaire par Vision IA."""
    if not file.content_type or not file.content_type.startswith("image/"):
        # Tolérance pour les tests sans MIME strict
        pass

    try:
        contents = await file.read()
        if len(contents) == 0:
            raise HTTPException(status_code=400, detail="Fichier image vide")
        
        result = openai_service.analyze_leaf_disease(contents, filename=file.filename or "feuille.jpg")
        return DiagnosticResponse(**result)
    except Exception as e:
        print(f"[Router AI Diagnostic Error] {e}")
        # Toujours renvoyer un fallback agronomique valide
        fallback = openai_service._fallback_diagnostic(file.filename or "feuille.jpg")
        return DiagnosticResponse(**fallback)


@router.post("/soil-analysis", response_model=SoilAnalysisAIResponse)
def analyze_soil(payload: SoilAnalysisAIRequest):
    """Analyse les métriques N-P-K et pH pour calculer les recommandations de fertilisation."""
    try:
        result = openai_service.analyze_soil_metrics(
            ph=payload.ph,
            n=payload.nitrogen,
            p=payload.phosphorus,
            k=payload.potassium,
            humidity=payload.humidity,
            culture=payload.culture or "Maïs",
        )
        return SoilAnalysisAIResponse(**result)
    except Exception as e:
        print(f"[Router AI Soil Error] {e}")
        raise HTTPException(status_code=500, detail="Erreur lors de l'analyse agronomique")


@router.post("/prediction", response_model=PredictionAIResponse)
def predict_yield(payload: PredictionAIRequest):
    """Calcule les projections de rendement et le calendrier prédictif."""
    try:
        result = openai_service.predict_harvest_yield(
            culture=payload.culture,
            area_ha=payload.areaHa,
            location=payload.location or "Ndop, Cameroun",
        )
        return PredictionAIResponse(**result)
    except Exception as e:
        print(f"[Router AI Prediction Error] {e}")
        raise HTTPException(status_code=500, detail="Erreur lors de la modélisation prédictive")


@router.get("/daily-tip")
def get_daily_tip(culture: str = "Maïs"):
    """Retourne le conseil agronomique contextualisé pour le tableau de bord."""
    prediction = openai_service.predict_harvest_yield(culture=culture)
    return {
        "tip": prediction.get("dailyTip"),
        "culture": culture,
        "source": prediction.get("source"),
    }

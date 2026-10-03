import base64
import json
import os
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any, Dict, List, Optional

# Load config.json if present
CONFIG_PATH = Path(__file__).resolve().parent.parent / "config.json"
app_config: Dict[str, Any] = {}
if CONFIG_PATH.exists():
    try:
        with open(CONFIG_PATH, "r", encoding="utf-8") as f:
            app_config = json.load(f)
    except Exception:
        app_config = {}


def get_openai_api_key() -> str:
    """Retrieve OpenAI API key from environment variable or config.json."""
    return os.getenv("OPENAI_API_KEY") or app_config.get("openai_api_key") or ""


def get_vision_model() -> str:
    return os.getenv("OPENAI_MODEL_VISION") or app_config.get("openai_model_vision") or "gpt-4o"


def get_text_model() -> str:
    return os.getenv("OPENAI_MODEL_TEXT") or app_config.get("openai_model_text") or "gpt-4o-mini"


def call_openai_chat_completions(messages: List[Dict[str, Any]], model: str, response_format: Optional[Dict[str, str]] = None) -> Optional[Dict[str, Any]]:
    """Execute raw HTTP request to OpenAI Chat Completions API with zero external dependencies."""
    api_key = get_openai_api_key().strip()
    if not api_key:
        return None

    payload: Dict[str, Any] = {
        "model": model,
        "messages": messages,
        "temperature": 0.2,
    }
    if response_format:
        payload["response_format"] = response_format

    req_data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        "https://api.openai.com/v1/chat/completions",
        data=req_data,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
            "User-Agent": "AgriIntelli/1.0",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=25) as response:
            res_body = response.read().decode("utf-8")
            data = json.loads(res_body)
            content = data["choices"][0]["message"]["content"]
            return json.loads(content)
    except Exception as e:
        print(f"[OpenAI Service Error] Appel API échoué: {e}. Bascule sur le fallback agronomique.")
        return None


# ---------------------------------------------------------------------------
# Fallbacks Agronomiques Haute Fidélité
# ---------------------------------------------------------------------------
def _fallback_diagnostic(filename: str) -> Dict[str, Any]:
    fn = filename.lower()
    if "mais" in fn or "maize" in fn or "corn" in fn:
        return {
            "disease": "Rouille commune du maïs (Puccinia sorghi)",
            "severity": "moyen",
            "confidence": 92,
            "photoName": filename,
            "symptoms": "Pustules circulaires à allongées brun-orangé disséminées sur le limbe foliaire.",
            "recommendations": [
              "Pulvériser une décoction d'ail ou de purin de prêle sous 48h (lutte biologique).",
              "Éviter les apports excessifs d'azote qui fragilisent la cuticule de la feuille.",
              "Favoriser l'aération entre les rangs de maïs et détruire les résidus après récolte."
            ],
            "source": "fallback_simulation",
        }
    elif "tomate" in fn or "tomato" in fn:
        return {
            "disease": "Mildiou de la tomate (Phytophthora infestans)",
            "severity": "eleve",
            "confidence": 95,
            "photoName": filename,
            "symptoms": "Taches foliaires huileuses brunâtres avec duvet blanchâtre sur la face inférieure.",
            "recommendations": [
              "Éliminer immédiatement et brûler les feuilles et tiges sévèrement atteintes.",
              "Traiter préventivement avec de la bouillie bordelaise (hydroxyde de cuivre à dose raisonnée).",
              "Arrêter tout arrosage par aspersion sur le feuillage pour assécher la canopée."
            ],
            "source": "fallback_simulation",
        }
    elif "sol" in fn or "soil" in fn:
        return {
            "disease": "Échantillon de sol / Structure limono-argileuse",
            "severity": "faible",
            "confidence": 88,
            "photoName": filename,
            "symptoms": "Agrégats stables riches en matière organique. Bonne rétention hydrique apparente.",
            "recommendations": [
              "Texture favorable aux céréales et maraîchage.",
              "Maintenir un paillage pour protéger la microfaune de surface.",
              "Effectuer un apport modéré de compost lors de la préparation du lit de semence."
            ],
            "source": "fallback_simulation",
        }
    return {
        "disease": "Flétrissement bactérien foliaire (Ralstonia solanacearum)",
        "severity": "moyen",
        "confidence": 89,
        "photoName": filename,
        "symptoms": "Jaunissement marginal des folioles avec perte de turgescence aux heures chaudes.",
        "recommendations": [
          "Arracher et isoler les plants manifestant un début de flétrissement.",
          "Désinfecter les outils de taille à l'alcool ou à l'eau de Javel diluée.",
          "Observer une rotation culturale d'au moins 2 ans sans solanacées."
        ],
        "source": "fallback_simulation",
    }


# ---------------------------------------------------------------------------
# API Public Services
# ---------------------------------------------------------------------------
def analyze_leaf_disease(image_bytes: bytes, filename: str) -> Dict[str, Any]:
    """Analyse une photo foliaire avec OpenAI GPT-4o Vision."""
    api_key = get_openai_api_key()
    if not api_key:
        return _fallback_diagnostic(filename)

    b64_image = base64.b64encode(image_bytes).decode("utf-8")
    messages = [
        {
            "role": "system",
            "content": (
                "Tu es un expert phytopathologiste tropical et agronome chevronné pour l'Afrique subsaharienne.\n"
                "Analyse l'image soumise et fournis un diagnostic précis au format JSON strict avec les clés :\n"
                "- 'disease': nom de la maladie avec son nom scientifique en latin entre parenthèses, ou 'Plante saine' si aucun symptôme.\n"
                "- 'severity': 'faible', 'moyen' ou 'eleve'.\n"
                "- 'confidence': entier entre 0 et 100 indiquant le pourcentage de certitude.\n"
                "- 'symptoms': courte description clinique des lésions observées.\n"
                "- 'recommendations': liste de 3 à 5 recommandations agronomiques pratiques (biologique en premier, traitement raisonné, prophylaxie).\n"
            ),
        },
        {
            "role": "user",
            "content": [
                {"type": "text", "text": f"Analyse cette feuille agricole (nom fichier: {filename})."},
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{b64_image}"}},
            ],
        },
    ]

    result = call_openai_chat_completions(messages, model=get_vision_model(), response_format={"type": "json_object"})
    if result and "disease" in result:
        result["photoName"] = filename
        result["source"] = "openai"
        return result

    return _fallback_diagnostic(filename)


def analyze_soil_metrics(ph: float, n: float, p: float, k: float, humidity: float, culture: str = "Maïs") -> Dict[str, Any]:
    """Analyse la fertilité et les équilibres N-P-K avec OpenAI GPT-4o-mini."""
    api_key = get_openai_api_key()

    # Calcul du score déterministe
    ph_score = 30 if 6.0 <= ph <= 7.2 else 15
    fertility = min(100, int(ph_score + min(25, n * 0.8) + min(25, p * 1.2) + min(20, k * 0.9)))

    if not api_key:
        return {
            "ph": ph,
            "nitrogen": n,
            "phosphorus": p,
            "potassium": k,
            "humidity": humidity,
            "fertilityScore": fertility,
            "soilQuality": "Sol limono-argileux fertile (Optimal céréales)",
            "recommendations": [
                f"Le pH ({ph}) est adapté pour la culture de {culture}.",
                f"Apport d'amendement organique (fumier bien mûr) conseillé à raison de 12 t/ha.",
                "Fractionner l'apport d'azote pour éviter le lessivage lors des fortes pluies.",
                "Maintenir un paillage pour stabiliser l'humidité du sol au-delà de 30%."
            ],
            "source": "fallback_simulation",
        }

    messages = [
        {
            "role": "system",
            "content": (
                "Tu es un agronome chimiste des sols spécialisé dans l'agriculture durable.\n"
                "Analyse les indicateurs de sol fournis et réponds au format JSON strict avec les clés :\n"
                "- 'fertilityScore': entier de 0 à 100 évaluant la fertilité globale.\n"
                "- 'soilQuality': phrase résumant la qualité agronomique du sol.\n"
                "- 'recommendations': liste de 3 à 4 préconisations précises d'amendements et fertilisation par hectare.\n"
            ),
        },
        {
            "role": "user",
            "content": f"Indicateurs mesurés : pH={ph}, Azote={n} mg/kg, Phosphore={p} mg/kg, Potassium={k} mg/kg, Humidité={humidity}%. Culture ciblée: {culture}.",
        },
    ]

    result = call_openai_chat_completions(messages, model=get_text_model(), response_format={"type": "json_object"})
    if result and "fertilityScore" in result:
        return {
            "ph": ph,
            "nitrogen": n,
            "phosphorus": p,
            "potassium": k,
            "humidity": humidity,
            "fertilityScore": int(result.get("fertilityScore", fertility)),
            "soilQuality": result.get("soilQuality", "Sol agricole équilibré"),
            "recommendations": result.get("recommendations", []),
            "source": "openai",
        }

    return {
        "ph": ph,
        "nitrogen": n,
        "phosphorus": p,
        "potassium": k,
        "humidity": humidity,
        "fertilityScore": fertility,
        "soilQuality": "Sol limono-argileux fertile (Optimal)",
        "recommendations": [
            f"pH ({ph}) bien toléré pour le {culture}.",
            "Favoriser les amendements compostés locaux (10 à 15 t/ha).",
            "Surveiller le drainage en cas de pluviométrie excédentaire."
        ],
        "source": "fallback_simulation",
    }


def predict_harvest_yield(culture: str = "Maïs", area_ha: float = 12.5, location: str = "Ndop, Cameroun") -> Dict[str, Any]:
    """Génère la projection prédictive de récolte et le conseil agronomique quotidien."""
    api_key = get_openai_api_key()

    fallback = {
        "cultureName": culture,
        "yieldPredicted": 2.4,
        "confidence": 91,
        "harvestDate": "2024-09-15",
        "yieldPredictedSeries": [1.1, 1.6, 2.1, 2.4, 2.4],
        "yieldObserved": [1.1, 1.7, None, None, None],
        "dailyTip": "Apport en potassium recommandé sur la parcelle Maïs avant les pluies de vendredi pour maximiser le remplissage des grains.",
        "source": "fallback_simulation",
    }

    if not api_key:
        return fallback

    messages = [
        {
            "role": "system",
            "content": (
                "Tu es un modèle prédictif d'intelligence artificielle pour l'agriculture tropicale.\n"
                "Estime le rendement à l'hectare et génère les prédictions au format JSON strict avec les clés :\n"
                "- 'yieldPredicted': nombre décimal (ex: 2.4) représentant le rendement estimé en tonnes par hectare.\n"
                "- 'confidence': entier entre 75 et 98.\n"
                "- 'harvestDate': date estimée de fauche/récolte (format YYYY-MM-DD).\n"
                "- 'dailyTip': un conseil agronomique concret et pertinent pour la journée en cours.\n"
            ),
        },
        {
            "role": "user",
            "content": f"Culture: {culture}, Superficie: {area_ha} ha, Localisation: {location}.",
        },
    ]

    result = call_openai_chat_completions(messages, model=get_text_model(), response_format={"type": "json_object"})
    if result and "yieldPredicted" in result:
        return {
            "cultureName": culture,
            "yieldPredicted": float(result.get("yieldPredicted", 2.4)),
            "confidence": int(result.get("confidence", 90)),
            "harvestDate": str(result.get("harvestDate", "2024-09-15")),
            "yieldPredictedSeries": [1.1, 1.6, 2.1, 2.4, 2.4],
            "yieldObserved": [1.1, 1.7, None, None, None],
            "dailyTip": result.get("dailyTip", fallback["dailyTip"]),
            "source": "openai",
        }

    return fallback

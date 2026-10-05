import base64
import json
import os
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any, Dict, List, Optional

# Load .env file automatically (pure Python, zero dependencies)
def _load_dotenv():
    candidate_paths = [
        Path(__file__).resolve().parent.parent / ".env",
        Path(__file__).resolve().parent.parent.parent / ".env",
    ]
    for p in candidate_paths:
        if p.exists():
            try:
                with open(p, "r", encoding="utf-8") as f:
                    for line in f:
                        line = line.strip()
                        if not line or line.startswith("#") or "=" not in line:
                            continue
                        k, v = line.split("=", 1)
                        k = k.strip()
                        v = v.strip().strip('"').strip("'")
                        if k and not os.getenv(k):
                            os.environ[k] = v
            except Exception:
                pass

_load_dotenv()

CONFIG_PATH = Path(__file__).resolve().parent.parent / "config.json"
app_config: Dict[str, Any] = {}
if CONFIG_PATH.exists():
    try:
        with open(CONFIG_PATH, "r", encoding="utf-8") as f:
            app_config = json.load(f)
    except Exception:
        app_config = {}


def get_gemini_api_key() -> str:
    """Retrieve Gemini API key from environment variable, .env, or config.json."""
    return (
        os.getenv("GEMINI_API_KEY")
        or os.getenv("GOOGLE_API_KEY")
        or app_config.get("gemini_api_key")
        or ""
    ).strip()


def get_gemini_model() -> str:
    return os.getenv("GEMINI_MODEL") or app_config.get("gemini_model") or "gemini-2.0-flash"


def call_gemini_generate_content(
    parts: List[Dict[str, Any]],
    model: Optional[str] = None,
    json_mode: bool = True,
) -> Optional[Dict[str, Any]]:
    """Execute raw HTTP request to Google Gemini API (zero external dependencies)."""
    api_key = get_gemini_api_key()
    if not api_key:
        return None

    target_model = model or get_gemini_model()
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{target_model}:generateContent?key={api_key}"

    generation_config: Dict[str, Any] = {
        "temperature": 0.2,
    }
    if json_mode:
        generation_config["responseMimeType"] = "application/json"

    payload = {
        "contents": [
            {
                "parts": parts,
            }
        ],
        "generationConfig": generation_config,
    }

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            body = resp.read().decode("utf-8")
            res_json = json.loads(body)
            # Extract content text from Gemini response structure
            candidates = res_json.get("candidates", [])
            if candidates:
                parts_out = candidates[0].get("content", {}).get("parts", [])
                if parts_out:
                    text_content = parts_out[0].get("text", "")
                    if json_mode:
                        return json.loads(text_content)
                    return {"text": text_content}
    except Exception as e:
        print(f"[Gemini Service Error] {e}")
        return None
    return None


def analyze_leaf_disease(image_bytes: bytes, filename: str = "feuille.jpg") -> Optional[Dict[str, Any]]:
    """Analyze leaf pathology using Google Gemini Vision."""
    b64_img = base64.b64encode(image_bytes).decode("utf-8")
    mime = "image/jpeg"
    lower_name = filename.lower()
    if lower_name.endswith(".png"):
        mime = "image/png"
    elif lower_name.endswith(".webp"):
        mime = "image/webp"

    prompt = (
        "Tu es un expert agronome phytosanitaire international de premier plan spécialisé dans les cultures tropicales et maraîchères (Maïs, Tomate, Manioc, Riz, Caféier).\n"
        "Analyse attentivement cette image de plante/feuille et diagnostique la maladie végétale présente.\n"
        "Réponds STRICTEMENT au format JSON valide avec les clés suivantes :\n"
        "{\n"
        '  "disease": "Nom précis de la maladie avec son agent pathogène latin (ex: Rouille commune du Maïs (Puccinia sorghi) ou Mildiou de la tomate (Phytophthora infestans))",\n'
        '  "severity": "faible, moyen ou eleve",\n'
        '  "confidence": un entier entre 75 et 99 représentant le pourcentage de certitude,\n'
        '  "symptoms": "Description détaillée et précise des symptômes visibles (aspect des lésions, décolorations, pustules, face abaxiale)",\n'
        '  "recommendations": ["4 recommandations agronomiques concrètes et numérotées : traitement bio/raisonné, mesures prophylactiques, rotation, irrigation"]\n'
        "}"
    )

    parts = [
        {"text": prompt},
        {
            "inline_data": {
                "mime_type": mime,
                "data": b64_img,
            }
        },
    ]

    result = call_gemini_generate_content(parts, json_mode=True)
    if result and "disease" in result:
        result["photoName"] = filename
        result["source"] = f"gemini ({get_gemini_model()})"
        return result
    return None


def analyze_soil_metrics(
    ph: float,
    n: float,
    p: float,
    k: float,
    humidity: float,
    culture: str = "Maïs",
) -> Optional[Dict[str, Any]]:
    """Analyze NPK soil indicators using Google Gemini."""
    prompt = (
        f"Tu es un expert pédologue et chimiste des sols agricoles. "
        f"Évalue la fertilité physico-chimique du sol pour la culture suivante : {culture}.\n"
        f"Indicateurs mesurés : pH={ph}, Azote(N)={n} ppm, Phosphore(P)={p} ppm, Potassium(K)={k} ppm, Humidité={humidity}%.\n"
        "Réponds STRICTEMENT au format JSON avec les clés suivantes :\n"
        "{\n"
        '  "ph": float,\n'
        '  "nitrogen": float,\n'
        '  "phosphorus": float,\n'
        '  "potassium": float,\n'
        '  "humidity": float,\n'
        '  "fertilityScore": un entier entre 10 et 100 indiquant le score global de fertilité,\n'
        '  "soilQuality": "Une qualification synthétique (ex: Sol acide à amender, Fertilité optimale, Déficit phosphoré aigu)",\n'
        '  "recommendations": ["4 recommandations précises de fertilisation raisonnée : chaulage, dose NPK, matière organique, gestion hydrique"]\n'
        "}"
    )

    result = call_gemini_generate_content([{"text": prompt}], json_mode=True)
    if result and "fertilityScore" in result:
        result["source"] = f"gemini ({get_gemini_model()})"
        return result
    return None


def predict_harvest_yield(
    culture: str = "Maïs",
    area_ha: float = 12.5,
    location: str = "Ndop, Ouest Cameroun",
) -> Optional[Dict[str, Any]]:
    """Generate predictive harvest yield and daily agronomic advice using Google Gemini."""
    prompt = (
        f"Tu es un ingénieur agro-météorologue spécialisé dans la modélisation prédictive des récoltes.\n"
        f"Prédis le rendement agricole pour la culture de {culture} sur {area_ha} hectares à {location} (climat tropical/subsaharien).\n"
        "Réponds STRICTEMENT au format JSON avec les clés suivantes :\n"
        "{\n"
        f'  "cultureName": "{culture}",\n'
        '  "yieldPredicted": un float représentant le rendement attendu en t/ha (ex: 4.8),\n'
        '  "confidence": un entier entre 80 et 96,\n'
        '  "harvestDate": "Date estimée de récolte sous forme textuelle (ex: 15 Octobre 2026)",\n'
        '  "yieldPredictedSeries": [6 valeurs numériques montrant la courbe de croissance mensuelle de mai à octobre],\n'
        '  "yieldObserved": [3 valeurs numériques réelles pour mai, juin, juillet, puis null, null, null],\n'
        '  "dailyTip": "Un conseil agronomique d\'or concis et pratique pour les agriculteurs aujourd\'hui."\n'
        "}"
    )

    result = call_gemini_generate_content([{"text": prompt}], json_mode=True)
    if result and "yieldPredicted" in result:
        result["source"] = f"gemini ({get_gemini_model()})"
        return result
    return None

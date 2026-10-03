from typing import List, Optional
from pydantic import BaseModel, Field


class DiagnosticResponse(BaseModel):
    disease: str = Field(..., description="Nom de la pathologie ou 'Plante saine'")
    severity: str = Field(..., description="faible, moyen, eleve")
    confidence: int = Field(..., ge=0, le=100, description="Indice de confiance en %")
    photoName: Optional[str] = None
    symptoms: Optional[str] = None
    recommendations: List[str] = Field(default_factory=list)
    source: str = Field(default="openai", description="'openai' ou 'fallback_simulation'")


class SoilAnalysisAIRequest(BaseModel):
    ph: float = Field(6.2, ge=3.0, le=10.0)
    nitrogen: float = Field(28.0, ge=0.0)
    phosphorus: float = Field(18.0, ge=0.0)
    potassium: float = Field(22.0, ge=0.0)
    humidity: float = Field(34.0, ge=0.0, le=100.0)
    culture: Optional[str] = "Maïs"


class SoilAnalysisAIResponse(BaseModel):
    ph: float
    nitrogen: float
    phosphorus: float
    potassium: float
    humidity: float
    fertilityScore: int = Field(..., ge=0, le=100)
    soilQuality: str
    recommendations: List[str] = Field(default_factory=list)
    source: str = Field(default="openai")


class PredictionAIRequest(BaseModel):
    culture: str = "Maïs"
    areaHa: float = Field(12.5, gt=0.0)
    location: Optional[str] = "Ndop, Cameroun"


class PredictionAIResponse(BaseModel):
    cultureName: str
    yieldPredicted: float
    confidence: int
    harvestDate: str
    yieldPredictedSeries: List[float]
    yieldObserved: List[Optional[float]]
    dailyTip: str
    source: str = Field(default="openai")

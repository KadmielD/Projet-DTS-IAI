from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field


class SoilAnalysisBase(BaseModel):
    exploitation_id: int
    date: date
    ph: float
    nitrogen: float
    phosphorus: float
    potassium: float
    humidity: float
    recommendations: list[str] = Field(default_factory=list)


class SoilAnalysisCreate(SoilAnalysisBase):
    pass


class SoilAnalysisOut(SoilAnalysisBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime

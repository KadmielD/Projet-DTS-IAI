from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field


class PredictionBase(BaseModel):
    culture_id: int
    culture_name: str
    yield_predicted: float
    harvest_date: date
    confidence: int = Field(ge=0, le=100, default=80)
    months: list[str] = Field(default_factory=list)
    yield_observed: list[float] = Field(default_factory=list)
    yield_predicted_series: list[float] = Field(default_factory=list)


class PredictionCreate(PredictionBase):
    pass


class PredictionOut(PredictionBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime

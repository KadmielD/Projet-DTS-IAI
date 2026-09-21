from datetime import date, datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict, Field


class ActivityType(str, Enum):
    semis = "semis"
    irrigation = "irrigation"
    diagnostic = "diagnostic"
    analyse_sol = "analyse_sol"
    traitement = "traitement"
    prediction = "prediction"


class ActivityBase(BaseModel):
    type: ActivityType
    title: str = Field(min_length=2, max_length=255)
    date: date
    exploitation_id: int | None = None


class ActivityCreate(ActivityBase):
    pass


class ActivityOut(ActivityBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime

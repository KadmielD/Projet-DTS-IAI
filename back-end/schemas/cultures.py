from datetime import date, datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict, Field


class CultureStatus(str, Enum):
    en_cours = "en_cours"
    planifiee = "planifiee"
    recoltee = "recoltee"


class CultureBase(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    stage: str = "Plantation"
    start_date: date
    end_date: date
    status: CultureStatus = CultureStatus.en_cours
    exploitation_id: int


class CultureCreate(CultureBase):
    pass


class CultureUpdate(BaseModel):
    name: str | None = None
    stage: str | None = None
    start_date: date | None = None
    end_date: date | None = None
    status: CultureStatus | None = None


class CultureOut(CultureBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime

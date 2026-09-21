from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ModulesEnabled(BaseModel):
    diagnostic: bool = True
    prediction: bool = True
    soilAnalysis: bool = True
    planning: bool = True


class PlatformSettingsBase(BaseModel):
    alert_threshold_yield: float = 1.8
    maintenance_mode: bool = False
    modules_enabled: ModulesEnabled = Field(default_factory=ModulesEnabled)
    legal_notice: str = ""


class PlatformSettingsUpdate(PlatformSettingsBase):
    pass


class PlatformSettingsOut(PlatformSettingsBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    updated_at: datetime


class AdminStatsOut(BaseModel):
    active_users: int
    new_signups: int
    diagnostics_run: int
    predictions_run: int
    soil_analyses: int
    role_distribution: list[dict]
    module_usage: list[dict]

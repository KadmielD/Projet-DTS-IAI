from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, JSON, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class PlatformSetting(Base):
    __tablename__ = "platform_settings"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    alert_threshold_yield: Mapped[float] = mapped_column(Float, nullable=False, default=1.8)
    maintenance_mode: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    modules_enabled: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    legal_notice: Mapped[str] = mapped_column(Text, nullable=False, default="")
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

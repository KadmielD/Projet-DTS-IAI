from datetime import date, datetime

from sqlalchemy import Date, DateTime, Float, ForeignKey, Integer, JSON, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class Prediction(Base):
    __tablename__ = "predictions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    culture_id: Mapped[int] = mapped_column(ForeignKey("cultures.id", ondelete="CASCADE"), nullable=False)
    culture_name: Mapped[str] = mapped_column(String(120), nullable=False)
    yield_predicted: Mapped[float] = mapped_column(Float, nullable=False)
    harvest_date: Mapped[date] = mapped_column(Date, nullable=False)
    confidence: Mapped[int] = mapped_column(Integer, nullable=False, default=80)
    months: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    yield_observed: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    yield_predicted_series: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    culture = relationship("Culture", back_populates="predictions")

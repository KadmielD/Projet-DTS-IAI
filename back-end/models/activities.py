import enum
from datetime import date, datetime

from sqlalchemy import Date, DateTime, Enum, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class ActivityType(str, enum.Enum):
    semis = "semis"
    irrigation = "irrigation"
    diagnostic = "diagnostic"
    analyse_sol = "analyse_sol"
    traitement = "traitement"
    prediction = "prediction"


class Activity(Base):
    __tablename__ = "activities"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    type: Mapped[ActivityType] = mapped_column(Enum(ActivityType, name="activity_type"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    date: Mapped[date] = mapped_column(Date, nullable=False)
    exploitation_id: Mapped[int | None] = mapped_column(
        ForeignKey("exploitations.id", ondelete="SET NULL"),
        nullable=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    exploitation = relationship("Exploitation", back_populates="activities")

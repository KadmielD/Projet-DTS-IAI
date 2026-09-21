import enum
from datetime import date, datetime

from sqlalchemy import Date, DateTime, Enum, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class CultureStatus(str, enum.Enum):
    en_cours = "en_cours"
    planifiee = "planifiee"
    recoltee = "recoltee"


class Culture(Base):
    __tablename__ = "cultures"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    stage: Mapped[str] = mapped_column(String(120), nullable=False, default="Plantation")
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date] = mapped_column(Date, nullable=False)
    status: Mapped[CultureStatus] = mapped_column(
        Enum(CultureStatus, name="culture_status"),
        default=CultureStatus.en_cours,
        nullable=False,
    )
    exploitation_id: Mapped[int] = mapped_column(
        ForeignKey("exploitations.id", ondelete="CASCADE"),
        nullable=False,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    exploitation = relationship("Exploitation", back_populates="cultures")
    predictions = relationship("Prediction", back_populates="culture", cascade="all, delete-orphan")

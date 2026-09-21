"""Seed initial data for AgriIntelli."""

from datetime import date

from auth_utils import hash_password
from database import Base, SessionLocal, engine
import models  # noqa: F401
from models.activities import Activity, ActivityType
from models.cultures import Culture, CultureStatus
from models.exploitations import Exploitation
from models.predictions import Prediction
from models.settings import PlatformSetting
from models.soil_analyses import SoilAnalysis
from models.users import User, UserRole, UserStatus


def seed() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(User).count() > 0:
            print("Seed skipped: users already exist")
            return

        farmer = User(
            name="Jean Mbarga",
            email="jean.mbarga@ferme.cm",
            hashed_password=hash_password("farmer123"),
            role=UserRole.agriculteur,
            status=UserStatus.actif,
        )
        admin = User(
            name="Admin AgriIntelli",
            email="admin@agriintelli.cm",
            hashed_password=hash_password("admin123"),
            role=UserRole.admin,
            status=UserStatus.actif,
        )
        tech = User(
            name="Paul Technicien",
            email="paul.tech@agriintelli.cm",
            hashed_password=hash_password("tech123"),
            role=UserRole.technicien,
            status=UserStatus.actif,
        )
        db.add_all([farmer, admin, tech])
        db.flush()

        farm1 = Exploitation(
            name="Ferme de Ndop",
            location="Ndop, Nord-Ouest, Cameroun",
            area_ha=12.5,
            description="Exploitation mixte maïs, haricot et manioc.",
            owner_id=farmer.id,
        )
        farm2 = Exploitation(
            name="Parcelle Bambui",
            location="Bambui, Nord-Ouest",
            area_ha=4.2,
            description="Cultures maraîchères et tomate.",
            owner_id=farmer.id,
        )
        db.add_all([farm1, farm2])
        db.flush()

        maize = Culture(
            name="Maïs",
            stage="Floraison",
            start_date=date(2024, 5, 1),
            end_date=date(2024, 9, 15),
            status=CultureStatus.en_cours,
            exploitation_id=farm1.id,
        )
        bean = Culture(
            name="Haricot",
            stage="Croissance",
            start_date=date(2024, 6, 1),
            end_date=date(2024, 8, 30),
            status=CultureStatus.en_cours,
            exploitation_id=farm1.id,
        )
        tomato = Culture(
            name="Tomate",
            stage="Plantation",
            start_date=date(2024, 5, 15),
            end_date=date(2024, 10, 1),
            status=CultureStatus.en_cours,
            exploitation_id=farm2.id,
        )
        db.add_all([maize, bean, tomato])
        db.flush()

        db.add_all(
            [
                Activity(
                    type=ActivityType.semis,
                    title="Semis de maïs — Ferme de Ndop",
                    date=date(2024, 5, 2),
                    exploitation_id=farm1.id,
                ),
                Activity(
                    type=ActivityType.irrigation,
                    title="Irrigation — Parcelle Bambui",
                    date=date(2024, 5, 10),
                    exploitation_id=farm2.id,
                ),
                Activity(
                    type=ActivityType.diagnostic,
                    title="Diagnostic IA — taches foliaires (tomate)",
                    date=date(2024, 5, 12),
                    exploitation_id=farm2.id,
                ),
                Activity(
                    type=ActivityType.analyse_sol,
                    title="Analyse sol — Ferme de Ndop",
                    date=date(2024, 5, 14),
                    exploitation_id=farm1.id,
                ),
            ]
        )

        db.add(
            SoilAnalysis(
                exploitation_id=farm1.id,
                date=date(2024, 5, 14),
                ph=6.2,
                nitrogen=28,
                phosphorus=18,
                potassium=22,
                humidity=34,
                recommendations=[
                    "Apport modéré d'azote avant floraison du maïs",
                    "Maintenir le paillage pour stabiliser l'humidité",
                    "pH légèrement acide : amendement calcaire léger recommandé",
                ],
            )
        )

        db.add(
            Prediction(
                culture_id=maize.id,
                culture_name="Maïs",
                yield_predicted=2.4,
                harvest_date=date(2024, 9, 12),
                confidence=87,
                months=["Mai", "Juin", "Juil", "Août", "Sept"],
                yield_observed=[0.4, 0.9, 1.5, 2.0],
                yield_predicted_series=[0.5, 1.0, 1.6, 2.1, 2.4],
            )
        )

        db.add(
            PlatformSetting(
                alert_threshold_yield=1.8,
                maintenance_mode=False,
                modules_enabled={
                    "diagnostic": True,
                    "prediction": True,
                    "soilAnalysis": True,
                    "planning": True,
                },
                legal_notice="AgriIntelli — Plateforme intelligente pour une agriculture durable.",
            )
        )

        db.commit()
        print("Seed OK")
        print("  Agriculteur: jean.mbarga@ferme.cm / farmer123")
        print("  Admin:       admin@agriintelli.cm / admin123")
    finally:
        db.close()


if __name__ == "__main__":
    seed()

from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from auth_utils import get_current_user, require_roles
from database import get_db
from models.activities import Activity, ActivityType
from models.predictions import Prediction
from models.settings import PlatformSetting
from models.soil_analyses import SoilAnalysis
from models.users import User, UserRole, UserStatus
from schemas.admin import AdminStatsOut, PlatformSettingsOut, PlatformSettingsUpdate

router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("/admin", response_model=AdminStatsOut)
def admin_stats(
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(UserRole.admin)),
):
    active_users = db.query(User).filter(User.status == UserStatus.actif).count()
    since = datetime.now(timezone.utc) - timedelta(days=30)
    new_signups = db.query(User).filter(User.created_at >= since).count()
    diagnostics_run = (
        db.query(Activity).filter(Activity.type == ActivityType.diagnostic).count()
    )
    predictions_run = db.query(Prediction).count()
    soil_analyses = db.query(SoilAnalysis).count()

    role_rows = (
        db.query(User.role, func.count(User.id)).group_by(User.role).all()
    )
    role_distribution = [
        {"role": role.value if hasattr(role, "value") else str(role), "count": count}
        for role, count in role_rows
    ]

    module_usage = [
        {"name": "Diagnostic", "value": diagnostics_run},
        {"name": "Prédiction", "value": predictions_run},
        {"name": "Analyse sol", "value": soil_analyses},
        {
            "name": "Planification",
            "value": db.query(Activity).filter(Activity.type == ActivityType.semis).count(),
        },
    ]

    return AdminStatsOut(
        active_users=active_users,
        new_signups=new_signups,
        diagnostics_run=diagnostics_run,
        predictions_run=predictions_run,
        soil_analyses=soil_analyses,
        role_distribution=role_distribution,
        module_usage=module_usage,
    )


@router.get("/settings", response_model=PlatformSettingsOut)
def get_settings(
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(UserRole.admin)),
):
    settings = db.query(PlatformSetting).first()
    if not settings:
        settings = PlatformSetting(
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
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings


@router.put("/settings", response_model=PlatformSettingsOut)
def update_settings(
    payload: PlatformSettingsUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(UserRole.admin)),
):
    settings = db.query(PlatformSetting).first()
    if not settings:
        settings = PlatformSetting()
        db.add(settings)

    settings.alert_threshold_yield = payload.alert_threshold_yield
    settings.maintenance_mode = payload.maintenance_mode
    settings.modules_enabled = payload.modules_enabled.model_dump()
    settings.legal_notice = payload.legal_notice
    db.commit()
    db.refresh(settings)
    return settings


@router.get("/dashboard")
def farmer_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    from models.cultures import Culture, CultureStatus
    from models.exploitations import Exploitation

    farms = (
        db.query(Exploitation).filter(Exploitation.owner_id == current_user.id).all()
        if current_user.role != UserRole.admin
        else db.query(Exploitation).all()
    )
    farm_ids = [f.id for f in farms]
    cultures = (
        db.query(Culture).filter(Culture.exploitation_id.in_(farm_ids or [-1])).all()
    )
    activities = (
        db.query(Activity)
        .filter(Activity.exploitation_id.in_(farm_ids or [-1]))
        .order_by(Activity.date.desc())
        .limit(10)
        .all()
    )
    prediction = (
        db.query(Prediction)
        .join(Culture, Culture.id == Prediction.culture_id)
        .filter(Culture.exploitation_id.in_(farm_ids or [-1]))
        .order_by(Prediction.created_at.desc())
        .first()
    )

    return {
        "exploitations_count": len(farms),
        "cultures_en_cours": sum(1 for c in cultures if c.status == CultureStatus.en_cours),
        "next_activity": activities[0].title if activities else None,
        "next_activity_date": activities[0].date.isoformat() if activities else None,
        "yield_predicted": prediction.yield_predicted if prediction else None,
        "confidence": prediction.confidence if prediction else None,
        "active_exploitation": farms[0] if farms else None,
        "recent_activities": activities,
    }

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from auth_utils import get_current_user
from database import get_db
from models.activities import Activity
from models.exploitations import Exploitation
from models.users import User, UserRole
from schemas.activities import ActivityCreate, ActivityOut

router = APIRouter(prefix="/activities", tags=["activities"])


@router.get("", response_model=list[ActivityOut])
def list_activities(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Activity)
    if current_user.role != UserRole.admin:
        farm_ids = [
            e.id
            for e in db.query(Exploitation.id).filter(Exploitation.owner_id == current_user.id).all()
        ]
        query = query.filter(
            (Activity.exploitation_id.in_(farm_ids or [-1])) | (Activity.exploitation_id.is_(None))
        )
    return query.order_by(Activity.date.desc()).all()


@router.post("", response_model=ActivityOut, status_code=status.HTTP_201_CREATED)
def create_activity(
    payload: ActivityCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    activity = Activity(**payload.model_dump())
    db.add(activity)
    db.commit()
    db.refresh(activity)
    return activity

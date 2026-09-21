from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from auth_utils import get_current_user
from database import get_db
from models.cultures import Culture
from models.exploitations import Exploitation
from models.predictions import Prediction
from models.users import User, UserRole
from schemas.predictions import PredictionCreate, PredictionOut

router = APIRouter(prefix="/predictions", tags=["predictions"])


@router.get("", response_model=list[PredictionOut])
def list_predictions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Prediction)
    if current_user.role != UserRole.admin:
        farm_ids = [
            e.id
            for e in db.query(Exploitation.id).filter(Exploitation.owner_id == current_user.id).all()
        ]
        culture_ids = [
            c.id
            for c in db.query(Culture.id).filter(Culture.exploitation_id.in_(farm_ids or [-1])).all()
        ]
        query = query.filter(Prediction.culture_id.in_(culture_ids or [-1]))
    return query.order_by(Prediction.created_at.desc()).all()


@router.post("", response_model=PredictionOut, status_code=status.HTTP_201_CREATED)
def create_prediction(
    payload: PredictionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    culture = db.query(Culture).filter(Culture.id == payload.culture_id).first()
    if not culture:
        raise HTTPException(status_code=404, detail="Culture introuvable")
    farm = db.query(Exploitation).filter(Exploitation.id == culture.exploitation_id).first()
    if current_user.role != UserRole.admin and (not farm or farm.owner_id != current_user.id):
        raise HTTPException(status_code=403, detail="Accès refusé")

    prediction = Prediction(**payload.model_dump())
    db.add(prediction)
    db.commit()
    db.refresh(prediction)
    return prediction

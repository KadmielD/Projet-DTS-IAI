from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from auth_utils import get_current_user
from database import get_db
from models.exploitations import Exploitation
from models.soil_analyses import SoilAnalysis
from models.users import User, UserRole
from schemas.soil_analyses import SoilAnalysisCreate, SoilAnalysisOut

router = APIRouter(prefix="/soil-analyses", tags=["soil-analyses"])


@router.get("", response_model=list[SoilAnalysisOut])
def list_analyses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(SoilAnalysis)
    if current_user.role != UserRole.admin:
        farm_ids = [
            e.id
            for e in db.query(Exploitation.id).filter(Exploitation.owner_id == current_user.id).all()
        ]
        query = query.filter(SoilAnalysis.exploitation_id.in_(farm_ids or [-1]))
    return query.order_by(SoilAnalysis.date.desc()).all()


@router.post("", response_model=SoilAnalysisOut, status_code=status.HTTP_201_CREATED)
def create_analysis(
    payload: SoilAnalysisCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    farm = db.query(Exploitation).filter(Exploitation.id == payload.exploitation_id).first()
    if not farm:
        raise HTTPException(status_code=404, detail="Exploitation introuvable")
    if current_user.role != UserRole.admin and farm.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Accès refusé")

    analysis = SoilAnalysis(**payload.model_dump())
    db.add(analysis)
    db.commit()
    db.refresh(analysis)
    return analysis

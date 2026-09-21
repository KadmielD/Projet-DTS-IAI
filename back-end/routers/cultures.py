from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from auth_utils import get_current_user
from database import get_db
from models.cultures import Culture
from models.exploitations import Exploitation
from models.users import User, UserRole
from schemas.cultures import CultureCreate, CultureOut, CultureUpdate

router = APIRouter(prefix="/cultures", tags=["cultures"])


def _user_exploitation_ids(db: Session, user: User) -> list[int] | None:
    if user.role == UserRole.admin:
        return None
    return [
        e.id
        for e in db.query(Exploitation.id).filter(Exploitation.owner_id == user.id).all()
    ]


@router.get("", response_model=list[CultureOut])
def list_cultures(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Culture)
    ids = _user_exploitation_ids(db, current_user)
    if ids is not None:
        query = query.filter(Culture.exploitation_id.in_(ids or [-1]))
    return query.order_by(Culture.start_date.desc()).all()


@router.post("", response_model=CultureOut, status_code=status.HTTP_201_CREATED)
def create_culture(
    payload: CultureCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    farm = db.query(Exploitation).filter(Exploitation.id == payload.exploitation_id).first()
    if not farm:
        raise HTTPException(status_code=404, detail="Exploitation introuvable")
    if current_user.role != UserRole.admin and farm.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Accès refusé")

    culture = Culture(**payload.model_dump())
    db.add(culture)
    db.commit()
    db.refresh(culture)
    return culture


@router.patch("/{culture_id}", response_model=CultureOut)
def update_culture(
    culture_id: int,
    payload: CultureUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    culture = db.query(Culture).filter(Culture.id == culture_id).first()
    if not culture:
        raise HTTPException(status_code=404, detail="Culture introuvable")

    farm = db.query(Exploitation).filter(Exploitation.id == culture.exploitation_id).first()
    if current_user.role != UserRole.admin and (not farm or farm.owner_id != current_user.id):
        raise HTTPException(status_code=403, detail="Accès refusé")

    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(culture, key, value)
    db.commit()
    db.refresh(culture)
    return culture


@router.delete("/{culture_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_culture(
    culture_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    culture = db.query(Culture).filter(Culture.id == culture_id).first()
    if not culture:
        raise HTTPException(status_code=404, detail="Culture introuvable")
    farm = db.query(Exploitation).filter(Exploitation.id == culture.exploitation_id).first()
    if current_user.role != UserRole.admin and (not farm or farm.owner_id != current_user.id):
        raise HTTPException(status_code=403, detail="Accès refusé")
    db.delete(culture)
    db.commit()

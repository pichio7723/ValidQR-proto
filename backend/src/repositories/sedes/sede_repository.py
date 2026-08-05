from sqlalchemy.orm import Session
from models.sede import Sede


def obtener_por_id(db: Session, sede_id: int) -> Sede | None:
    return db.query(Sede).filter(Sede.id == sede_id).first()
from sqlalchemy.orm import Session
from models.codigo_qr import CodigoQR


def obtener_por_id(db: Session, codigo_id: str) -> CodigoQR | None:
    return db.query(CodigoQR).filter(CodigoQR.id == codigo_id).first()
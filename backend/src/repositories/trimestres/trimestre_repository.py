from sqlalchemy.orm import Session
from models.trimestre import Trimestre
from schemas.trimestre import TrimestreCreate


def crear_trimestre(db: Session, datos: TrimestreCreate) -> Trimestre:
    nuevo = Trimestre(nombre=datos.nombre, fecha_inicio=datos.fecha_inicio, fecha_fin=datos.fecha_fin)
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


def obtener_por_id(db: Session, trimestre_id: int) -> Trimestre | None:
    return db.query(Trimestre).filter(Trimestre.id == trimestre_id).first()


def obtener_por_nombre(db: Session, nombre: str) -> Trimestre | None:
    return db.query(Trimestre).filter(Trimestre.nombre == nombre).first()


def listar_trimestres(db: Session) -> list[Trimestre]:
    return db.query(Trimestre).all()


def actualizar_trimestre(db: Session, trimestre: Trimestre, datos: dict) -> Trimestre:
    for campo, valor in datos.items():
        setattr(trimestre, campo, valor)
    db.commit()
    db.refresh(trimestre)
    return trimestre


def eliminar_trimestre(db: Session, trimestre: Trimestre) -> None:
    db.delete(trimestre)
    db.commit()
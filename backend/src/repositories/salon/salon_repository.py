from sqlalchemy.orm import Session
from models.salon import Salon
from schemas.salon import SalonCreate


def crear_salon(db: Session, datos: SalonCreate) -> Salon:
    nuevo = Salon(nombre=datos.nombre, sede_id=datos.sede_id)
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


def obtener_por_id(db: Session, salon_id: int) -> Salon | None:
    return db.query(Salon).filter(Salon.id == salon_id).first()


def listar_salones(db: Session) -> list[Salon]:
    return db.query(Salon).all()


def actualizar_salon(db: Session, salon: Salon, datos: dict) -> Salon:
    for campo, valor in datos.items():
        setattr(salon, campo, valor)
    db.commit()
    db.refresh(salon)
    return salon


def eliminar_salon(db: Session, salon: Salon) -> None:
    db.delete(salon)
    db.commit()
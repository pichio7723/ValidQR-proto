from sqlalchemy.orm import Session
from models.franjas_clase import FranjaClase
from schemas.franja_clase import FranjaClaseCreate


def crear_franja(db: Session, datos: FranjaClaseCreate) -> FranjaClase:
    nueva = FranjaClase(hora_inicio=datos.hora_inicio, hora_fin=datos.hora_fin, jornada=datos.jornada)
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva


def obtener_por_id(db: Session, franja_id: int) -> FranjaClase | None:
    return db.query(FranjaClase).filter(FranjaClase.id == franja_id).first()


def listar_franjas(db: Session) -> list[FranjaClase]:
    return db.query(FranjaClase).all()


def actualizar_franja(db: Session, franja: FranjaClase, datos: dict) -> FranjaClase:
    for campo, valor in datos.items():
        setattr(franja, campo, valor)
    db.commit()
    db.refresh(franja)
    return franja


def eliminar_franja(db: Session, franja: FranjaClase) -> None:
    db.delete(franja)
    db.commit()
from sqlalchemy.orm import Session
from models.sede import Sede
from schemas.sede import SedeCrear


def crear_sede(db: Session, sede_data: SedeCrear) -> Sede:
    nueva_sede = Sede(
        nombre=sede_data.nombre,
        direccion=sede_data.direccion,
        latitud=sede_data.latitud,
        longitud=sede_data.longitud,
        radio_metros=sede_data.radio_metros,
    )
    db.add(nueva_sede)
    db.commit()
    db.refresh(nueva_sede)
    return nueva_sede


def obtener_por_id(db: Session, sede_id: int) -> Sede | None:
    return db.query(Sede).filter(Sede.id == sede_id).first()


def obtener_por_nombre(db: Session, nombre: str) -> Sede | None:
    return db.query(Sede).filter(Sede.nombre == nombre).first()


def listar_sedes(db: Session) -> list[Sede]:
    return db.query(Sede).all()


def actualizar_sede(db: Session, sede: Sede, datos: dict) -> Sede:
    for campo, valor in datos.items():
        setattr(sede, campo, valor)

    db.commit()
    db.refresh(sede)
    return sede


def eliminar_sede(db: Session, sede: Sede) -> None:
    db.delete(sede)
    db.commit()
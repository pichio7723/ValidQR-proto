from sqlalchemy.orm import Session
from models.ficha import Ficha
from schemas.ficha import FichaCreate


def crear_ficha(db: Session, ficha_data: FichaCreate) -> Ficha:
    nueva_ficha = Ficha(
        instructor_id=ficha_data.instructor_id,
        numero_ficha=ficha_data.numero_ficha,
        nombre_programa=ficha_data.nombre_programa,
    )
    db.add(nueva_ficha)
    db.commit()
    db.refresh(nueva_ficha)
    return nueva_ficha


def obtener_por_id(db: Session, ficha_id: int) -> Ficha | None:
    return db.query(Ficha).filter(Ficha.id == ficha_id).first()


def obtener_por_numero(db: Session, numero_ficha: int) -> Ficha | None:
    return db.query(Ficha).filter(Ficha.numero_ficha == numero_ficha).first()


def listar_por_instructor(db: Session, instructor_id: int) -> list[Ficha]:
    return db.query(Ficha).filter(Ficha.instructor_id == instructor_id).all()


def actualizar_ficha(db: Session, ficha: Ficha, datos: dict) -> Ficha:
    for campo, valor in datos.items():
        setattr(ficha, campo, valor)
    db.commit()
    db.refresh(ficha)
    return ficha


def eliminar_ficha(db: Session, ficha: Ficha) -> None:
    db.delete(ficha)
    db.commit()
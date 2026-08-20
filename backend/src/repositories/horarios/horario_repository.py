from datetime import date, time
from sqlalchemy.orm import Session
from models.horario import Horario
from models.trimestre import Trimestre
from models.franjas_clase import FranjaClase
from schemas.horario import HorarioCreate


def crear_horario(db: Session, datos: HorarioCreate) -> Horario:
    nuevo = Horario(
        ficha_id=datos.ficha_id,
        instructor_id=datos.instructor_id,
        salon_id=datos.salon_id,
        franja_id=datos.franja_id,
        trimestre_id=datos.trimestre_id,
        dia_semana=datos.dia_semana,
        tematica=datos.tematica,
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


def obtener_por_id(db: Session, horario_id: int) -> Horario | None:
    return db.query(Horario).filter(Horario.id == horario_id).first()


def listar_horarios(db: Session) -> list[Horario]:
    return db.query(Horario).all()


def actualizar_horario(db: Session, horario: Horario, datos: dict) -> Horario:
    for campo, valor in datos.items():
        setattr(horario, campo, valor)
    db.commit()
    db.refresh(horario)
    return horario


def eliminar_horario(db: Session, horario: Horario) -> None:
    db.delete(horario)
    db.commit()


def buscar_horario_vigente(
    db: Session,
    instructor_id: int,
    ficha_id: int,
    dia_semana: str,
    hora_actual: time,
    fecha_actual: date,
) -> Horario | None:
    return (
        db.query(Horario)
        .join(Trimestre, Horario.trimestre_id == Trimestre.id)
        .join(FranjaClase, Horario.franja_id == FranjaClase.id)
        .filter(
            Horario.instructor_id == instructor_id,
            Horario.ficha_id == ficha_id,
            Horario.dia_semana == dia_semana,
            Trimestre.fecha_inicio <= fecha_actual,
            Trimestre.fecha_fin >= fecha_actual,
            FranjaClase.hora_inicio <= hora_actual,
            FranjaClase.hora_fin >= hora_actual,
        )
        .first()
    )
from datetime import datetime
from sqlalchemy.orm import Session
from models.asistencia import Asistencia


def crear_asistencia(db: Session, aprendiz_id: int, ficha_id: int, sede_id: int, codigo_id: str) -> Asistencia:
    nueva_asistencia = Asistencia(
        aprendiz_id=aprendiz_id,
        ficha_id=ficha_id,
        sede_id=sede_id,
        codigo_id=codigo_id,
    )
    db.add(nueva_asistencia)
    db.commit()
    db.refresh(nueva_asistencia)
    return nueva_asistencia


def existe_asistencia_hoy(db: Session, aprendiz_id: int, ficha_id: int) -> bool:
    hoy = datetime.utcnow().date()
    return (
        db.query(Asistencia)
        .filter(
            Asistencia.aprendiz_id == aprendiz_id,
            Asistencia.ficha_id == ficha_id,
        )
        .filter(Asistencia.creacion >= hoy)
        .first()
        is not None
    )
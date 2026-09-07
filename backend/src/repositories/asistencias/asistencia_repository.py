# backend/src/repositories/asistencias/asistencia_repository.py
from sqlalchemy.orm import Session
from models.asistencia import Asistencia
from datetime import datetime, date
from typing import Optional

def crear_asistencia(db: Session, aprendiz_id: int, ficha_id: int, sede_id: int, codigo_id: str):
    asistencia = Asistencia(
        aprendiz_id=aprendiz_id,
        ficha_id=ficha_id,
        sede_id=sede_id,
        codigo_id=codigo_id
    )
    db.add(asistencia)
    db.commit()
    db.refresh(asistencia)
    return asistencia


def existe_asistencia_hoy(db: Session, aprendiz_id: int, ficha_id: int) -> bool:
    hoy = datetime.now().date()
    asistencia = db.query(Asistencia).filter(
        Asistencia.aprendiz_id == aprendiz_id,
        Asistencia.ficha_id == ficha_id,
        Asistencia.creacion >= datetime.combine(hoy, datetime.min.time())
    ).first()
    return asistencia is not None


# NUEVA FUNCIÓN: Obtener asistencias por instructor
def obtener_asistencias_por_instructor(db: Session, instructor_id: int, ficha_id: Optional[int] = None):
    """
    Obtiene todas las asistencias de las fichas asignadas al instructor.
    Si se proporciona ficha_id, filtra solo esa ficha.
    """
    from models.horario import Horario
    from models.usuario import Usuario
    from models.ficha import Ficha
    from models.sede import Sede
    
    # Subquery: obtener las fichas del instructor
    fichas_instructor = db.query(Horario.ficha_id).filter(
        Horario.instructor_id == instructor_id
    ).distinct().subquery()
    
    # Query principal
    query = db.query(Asistencia).join(
        Usuario, Asistencia.aprendiz_id == Usuario.id
    ).join(
        Ficha, Asistencia.ficha_id == Ficha.id
    ).join(
        Sede, Asistencia.sede_id == Sede.id
    ).filter(
        Asistencia.ficha_id.in_(fichas_instructor)
    ).order_by(Asistencia.creacion.desc())
    
    # Filtrar por ficha específica si se proporciona
    if ficha_id:
        query = query.filter(Asistencia.ficha_id == ficha_id)
    
    return query.all()
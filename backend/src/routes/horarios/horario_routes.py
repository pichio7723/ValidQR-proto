from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from zoneinfo import ZoneInfo

from core.roles import Rol
from core.database import get_db
from core.security import requerir_rol, get_usuario_actual
from models.usuario import Usuario
from models.horario import Horario
from models.ficha import Ficha
from models.salon import Salon
from models.sede import Sede
from models.franjas_clase import FranjaClase
from schemas.horario import HorarioCreate, HorarioUpdate, HorarioOut
from services.horarios.horario_service import (
    crear_horario_service, obtener_horario_service, listar_horarios_service,
    actualizar_horario_service, eliminar_horario_service,
)

router = APIRouter(prefix="/horarios", tags=["horarios"])

DIAS_SEMANA = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"]


# ==============================================================================
# NUEVO ENDPOINT: Obtener clases del instructor para el día de hoy
# ==============================================================================
@router.get("/instructor/hoy")
def obtener_clases_hoy(
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(requerir_rol(Rol.INSTRUCTOR))
):
    """
    Devuelve las fichas, salones y horarios que tiene el instructor asignados para el día actual.
    """
    hoy_bogota = datetime.now(ZoneInfo("America/Bogota"))
    dia_semana_hoy = DIAS_SEMANA[hoy_bogota.weekday()]
    
    
    
    # ✅ Usar select_from para establecer Horario como tabla base
    resultados = db.query(
        Ficha.numero_ficha,
        Ficha.nombre_programa,
        Salon.nombre.label("salon_nombre"),
        Sede.nombre.label("sede_nombre"),
        FranjaClase.hora_inicio,
        FranjaClase.hora_fin
    ).select_from(Horario).join(
        Salon, Horario.salon_id == Salon.id
    ).join(
        Sede, Salon.sede_id == Sede.id
    ).join(
        Ficha, Horario.ficha_id == Ficha.id
    ).join(
        FranjaClase, Horario.franja_id == FranjaClase.id
    ).filter(
        Horario.instructor_id == usuario_actual.id,
        Horario.dia_semana == dia_semana_hoy
    ).all()
    
    return [
        {
            "ficha_numero": row.numero_ficha,
            "ficha_programa": row.nombre_programa,
            "salon_nombre": row.salon_nombre,
            "sede_nombre": row.sede_nombre,
            "hora_inicio": row.hora_inicio.strftime("%H:%M") if row.hora_inicio else "N/A",
            "hora_fin": row.hora_fin.strftime("%H:%M") if row.hora_fin else "N/A",
        }
        for row in resultados
    ]

# ==============================================================================
# ENDPOINTS EXISTENTES (CRUD)
# ==============================================================================

@router.post("/", response_model=HorarioOut)
def crear(datos: HorarioCreate, db: Session = Depends(get_db), usuario_actual: Usuario = Depends(requerir_rol(Rol.ADMIN))):
    return crear_horario_service(db, datos)


@router.get("/{horario_id}", response_model=HorarioOut)
def obtener(horario_id: int, db: Session = Depends(get_db), usuario_actual: Usuario = Depends(get_usuario_actual)):
    return obtener_horario_service(db, horario_id)


@router.get("/", response_model=list[HorarioOut])
def listar(db: Session = Depends(get_db), usuario_actual: Usuario = Depends(get_usuario_actual)):
    return listar_horarios_service(db)


@router.patch("/{horario_id}", response_model=HorarioOut)
def actualizar(horario_id: int, datos: HorarioUpdate, db: Session = Depends(get_db), usuario_actual: Usuario = Depends(requerir_rol(Rol.ADMIN))):
    return actualizar_horario_service(db, horario_id, datos)


@router.delete("/{horario_id}", status_code=204)
def eliminar(horario_id: int, db: Session = Depends(get_db), usuario_actual: Usuario = Depends(requerir_rol(Rol.ADMIN))):
    eliminar_horario_service(db, horario_id)
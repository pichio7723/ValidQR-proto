from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import Optional

from core.database import get_db
from core.security import get_usuario_actual, requerir_rol
from core.roles import Rol
from models.usuario import Usuario
from schemas.asistencias import EscanearQR, AsistenciaOut, AsistenciaDetalleOut
from services.asistencias.asistencia_service import (
    registrar_asistencia_service,
    listar_asistencias_instructor_service
)

router = APIRouter(prefix="/asistencias", tags=["asistencias"])


@router.post("/", response_model=AsistenciaOut)
def escanear(
    datos: EscanearQR,
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(get_usuario_actual)
):
    if datos.aprendiz_id != usuario_actual.id:
        raise HTTPException(status_code=403, detail="No puedes registrar asistencia para otro usuario")
    
    return registrar_asistencia_service(
        db, 
        datos.aprendiz_id, 
        datos.codigo_id, 
        datos.latitud, 
        datos.longitud
    )



@router.get("/instructor", response_model=list[AsistenciaDetalleOut])
def listar_asistencias(
    ficha_id: Optional[int] = Query(None, description="Filtrar por ficha específica"),
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(requerir_rol(Rol.INSTRUCTOR))
):
    """
    Lista todas las asistencias de las fichas asignadas al instructor.
    Opcionalmente filtra por ficha_id.
    """
    return listar_asistencias_instructor_service(db, usuario_actual.id, ficha_id)
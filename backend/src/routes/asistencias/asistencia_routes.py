# backend/src/routes/asistencias/asistencia_routes.py
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from fastapi import HTTPException
from fastapi.responses import StreamingResponse
from typing import Optional
from datetime import datetime

from core.database import get_db
from core.security import get_usuario_actual, requerir_rol
from core.roles import Rol
from models.usuario import Usuario
from schemas.asistencias import (
    EscanearQR, 
    AsistenciaOut, 
    AsistenciaDetalleOut,
    AsistenciaManualCreate  # ✅ Nuevo schema importado
)
from services.asistencias.asistencia_service import (
    registrar_asistencia_service,
    listar_asistencias_instructor_service,
    exportar_asistencias_a_excel,
    registrar_asistencia_manual_service  # ✅ Nuevo service importado
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


# ✅ NUEVO ENDPOINT: Registro manual de asistencia
@router.post("/manual", response_model=AsistenciaOut)
def registrar_manual(
    datos: AsistenciaManualCreate,
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(requerir_rol(Rol.INSTRUCTOR))
):
    """
    Permite al instructor registrar la asistencia de un aprendiz manualmente.
    No requiere código QR ni validación de distancia GPS.
    """
    return registrar_asistencia_manual_service(
        db=db,
        instructor_id=usuario_actual.id,
        aprendiz_id=datos.aprendiz_id,
        ficha_id=datos.ficha_id,
        sede_id=datos.sede_id,
        es_tarde=datos.es_tarde
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


@router.get("/instructor/exportar-excel")
def exportar_asistencias_excel(
    ficha_id: Optional[int] = Query(None, description="Filtrar por ficha específica"),
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(requerir_rol(Rol.INSTRUCTOR))
):
    """
    Exporta las asistencias del instructor a Excel
    """
    # Llamar al service que genera el Excel
    output = exportar_asistencias_a_excel(db, usuario_actual.id, ficha_id)
    
    # Nombre del archivo con fecha
    fecha_actual = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = f"asistencias_{fecha_actual}.xlsx"
    
    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
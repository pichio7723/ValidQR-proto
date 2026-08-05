from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.database import get_db
from schemas.asistencias import EscanearQR, AsistenciaOut
from services.asistencias.asistencia_service import registrar_asistencia_service

router = APIRouter(prefix="/asistencias", tags=["asistencias"])


@router.post("/", response_model=AsistenciaOut)
def escanear(datos: EscanearQR, db: Session = Depends(get_db)):
    return registrar_asistencia_service(db, datos.aprendiz_id, datos.codigo_id, datos.latitud, datos.longitud)
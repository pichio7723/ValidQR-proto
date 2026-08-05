from math import radians, sin, cos, sqrt, atan2
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from fastapi import HTTPException

from repositories.asistencias.asistencia_repository import crear_asistencia, existe_asistencia_hoy
from repositories.codigos_qr.codigo_qr_repository import obtener_por_id as obtener_codigo_por_id
from repositories.sedes.sede_repository import obtener_por_id as obtener_sede_por_id


def calcular_distancia_metros(lat1, lon1, lat2, lon2) -> float:
    radio_tierra = 6371000
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2) ** 2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return radio_tierra * c


def registrar_asistencia_service(db: Session, aprendiz_id: int, codigo_id: str, lat_aprendiz: float, lon_aprendiz: float):
    codigo = obtener_codigo_por_id(db, codigo_id)
    if not codigo:
        raise HTTPException(status_code=404, detail="Este código no corresponde a tu ficha")

    if codigo.expiracion < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="Este código QR ya expiró, solicita uno nuevo")

    if existe_asistencia_hoy(db, aprendiz_id, codigo.ficha_id):
        raise HTTPException(status_code=400, detail="Ya registraste tu asistencia hoy")

    sede = obtener_sede_por_id(db, codigo.sede_id)
    distancia = calcular_distancia_metros(lat_aprendiz, lon_aprendiz, sede.latitud, sede.longitud)

    if distancia > sede.radio_metros:
        raise HTTPException(status_code=400, detail="Debes estar físicamente en el lugar de clase para registrar asistencia")

    return crear_asistencia(db, aprendiz_id, codigo.ficha_id, codigo.sede_id, codigo.id)
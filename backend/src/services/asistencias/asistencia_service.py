# backend/src/services/asistencias/asistencia_service.py
from math import radians, sin, cos, sqrt, atan2
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import Optional
import pandas as pd
from io import BytesIO

from repositories.asistencias.asistencia_repository import crear_asistencia, existe_asistencia_hoy, obtener_asistencias_por_instructor
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

    expiracion_utc = codigo.expiracion.replace(tzinfo=timezone.utc)
    if expiracion_utc < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="Este código QR ya expiró, solicita uno nuevo")

    if existe_asistencia_hoy(db, aprendiz_id, codigo.ficha_id):
        raise HTTPException(status_code=400, detail="Ya registraste tu asistencia hoy")

    sede = obtener_sede_por_id(db, codigo.sede_id)
    distancia = calcular_distancia_metros(lat_aprendiz, lon_aprendiz, sede.latitud, sede.longitud)

    if distancia > sede.radio_metros:
        raise HTTPException(status_code=400, detail="Debes estar físicamente en el lugar de clase para registrar asistencia")

    return crear_asistencia(db, aprendiz_id, codigo.ficha_id, codigo.sede_id, codigo.id)


def registrar_asistencia_manual_service(
    db: Session, 
    instructor_id: int, 
    aprendiz_id: int, 
    ficha_id: int, 
    sede_id: int, 
    es_tarde: bool = False
):
    """
    Registra una asistencia manualmente por el instructor.
    No requiere código QR ni validación de distancia GPS.
    """
    from repositories.usuarios.usuario_repository import obtener_por_id as obtener_usuario_por_id
    from repositories.fichas.ficha_repository import obtener_por_id as obtener_ficha_por_id
    from repositories.sedes.sede_repository import obtener_por_id as obtener_sede_por_id
    from repositories.horarios.horario_repository import obtener_por_instructor_y_ficha
    
    # 1. Validar que el instructor exista
    instructor = obtener_usuario_por_id(db, instructor_id)
    if not instructor:
        raise HTTPException(status_code=404, detail="Instructor no encontrado")
    
    # 2. Validar que el aprendiz exista
    aprendiz = obtener_usuario_por_id(db, aprendiz_id)
    if not aprendiz:
        raise HTTPException(status_code=404, detail="Aprendiz no encontrado")
    
    # 3. Validar que el aprendiz sea realmente un aprendiz
    if aprendiz.rol != 'aprendiz':
        raise HTTPException(status_code=400, detail="El usuario seleccionado no es un aprendiz")
    
    # 4. Validar que la ficha exista
    ficha = obtener_ficha_por_id(db, ficha_id)
    if not ficha:
        raise HTTPException(status_code=404, detail="Ficha no encontrada")
    
    # 5. Validar que el aprendiz esté asignado a esa ficha
    if aprendiz.ficha_id != ficha_id:
        raise HTTPException(
            status_code=400, 
            detail=f"El aprendiz {aprendiz.nombre} no está asignado a la ficha {ficha.numero_ficha}"
        )
    
    # 6. Validar que la sede exista
    sede = obtener_sede_por_id(db, sede_id)
    if not sede:
        raise HTTPException(status_code=404, detail="Sede no encontrada")
    
    # 7. Validar que el instructor tenga esa ficha asignada en algún horario
    horarios_instructor = obtener_por_instructor_y_ficha(db, instructor_id, ficha_id)
    if not horarios_instructor:
        raise HTTPException(
            status_code=403, 
            detail="No tienes autorización para registrar asistencias en esta ficha"
        )
    
    # 8. Crear la asistencia manual
    asistencia = crear_asistencia(
        db, 
        aprendiz_id=aprendiz_id, 
        ficha_id=ficha_id, 
        sede_id=sede_id, 
        codigo_id=None,
        tipo='manual',
        es_tarde=es_tarde
    )
    
    return asistencia


def listar_asistencias_instructor_service(db: Session, instructor_id: int, ficha_id: Optional[int] = None):
    """
    Lista todas las asistencias de las fichas asignadas al instructor.
    """
    asistencias = obtener_asistencias_por_instructor(db, instructor_id, ficha_id)
    
    resultado = []
    for asistencia in asistencias:
        resultado.append({
            "id": asistencia.id,
            "aprendiz_id": asistencia.aprendiz_id,
            "aprendiz_nombre": asistencia.aprendiz.nombre,
            "aprendiz_email": asistencia.aprendiz.email,
            "ficha_id": asistencia.ficha_id,
            "ficha_numero": str(asistencia.ficha.numero_ficha) if asistencia.ficha and asistencia.ficha.numero_ficha else None,
            "ficha_programa": asistencia.ficha.nombre_programa if asistencia.ficha else None,
            "sede_id": asistencia.sede_id,
            "sede_nombre": asistencia.sede.nombre if asistencia.sede else None,
            "codigo_id": asistencia.codigo_id,
            "tipo": asistencia.tipo,          # ✅ LÍNEA QUE FALTABA
            "es_tarde": asistencia.es_tarde,  # ✅ LÍNEA QUE FALTABA
            "creacion": asistencia.creacion
        })
    
    return resultado


def exportar_asistencias_a_excel(db: Session, instructor_id: int, ficha_id: Optional[int] = None):
    """
    Exporta asistencias a Excel y retorna el archivo en memoria (BytesIO)
    """
    asistencias = listar_asistencias_instructor_service(db, instructor_id, ficha_id)
    
    if not asistencias:
        raise HTTPException(status_code=404, detail="No hay asistencias para exportar")
    
    df = pd.DataFrame(asistencias)
    
    df['Fecha'] = pd.to_datetime(df['creacion']).dt.strftime('%d/%m/%Y %H:%M')
    
    # ✅ Excel actualizado con las nuevas columnas
    df_excel = pd.DataFrame({
        'Aprendiz': df['aprendiz_nombre'],
        'Email': df['aprendiz_email'],
        'Ficha': df['ficha_numero'],
        'Programa': df['ficha_programa'],
        'Sede': df['sede_nombre'],
        'Tipo': df['tipo'].apply(lambda x: 'Manual' if x == 'manual' else 'QR'),
        'Llegó Tarde': df['es_tarde'].apply(lambda x: 'Sí' if x else 'No'),
        'Fecha Registro': df['Fecha']
    })
    
    output = BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df_excel.to_excel(writer, sheet_name='Asistencias', index=False)
        
        worksheet = writer.sheets['Asistencias']
        for column in worksheet.columns:
            max_length = 0
            column_letter = column[0].column_letter
            for cell in column:
                try:
                    if cell.value:
                        max_length = max(max_length, len(str(cell.value)))
                except:
                    pass
            adjusted_width = min(max_length + 2, 50)
            worksheet.column_dimensions[column_letter].width = adjusted_width
    
    output.seek(0)
    return output
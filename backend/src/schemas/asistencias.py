# backend/src/schemas/asistencias.py
from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional, Union

class AsistenciaBase(BaseModel):
    aprendiz_id: int
    ficha_id: int
    sede_id: int
    codigo_id: Optional[str] = None  # ✅ Ahora es opcional para registro manual
    
class AsistenciaCreate(AsistenciaBase):
    pass

# Schema para registro manual
class AsistenciaManualCreate(BaseModel):
    aprendiz_id: int
    ficha_id: int
    sede_id: int
    es_tarde: bool = False

class EscanearQR(BaseModel):
    codigo_id: str
    aprendiz_id: int
    latitud: float
    longitud: float

class AsistenciaOut(AsistenciaBase):
    id: int
    tipo: str = 'qr'  #Nuevo campo
    es_tarde: bool = False  #Nuevo campo
    creacion: datetime

    model_config = ConfigDict(from_attributes=True)


class AsistenciaDetalleOut(BaseModel):
    """Schema detallado para listar asistencias con información relacionada"""
    id: int
    aprendiz_id: int
    aprendiz_nombre: str
    aprendiz_email: str
    ficha_id: int
    ficha_numero: Optional[Union[str, int]] = None 
    ficha_programa: Optional[str] = None
    sede_id: int
    sede_nombre: Optional[str] = None
    codigo_id: Optional[str] = None  # ✅ Ahora es opcional
    tipo: str = 'qr'  # ✅ Nuevo campo
    es_tarde: bool = False  # ✅ Nuevo campo
    creacion: datetime

    model_config = ConfigDict(from_attributes=True)
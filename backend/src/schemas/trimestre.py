from datetime import date
from pydantic import BaseModel, ConfigDict


class TrimestreBase(BaseModel):
    nombre: str
    fecha_inicio: date
    fecha_fin: date


class TrimestreCreate(TrimestreBase):
    pass


class TrimestreUpdate(BaseModel):
    nombre: str | None = None
    fecha_inicio: date | None = None
    fecha_fin: date | None = None


class TrimestreOut(TrimestreBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
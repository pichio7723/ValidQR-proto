from pydantic import BaseModel, ConfigDict


class HorarioBase(BaseModel):
    ficha_id: int
    instructor_id: int
    salon_id: int
    franja_id: int
    trimestre_id: int
    dia_semana: str
    tematica: str | None = None


class HorarioCreate(HorarioBase):
    pass


class HorarioUpdate(BaseModel):
    ficha_id: int | None = None
    instructor_id: int | None = None
    salon_id: int | None = None
    franja_id: int | None = None
    trimestre_id: int | None = None
    dia_semana: str | None = None
    tematica: str | None = None


class HorarioOut(HorarioBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
from pydantic import BaseModel, ConfigDict


class SalonBase(BaseModel):
    nombre: str
    sede_id: int


class SalonCreate(SalonBase):
    pass


class SalonUpdate(BaseModel):
    nombre: str | None = None
    sede_id: int | None = None


class SalonOut(SalonBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
from pydantic import BaseModel, ConfigDict
from core.roles import Rol

class UsuarioBase(BaseModel):
    nombre: str
    email: str
    rol: Rol
    ficha_id : int | None = None


class UsuarioCrear(UsuarioBase):
    password: str  # contraseña en texto plano, solo al crear — el service la hashea antes de guardar


class UsuarioUpdate(BaseModel):
    nombre: str | None = None
    email: str | None = None
    password: str | None = None
    rol: Rol | None = None


class UsuarioOut(UsuarioBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


class UsuarioLogin(BaseModel):
    email: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
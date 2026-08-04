from sqlalchemy.orm import Session
from passlib.context import CryptContext
from fastapi import HTTPException
from core.security import crear_token


from schemas.usuario import UsuarioLogin
from schemas.usuario import UsuarioUpdate
from schemas.usuario import UsuarioCrear
from repositories.usuarios.usuario_repository import crear_usuario, obtener_por_email, obtener_por_id, actualizar_usuario, eliminar_usuario

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def registrar_usuario(db: Session, usuario_data: UsuarioCrear):
    usuario_existente = obtener_por_email(db, usuario_data.email)
    if usuario_existente:
        raise HTTPException(status_code=400, detail="Ya existe una cuenta con este email")

    password_hash = pwd_context.hash(usuario_data.password)
    return crear_usuario(db, usuario_data, password_hash)



def login_usuario(db: Session, credenciales: UsuarioLogin):
    usuario = obtener_por_email(db, credenciales.email)
    if not usuario:
        raise HTTPException(status_code=401, detail="La cuenta no existe")

    if not pwd_context.verify(credenciales.password, usuario.password_hash):
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")

    token = crear_token({"sub": str(usuario.id), "rol": usuario.rol})
    return {"access_token": token, "token_type": "bearer"}



def actualizar_usuario_service(db: Session, usuario_id: int, datos: UsuarioUpdate):
    usuario = obtener_por_id(db, usuario_id)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    datos_dict = datos.model_dump(exclude_unset=True)
    #traduccion de password a nombre real, passwordhash
    if "password" in datos_dict:
        password_plano = datos_dict.pop("password")
        datos_dict["password_hash"] = pwd_context.hash(password_plano)

    return actualizar_usuario(db, usuario, datos_dict)

def eliminar_usuario_service(db: Session, usuario_id: int):
    usuario = obtener_por_id(db, usuario_id)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    eliminar_usuario(db, usuario)
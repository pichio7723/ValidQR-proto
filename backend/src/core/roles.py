from enum import Enum


class Rol(str, Enum):
    ADMIN = "admin"
    INSTRUCTOR = "instructor"
    APRENDIZ = "aprendiz"
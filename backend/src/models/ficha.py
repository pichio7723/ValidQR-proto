from sqlalchemy import Column, ForeignKey, Integer, String
from core.database import Base

class Ficha(Base):
    __tablename__ = "fichas"

    id = Column(Integer, primary_key = True, index = True)
    instructor_id = Column(Integer, ForeignKey("usuarios.id"), index = True, nullable = False)
    numero_ficha = Column(Integer, nullable = False, unique=True)
    nombre_programa = Column(String, nullable = False)




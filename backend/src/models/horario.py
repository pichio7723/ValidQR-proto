from sqlalchemy import Column, Integer, String, ForeignKey
from core.database import Base


class Horario(Base):
    __tablename__ = "horarios"

    id = Column(Integer, primary_key=True, index=True)
    ficha_id = Column(Integer, ForeignKey("fichas.id"), index=True, nullable=False)
    instructor_id = Column(Integer, ForeignKey("usuarios.id"), index=True, nullable=False)
    salon_id = Column(Integer, ForeignKey("salones.id"), index=True, nullable=False)
    franja_id = Column(Integer, ForeignKey("franjas_clase.id"), index=True, nullable=False)
    trimestre_id = Column(Integer, ForeignKey("trimestres.id"), index=True, nullable=False)
    dia_semana = Column(String, nullable=False)
    tematica = Column(String, nullable=True)
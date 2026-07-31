from sqlalchemy import Column, ForeignKey, Integer, String, DateTime
from core.database import Base
from datetime import datetime, timedelta, timezone


class Asistencia(Base):
    __tablename__ = "asistencias"

    id = Column(Integer, primary_key=True, index=True)
    aprendiz_id = Column(Integer, ForeignKey("usuarios.id"), index=True, nullable=False) 
    ficha_id = Column(Integer, ForeignKey("fichas.id"), index=True, nullable=False)
    sede_id = Column(Integer, ForeignKey("sedes.id"), index=True, nullable=False)
    codigo_id = Column(String, ForeignKey("codigos_qr.id"), index=True, nullable=False)
    creacion = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
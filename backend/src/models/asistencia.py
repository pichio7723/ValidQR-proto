from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, Boolean
from sqlalchemy.orm import relationship
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
    tipo = Column(String, default='qr', nullable=False)  # 'qr' o 'manual'
    es_tarde = Column(Boolean, default=False, nullable=False)  # True si llegó tarde


    aprendiz = relationship("Usuario", foreign_keys=[aprendiz_id])
    ficha = relationship("Ficha", foreign_keys=[ficha_id])
    sede = relationship("Sede", foreign_keys=[sede_id])
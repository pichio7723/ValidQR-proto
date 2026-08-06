from fastapi import FastAPI
from routes.usuarios.usuario_routes import router as usuario_router
from routes.fichas.ficha_routes import router as ficha_router
from routes.asistencias.asistencia_routes import router as asistencia_router
from routes.sedes.sede_routes import router as sede_router

app = FastAPI()

@app.get("/")
def read_root():
    return {"mensaje": "ValidQR API funcionando"}

app.include_router(usuario_router)
app.include_router(ficha_router)
app.include_router(asistencia_router)
app.include_router(sede_router)
from fastapi import FastAPI
from routes.usuarios.usuario_routes import router as usuario_router

app = FastAPI()

@app.get("/")
def read_root():
    return {"mensaje": "ValidQR API funcionando"}

app.include_router(usuario_router)
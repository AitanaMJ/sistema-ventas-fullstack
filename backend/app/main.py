from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import (
    productos,
    cliente,
    ventas,
    usuarios,
    auth,
    dashboard,
    reportes
)


app = FastAPI(
    title="Sistema de Ventas API"
)


origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router)
app.include_router(productos.router)
app.include_router(cliente.router)
app.include_router(ventas.router)
app.include_router(usuarios.router)
app.include_router(dashboard.router)
app.include_router(reportes.router)


@app.get("/")
def inicio():
    return {
        "mensaje": "Sistema de Ventas funcionando"
    }
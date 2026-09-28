from typing import Literal
from pydantic import BaseModel, EmailStr, Field


# =========================================================
# CREAR USUARIO
# =========================================================
class UsuarioCrear(BaseModel):
    nombre: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=100)
    rol: Literal["admin", "vendedor"] = "vendedor"


# =========================================================
# ACTUALIZAR USUARIO
# No modificamos la contraseña desde este schema
# =========================================================
class UsuarioActualizar(BaseModel):
    nombre: str = Field(min_length=2, max_length=100)
    email: EmailStr
    rol: Literal["admin", "vendedor"]


# =========================================================
# CAMBIAR ESTADO DEL USUARIO
# =========================================================
class UsuarioEstado(BaseModel):
    activo: bool


# =========================================================
# RESPUESTA DE USUARIO
# =========================================================
class UsuarioRespuesta(BaseModel):
    id: int
    nombre: str
    email: EmailStr
    rol: Literal["admin", "vendedor"]
    activo: bool

    model_config = {
        "from_attributes": True
    }

# =========================================================
# Cambiar Contraseña
# =========================================================    
class CambiarPassword(BaseModel):
    password_actual: str = Field(min_length=8, max_length=100)
    password_nueva: str = Field(min_length=8, max_length=100)    
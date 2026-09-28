from pydantic import BaseModel, EmailStr, Field


class ClienteCrear(BaseModel):
    nombre: str = Field(min_length=2, max_length=100)
    email: EmailStr
    telefono: str | None = Field(default=None, min_length=6, max_length=30)


class ClienteRespuesta(BaseModel):
    id: int
    nombre: str
    email: EmailStr
    telefono: str | None = None

    model_config = {"from_attributes": True}


class ClientesPaginados(BaseModel):
    total: int
    pagina: int
    por_pagina: int
    clientes: list[ClienteRespuesta]
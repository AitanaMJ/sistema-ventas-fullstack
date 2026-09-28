from decimal import Decimal
from pydantic import BaseModel, Field


class ProductoCrear(BaseModel):
    nombre: str = Field(min_length=2, max_length=100)
    precio: Decimal = Field(gt=0)
    stock: int = Field(ge=0)


class ProductoActualizar(BaseModel):
    nombre: str = Field(min_length=2, max_length=100)
    precio: Decimal = Field(gt=0)
    stock: int = Field(ge=0)


class ProductoEstado(BaseModel):
    activo: bool


class ProductoRespuesta(BaseModel):
    id: int
    nombre: str
    precio: Decimal
    stock: int
    activo: bool

    model_config = {"from_attributes": True}


class ProductosPaginados(BaseModel):
    total: int
    pagina: int
    por_pagina: int
    productos: list[ProductoRespuesta]
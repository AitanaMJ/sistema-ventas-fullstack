import os
from datetime import datetime, timedelta, timezone

import jwt
from dotenv import load_dotenv
from pwdlib import PasswordHash
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from .database import obtener_db
from .models.usuario import Usuario


load_dotenv()

password_hash = PasswordHash.recommended()

SECRET_KEY = os.getenv("SECRET_KEY")

if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY no está configurada")

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60")
)

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)


def hashear_password(password: str) -> str:
    return password_hash.hash(password)


def verificar_password(
    password: str,
    password_hasheado: str
) -> bool:
    return password_hash.verify(
        password,
        password_hasheado
    )


def crear_access_token(datos: dict) -> str:
    datos_token = datos.copy()

    expiracion = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    datos_token.update({
        "exp": expiracion
    })

    token = jwt.encode(
        datos_token,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return token

def obtener_usuario_actual(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(obtener_db)
):
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        usuario_id = payload.get("sub")

        if usuario_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido"
            )

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="El token expiró"
        )

    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido"
        )

    usuario = db.query(Usuario).filter(
        Usuario.id == int(usuario_id)
    ).first()

    if usuario is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no encontrado"
        )

    if not usuario.activo:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Usuario inactivo"
        )

    return usuario

def requerir_admin(
    usuario_actual: Usuario = Depends(obtener_usuario_actual)
):
    if usuario_actual.rol != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tenés permisos para realizar esta acción"
        )

    return usuario_actual
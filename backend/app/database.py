import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base


load_dotenv()


SERVER = os.getenv("DB_SERVER")
DATABASE = os.getenv("DB_NAME")
DRIVER = os.getenv("DB_DRIVER")


if not SERVER or not DATABASE or not DRIVER:
    raise RuntimeError(
        "La configuración de la base de datos no está completa"
    )


DATABASE_URL = (
    f"mssql+pyodbc://@{SERVER}/{DATABASE}"
    f"?driver={DRIVER.replace(' ', '+')}"
    "&trusted_connection=yes"
)


engine = create_engine(DATABASE_URL)


SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


def obtener_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


Base = declarative_base()
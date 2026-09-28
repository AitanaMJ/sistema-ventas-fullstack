# 📊 Sistema de Gestión de Ventas

Aplicación web Full Stack para la gestión de ventas, productos, clientes y usuarios, desarrollada con **React, FastAPI y SQL Server**.

El sistema permite administrar el proceso de ventas, controlar stock, gestionar clientes y vendedores, consultar métricas mediante un dashboard y generar reportes exportables a Excel.

## 🚀 Tecnologías utilizadas

### Backend
- Python
- FastAPI
- SQLAlchemy
- Alembic
- Pydantic
- JWT
- SQL Server
- OpenPyXL

### Frontend
- React
- JavaScript
- Vite
- React Router
- Recharts
- CSS

## ✨ Funcionalidades

### 🔐 Autenticación y usuarios
- Inicio de sesión mediante JWT.
- Roles de **Administrador** y **Vendedor**.
- Protección de rutas según el rol.
- Activación y desactivación de usuarios.
- Cambio de contraseña.
- Administración de vendedores.

### 📦 Productos
- Registro y edición de productos.
- Control de stock.
- Activación y desactivación de productos.
- Búsqueda y paginación.
- Validación de stock al realizar una venta.

### 👥 Clientes
- Registro y edición de clientes.
- Búsqueda por nombre o email.
- Paginación.
- Validación de email único.
- Protección de clientes asociados a ventas.

### 🛒 Ventas
- Registro de ventas con uno o varios productos.
- Descuento automático de stock.
- Asociación de la venta al vendedor autenticado.
- Ventas a clientes registrados.
- Ventas a **Consumidor final**.
- Historial de ventas.
- Filtros por cliente, vendedor y fechas.
- Consulta del detalle de cada venta.

### 📈 Dashboard
- Resumen general de ventas.
- Total vendido.
- Cantidad de clientes.
- Productos vendidos.
- Productos con stock bajo.
- Gráficos y estadísticas de ventas.

### 📄 Reportes
- Reportes por rango de fechas.
- Filtro por vendedor.
- Cantidad de ventas realizadas.
- Total vendido.
- Exportación de ventas a **Excel (.xlsx)**.
- El archivo exportado respeta los filtros seleccionados.

## 🏗️ Arquitectura

```text
SistemaVentas/
│
├── backend/
│   └── app/
│       ├── models/
│       ├── routers/
│       ├── schemas/
│       ├── database.py
│       ├── security.py
│       └── main.py
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── services/
│
├── alembic/
├── .env.example
├── .gitignore
├── alembic.ini
└── requirements.txt
```

## 🔒 Seguridad

El sistema utiliza **JSON Web Tokens (JWT)** para la autenticación.

Las contraseñas se almacenan utilizando hashing y los endpoints sensibles están protegidos según el rol del usuario.

Las variables sensibles se configuran mediante un archivo `.env`, que no se incluye en el repositorio.

## ⚙️ Configuración

Clonar el repositorio:

```bash
git clone https://github.com/AitanaMJ/sistema-ventas-fullstack.git
cd sistema-ventas-fullstack
```

Crear el entorno virtual:

```bash
python -m venv venv
```

Activarlo en Windows:

```bash
venv\Scripts\activate
```

Instalar las dependencias del backend:

```bash
pip install -r requirements.txt
```

Crear un archivo `.env` tomando como referencia `.env.example`.

Ejecutar las migraciones:

```bash
alembic upgrade head
```

Iniciar FastAPI:

```bash
uvicorn backend.app.main:app --reload
```

La API estará disponible en:

```text
http://127.0.0.1:8000
```

Documentación Swagger:

```text
http://127.0.0.1:8000/docs
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

La aplicación estará disponible en:

```text
http://localhost:5173
```

## 📸 Capturas

Próximamente se agregarán capturas del:

- Dashboard
- Gestión de productos
- Gestión de clientes
- Registro de ventas
- Reportes
- Exportación a Excel

## 🔜 Próximas mejoras

- Productos más vendidos.
- Análisis de ventas por vendedor.
- Reportes más detallados.
- Nuevos gráficos y estadísticas.
- Mejoras de validación y seguridad.
- Despliegue de la aplicación.

## 👩‍💻 Autora

**Aitana Molina Juárez**

Programadora Full Stack

Tecnologías principales: C#, .NET, Python, FastAPI, React, JavaScript y SQL Server.
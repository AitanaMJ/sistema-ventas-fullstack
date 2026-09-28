import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useAuth } from '../context/AuthContext'
import './Layout.css'

function Layout() {
  const { usuario } = useAuth()

  const [menuAbierto, setMenuAbierto] = useState(false)

  const inicialUsuario = usuario?.nombre
    ?.charAt(0)
    .toUpperCase()

  const nombreRol =
    usuario?.rol === 'admin'
      ? 'Administrador'
      : 'Vendedor'

  const abrirMenu = () => {
    setMenuAbierto(true)
  }

  const cerrarMenu = () => {
    setMenuAbierto(false)
  }

  return (
    <div className="layout">

      <Sidebar
        menuAbierto={menuAbierto}
        cerrarMenu={cerrarMenu}
      />

      {menuAbierto && (
        <div
          className="sidebar-overlay"
          onClick={cerrarMenu}
        />
      )}

      <div className="layout-content">

        <header className="topbar">

          <div className="topbar-izquierda">

            <button
              type="button"
              className="menu-hamburguesa"
              onClick={abrirMenu}
              aria-label="Abrir menú"
            >
              ☰
            </button>

            <div className="topbar-titulo">
              <span>Sistema de Ventas</span>
            </div>

          </div>

          <div className="topbar-acciones">

            <button
              type="button"
              className="topbar-icono"
              title="Notificaciones"
            >
              🔔
            </button>

            <div className="topbar-separador" />

            <div className="topbar-usuario">

              <div className="topbar-avatar">
                {inicialUsuario}
              </div>

              <div className="topbar-usuario-info">
                <strong>{usuario?.nombre}</strong>
                <span>{nombreRol}</span>
              </div>

            </div>

          </div>

        </header>

        <main className="main-content">
          <Outlet />
        </main>

      </div>

    </div>
  )
}

export default Layout
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Sidebar.css'

function Sidebar({ menuAbierto, cerrarMenu }) {
  const { usuario, cerrarSesion } = useAuth()

  const obtenerClaseLink = ({ isActive }) =>
    isActive
      ? 'sidebar-link sidebar-link-active'
      : 'sidebar-link'

  const manejarCerrarSesion = () => {
    cerrarMenu?.()
    cerrarSesion()
  }

  return (
    <aside
      className={`sidebar ${
        menuAbierto ? 'sidebar-abierto' : ''
      }`}
    >

      <div className="sidebar-logo">

        <div className="sidebar-logo-icon">
          SV
        </div>

        <div className="sidebar-logo-texto">
          <strong>SalesFlow</strong>
          <span>Gestión de ventas</span>
        </div>

        <button
          type="button"
          className="sidebar-cerrar"
          onClick={cerrarMenu}
          aria-label="Cerrar menú"
        >
          ×
        </button>

      </div>

      <div className="sidebar-menu">

        <span className="sidebar-menu-titulo">
          MENÚ PRINCIPAL
        </span>

        <nav className="sidebar-nav">

          {usuario.rol === 'admin' && (
            <NavLink
              to="/dashboard"
              className={obtenerClaseLink}
              onClick={cerrarMenu}
            >
              <span className="sidebar-link-icon">▦</span>
              <span>Dashboard</span>
            </NavLink>
          )}

          <NavLink
            to="/productos"
            className={obtenerClaseLink}
            onClick={cerrarMenu}
          >
            <span className="sidebar-link-icon">◇</span>
            <span>Productos</span>
          </NavLink>

          <NavLink
            to="/clientes"
            className={obtenerClaseLink}
            onClick={cerrarMenu}
          >
            <span className="sidebar-link-icon">♙</span>
            <span>Clientes</span>
          </NavLink>

          <NavLink
            to="/ventas"
            className={obtenerClaseLink}
            onClick={cerrarMenu}
          >
            <span className="sidebar-link-icon">$</span>
            <span>Ventas</span>
          </NavLink>

          {usuario.rol === 'admin' && (
            <NavLink
              to="/reportes"
              className={obtenerClaseLink}
              onClick={cerrarMenu}
            >
              <span className="sidebar-link-icon">◫</span>
              <span>Reportes</span>
            </NavLink>
          )}

          {usuario.rol === 'admin' && (
            <NavLink
              to="/usuarios"
              className={obtenerClaseLink}
              onClick={cerrarMenu}
            >
              <span className="sidebar-link-icon">♧</span>
              <span>Usuarios</span>
            </NavLink>
          )}

        </nav>

      </div>

      <div className="sidebar-footer">

        <div className="sidebar-user">

          <div className="sidebar-user-avatar">
            {usuario.nombre?.charAt(0).toUpperCase()}
          </div>

          <div className="sidebar-user-info">
            <strong>{usuario.nombre}</strong>
            <span>
              {usuario.rol === 'admin'
                ? 'Administrador'
                : 'Vendedor'}
            </span>
          </div>

        </div>

        <button
          type="button"
          className="logout-button"
          onClick={manejarCerrarSesion}
        >
          <span>↪</span>
          Cerrar sesión
        </button>

      </div>

    </aside>
  )
}

export default Sidebar
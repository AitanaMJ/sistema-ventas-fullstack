import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'


function Sidebar() {
  const { usuario, cerrarSesion } = useAuth()

  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        SistemaVentas
      </div>

      <div className="sidebar-user">
        <p className="sidebar-user-name">
          {usuario.nombre}
        </p>

        <p className="sidebar-user-role">
          {usuario.rol}
        </p>
      </div>

      <nav className="sidebar-nav">

        {usuario.rol === 'admin' && (
        <NavLink
          to="/dashboard"
          className="sidebar-link"
        >
          Dashboard
        </NavLink>
      )}
 
        <NavLink
          to="/productos"
          className="sidebar-link"
        >
          Productos
        </NavLink>

        <NavLink
          to="/clientes"
          className="sidebar-link"
        >
          Clientes
        </NavLink>

        <NavLink
          to="/ventas"
          className="sidebar-link"
        >
          Ventas
        </NavLink>

        {usuario.rol === 'admin' && (
  <NavLink
    to="/reportes"
    className="sidebar-link"
  >
    Reportes
  </NavLink>
)}

        {usuario.rol === 'admin' && (
          <NavLink
            to="/usuarios"
            className="sidebar-link"
          >
            Usuarios
          </NavLink>
        )}

      </nav>

      <button
        className="logout-button"
        onClick={cerrarSesion}
      >
        Cerrar sesión
      </button>

    </aside>
  )
}


export default Sidebar
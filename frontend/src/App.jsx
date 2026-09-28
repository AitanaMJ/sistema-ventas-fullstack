import {
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Productos from './pages/Productos'
import Clientes from './pages/Clientes'
import Ventas from './pages/Ventas'
import Usuarios from './pages/Usuarios'
import Reportes from './pages/Reportes'

import Layout from './components/Layout'
import RutaProtegida from './components/RutaProtegida'

import { useAuth } from './context/AuthContext'


function App() {
  const { usuario, cargando } = useAuth()

  if (cargando) {
    return <p>Cargando...</p>
  }

  return (
    <Routes>

      {/* LOGIN */}
      <Route
        path="/login"
        element={
          usuario
            ? (
                <Navigate
                  to={
                    usuario.rol === 'admin'
                      ? '/dashboard'
                      : '/ventas'
                  }
                  replace
                />
              )
            : <Login />
        }
      />


      {/* RUTAS PROTEGIDAS */}
      <Route
        element={
          <RutaProtegida>
            <Layout />
          </RutaProtegida>
        }
      >

        {/* SOLO ADMIN */}
        <Route
          path="/dashboard"
          element={
            usuario?.rol === 'admin'
              ? <Dashboard />
              : <Navigate to="/ventas" replace />
          }
        />


        {/* ADMIN Y VENDEDOR */}
        <Route
          path="/productos"
          element={<Productos />}
        />

        <Route
          path="/clientes"
          element={<Clientes />}
        />

        <Route
          path="/ventas"
          element={<Ventas />}
        />

        <Route
  path="/reportes"
  element={
    usuario?.rol === 'admin'
      ? <Reportes />
      : <Navigate to="/ventas" replace />
  }
/>


        {/* SOLO ADMIN */}
        <Route
          path="/usuarios"
          element={
            usuario?.rol === 'admin'
              ? <Usuarios />
              : <Navigate to="/ventas" replace />
          }
        />

      </Route>


      {/* RUTA INICIAL */}
      <Route
        path="/"
        element={
          <Navigate
            to={
              usuario
                ? usuario.rol === 'admin'
                  ? '/dashboard'
                  : '/ventas'
                : '/login'
            }
            replace
          />
        }
      />


      {/* CUALQUIER RUTA INEXISTENTE */}
      <Route
        path="*"
        element={
          <Navigate
            to={
              usuario
                ? usuario.rol === 'admin'
                  ? '/dashboard'
                  : '/ventas'
                : '/login'
            }
            replace
          />
        }
      />

    </Routes>
  )
}


export default App
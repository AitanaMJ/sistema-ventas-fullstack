import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'


function RutaProtegida({ children }) {
  const { usuario, cargando } = useAuth()

  if (cargando) {
    return <p>Cargando...</p>
  }

  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  return children
}


export default RutaProtegida
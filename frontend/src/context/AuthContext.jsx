import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

import {
  login as loginService,
  obtenerMiUsuario,
} from '../services/authService'


const AuthContext = createContext()


export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)


  useEffect(() => {
    const cargarUsuario = async () => {
      const token = localStorage.getItem('token')

      if (!token) {
        setCargando(false)
        return
      }

      try {
        const usuarioActual = await obtenerMiUsuario(token)

        setUsuario(usuarioActual)

      } catch {
        localStorage.removeItem('token')
        setUsuario(null)

      } finally {
        setCargando(false)
      }
    }

    cargarUsuario()
  }, [])


  const iniciarSesion = async (email, password) => {
    const respuesta = await loginService(email, password)

    localStorage.setItem(
      'token',
      respuesta.access_token
    )

    const usuarioActual = await obtenerMiUsuario(
      respuesta.access_token
    )

    setUsuario(usuarioActual)
  }


  const cerrarSesion = () => {
    localStorage.removeItem('token')
    setUsuario(null)
  }


  return (
    <AuthContext.Provider
      value={{
        usuario,
        cargando,
        iniciarSesion,
        cerrarSesion,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}


export function useAuth() {
  return useContext(AuthContext)
}
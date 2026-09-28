import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import './Login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const { iniciarSesion } = useAuth()


  const manejarSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setCargando(true)

    try {
      await iniciarSesion(email, password)

    } catch (error) {
      setError(error.message)

    } finally {
      setCargando(false)
    }
  }


return (
  <div className="login-container">

    <div className="login-card">

      <h1>Iniciar sesión</h1>

      <p className="login-subtitulo">
        Ingresá a tu cuenta para continuar
      </p>

      <form onSubmit={manejarSubmit}>

        <div className="login-grupo">
          <label>Email</label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@ejemplo.com"
            required
          />
        </div>

        <div className="login-grupo">
          <label>Contraseña</label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingresá tu contraseña"
            required
          />
        </div>

        {error && (
          <p className="login-error">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="login-boton"
          disabled={cargando}
        >
          {cargando ? 'Ingresando...' : 'Ingresar'}
        </button>

      </form>

    </div>

  </div>
)}


export default Login
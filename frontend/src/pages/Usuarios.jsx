import { useEffect, useState } from 'react'
import {
  obtenerUsuarios,
  crearUsuario,
  actualizarUsuario,
  cambiarEstadoUsuario,
} from '../services/usuarioService'

import './Usuarios.css'


function Usuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const [mostrarModal, setMostrarModal] = useState(false)
  const [usuarioEditando, setUsuarioEditando] = useState(null)

  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rol, setRol] = useState('vendedor')

  const [guardando, setGuardando] = useState(false)


  const cargarUsuarios = async () => {
    try {
      setCargando(true)
      setError('')

      const respuesta = await obtenerUsuarios()

      setUsuarios(respuesta)

    } catch (error) {
      setError(error.message)

    } finally {
      setCargando(false)
    }
  }


  useEffect(() => {
    cargarUsuarios()
  }, [])


  const abrirNuevoUsuario = () => {
    setUsuarioEditando(null)

    setNombre('')
    setEmail('')
    setPassword('')
    setRol('vendedor')

    setError('')
    setMostrarModal(true)
  }


  const abrirEditarUsuario = (usuario) => {
    setUsuarioEditando(usuario)

    setNombre(usuario.nombre)
    setEmail(usuario.email)
    setPassword('')
    setRol(usuario.rol)

    setError('')
    setMostrarModal(true)
  }


  const cerrarModal = () => {
    setMostrarModal(false)
    setUsuarioEditando(null)

    setNombre('')
    setEmail('')
    setPassword('')
    setRol('vendedor')
  }


  const manejarGuardar = async (e) => {
    e.preventDefault()

    try {
      setGuardando(true)
      setError('')

      if (usuarioEditando) {

        await actualizarUsuario(
          usuarioEditando.id,
          {
            nombre,
            email,
            rol,
          }
        )

      } else {

        await crearUsuario({
          nombre,
          email,
          password,
          rol,
        })
      }

      cerrarModal()
      await cargarUsuarios()

    } catch (error) {
      setError(error.message)

    } finally {
      setGuardando(false)
    }
  }


  const manejarEstado = async (usuario) => {
    try {
      setError('')

      await cambiarEstadoUsuario(
        usuario.id,
        !usuario.activo
      )

      await cargarUsuarios()

    } catch (error) {
      setError(error.message)
    }
  }


  return (
    <div className="usuarios">

      <div className="usuarios-header">

        <div>
          <h1>Usuarios</h1>
          <p>Administrá los usuarios del sistema</p>
        </div>

        <button
          className="btn-nuevo-usuario"
          onClick={abrirNuevoUsuario}
        >
          + Nuevo usuario
        </button>

      </div>


      {error && (
        <p className="usuarios-error">
          {error}
        </p>
      )}


      <div className="usuarios-tabla">

        <table>

          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>

            {cargando ? (

              <tr>
                <td colSpan="5" className="cargando-usuarios">
                  Cargando usuarios...
                </td>
              </tr>

            ) : (

              usuarios.map((usuario) => (

                <tr key={usuario.id}>

                  <td>
                    <strong>{usuario.nombre}</strong>
                  </td>

                  <td>
                    {usuario.email}
                  </td>

                  <td>
                    <span className={`rol rol-${usuario.rol}`}>
                      {usuario.rol === 'admin'
                        ? 'Administrador'
                        : 'Vendedor'}
                    </span>
                  </td>

                  <td>
                    <span
                      className={
                        usuario.activo
                          ? 'estado estado-activo'
                          : 'estado estado-inactivo'
                      }
                    >
                      {usuario.activo
                        ? 'Activo'
                        : 'Inactivo'}
                    </span>
                  </td>

                  <td className="usuario-acciones">

                    <button
                      className="btn-editar-usuario"
                      onClick={() => abrirEditarUsuario(usuario)}
                    >
                      Editar
                    </button>

                    <button
                      className={
                        usuario.activo
                          ? 'btn-desactivar-usuario'
                          : 'btn-activar-usuario'
                      }
                      onClick={() => manejarEstado(usuario)}
                    >
                      {usuario.activo
                        ? 'Desactivar'
                        : 'Activar'}
                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>


        {!cargando && usuarios.length === 0 && (
          <p className="sin-usuarios">
            No hay usuarios registrados.
          </p>
        )}

      </div>


      {mostrarModal && (

        <div className="modal-fondo">

          <div className="modal modal-usuario">

            <div className="modal-header">

              <div>
                <h2>
                  {usuarioEditando
                    ? 'Editar usuario'
                    : 'Nuevo usuario'}
                </h2>

                <p>
                  {usuarioEditando
                    ? 'Modificá los datos del usuario'
                    : 'Creá un nuevo usuario del sistema'}
                </p>
              </div>

              <button
                className="modal-cerrar"
                onClick={cerrarModal}
              >
                ×
              </button>

            </div>


            <form onSubmit={manejarGuardar}>

              <div className="form-grupo">
                <label>Nombre</label>

                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Nombre del usuario"
                  required
                />
              </div>


              <div className="form-grupo">
                <label>Email</label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@email.com"
                  required
                />
              </div>


              {!usuarioEditando && (

                <div className="form-grupo">
                  <label>Contraseña</label>

                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    required
                  />
                </div>

              )}


              <div className="form-grupo">
                <label>Rol</label>

                <select
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                  required
                >
                  <option value="vendedor">
                    Vendedor
                  </option>

                  <option value="admin">
                    Administrador
                  </option>
                </select>
              </div>


              <div className="modal-acciones">

                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={cerrarModal}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn-guardar-usuario"
                  disabled={guardando}
                >
                  {guardando
                    ? 'Guardando...'
                    : usuarioEditando
                      ? 'Guardar cambios'
                      : 'Crear usuario'}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  )
}

export default Usuarios
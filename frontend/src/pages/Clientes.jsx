import { useEffect, useState } from 'react'
import {
  obtenerClientes,
  crearCliente,
  actualizarCliente,
} from '../services/clienteService'

import './Clientes.css'


function Clientes() {
  const [clientes, setClientes] = useState([])
  const [buscar, setBuscar] = useState('')
  const [pagina, setPagina] = useState(1)
  const [total, setTotal] = useState(0)

  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const porPagina = 10

  const totalPaginas = Math.ceil(total / porPagina)

  const [mostrarModal, setMostrarModal] = useState(false)

const [nuevoCliente, setNuevoCliente] = useState({
  nombre: '',
  email: '',
  telefono: '',
})

const [guardando, setGuardando] = useState(false)

const [clienteEditando, setClienteEditando] = useState(null)

const [datosEdicion, setDatosEdicion] = useState({
  nombre: '',
  email: '',
  telefono: '',
})

const [guardandoEdicion, setGuardandoEdicion] = useState(false)

const manejarCrearCliente = async (e) => {
  e.preventDefault()

  try {
    setGuardando(true)
    setError('')

    const clienteCreado = await crearCliente({
      nombre: nuevoCliente.nombre,
      email: nuevoCliente.email,
      telefono: nuevoCliente.telefono || null,
    })

    setClientes((clientesActuales) => [
      ...clientesActuales,
      clienteCreado,
    ])

    setTotal((totalActual) => totalActual + 1)

    setNuevoCliente({
      nombre: '',
      email: '',
      telefono: '',
    })

    setMostrarModal(false)

  } catch (error) {
    setError(error.message)

  } finally {
    setGuardando(false)
  }
}

const abrirEditar = (cliente) => {
  setClienteEditando(cliente)

  setDatosEdicion({
    nombre: cliente.nombre,
    email: cliente.email,
    telefono: cliente.telefono || '',
  })
}


const manejarEditarCliente = async (e) => {
  e.preventDefault()

  try {
    setGuardandoEdicion(true)
    setError('')

    const clienteActualizado = await actualizarCliente(
      clienteEditando.id,
      {
        nombre: datosEdicion.nombre,
        email: datosEdicion.email,
        telefono: datosEdicion.telefono || null,
      }
    )

    setClientes((clientesActuales) =>
      clientesActuales.map((cliente) =>
        cliente.id === clienteActualizado.id
          ? clienteActualizado
          : cliente
      )
    )

    setClienteEditando(null)

  } catch (error) {
    setError(error.message)

  } finally {
    setGuardandoEdicion(false)
  }
}


  useEffect(() => {
    const cargarClientes = async () => {
      try {
        setCargando(true)
        setError('')

        const respuesta = await obtenerClientes(
          buscar,
          pagina,
          porPagina
        )

        setClientes(respuesta.clientes)
        setTotal(respuesta.total)

      } catch (error) {
        setError(error.message)

      } finally {
        setCargando(false)
      }
    }

    cargarClientes()

  }, [buscar, pagina])


  return (
    <div className="clientes">

      <div className="clientes-header">

        <div>
          <h1>Clientes</h1>

          <p>
            Administrá los clientes registrados
          </p>
        </div>

        <button
  className="btn-nuevo-cliente"
  onClick={() => setMostrarModal(true)}
>
  + Nuevo cliente
</button>

      </div>


      <div className="clientes-tabla">

        <div className="clientes-filtros">

          <input
            type="text"
            className="buscar-cliente"
            placeholder="Buscar por nombre o email..."
            value={buscar}
            onChange={(e) => {
              setBuscar(e.target.value)
              setPagina(1)
            }}
          />

        </div>


        {error && (
          <p className="clientes-error">
            {error}
          </p>
        )}


        <table>

          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>


          <tbody>

            {cargando ? (

              <tr>
                <td
                  colSpan="5"
                  className="cargando-clientes"
                >
                  Cargando clientes...
                </td>
              </tr>

            ) : (

              clientes.map((cliente) => (

                <tr key={cliente.id}>

                  <td>
                    {cliente.id}
                  </td>

                  <td>
                    {cliente.nombre}
                  </td>

                  <td>
                    {cliente.email}
                  </td>

                  <td>
                    {cliente.telefono || '-'}
                  </td>

                  <td>
                    <button
  className="btn-editar-cliente"
  onClick={() => abrirEditar(cliente)}
>
  Editar
</button>
                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>


        {!cargando && clientes.length === 0 && (
          <p className="sin-clientes">
            No se encontraron clientes.
          </p>
        )}


        {totalPaginas > 1 && (
          <div className="paginacion">

            <button
              onClick={() =>
                setPagina((paginaActual) => paginaActual - 1)
              }
              disabled={pagina === 1}
            >
              ← Anterior
            </button>

            <span>
              Página {pagina} de {totalPaginas}
            </span>

            <button
              onClick={() =>
                setPagina((paginaActual) => paginaActual + 1)
              }
              disabled={pagina === totalPaginas}
            >
              Siguiente →
            </button>

          </div>
        )}

      </div>

      {mostrarModal && (

  <div className="modal-fondo">

    <div className="modal">

      <div className="modal-header">
        <h2>Nuevo cliente</h2>

        <button
          className="modal-cerrar"
          onClick={() => setMostrarModal(false)}
        >
          ×
        </button>
      </div>


      <form onSubmit={manejarCrearCliente}>

        <div className="form-grupo">
          <label>Nombre</label>

          <input
            type="text"
            value={nuevoCliente.nombre}
            onChange={(e) =>
              setNuevoCliente({
                ...nuevoCliente,
                nombre: e.target.value,
              })
            }
            placeholder="Ej: María González"
            required
          />
        </div>


        <div className="form-grupo">
          <label>Email</label>

          <input
            type="email"
            value={nuevoCliente.email}
            onChange={(e) =>
              setNuevoCliente({
                ...nuevoCliente,
                email: e.target.value,
              })
            }
            placeholder="cliente@gmail.com"
            required
          />
        </div>


        <div className="form-grupo">
          <label>Teléfono</label>

          <input
            type="text"
            value={nuevoCliente.telefono}
            onChange={(e) =>
              setNuevoCliente({
                ...nuevoCliente,
                telefono: e.target.value,
              })
            }
            placeholder="Ej: 3815555555"
          />
        </div>


        <div className="modal-acciones">

          <button
            type="button"
            className="btn-cancelar"
            onClick={() => setMostrarModal(false)}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="btn-guardar"
            disabled={guardando}
          >
            {guardando
              ? 'Guardando...'
              : 'Guardar cliente'}
          </button>

        </div>

      </form>

    </div>

  </div>

)}

{clienteEditando && (

  <div className="modal-fondo">

    <div className="modal">

      <div className="modal-header">
        <h2>Editar cliente</h2>

        <button
          className="modal-cerrar"
          onClick={() => setClienteEditando(null)}
        >
          ×
        </button>
      </div>


      <form onSubmit={manejarEditarCliente}>

        <div className="form-grupo">
          <label>Nombre</label>

          <input
            type="text"
            value={datosEdicion.nombre}
            onChange={(e) =>
              setDatosEdicion({
                ...datosEdicion,
                nombre: e.target.value,
              })
            }
            required
          />
        </div>


        <div className="form-grupo">
          <label>Email</label>

          <input
            type="email"
            value={datosEdicion.email}
            onChange={(e) =>
              setDatosEdicion({
                ...datosEdicion,
                email: e.target.value,
              })
            }
            required
          />
        </div>


        <div className="form-grupo">
          <label>Teléfono</label>

          <input
            type="text"
            value={datosEdicion.telefono}
            onChange={(e) =>
              setDatosEdicion({
                ...datosEdicion,
                telefono: e.target.value,
              })
            }
          />
        </div>


        <div className="modal-acciones">

          <button
            type="button"
            className="btn-cancelar"
            onClick={() => setClienteEditando(null)}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="btn-guardar"
            disabled={guardandoEdicion}
          >
            {guardandoEdicion
              ? 'Guardando...'
              : 'Guardar cambios'}
          </button>

        </div>

      </form>

    </div>

  </div>

)}






    </div>
  )
}


export default Clientes
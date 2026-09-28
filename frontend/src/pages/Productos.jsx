import { useEffect, useState } from 'react'
import {
  obtenerProductos,
  cambiarEstadoProducto,
  crearProducto,
  actualizarProducto,
} from '../services/productoService'

import './Productos.css'


function Productos() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [mostrarModal, setMostrarModal] = useState(false)

const [nuevoProducto, setNuevoProducto] = useState({
  nombre: '',
  precio: '',
  stock: '',
})

const [guardando, setGuardando] = useState(false)

const [productoEditando, setProductoEditando] = useState(null)

const [datosEdicion, setDatosEdicion] = useState({
  nombre: '',
  precio: '',
  stock: '',
})

const [guardandoEdicion, setGuardandoEdicion] = useState(false)

const [buscar, setBuscar] = useState('')
const [pagina, setPagina] = useState(1)
const [total, setTotal] = useState(0)

const porPagina = 10

const totalPaginas = Math.ceil(total / porPagina)


  const manejarEstado = async (producto) => {
    try {
      const productoActualizado = await cambiarEstadoProducto(
        producto.id,
        !producto.activo
      )

      setProductos((productosActuales) =>
        productosActuales.map((p) =>
          p.id === producto.id
            ? productoActualizado
            : p
        )
      )

    } catch (error) {
      setError(error.message)
    }
  }

  const manejarCrearProducto = async (e) => {
  e.preventDefault()

  try {
    setGuardando(true)
    setError('')

    const productoCreado = await crearProducto({
      nombre: nuevoProducto.nombre,
      precio: Number(nuevoProducto.precio),
      stock: Number(nuevoProducto.stock),
    })

    setProductos((productosActuales) => [
      ...productosActuales,
      productoCreado,
    ])

    setNuevoProducto({
      nombre: '',
      precio: '',
      stock: '',
    })

    setMostrarModal(false)

  } catch (error) {
    setError(error.message)

  } finally {
    setGuardando(false)
  }
}

const abrirEditar = (producto) => {
  setProductoEditando(producto)

  setDatosEdicion({
    nombre: producto.nombre,
    precio: producto.precio,
    stock: producto.stock,
  })
}


const manejarEditarProducto = async (e) => {
  e.preventDefault()

  try {
    setGuardandoEdicion(true)
    setError('')

    const productoActualizado = await actualizarProducto(
      productoEditando.id,
      {
        nombre: datosEdicion.nombre,
        precio: Number(datosEdicion.precio),
        stock: Number(datosEdicion.stock),
      }
    )

    setProductos((productosActuales) =>
      productosActuales.map((producto) =>
        producto.id === productoActualizado.id
          ? productoActualizado
          : producto
      )
    )

    setProductoEditando(null)

  } catch (error) {
    setError(error.message)

  } finally {
    setGuardandoEdicion(false)
  }
}


  useEffect(() => {
  const cargarProductos = async () => {
    try {
      setCargando(true)
      setError('')

      const respuesta = await obtenerProductos(
        buscar,
        pagina,
        porPagina
      )

      setProductos(respuesta.productos)
      setTotal(respuesta.total)

    } catch (error) {
      setError(error.message)

    } finally {
      setCargando(false)
    }
  }

  cargarProductos()
}, [buscar, pagina])


  if (error) {
    return <p>{error}</p>
  }


  return (
    <div className="productos">

      <div className="productos-header">

        <div>
          <h1>Productos</h1>
          <p>Administrá los productos y su stock</p>
        </div>

        <button
  className="btn-nuevo"
  onClick={() => setMostrarModal(true)}
>
  + Nuevo producto
</button>

      </div>


      <div className="productos-tabla">

        <div className="productos-filtros">

  <input
    type="text"
    className="buscar-producto"
    placeholder="Buscar producto..."
    value={buscar}
    onChange={(e) => {
      setBuscar(e.target.value)
      setPagina(1)
    }}
  />

</div>

        <table>

          <thead>
            <tr>
              <th>ID</th>
              <th>Producto</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>


          <tbody>

            {productos.map((producto) => (

              <tr key={producto.id}>

                <td>
                  {producto.id}
                </td>

                <td>
                  {producto.nombre}
                </td>

                <td>
                  ${Number(producto.precio)
                    .toLocaleString('es-AR')}
                </td>

                <td>
                  {producto.stock}
                </td>


                {/* ESTADO */}
                <td>
                  <span
                    className={
                      producto.activo
                        ? 'estado activo'
                        : 'estado inactivo'
                    }
                  >
                    {producto.activo
                      ? 'Activo'
                      : 'Inactivo'}
                  </span>
                </td>


                {/* ACCIONES */}
                <td>

                  <button
  className="btn-editar"
  onClick={() => abrirEditar(producto)}
>
  Editar
</button>

                  <button
                    className={
                      producto.activo
                        ? 'btn-desactivar'
                        : 'btn-activar'
                    }
                    onClick={() => manejarEstado(producto)}
                  >
                    {producto.activo
                      ? 'Desactivar'
                      : 'Activar'}
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>


        {productos.length === 0 && (
          <p className="sin-productos">
            No hay productos registrados.
          </p>
        )}

        {totalPaginas > 1 && (
  <div className="paginacion">

    <button
      onClick={() => setPagina(pagina - 1)}
      disabled={pagina === 1}
    >
      ← Anterior
    </button>

    <span>
      Página {pagina} de {totalPaginas}
    </span>

    <button
      onClick={() => setPagina(pagina + 1)}
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
        <h2>Nuevo producto</h2>

        <button
          className="modal-cerrar"
          onClick={() => setMostrarModal(false)}
        >
          ×
        </button>
      </div>


      <form onSubmit={manejarCrearProducto}>

        <div className="form-grupo">
          <label>Nombre</label>

          <input
            type="text"
            value={nuevoProducto.nombre}
            onChange={(e) =>
              setNuevoProducto({
                ...nuevoProducto,
                nombre: e.target.value,
              })
            }
            placeholder="Ej: Auriculares"
            required
          />
        </div>


        <div className="form-grupo">
          <label>Precio</label>

          <input
            type="number"
            min="0.01"
            step="0.01"
            value={nuevoProducto.precio}
            onChange={(e) =>
              setNuevoProducto({
                ...nuevoProducto,
                precio: e.target.value,
              })
            }
            placeholder="Ej: 25000"
            required
          />
        </div>


        <div className="form-grupo">
          <label>Stock</label>

          <input
            type="number"
            min="0"
            step="1"
            value={nuevoProducto.stock}
            onChange={(e) =>
              setNuevoProducto({
                ...nuevoProducto,
                stock: e.target.value,
              })
            }
            placeholder="Ej: 10"
            required
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
              : 'Guardar producto'}
          </button>

        </div>

      </form>

    </div>

   </div>

    )}

    {productoEditando && (

  <div className="modal-fondo">

    <div className="modal">

      <div className="modal-header">
        <h2>Editar producto</h2>

        <button
          className="modal-cerrar"
          onClick={() => setProductoEditando(null)}
        >
          ×
        </button>
      </div>


      <form onSubmit={manejarEditarProducto}>

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
          <label>Precio</label>

          <input
            type="number"
            min="0.01"
            step="0.01"
            value={datosEdicion.precio}
            onChange={(e) =>
              setDatosEdicion({
                ...datosEdicion,
                precio: e.target.value,
              })
            }
            required
          />
        </div>


        <div className="form-grupo">
          <label>Stock</label>

          <input
            type="number"
            min="0"
            step="1"
            value={datosEdicion.stock}
            onChange={(e) =>
              setDatosEdicion({
                ...datosEdicion,
                stock: e.target.value,
              })
            }
            required
          />
        </div>


        <div className="modal-acciones">

          <button
            type="button"
            className="btn-cancelar"
            onClick={() => setProductoEditando(null)}
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


export default Productos
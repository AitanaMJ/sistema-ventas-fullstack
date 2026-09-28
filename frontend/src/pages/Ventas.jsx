import { useEffect, useState } from 'react'

import {
  obtenerVentas,
  obtenerVentaPorId,
  crearVenta,
} from '../services/ventaService'

import { obtenerClientes } from '../services/clienteService'
import { obtenerProductos } from '../services/productoService'
import { obtenerVendedores } from '../services/usuarioService'
import BuscadorCliente from '../components/BuscadorCliente'

import './Ventas.css'


function Ventas() {
  const [ventas, setVentas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  // =========================================================
  // PAGINACIÓN
  // =========================================================
  const [pagina, setPagina] = useState(1)
  const [total, setTotal] = useState(0)

  const porPagina = 10
  const totalPaginas = Math.ceil(total / porPagina)


  // =========================================================
  // FILTROS
  // =========================================================
  const [filtroCliente, setFiltroCliente] = useState('')
  const [filtroConsumidorFinal, setFiltroConsumidorFinal] = useState(false)

  const [clienteFiltroSeleccionado, setClienteFiltroSeleccionado] =
  useState(null)
  const [filtroVendedor, setFiltroVendedor] = useState('')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')

  const [vendedores, setVendedores] = useState([])


  // =========================================================
  // DETALLE DE VENTA
  // =========================================================
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null)
  const [cargandoDetalle, setCargandoDetalle] = useState(false)


  // =========================================================
  // NUEVA VENTA
  // =========================================================
  const [mostrarNuevaVenta, setMostrarNuevaVenta] = useState(false)

  const [clientes, setClientes] = useState([])
  const [productosDisponibles, setProductosDisponibles] = useState([])

  // Vacío = Consumidor final
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null)

  const [itemsVenta, setItemsVenta] = useState([
    {
      producto_id: '',
      cantidad: 1,
    },
  ])

  const [guardandoVenta, setGuardandoVenta] = useState(false)


  // =========================================================
  // ABRIR MODAL NUEVA VENTA
  // =========================================================
  const abrirNuevaVenta = async () => {
    try {
      setError('')

      const respuestaClientes = await obtenerClientes('', 1, 100)
      const respuestaProductos = await obtenerProductos('', 1, 100)

      setClientes(respuestaClientes.clientes)

      setProductosDisponibles(
        respuestaProductos.productos.filter(
          (producto) => producto.activo && producto.stock > 0
        )
      )

      // Consumidor final por defecto
      setClienteSeleccionado(null)

      setItemsVenta([
        {
          producto_id: '',
          cantidad: 1,
        },
      ])

      setMostrarNuevaVenta(true)
    } catch (error) {
      setError(error.message)
    }
  }


  // =========================================================
  // AGREGAR PRODUCTO A LA VENTA
  // =========================================================
  const agregarProducto = () => {
    setItemsVenta([
      ...itemsVenta,
      {
        producto_id: '',
        cantidad: 1,
      },
    ])
  }


  // =========================================================
  // MODIFICAR PRODUCTO / CANTIDAD
  // =========================================================
  const modificarItem = (indice, campo, valor) => {
    const nuevosItems = [...itemsVenta]

    nuevosItems[indice] = {
      ...nuevosItems[indice],
      [campo]: valor,
    }

    setItemsVenta(nuevosItems)
  }


  // =========================================================
  // ELIMINAR PRODUCTO
  // =========================================================
  const eliminarItem = (indice) => {
    if (itemsVenta.length === 1) {
      return
    }

    setItemsVenta(
      itemsVenta.filter((_, i) => i !== indice)
    )
  }


  // =========================================================
  // CALCULAR TOTAL DE LA VENTA
  // =========================================================
  const calcularTotalVenta = () => {
    return itemsVenta.reduce((total, item) => {
      const producto = productosDisponibles.find(
        (p) => p.id === Number(item.producto_id)
      )

      if (!producto) {
        return total
      }

      return (
        total +
        Number(producto.precio) * Number(item.cantidad || 0)
      )
    }, 0)
  }


  // =========================================================
  // CREAR VENTA
  // =========================================================
  const manejarCrearVenta = async (e) => {
    e.preventDefault()

    const productosValidos = itemsVenta.filter(
      (item) =>
        item.producto_id &&
        Number(item.cantidad) > 0
    )

    if (productosValidos.length === 0) {
      setError('Agregá al menos un producto')
      return
    }

    try {
      setGuardandoVenta(true)
      setError('')

      const nuevaVenta = await crearVenta({
        // Si no se seleccionó cliente, enviamos null.
       cliente_id: clienteSeleccionado
       ? clienteSeleccionado.id
        : null,

        productos: productosValidos.map((item) => ({
          producto_id: Number(item.producto_id),
          cantidad: Number(item.cantidad),
        })),
      })

      setMostrarNuevaVenta(false)

      // Recargar historial manteniendo los filtros actuales.
      const respuesta = await obtenerVentas(
        pagina,
        porPagina,
        {
          clienteId: filtroCliente,
          consumidorFinal: filtroConsumidorFinal,
          usuarioId: filtroVendedor,
          fechaDesde: fechaDesde,
          fechaHasta: fechaHasta,
        }
      )

      setVentas(respuesta.ventas)
      setTotal(respuesta.total)

      console.log('Venta registrada:', nuevaVenta)
    } catch (error) {
      setError(error.message)
    } finally {
      setGuardandoVenta(false)
    }
  }


  // =========================================================
  // CARGAR CLIENTES Y VENDEDORES PARA FILTROS
  // =========================================================
  useEffect(() => {
    const cargarFiltros = async () => {
      try {
        const respuestaClientes = await obtenerClientes('', 1, 100)
        const respuestaVendedores = await obtenerVendedores()

        setClientes(respuestaClientes.clientes)
        setVendedores(respuestaVendedores)
      } catch (error) {
        setError(error.message)
      }
    }

    cargarFiltros()
  }, [])


  // =========================================================
  // CARGAR VENTAS
  // =========================================================
  useEffect(() => {
    const cargarVentas = async () => {
      try {
        setCargando(true)
        setError('')

        const respuesta = await obtenerVentas(
          pagina,
          porPagina,
          {
            clienteId: filtroCliente,
            consumidorFinal: filtroConsumidorFinal,
            usuarioId: filtroVendedor,
            fechaDesde: fechaDesde,
            fechaHasta: fechaHasta,
          }
        )

        setVentas(respuesta.ventas)
        setTotal(respuesta.total)
      } catch (error) {
        setError(error.message)
      } finally {
        setCargando(false)
      }
    }

    cargarVentas()
  }, [
    pagina,
    filtroCliente,
    filtroConsumidorFinal,
    filtroVendedor,
    fechaDesde,
    fechaHasta,
  ])


  // =========================================================
  // FORMATEAR PRECIO
  // =========================================================
  const formatearPrecio = (precio) => {
    return Number(precio).toLocaleString('es-AR', {
      style: 'currency',
      currency: 'ARS',
    })
  }


  // =========================================================
  // FORMATEAR FECHA
  // =========================================================
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString('es-AR')
  }


  // =========================================================
  // VER DETALLE
  // =========================================================
  const verDetalle = async (id) => {
    try {
      setCargandoDetalle(true)
      setError('')

      const venta = await obtenerVentaPorId(id)

      setVentaSeleccionada(venta)
    } catch (error) {
      setError(error.message)
    } finally {
      setCargandoDetalle(false)
    }
  }


  return (
    <div className="ventas">

      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="ventas-header">

        <div>
          <h1>Ventas</h1>
          <p>Consultá y administrá las ventas realizadas</p>
        </div>

        <button
          className="btn-nueva-venta"
          onClick={abrirNuevaVenta}
        >
          + Nueva venta
        </button>

      </div>


      {/* =====================================================
          ERROR
      ===================================================== */}
      {error && (
        <p className="ventas-error">
          {error}
        </p>
      )}


      {/* =====================================================
          FILTROS
      ===================================================== */}
      <div className="ventas-filtros">

        <div className="filtro-grupo filtro-cliente">

  <label>Cliente</label>

  <div className="filtro-cliente-opciones">

    <button
      type="button"
      className={
        !filtroCliente && !filtroConsumidorFinal
          ? 'filtro-opcion activa'
          : 'filtro-opcion'
      }
      onClick={() => {
        setFiltroCliente('')
        setFiltroConsumidorFinal(false)
        setClienteFiltroSeleccionado(null)
        setPagina(1)
      }}
    >
      Todos
    </button>

    <button
      type="button"
      className={
        filtroConsumidorFinal
          ? 'filtro-opcion activa'
          : 'filtro-opcion'
      }
      onClick={() => {
        setFiltroCliente('')
        setFiltroConsumidorFinal(true)
        setClienteFiltroSeleccionado(null)
        setPagina(1)
      }}
    >
      Consumidor final
    </button>

  </div>

  {!filtroConsumidorFinal && (
    <BuscadorCliente
      clienteSeleccionado={clienteFiltroSeleccionado}
      onSeleccionar={(cliente) => {
        setClienteFiltroSeleccionado(cliente)

        if (cliente) {
          setFiltroCliente(cliente.id)
          setFiltroConsumidorFinal(false)
        } else {
          setFiltroCliente('')
        }

        setPagina(1)
      }}
    />
  )}

</div>

        <div className="filtro-grupo">
          <label>Vendedor</label>

          <select
            value={filtroVendedor}
            onChange={(e) => {
              setFiltroVendedor(e.target.value)
              setPagina(1)
            }}
          >
            <option value="">
              Todos los vendedores
            </option>

            {vendedores.map((vendedor) => (
              <option
                key={vendedor.id}
                value={vendedor.id}
              >
                {vendedor.nombre}
              </option>
            ))}
          </select>
        </div>


        <div className="filtro-grupo">
          <label>Desde</label>

          <input
            type="date"
            value={fechaDesde}
            onChange={(e) => {
              setFechaDesde(e.target.value)
              setPagina(1)
            }}
          />
        </div>


        <div className="filtro-grupo">
          <label>Hasta</label>

          <input
            type="date"
            value={fechaHasta}
            onChange={(e) => {
              setFechaHasta(e.target.value)
              setPagina(1)
            }}
          />
        </div>


        <button
  type="button"
  className="btn-limpiar-filtros"
  onClick={() => {
    setFiltroCliente('')
    setFiltroConsumidorFinal(false)
    setClienteFiltroSeleccionado(null)

    setFiltroVendedor('')
    setFechaDesde('')
    setFechaHasta('')

    setPagina(1)
  }}
>
  Limpiar filtros
</button>

      </div>


      {/* =====================================================
          TABLA DE VENTAS
      ===================================================== */}
      <div className="ventas-tabla">

        <table>

          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Vendedor</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>


          <tbody>

            {cargando ? (

              <tr>
                <td
                  colSpan="6"
                  className="cargando-ventas"
                >
                  Cargando ventas...
                </td>
              </tr>

            ) : (

              ventas.map((venta) => (

                <tr key={venta.id}>

                  <td>
                    #{venta.id}
                  </td>

                  <td>
                    {formatearFecha(venta.fecha)}
                  </td>

                  <td>
                    {venta.cliente?.nombre || 'Consumidor final'}
                  </td>

                  <td>
                    {venta.vendedor?.nombre || 'Sin vendedor'}
                  </td>

                  <td className="venta-total">
                    {formatearPrecio(venta.total)}
                  </td>

                  <td>
                    <button
                      className="btn-ver-venta"
                      onClick={() => verDetalle(venta.id)}
                      disabled={cargandoDetalle}
                    >
                      Ver detalle
                    </button>
                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>


        {!cargando && ventas.length === 0 && (
          <p className="sin-ventas">
            Todavía no hay ventas registradas.
          </p>
        )}


        {/* ===================================================
            PAGINACIÓN
        =================================================== */}
        {totalPaginas > 1 && (
          <div className="paginacion">

            <button
              onClick={() =>
                setPagina(
                  (paginaActual) => paginaActual - 1
                )
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
                setPagina(
                  (paginaActual) => paginaActual + 1
                )
              }
              disabled={pagina === totalPaginas}
            >
              Siguiente →
            </button>

          </div>
        )}

      </div>


      {/* =====================================================
          MODAL DETALLE DE VENTA
      ===================================================== */}
      {ventaSeleccionada && (

        <div className="modal-fondo">

          <div className="modal modal-venta">

            <div className="modal-header">

              <div>
                <h2>
                  Venta #{ventaSeleccionada.id}
                </h2>

                <p>
                  {formatearFecha(
                    ventaSeleccionada.fecha
                  )}
                </p>
              </div>

              <button
                className="modal-cerrar"
                onClick={() =>
                  setVentaSeleccionada(null)
                }
              >
                ×
              </button>

            </div>


            <div className="venta-info">

              <div>
                <span>Cliente</span>

                <strong>
                  {ventaSeleccionada.cliente?.nombre ||
                    'Consumidor final'}
                </strong>
              </div>


              <div>
                <span>Vendedor</span>

                <strong>
                  {ventaSeleccionada.vendedor?.nombre ||
                    'Sin vendedor'}
                </strong>
              </div>

            </div>


            <h3 className="detalle-titulo">
              Productos
            </h3>


            <div className="detalle-productos">

              <table>

                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>

                <tbody>

                  {ventaSeleccionada.productos.map(
                    (producto) => (

                      <tr key={producto.id}>

                        <td>
                          {producto.nombre}
                        </td>

                        <td>
                          {formatearPrecio(
                            producto.precio_unitario
                          )}
                        </td>

                        <td>
                          {producto.cantidad}
                        </td>

                        <td>
                          {formatearPrecio(
                            producto.subtotal
                          )}
                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>


            <div className="detalle-total">

              <span>Total</span>

              <strong>
                {formatearPrecio(
                  ventaSeleccionada.total
                )}
              </strong>

            </div>


            <div className="modal-acciones">

              <button
                className="btn-cancelar"
                onClick={() =>
                  setVentaSeleccionada(null)
                }
              >
                Cerrar
              </button>

            </div>

          </div>

        </div>

      )}


    {/* =====================================================
    MODAL NUEVA VENTA
===================================================== */}
{mostrarNuevaVenta && (

  <div className="modal-fondo">

    <div className="modal modal-nueva-venta">

      <div className="modal-header">

        <div>
          <h2>Nueva venta</h2>
          <p>Registrá los productos vendidos</p>
        </div>

        <button
          className="modal-cerrar"
          onClick={() => setMostrarNuevaVenta(false)}
        >
          ×
        </button>

      </div>


      <form onSubmit={manejarCrearVenta}>

        {/* CLIENTE */}
        <div className="form-grupo">

          <label>Cliente</label>

          <BuscadorCliente
            clienteSeleccionado={clienteSeleccionado}
            onSeleccionar={setClienteSeleccionado}
            permitirConsumidorFinal={true}
          />

        </div>


        {/* PRODUCTOS */}
        <div className="productos-venta-header">

          <h3>Productos</h3>

          <button
            type="button"
            className="btn-agregar-producto"
            onClick={agregarProducto}
          >
            + Agregar producto
          </button>

        </div>


              <div className="items-venta">

                {itemsVenta.map((item, indice) => {

                  const productoSeleccionado =
                    productosDisponibles.find(
                      (producto) =>
                        producto.id ===
                        Number(item.producto_id)
                    )

                  return (

                    <div
                      className="item-venta"
                      key={indice}
                    >

                      {/* PRODUCTO */}
                      <div className="item-producto">

                        <label>Producto</label>

                        <select
                          value={item.producto_id}
                          onChange={(e) =>
                            modificarItem(
                              indice,
                              'producto_id',
                              e.target.value
                            )
                          }
                          required
                        >

                          <option value="">
                            Seleccionar...
                          </option>


                          {productosDisponibles.map(
                            (producto) => {

                              const yaSeleccionado =
                                itemsVenta.some(
                                  (
                                    otroItem,
                                    otroIndice
                                  ) =>
                                    otroIndice !== indice &&
                                    Number(
                                      otroItem.producto_id
                                    ) === producto.id
                                )

                              return (
                                <option
                                  key={producto.id}
                                  value={producto.id}
                                  disabled={yaSeleccionado}
                                >
                                  {producto.nombre}
                                  {' - '}
                                  {formatearPrecio(
                                    producto.precio
                                  )}
                                  {' '}
                                  (Stock: {producto.stock})
                                </option>
                              )
                            }
                          )}

                        </select>

                      </div>


                      {/* CANTIDAD */}
                      <div className="item-cantidad">

                        <label>Cantidad</label>

                        <input
                          type="number"
                          min="1"
                          max={
                            productoSeleccionado
                              ? productoSeleccionado.stock
                              : undefined
                          }
                          value={item.cantidad}
                          onChange={(e) =>
                            modificarItem(
                              indice,
                              'cantidad',
                              e.target.value
                            )
                          }
                          required
                        />

                      </div>


                      {/* SUBTOTAL */}
                      <div className="item-subtotal">

                        <label>Subtotal</label>

                        <strong>
                          {productoSeleccionado
                            ? formatearPrecio(
                                Number(
                                  productoSeleccionado.precio
                                ) *
                                Number(
                                  item.cantidad || 0
                                )
                              )
                            : '-'}
                        </strong>

                      </div>


                      {/* ELIMINAR */}
                      <button
                        type="button"
                        className="btn-eliminar-item"
                        onClick={() =>
                          eliminarItem(indice)
                        }
                        disabled={
                          itemsVenta.length === 1
                        }
                      >
                        ×
                      </button>

                    </div>

                  )
                })}

              </div>


              {/* TOTAL */}
              <div className="nueva-venta-total">

                <span>Total</span>

                <strong>
                  {formatearPrecio(
                    calcularTotalVenta()
                  )}
                </strong>

              </div>


              {/* BOTONES */}
              <div className="modal-acciones">

                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={() =>
                    setMostrarNuevaVenta(false)
                  }
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn-confirmar-venta"
                  disabled={guardandoVenta}
                >
                  {guardandoVenta
                    ? 'Registrando...'
                    : 'Confirmar venta'}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  )
}


export default Ventas
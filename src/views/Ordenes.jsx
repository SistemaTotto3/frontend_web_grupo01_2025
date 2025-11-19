import { useState, useEffect } from "react";
import { Container, Col, Row, Button } from "react-bootstrap";
import TablaOrdenes from "../components/ordenes/TablaOrdenes";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import ModalRegistroOrden from "../components/ordenes/ModalRegistroOrden";
import ModalEdicionOrden from "../components/ordenes/ModalEdicionOrden";
import ModalEliminacionOrden from "../components/ordenes/ModalEliminacionOrden";
import ModalDetalleOrden from "../components/ordenes/ModalDetalleOrden";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Ordenes = () => {

  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [ordenesFiltrados, setOrdenesFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");

  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);

  const [ordenAEditar, setOrdenAEditar] = useState(null);
  const [ordenAEliminar, setOrdenAEliminar] = useState(null);
  const [ordenEnEdicion, setOrdenEnEdicion] = useState(null);

  const [detallesOrdenes, setDetallesOrdenes] = useState([]);
  const [mostrarModalDetalles, setMostrarModalDetalles] = useState(false);

  const [detallesNuevos, setDetallesNuevos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);

  const hoy = new Date().toISOString().split("T")[0];

  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevaOrden, setNuevaOrden] = useState({
    id_venta: '',
    fecha_orden: ''
  });

  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 5;

  const indexInicial = (paginaActual - 1) * elementosPorPagina;
const indexFinal = indexInicial + elementosPorPagina;

const ordenesPaginados = ordenesFiltrados.slice(indexInicial, indexFinal);

  const generarPDFOrdenes = () => {
      const doc = new jsPDF();
  
      // Encabezado del PDF
      doc.setFillColor(28, 41, 51);
      doc.rect(0, 0, 220, 30, "F");
  
      // Texto centrado (Título)
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(28);
      doc.text("Lista de Ordenes", doc.internal.pageSize.getWidth() / 2, 20, {
        align: "center",
      });
  
      // Columnas (solo las que existen)
      const columnas = ["ID Orden", "ID Venta", "Fecha Orden"];
  
      //  Filas (mapeadas desde tu lista de insumos)
      const filas = ordenesFiltrados.map((orden) => [
        orden.idOrden,
        orden.id_venta,
        orden.fecha_orden,
      ]);
  
      // Marcador de total de páginas
      const totalPaginas = "{total_pages_count_string}";
  
      // Generación de la tabla
      autoTable(doc, {
        head: [columnas],
        body: filas,
        startY: 40,
        theme: "grid",
        styles: { fontSize: 10, cellPadding: 2 },
        margin: { top: 20, left: 14, right: 14 },
        tableWidth: "auto",
        columnStyles: {
          0: { cellWidth: "auto" },
          1: { cellWidth: "auto" },
          2: { cellWidth: "auto" },
        },
        pageBreak: "auto",
        rowPageBreak: "auto",
  
        didDrawPage: function () {
          const alturaPagina = doc.internal.pageSize.getHeight();
          const anchoPagina = doc.internal.pageSize.getWidth();
          const numeroPagina = doc.internal.getNumberOfPages();
  
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          const piePagina = `Página ${numeroPagina} de ${totalPaginas}`;
          doc.text(piePagina, anchoPagina / 2, alturaPagina - 10, {
            align: "center",
          });
        },
      });
  
      //  Actualizar el total real de páginas
      if (typeof doc.putTotalPages === "function") {
        doc.putTotalPages(totalPaginas);
      }
  
      // Guardar el PDF con nombre y fecha actual
      const fecha = new Date();
      const dia = String(fecha.getDate()).padStart(2, "0");
      const mes = String(fecha.getMonth() + 1).padStart(2, "0");
      const anio = fecha.getFullYear();
      const nombreArchivo = `Ordenes_${dia}${mes}${anio}.pdf`;
  
      doc.save(nombreArchivo);
    };

    const obtenerNombreProducto = async (id_producto) => {
    if (!id_producto) return "—";
    try {
      const resp = await fetch(
        `http://localhost:3000/api/producto/${id_producto}`
      );
      if (!resp.ok) return "—";
      const data = await resp.json();
      return data.nombre_producto || "—";
    } catch (error) {
      console.error("Error al cargar nombre del producto:", error);
      return "—";
    }
  };

  const obtenerDetallesOrdenes = async (idOrden) => {
  try {
    const resp = await fetch(`http://localhost:3000/api/detalleorden/pororden/${idOrden}`);
    
    if (!resp.ok) throw new Error("Error al cargar detalles");

    const datos = await resp.json();

    // Traer nombre de producto
    const detalles = await Promise.all(
      datos.map(async (d) => ({
        ...d,
        nombre_producto: await obtenerNombreProducto(d.id_producto)
      }))
    );

    setDetallesOrdenes(detalles);
    setMostrarModalDetalles(true);

  } catch (error) {
    console.error(error);
    alert("No se pudieron cargar los detalles.");
  }
};


  const obtenerProductos = async () => {
    try {
      const resp = await fetch("http://localhost:3000/api/productos");
      if (!resp.ok) throw new Error("Error al cargar productos");
      const datos = await resp.json();
      // Normalizar campos para consistencia
      const productosNorm = datos.map((p) => ({
        ...p,
        id_producto: p.id_producto ?? p.id ?? null,
        nombre_producto: p.nombre_producto ?? p.nombre ?? "",
        stock: p.existencia ?? p.stock ?? 0,
      }));
      setProductos(productosNorm);
    } catch (error) {
      console.error(error);
    }
  };



  const agregarOrden = async () => {
    if (!nuevaOrden.id_venta.trim()) return
    
    if (detallesNuevos.length === 0) {
      alert("Agrega al menos un detalle.");
      return;
    };

    try {
      const respuesta = await fetch('http://localhost:3000/api/registrarorden', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaOrden)
      });

      if (!respuesta.ok) throw new Error('Error al guardar');

      const { idOrden } = await respuesta.json();

      for (const d of detallesNuevos) {
        await fetch("http://localhost:3000/api/registrarDetalleOrden", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...d, idOrden }),
        });
      }

      // Limpiar y cerrar el modal
      setNuevaOrden({ id_venta: '', fecha_orden: '' });
      setMostrarModal(false);

      await obtenerOrdenes(); // Refresca la lista
    } catch (error) {
      console.error("Error al agregar Orden:", error);
      alert("No se pudo guardar la Orden. Revisa la consola.");
    }
  };

  const manejarCambioInput = (e) => {
  const { name, value } = e.target;
  setNuevaOrden((prev) => ({
    ...prev,
    [name]: value,
  }));
};

  const obtenerOrdenes = async () => {
    try {
      const respuesta = await fetch("http://localhost:3000/api/orden");
      if (!respuesta.ok) {
        throw new Error("Error al obtener los ordenes");
      }
      const datos = await respuesta.json();
      setOrdenes(datos);
      setOrdenesFiltrados(datos);
      setCargando(false);
    } catch (error) {
      console.error(error.message);
      setCargando(false);
    }
  };

  const abrirModalEdicion = async (orden) => {
    setOrdenAEditar(orden);
  

  setOrdenEnEdicion({
      fecha_orden: new Date(orden.fecha_orden).toISOString().split("T")[0],
    });

      const resp = await fetch("http://localhost:3000/api/DetallesOrdenes");
      const todos = await resp.json();
      const detallesRaw = todos.filter((d) => d.idOrden === orden.idOrden);

      const detalles = await Promise.all(
      detallesRaw.map(async (d) => ({
        idOrden: d.idOrden,
        id_producto:d.id_producto,
        estado_orden: d.estado_orden,
        cantidad: d.cantidad,
      }))
    );

    setDetallesNuevos(detalles);
    setMostrarModalEdicion(true);
  };

const actualizarOrden = async () => {
    const total = detallesNuevos.reduce((acc, d) => acc + d.cantidad, 0
    );
    try {
      await fetch(
        `http://localhost:3000/api/actualizarOrdenPatch/${ordenAEditar.idOrden}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...ordenEnEdicion, total_cantidad: total } ),
        }
      );

      const resp = await fetch("http://localhost:3000/api/DetallesOrdenes");
      const todos = await resp.json();
      const actuales = todos.filter(
        (d) => d.idOrden === ordenAEditar.idOrden
      );
      for (const d of actuales) {
        await fetch(
          `http://localhost:3000/api/eliminarDetalleOrden/${d.id_detalle_orden}`,
          { method: "DELETE" }
        );
      }

      for (const d of detallesNuevos) {
        await fetch("http://localhost:3000/api/registrarDetalleOrden", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...d, idOrden: ordenAEditar.idOrden }),
        });
      }

      await obtenerOrdenes();
      cerrarModalEdicion();
    } catch (error) {
      alert("Error al actualizar.");
    }
  };



const abrirModalEliminacion = (orden) => {
    setOrdenAEliminar(orden);
    setMostrarModalEliminar(true);
  };

  const confirmarEliminacion = async () => {
    try {
      const respuesta = await fetch(
        `http://localhost:3000/api/eliminarorden/${ordenAEliminar.idOrden}`,
        {
          method: 'DELETE',
        }
      );

      if (!respuesta.ok) throw new Error('Error al eliminar');

      setMostrarModalEliminar(false);
      setOrdenAEliminar(null);
      await obtenerOrdenes();
    } catch (error) {
      console.error("Error al eliminar orden:", error);
      alert("No se pudo eliminar la orden.");
    }
  };


  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);

    if (texto.trim() === "") {
    setOrdenesFiltrados(ordenes);
    return;
  }
    const filtrados = ordenes.filter(
      (orden) =>
        orden.fecha_orden == texto ||
      orden.id_venta == texto
    );
    setOrdenesFiltrados(filtrados);
  };



const cerrarModalRegistro = () => {
    setMostrarModalRegistro(false);
    setNuevaOrden({ fecha_orden: hoy, id_venta: ''});
    setDetallesNuevos([]);
  };

  const cerrarModalEdicion = () => {
    setMostrarModalEdicion(false);
    setOrdenAEditar(null);
    setOrdenEnEdicion(null);
    setDetallesNuevos([]);
  };

  useEffect(() => {
    obtenerOrdenes();
    obtenerProductos();
  }, []);


  return (
    <>
      <Container className="mt-4">
              <h4>Ordenes</h4>
              <Row>
                <Col lg={5} md={6} sm={8} xs={12}>
                  <CuadroBusquedas
                    textoBusqueda={textoBusqueda}
                    manejarCambioBusqueda={manejarCambioBusqueda}
                  />
                </Col>
                <Col className="text-end">
                  <Button
                    className="btn btn-secondary"
                    onClick={() => setMostrarModalRegistro(true)}
                  >
                    + Nueva Orden
                  </Button>
                </Col>
                <Col lg={3} md={4} sm={4} xs={5}>
                  <Button
                    className="mb-3"
                    onClick={generarPDFOrdenes}
                    variant="secondary"
                    style={{ width: "100%" }}
                  >
                    Generar reporte PDF
                  </Button>
                </Col>
              </Row>

        <TablaOrdenes
          ordenes={ordenesPaginados}
          cargando={cargando}
          obtenerDetalles={obtenerDetallesOrdenes}
          abrirModalEdicion={abrirModalEdicion}
          abrirModalEliminacion={abrirModalEliminacion}
          totalElementos={ordenesFiltrados.length}
          elementosPorPagina={elementosPorPagina}
          paginaActual={paginaActual}
          establecerPaginaActual={setPaginaActual}
        />

        <ModalRegistroOrden
           mostrar={mostrarModalRegistro}
          setMostrar={cerrarModalRegistro}
          nuevaOrden={nuevaOrden}
          setNuevaOrden={setNuevaOrden}
          detalles={detallesNuevos}
          setDetalles={setDetallesNuevos}
          productos={productos}
          agregarOrden={agregarOrden}
          hoy={hoy}
          
        />

        <ModalEdicionOrden
          mostrar={mostrarModalEdicion}
          setMostrar={cerrarModalEdicion}
          orden={ordenAEditar}
          ordenEnEdicion={ordenEnEdicion}
          setOrdenEnEdicion={setOrdenEnEdicion}
          detalles={detallesNuevos}
          setDetalles={setDetallesNuevos}
          productos={productos}
          actualizarOrden={actualizarOrden}   
        />

        <ModalEliminacionOrden
          mostrar={mostrarModalEliminar}                
          setMostrar={setMostrarModalEliminar}
          orden={ordenAEliminar}           
          confirmarEliminacion={confirmarEliminacion}
        />

        <ModalDetalleOrden
          mostrarModal={mostrarModalDetalles}
          setMostrarModal={() => setMostrarModalDetalles(false)}
          detalles={detallesOrdenes}
        />
      </Container>
    </>
  );
};

export default Ordenes;

// src/views/Insumos.jsx
import { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import TablaInsumo from '../components/insumos/TablaInsumo';
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas';
import ModalRegistroInsumo from '../components/insumos/ModalRegistroInsumo';
import ModalEdicionInsumo from '../components/insumos/ModalEdicionInsumo';
import ModalEliminacionInsumo from '../components/insumos/ModalEliminacionInsumo';
import ModalDetallesInsumo from '../components/insumos/ModalDetallesInsumo';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Insumos = () => {
  const [insumos, setInsumos] = useState([]);
   const [insumosFiltrados, setInsumosFiltrados] = useState([]);
   const [cargando, setCargando] = useState(true);
  const [textoBusqueda, setTextoBusqueda] = useState("");

   const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
   const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
   const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [mostrarModalDetalles, setMostrarModalDetalles] = useState(false);

  const [insumoAEditar, setInsumoAEditar] = useState(null);
  const [insumoAEliminar, setInsumoAEliminar] = useState(null);
  const [detallesInsumo, setDetallesInsumo] = useState([]);

  const [productos, setProductos] = useState([]);

  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 5;
  // Fecha 
  const hoy = new Date().toISOString().split('T')[0];

  const generarPDFInsumos = () => {
  const doc = new jsPDF();

  // Encabezado del PDF
  doc.setFillColor(28, 41, 51);
  doc.rect(0, 0, 220, 30, 'F');

  // Texto centrado (Título)
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.text("Lista de Insumos", doc.internal.pageSize.getWidth() / 2, 20, { align: "center" });

  // Columnas (solo las que existen)
  const columnas = ["ID", "Fecha Insumo", "Total (C$)"];

  //  Filas (mapeadas desde tu lista de insumos)
  const filas = insumosFiltrados.map(insumo => [
    insumo.id_insumo,
    new Date(insumo.fecha_insumo).toLocaleDateString('es-NI', { timeZone: 'America/Managua' }),
    parseFloat(insumo.total_insumo).toFixed(2),
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
    tableWidth: 'auto',
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 'auto' },
    },
    pageBreak: 'auto',
    rowPageBreak: 'auto',

    didDrawPage: function () {
      const alturaPagina = doc.internal.pageSize.getHeight();
      const anchoPagina = doc.internal.pageSize.getWidth();
      const numeroPagina = doc.internal.getNumberOfPages();

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      const piePagina = `Página ${numeroPagina} de ${totalPaginas}`;
      doc.text(piePagina, anchoPagina / 2, alturaPagina - 10, { align: "center" });
    },
  });

  //  Actualizar el total real de páginas
  if (typeof doc.putTotalPages === 'function') {
    doc.putTotalPages(totalPaginas);
  }

  // Guardar el PDF con nombre y fecha actual
  const fecha = new Date();
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const anio = fecha.getFullYear();
  const nombreArchivo = `insumos_${dia}${mes}${anio}.pdf`;

  doc.save(nombreArchivo);
};


  // === ESTADO PARA REGISTRO ===
  const [nuevoInsumo, setNuevoInsumo] = useState({
    fecha_insumo: hoy,
    total_insumo: 0
  });

  // === ESTADO PARA EDICIÓN (SEPARADO) ===
  const [insumoEnEdicion, setInsumoEnEdicion] = useState(null);

  const [detallesNuevos, setDetallesNuevos] = useState([]);

  const insumosPaginados = insumosFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  const obtenerNombreProducto = async (idProducto) => {
    if (!idProducto) return '—';
    try {
      const resp = await fetch(`http://localhost:3000/api/producto/${idProducto}`);
      if (!resp.ok) return '—';
      const data = await resp.json();
      return data.nombre_producto || '—';
    } catch (error) {
      console.error("Error al cargar nombre del producto:", error);
      return '—';
    }
  };

  // === CARGAR DETALLES CON NOMBRE DE INSUMO ===
  const obtenerDetallesInsumo = async (id_insumo) => {
    try {
      const resp = await fetch('http://localhost:3000/api/Detalle_insumo');
      if (!resp.ok) throw new Error('Error al cargar detalles');
      const todos = await resp.json();
      const filtrados = todos.filter(d => d.id_insumo === parseInt(id_insumo));

      const detalles = await Promise.all(
        filtrados.map(async (d) => ({
          ...d,
          nombre_insumo: d.nombre_insumo || await obtenerNombreProducto(d.id_producto) // Priorizar nombre_insumo, fallback a producto
        }))
      );

      setDetallesInsumo(detalles);
      setMostrarModalDetalles(true);
    } catch (error) {
      console.error(error);
      alert("No se pudieron cargar los detalles.");
    }
  };

  const obtenerProductos = async () => {
    try {
      const resp = await fetch('http://localhost:3000/api/productos');
      if (!resp.ok) throw new Error('Error al cargar productos');
      const datos = await resp.json();
      // Normalizar campos para consistencia
      const productosNorm = datos.map(p => ({
        ...p,
        id_producto: p.id_producto ?? p.id ?? null,
        nombre_producto: p.nombre_producto ?? p.nombre ?? "",
        precio_insumo: p.precio_costo ?? p.precio_unitario ?? p.precio ?? 0, // Usar precio_costo para insumos
        stock: p.existencia ?? p.stock ?? 0,
      }));
      setProductos(productosNorm);
    } catch (error) {
      console.error(error);
    }
  };

  const obtenerInsumos = async () => {
    try {
      const resp = await fetch('http://localhost:3000/api/insumo');
      if (!resp.ok) throw new Error('Error al cargar insumos');
      const datos = await resp.json();
      setInsumos(datos);
      setInsumosFiltrados(datos);
     } catch (error) {
      console.error(error);
      alert("Error al cargar insumos.");
    } finally {
      setCargando(false);
    }
  };

  // === BÚSQUEDA ===
  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);
    const filtrados = insumos.filter(i =>
      i.id_insumo.toString().includes(texto) ||
      i.total_insumo.toString().includes(texto)
    );
    setInsumosFiltrados(filtrados);
    setPaginaActual(1);
  };

  // === REGISTRO ===
  const agregarInsumo = async () => {
    if (detallesNuevos.length === 0) {
      alert("Agrega al menos un detalle.");
      return;
    }

    const total = detallesNuevos.reduce((sum, d) => sum + (d.cantidad_insumo * d.precio_insumo), 0);

    try {
      const insumoResp = await fetch('http://localhost:3000/api/registrarinsumo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...nuevoInsumo, total_insumo: total })
      });

      if (!insumoResp.ok) throw new Error('Error al crear insumo');
      const { id_insumo } = await insumoResp.json();

      for (const d of detallesNuevos) {
        await fetch('http://localhost:3000/api/registrardetalle_insumo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...d, id_insumo })
        });
      }

      await obtenerInsumos();
      cerrarModalRegistro();
    } catch (error) {
      console.error(error);
      alert("Error al registrar insumo.");
    }
  };

  // === EDICIÓN ===
  const abrirModalEdicion = async (insumo) => {
    setInsumoAEditar(insumo);

    setInsumoEnEdicion({
      fecha_insumo: new Date(insumo.fecha_insumo).toISOString().split('T')[0]
    });

    const resp = await fetch('http://localhost:3000/api/Detalle_insumo');
    const todos = await resp.json();
    const detallesRaw = todos.filter(d => d.id_insumo === insumo.id_insumo);

    const detalles = await Promise.all(
      detallesRaw.map(async (d) => ({
        id_producto: d.id_producto,
        nombre_producto: await obtenerNombreProducto(d.id_producto),
        nombre_insumo: d.nombre_insumo, // Usar directamente el nombre_insumo de la DB
        cantidad_insumo: d.cantidad_insumo,
        precio_insumo: d.precio_insumo
      }))
    );

    setDetallesNuevos(detalles);
    setMostrarModalEdicion(true);
  };

  const actualizarInsumo = async () => {
    const total = detallesNuevos.reduce((sum, d) => sum + (d.cantidad_insumo * d.precio_insumo), 0);
    try {
      await fetch(`http://localhost:3000/api/actualizarInsumoPatch/${insumoAEditar.id_insumo}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...insumoEnEdicion, total_insumo: total })
      });

      const resp = await fetch('http://localhost:3000/api/Detalle_insumo');
      const todos = await resp.json();
      const actuales = todos.filter(d => d.id_insumo === insumoAEditar.id_insumo);
      for (const d of actuales) {
        await fetch(`http://localhost:3000/api/eliminardetalle_insumo/${d.id_detalle_insumo}`, { method: 'DELETE' });
      }

      for (const d of detallesNuevos) {
        await fetch('http://localhost:3000/api/registrardetalle_insumo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...d, id_insumo: insumoAEditar.id_insumo })
        });
      }

      await obtenerInsumos();
      cerrarModalEdicion();
    } catch (error) {
      alert("Error al actualizar.");
    }
  };

  // === ELIMINACIÓN ===
  const abrirModalEliminacion = (insumo) => {
    setInsumoAEliminar(insumo);
    setMostrarModalEliminar(true);
  };

  const eliminarInsumo = async () => {
    try {
      await fetch(`http://localhost:3000/api/eliminarinsumo/${insumoAEliminar.id_insumo}`, { method: 'DELETE' });
      await obtenerInsumos();
      setMostrarModalEliminar(false);
    } catch (error) {
      alert("No se pudo eliminar.");
    }
  };

  // === LIMPIEZA DE MODALES ===
  const cerrarModalRegistro = () => {
    setMostrarModalRegistro(false);
    setNuevoInsumo({ fecha_insumo: hoy, total_insumo: 0 });
    setDetallesNuevos([]);
  };

  const cerrarModalEdicion = () => {
    setMostrarModalEdicion(false);
    setInsumoAEditar(null);
    setInsumoEnEdicion(null);
    setDetallesNuevos([]);
  };

   useEffect(() => {
    obtenerInsumos();
    obtenerProductos();
   }, []);
 
  return (
    <>
    <Container className="mt-4">
      <h4>Insumos</h4>
      <Row>
        <Col lg={5} md={6} sm={8} xs={12}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarCambioBusqueda}
          />
        </Col>
        <Col className="text-end">
          <Button className="color-boton-registro" onClick={() => setMostrarModalRegistro(true)}>
            + Nuevo Insumo
          </Button>
        </Col>
      </Row>

      <TablaInsumo
        insumos={insumosPaginados}
        cargando={cargando}
        obtenerDetalles={obtenerDetallesInsumo}
        abrirModalEdicion={abrirModalEdicion}
        abrirModalEliminacion={abrirModalEliminacion}
        totalElementos={insumosFiltrados.length}
        elementosPorPagina={elementosPorPagina}
        paginaActual={paginaActual}
        establecerPaginaActual={setPaginaActual}
      />

      <ModalRegistroInsumo
        mostrar={mostrarModalRegistro}
        setMostrar={cerrarModalRegistro}
        nuevoInsumo={nuevoInsumo}
        setNuevoInsumo={setNuevoInsumo}
        detalles={detallesNuevos}
        setDetalles={setDetallesNuevos}
        productos={productos}
        agregarInsumo={agregarInsumo}
        hoy={hoy}
      />

      <ModalEdicionInsumo
        mostrar={mostrarModalEdicion}
        setMostrar={cerrarModalEdicion}
        insumo={insumoAEditar}
        insumoEnEdicion={insumoEnEdicion}
        setInsumoEnEdicion={setInsumoEnEdicion}
        detalles={detallesNuevos}
        setDetalles={setDetallesNuevos}
        productos={productos}
        actualizarInsumo={actualizarInsumo}
      />

      <ModalEliminacionInsumo
        mostrar={mostrarModalEliminar}
        setMostrar={setMostrarModalEliminar}
        insumo={insumoAEliminar}
        confirmarEliminacion={eliminarInsumo}
      />

      <ModalDetallesInsumo
        mostrarModal={mostrarModalDetalles}
        setMostrarModal={() => setMostrarModalDetalles(false)}
        detalles={detallesInsumo}
      />
    </Container>
       <Col lg ={3} md={4} sm={4} xs={5}>
          <Button 
          className="mb-3"
          onClick={generarPDFInsumos}
          variant="secondary"
          style={{width: "100%"}}
          >
            Generar reporte PDF 
          </Button>
          </Col>
    </>
  
  );
};

export default Insumos;
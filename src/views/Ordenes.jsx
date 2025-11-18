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

  const [ordenEditada, setOrdenEditada] = useState(null);
  const [ordenAEliminar, setOrdenAEliminar] = useState(null);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevaOrden, setNuevaOrden] = useState({
    id_venta: '',
    fecha_orden: ''
  });

  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 5;

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

  const agregarOrden = async () => {
    if (!nuevaOrden.id_venta.trim()) return;

    try {
      const respuesta = await fetch('http://localhost:3000/api/registrarorden', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaOrden)
      });

      if (!respuesta.ok) throw new Error('Error al guardar');

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

  const abrirModalEdicion = (orden) => {
    setOrdenEditada({ ...orden });
    setMostrarModalEdicion(true);
  };

  const guardarEdicion = async () => {
    if (!ordenEditada.id_venta.trim()) return;

    try {
      const respuesta = await fetch(
        `http://localhost:3000/api/actualizarordenpatch/${ordenEditada.idOrden}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ordenEditada),
        }
      );

      if (!respuesta.ok) throw new Error('Error al actualizar');

      setMostrarModalEdicion(false);
      await obtenerOrdenes();
    } catch (error) {
      console.error("Error al editar orden:", error);
      alert("No se pudo actualizar la orden.");
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

  useEffect(() => {
    obtenerOrdenes();
  }, []);
  return (
    <>
      <Container className="mt-4">
        <h4> Ordenes </h4>
        <Row>
          
          <Col lg={5} md={6} sm={8} xs={12} className="mb-3">
            <CuadroBusquedas
              textoBusqueda={textoBusqueda}
              manejarCambioBusqueda={manejarCambioBusqueda}
            />
          </Col>
          <Col className="text-end">
  <Button
    className="btn btn-secondary"
    onClick={() => setMostrarModal(true)}
  >
    + Nueva Orden
  </Button>
</Col>  
        </Row>

        <TablaOrdenes
          ordenes={ordenesFiltrados} 
          cargando={cargando}
          abrirModalEdicion={abrirModalEdicion}
          abrirModalEliminacion={abrirModalEliminacion}
        />

        <ModalRegistroOrden
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          nuevaOrden={nuevaOrden}
          manejarCambioInput={manejarCambioInput}
          agregarOrden={agregarOrden}
        />

        <ModalEdicionOrden
          mostrar={mostrarModalEdicion}             
          setMostrar={setMostrarModalEdicion}        
          ordenEditada={ordenEditada}           
          setOrdenEditada={setOrdenEditada}    
          guardarEdicion={guardarEdicion}       
        />

        <ModalEliminacionOrden
          mostrar={mostrarModalEliminar}                
          setMostrar={setMostrarModalEliminar}
          orden={ordenAEliminar}           
          confirmarEliminacion={confirmarEliminacion}
        />


      </Container>
    </>
  );
};

export default Ordenes;

import { useState, useEffect } from "react";
import { Container, Col, Row, Button } from "react-bootstrap";
import TablaCliente from "../components/clientes/TablaCliente";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import ModalRegistroCliente from "../components/clientes/ModalRegistroCliente";
import ModalEdicionCliente from "../components/clientes/ModalEdicionCliente";
import ModalEliminacionCliente from "../components/clientes/ModalEliminacionCliente";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");

  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);

  const [clienteEditada, setClienteEditada] = useState(null);
  const [clienteAEliminar, setClienteAEliminar] = useState(null);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre_1: "",
    apellido_1: "",
    direccion_cliente: "",
    telefono_cliente: "",
  });
  const abrirModalEdicion = (cliente) => {
    setClienteEditada({ ...cliente });
    setMostrarModalEdicion(true);
  };

   // Generar PDF
    const generarPDFClientes = () => {
      const doc = new jsPDF();
  
      doc.setFillColor(28, 41, 51);
      doc.rect(0, 0, 220, 30, "F");
  
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(28);
      doc.text("Lista de Clientes", doc.internal.pageSize.getWidth() / 2, 18, { align: "center" });
  
      const columnas = ["ID", "Primer_nombre", "Segundo_nombre", "Direccion_cliente", "Telefono_cliente"];
  
      const filas = clientesFiltrados.map((c) => [c.idCliente, c.nombre_1, c.apellido_1, c.direccion_cliente, c.telefono_cliente]);
  
      const totalPaginas = "{total_pages_count_string}";
  
      autoTable(doc, {
        head: [columnas],
        body: filas,
        startY: 40,
        theme: "grid",
        styles: { fontSize: 10, cellPadding: 2 },
        margin: { top: 20, left: 14, right: 14 },
        tableWidth: "auto",
        pageBreak: "auto",
        rowPageBreak: "auto",
        didDrawPage: function () {
          const alturaPagina = doc.internal.pageSize.getHeight();
          const anchoPagina = doc.internal.pageSize.getWidth();
  
          const numeroPagina = doc.internal.getNumberOfPages();
  
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          const piePagina = `Página ${numeroPagina} de ${totalPaginas}`;
          doc.text(piePagina, anchoPagina / 2 + 15, alturaPagina - 10, { align: "center" });
        },
      });
  
      if (typeof doc.putTotalPages === "function") {
        doc.putTotalPages(totalPaginas);
      }
  
      const fecha = new Date();
      const dia = String(fecha.getDate()).padStart(2, "0");
      const mes = String(fecha.getMonth() + 1).padStart(2, "0");
      const anio = fecha.getFullYear();
      const nombreArchivo = `clientes_${dia}${mes}${anio}.pdf`;
      doc.save(nombreArchivo);
    };

  const guardarEdicion = async () => {
    if (!clienteEditada.nombre_1.trim()) return;

    try {
      const respuesta = await fetch(
        `http://localhost:3000/api/actualizarClientepatch/${clienteEditada.idCliente
}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(clienteEditada),
        }
      );

      if (!respuesta.ok) throw new Error("Error al actualizar");

      setMostrarModalEdicion(false);
      await obtenerClientes();
    } catch (error) {
      console.error("Error al editar cliente:", error);
      alert("No se pudo actualizar la cliente.");
    }
  };

const abrirModalEliminacion = (cliente) => {
  setClienteAEliminar(cliente);
  setMostrarModalEliminar(true);
};


  const confirmarEliminacion = async () => {
    try {
      const respuesta = await fetch(
       `http://localhost:3000/api/eliminarCliente/${clienteAEliminar.idCliente}`,
        {
          method: "DELETE",
        }
      );

      if (!respuesta.ok) throw new Error("Error al eliminar");

      setMostrarModalEliminar(false);
      setClienteAEliminar(null);
      await obtenerClientes();
    } catch (error) {
      console.error("Error al eliminar clientes:", error);
      alert("No se pudo eliminar la cliente.");
    }
  };

  const agregarCliente = async () => {
    if (!nuevoCliente.nombre_1.trim()) return;

    try {
      const respuesta = await fetch(
        "http://localhost:3000/api/registrarCliente",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nuevoCliente),
        }
      );

      if (!respuesta.ok) throw new Error("Error al guardar");

      // Limpiar y cerrar el modal
      setNuevoCliente({
        nombre_1: "",
        apellido_1: "",
        direccion_cliente: "",
        telefono_cliente: "",
      });

      setMostrarModal(false);
      await obtenerClientes(); // Refresca la lista
    } catch (error) {
      console.error("Error al agregar cliente:", error);
      alert("No se pudo guardar la cliente. Revisa la consola.");
    }
  };

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoCliente((prev) => ({ ...prev, [name]: value }));
  };

  const obtenerClientes = async () => {
    try {
      const respuesta = await fetch("http://localhost:3000/api/Clientes");
      if (!respuesta.ok) {
        throw new Error("Error al obtener los clientes");
      }
      const datos = await respuesta.json();
      setClientes(datos);
      setClientesFiltrados(datos);
      setCargando(false);
    } catch (error) {
      console.error(error.message);
      setCargando(false);
    }
  };
  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);

    if (texto.trim() === "") {
      setClientesFiltrados(clientes);
      return;
    }
    const filtrados = clientes.filter(
      (cliente) =>
        cliente.nombre_1.toLowerCase().includes(texto) ||
        cliente.apellido_1.toLowerCase().includes(texto) ||
        cliente.direccion_cliente.toLowerCase().includes(texto) ||
        cliente.telefono_cliente.toLowerCase().includes(texto)
    );
    setClientesFiltrados(filtrados);
  };

  useEffect(() => {
    obtenerClientes();
  }, []);
  return (
    <>
      <Container className="mt-4">
        <h4> Clientes </h4>

        <Row>
          <Col lg={5} md={8} sm={8} xs={7}>
            <CuadroBusquedas
              textoBusqueda={textoBusqueda}
              manejarCambioBusqueda={manejarCambioBusqueda}
            />
          </Col>
        </Row>

        <Col className="text-end">
          <Button variant="primary" onClick={() => setMostrarModal(true)}>
            + Nuevo Cliente
          </Button>
        </Col>
         <Col lg={3} md={4} sm={4} xs={5}>
        <Button
          className="mb-3"
          onClick={generarPDFClientes}
          variant="secondary"
          style={{ width: "100%" }}
        >
          Generar reporte PDF
        </Button>
      </Col>

        <TablaCliente
          clientes={clientesFiltrados}
          cargando={cargando}
          abrirModalEdicion={abrirModalEdicion}
          abrirModalEliminacion={abrirModalEliminacion}
        />

        <ModalRegistroCliente
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          nuevoCliente={nuevoCliente}
          manejarCambioInput={manejarCambioInput}
          agregarCliente={agregarCliente}
        />

        <ModalEdicionCliente
          mostrar={mostrarModalEdicion}
          setMostrar={setMostrarModalEdicion}
          clienteEditada={clienteEditada}
          setClienteEditada={setClienteEditada}
          guardarEdicion={guardarEdicion}
        />

      <ModalEliminacionCliente
        mostrar={mostrarModalEliminar}
        setMostrar={setMostrarModalEliminar}
        cliente={clienteAEliminar}
        confirmarEliminacion={confirmarEliminacion}
      />
      </Container>
    </>
  );
};

export default Clientes;

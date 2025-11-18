import { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import TablaVentas from "../components/ventas/TablaVentas";
import ModalRegistroVenta from "../components/ventas/ModalRegistroVenta";
import ModalEdicionVenta from "../components/ventas/ModalEdicionVenta";
import ModalEliminacionVenta from "../components/ventas/ModalEliminacionVenta";

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [ventasFiltradas, setVentasFiltradas] = useState([]);

  const [cargando, setCargando] = useState(true);
  const [textoBusqueda, setTextoBusqueda] = useState("");

  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);

  const [ventaEditada, setVentaEditada] = useState(null);
  const [ventaAEliminar, setVentaAEliminar] = useState(null);

  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 5;

  const hoy = new Date().toISOString().split("T")[0];
  const [nuevaVenta, setNuevaVenta] = useState({
    idCliente: "",
    fecha_venta: hoy,
    total_venta: 0,
    estado_venta: "Pendiente",
  });

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevaVenta((prev) => ({ ...prev, [name]: value }));
  };

  const formatToMySQL = (input) => {
    if (input == null || input === "") return null;
    // If already looks like YYYY-MM-DD (date input), return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(input)) return input;

    const date = new Date(input);
    if (isNaN(date)) return input;
    const pad = (n) => String(n).padStart(2, "0");
    const yyyy = date.getFullYear();
    const mm = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const min = pad(date.getMinutes());
    const ss = pad(date.getSeconds());

    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
  };

  const generarPDFVentas = () => {
    const doc = new jsPDF();

    // Encabezado del PDF
    doc.setFillColor(28, 41, 51);
    doc.rect(0, 0, 220, 30, "F");

    // Título centrado
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.text("Lista de Ventas", doc.internal.pageSize.getWidth() / 2, 20, {
      align: "center",
    });

    // Columnas a mostrar
    const columnas = ["ID Venta", "Cliente (ID)", "Fecha Venta", "Total (C$)", "Estado"];

    // Filas mapeadas desde ventasFiltradas
    const filas = ventasFiltradas.map((v) => [
      v.id_venta,
      v.idCliente ?? v.id_cliente ?? "",
      v.fecha_venta
        ? new Date(v.fecha_venta).toLocaleDateString("es-NI", {
            timeZone: "America/Managua",
          })
        : "",
      v.total_venta != null ? parseFloat(v.total_venta).toFixed(2) : "",
      v.estado_venta ?? "",
    ]);

    const totalPaginas = "{total_pages_count_string}";

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
        3: { cellWidth: "auto" },
        4: { cellWidth: "auto" },
      },
      pageBreak: "auto",
      rowPageBreak: "auto",

      didDrawPage: function (data) {
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

    if (typeof doc.putTotalPages === "function") {
      doc.putTotalPages(totalPaginas);
    }

    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const anio = fecha.getFullYear();
    const nombreArchivo = `ventas_${dia}${mes}${anio}.pdf`;

    doc.save(nombreArchivo);
  };

  const obtenerVentas = async () => {
    try {
      const res = await fetch("http://localhost:3002/api/ventas");
      const data = await res.json();

      setVentas(data);
      setVentasFiltradas(data);
      setCargando(false);
    } catch (err) {
      console.log("Error al cargar ventas:", err);
      setCargando(false);
    }
  };

  const obtenerClientes = async () => {
    try {
      const res = await fetch("http://localhost:3002/api/Clientes");
      const raw = await res.json();
      const normalizados = raw.map((c) => ({
        ...c,
        idCliente: c.idCliente ?? c.id_cliente ?? c.id,
      }));
      setClientes(normalizados);
    } catch (err) {
      console.error("Error al cargar clientes:", err);
    }
  };

  const agregarVenta = async () => {
    try {
      const payload = {
        ...nuevaVenta,
        idCliente:
          nuevaVenta.idCliente === "" || nuevaVenta.idCliente == null
            ? null
            : Number(nuevaVenta.idCliente),
        total_venta:
          nuevaVenta.total_venta === "" || nuevaVenta.total_venta == null
            ? 0
            : parseFloat(nuevaVenta.total_venta),
        fecha_venta: formatToMySQL(nuevaVenta.fecha_venta),
      };

      const res = await fetch("http://localhost:3002/api/registrarVenta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text();
        let body;
        try {
          body = JSON.parse(txt);
        } catch (e) {
          body = txt;
        }
        console.error("Error al registrar venta:", res.status, body);
        alert(`Error al registrar venta: ${res.status} - ${JSON.stringify(body)}`);
        return;
      }

      setMostrarModalRegistro(false);
      setNuevaVenta({ idCliente: "",fecha_venta: hoy, total_venta: "", estado_venta: "Pendiente" });
      await obtenerVentas();
    } catch (error) {
      console.log("Error al guardar venta:", error);
    }
  };

  const guardarEdicion = async () => {
    if (!ventaEditada) return;

    try {
      // Normalizar tipos antes de enviar
      const payload = {
        ...ventaEditada,
        idCliente:
          ventaEditada.idCliente === "" || ventaEditada.idCliente == null
            ? null
            : Number(ventaEditada.idCliente),
        total_venta:
          ventaEditada.total_venta === "" || ventaEditada.total_venta == null
            ? 0
            : parseFloat(ventaEditada.total_venta),
        fecha_venta: formatToMySQL(ventaEditada.fecha_venta),
      };

      const res = await fetch(
        `http://localhost:3002/api/actualizarVenta/${ventaEditada.id_venta}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const text = await res.text();
      let body;
      try {
        body = JSON.parse(text);
      } catch (e) {
        body = text;
      }

      if (!res.ok) {
        console.error("Error al actualizar venta:", res.status, body);
        alert(
          `Error al actualizar venta: ${res.status} - ${JSON.stringify(body)}`
        );
        return;
      }

      setMostrarModalEdicion(false);
      await obtenerVentas();
    } catch (err) {
      console.error("Error en la petición de actualización:", err);
      alert("Error en la petición de actualización. Revisa la consola para más detalles.");
    }
  };

  const confirmarEliminacion = async () => {
    await fetch(
      `http://localhost:3002/api/eliminarventa/${ventaAEliminar.id_venta}`,
      { method: "DELETE" }
    );

    setMostrarModalEliminar(false);
    obtenerVentas();
  };

  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);

    const filtrados = ventas.filter((v) =>
      `${v.id_venta} ${v.idCliente} ${v.estado_venta}`
        .toLowerCase()
        .includes(texto)
    );

    setVentasFiltradas(filtrados);
  };

  const ventasPaginadas = ventasFiltradas.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  useEffect(() => {
    obtenerVentas();
    obtenerClientes();
  }, []);

  return (
    <Container className="mt-4">
      <h4>Ventas</h4>

      <Row className="mb-3">
        <Col lg={5} md={6}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarCambioBusqueda}
          />
        </Col>

        <Col className="text-end">
          <Button onClick={() => setMostrarModalRegistro(true)}>
            + Nueva Venta
          </Button>
        </Col>
        <Col lg={3} md={4} sm={4} xs={5}>
                <Button
                  className="mb-3"
                  onClick={generarPDFVentas}
                  variant="secondary"
                  style={{ width: "100%" }}
                >
                  Generar reporte PDF
                </Button>
              </Col>
      </Row>

      <TablaVentas
        ventas={ventasPaginadas}
        cargando={cargando}
        abrirModalEdicion={(v) => {
          setVentaEditada(v);
          setMostrarModalEdicion(true);
        }}
        abrirModalEliminacion={(v) => {
          setVentaAEliminar(v);
          setMostrarModalEliminar(true);
        }}
        totalElementos={ventas.length}
        elementosPorPagina={elementosPorPagina}
        paginaActual={paginaActual}
        establecerPaginaActual={establecerPaginaActual}
      />

      <ModalRegistroVenta
        mostrarModal={mostrarModalRegistro}
        setMostrarModal={setMostrarModalRegistro}
        nuevaVenta={nuevaVenta}
        manejarCambioInput={manejarCambioInput}
        setNuevaVenta={setNuevaVenta}
        clientes={clientes}
        agregarVenta={agregarVenta}
        hoy={hoy}
      />

      <ModalEdicionVenta
        mostrar={mostrarModalEdicion}
        setMostrar={setMostrarModalEdicion}
        ventaEditada={ventaEditada}
        setVentaEditada={setVentaEditada}
        guardarEdicion={guardarEdicion}
      />

      <ModalEliminacionVenta
        mostrar={mostrarModalEliminar}
        setMostrar={setMostrarModalEliminar}
        venta={ventaAEliminar}
        confirmarEliminacion={confirmarEliminacion}
      />
    </Container>
  );
};

export default Ventas;
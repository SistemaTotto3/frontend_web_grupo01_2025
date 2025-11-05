import { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import TablaProducto from "../components/productos/TablaProducto";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import ModalRegistroProductos from "../components/productos/ModalRegistroProductos";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");

  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    id_categoria: "",
    nombre_producto: "",
    precio_costo: "",
    precio_venta: "",
    existencia: "",
  });

  const agregarProducto = async () => {
    if (!nuevoProducto.id_categoria?.toString().trim()) return;

    try {
      const respuesta = await fetch("http://localhost:3000/api/registrarProducto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoProducto),
      });

      if (!respuesta.ok) throw new Error("Error al guardar");

      // Limpiar y cerrar el modal
      setNuevoProducto({
        id_categoria: "",
        nombre_producto: "",
        precio_costo: "",
        precio_venta: "",
        existencia: "",
      });

      setMostrarModal(false);
      await obtenerProductos(); // Refresca la lista
    } catch (error) {
      console.error("Error al agregar producto:", error);
      alert("No se pudo guardar el producto. Revisa la consola.");
    }
  };

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoProducto((prev) => ({ ...prev, [name]: value }));
  };

  const obtenerProductos = async () => {
    try {
      const respuesta = await fetch("http://localhost:3000/api/Productos");
      if (!respuesta.ok) {
        throw new Error("Error al obtener los productos");
      }

      const datos = await respuesta.json();
      setProductos(datos);
      setCargando(false);
      setProductosFiltrados(datos);
    } catch (error) {
      console.error(error.message);
      setCargando(false);
    }
  };

  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);

    const filtrados = productos.filter((producto) => {
      return (
        producto.id_categoria?.toString() === texto ||
        producto.nombre_producto?.toLowerCase().includes(texto) ||
        producto.precio_costo?.toString() === texto ||
        producto.precio_venta?.toString() === texto ||
        producto.existencia?.toString() === texto
      );
    });
    setProductosFiltrados(filtrados);
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  return (
    <>
      <Container className="mt-4">
        <h4> Productos </h4>
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
            + Nuevo Producto
          </Button>
        </Col>

        <TablaProducto productos={productosFiltrados} cargando={cargando} />

        <ModalRegistroProductos
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          nuevoProducto={nuevoProducto}
          manejarCambioInput={manejarCambioInput}
          agregarProducto={agregarProducto}
        />
      </Container>
    </>
  );
};

export default Productos;
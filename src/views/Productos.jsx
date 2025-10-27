import { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import TablaProducto from "../components/productos/TablaProducto";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";

const Productos = () => {
  const [producto, setProducto] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");

  const obtenerProductos = async () => {
    try {
      const respuesta = await fetch("http://localhost:3000/api/Productos");
      if (!respuesta.ok) {
        throw new Error("Error al obtener los productos");
      }

      const datos = await respuesta.json();
      setProducto(datos);
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
    
    const filtrados = producto.filter(
      (producto) =>
        producto.id_categoria == texto ||
        producto.nombre_producto.toLowerCase().includes(texto) ||
        producto.precio_costo == texto ||
        producto.precio_venta == texto ||
        producto.existencia == texto
    );
    setProductosFiltrados(filtrados);
  }

  useEffect(() => {
    obtenerProductos();
  }, []);

  return (
    <>
      <Container className = "mt-4">
        <h4> Productos </h4>
        <Row>
          <Col lg={5} md={8} sm={8} xs={7}>
            <CuadroBusquedas
              textoBusqueda={textoBusqueda}
              manejarCambioBusqueda={manejarCambioBusqueda}
            />
          </Col>
        </Row>
        <TablaProducto producto={productosFiltrados}
        cargando={cargando}/>
      </Container>
    </>
  );
}

export default Productos;
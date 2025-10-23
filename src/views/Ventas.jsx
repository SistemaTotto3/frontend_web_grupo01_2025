import { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import TablaVentas from "../components/ventas/TablaVentas";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";

const Ventas = () => {

  const [ventas, setVentas] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [ventasFiltradas, setVentasFiltradas] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");

  const obtenerVenta = async () => {
    try {
      const respuesta = await fetch("http://localhost:3002/api/venta");
      if (!respuesta.ok) {
        throw new Error("Error al obtener las ventas");
      }

      const datos = await respuesta.json();
      setVentas(datos);
      setVentasFiltradas(datos);
      setCargando(false);
    } catch (error) {
      console.error(error.message);
      setCargando(false);
    }
  };

  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowercase();
    setTextoBusqueda(texto);
    const filtradas = ventas.filter(
      (venta) =>
        venta.idCliente == texto ||
        venta.fecha_venta == texto ||
        venta.total_venta == texto ||
        venta.estado_venta.toLowercase().includes(texto)
    );
    setVentasFiltradas(filtradas);
  }


  useEffect(() => {
    obtenerVenta();
  }, []);

  return (
    <>
      <Container className="mt-4">
        <h4> Ventas </h4>

        <Row>
          <Col lg={5} md={8} sm={8} xs={7}>
            <CuadroBusquedas
              textoBusqueda={textoBusqueda}
              manejarCambioBusqueda={manejarCambioBusqueda}
            />
          </Col>
        </Row>

        <TablaVentas 
        ventas={ventasFiltradas}
          cargando={cargando} />
      </Container>
    </>
  );
};
export default Ventas;

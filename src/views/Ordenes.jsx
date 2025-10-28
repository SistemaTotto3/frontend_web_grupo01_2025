import { useState, useEffect } from "react";
import { Container, Col, Row, Button } from "react-bootstrap";
import TablaOrdenes from "../components/ordenes/TablaOrdenes";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";

const Ordenes = () => {

  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [ordenesFiltrados, setOrdenesFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");

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
  }

  useEffect(() => {
    obtenerOrdenes();
  }, []);
  return (
    <>
      <Container className="mt-4">
        <h4> Ordenes </h4>

        <Row>
          <Col lg={5} md={8} sm={8} xs={7}>
            <CuadroBusquedas
              textoBusqueda={textoBusqueda}
              manejarCambioBusqueda={manejarCambioBusqueda}
            />
          </Col>
        </Row>

        <TablaOrdenes
         ordenes={ordenesFiltrados} 
         cargando={cargando}
       />
      </Container>
    </>
  );
};

export default Ordenes;

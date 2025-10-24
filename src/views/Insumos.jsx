import { useState, useEffect } from "react";
import { Container, Col, Row, Button } from "react-bootstrap";
import TablaInsumos from "../components/insumos/TablaInsumo";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";

const Insumos = () => {

  const [insumos, setInsumos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [insumosFiltrados, setInsumosFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");

  const obtenerInsumos = async () => {
    try {
      const respuesta = await fetch("http://localhost:3000/api/insumo");
      if (!respuesta.ok) {
        throw new Error("Error al obtener los insumos");
      }
      const datos = await respuesta.json();
      setInsumos(datos);
      setInsumosFiltrados(datos);
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
    setInsumosFiltrados(insumos);
    return;
  }
    const filtrados = insumos.filter(
      (insumo) =>
        insumo.fecha_insumo == texto ||
      insumo.total_insumo == texto
    );
    setInsumosFiltrados(filtrados);
  }

  useEffect(() => {
    obtenerInsumos();
  }, []);
  return (
    <>
      <Container className="mt-4">
        <h4> Insumos </h4>

        <Row>
          <Col lg={5} md={8} sm={8} xs={7}>
            <CuadroBusquedas
              textoBusqueda={textoBusqueda}
              manejarCambioBusqueda={manejarCambioBusqueda}
            />
          </Col>
        </Row>

        <TablaInsumos
         insumos={insumosFiltrados} 
         cargando={cargando}
       />
      </Container>
    </>
  );
};

export default Insumos;

import { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import TablaCategoria from "../components/categorias/TablaCategoria";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";

const Categorias = () => {

  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [categoriasFiltradas, setcategoriasFiltradas] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");

  const obtenerCategorias = async () => {
    try {
      const respuesta = await fetch("http://localhost:3002/api/categorias");
      if (!respuesta.ok) {
        throw new Error("Error al obtener las categorias");
      }

      const datos = await respuesta.json();
      setCategorias(datos);
      setcategoriasFiltradas(datos);
      setCargando(false);
    } catch (error) {
      console.error(error.message);
      setCargando(false);
    }
  };

  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowercase();
    setTextoBusqueda(texto);
    const filtradas = categorias.filter(
      (categoria) =>
        categoria.nombre_categoria.toLowercase().includes(texto)
    );
    setVentasFiltradas(filtradas);
  }

  useEffect(() => {
    obtenerCategorias();
  }, []);


  return (
    <>
      <Container className="mt-4">
        <h4> Categorias </h4>

        <Row>
          <Col lg={5} md={8} sm={8} xs={7}>
            <CuadroBusquedas
              textoBusqueda={textoBusqueda}
              manejarCambioBusqueda={manejarCambioBusqueda}
            />
          </Col>
        </Row>

        <TablaCategoria categorias={categoriasFiltradas}
          cargando={cargando} />
      </Container>
    </>
  );
};
export default Categorias;

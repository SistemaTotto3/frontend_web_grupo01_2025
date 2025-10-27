import { useState, useEffect } from "react";
import { Container,Row,Col,Button } from "react-bootstrap";
import TablaUsuario from "../components/usuarios/TablaUsuarios";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";

const Usuarios = () => {
  const [usuario, setUsuario] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [UsuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");

  const obtenerUsuario = async () => {
    try {
      const respuesta = await fetch("http://localhost:3000/api/usuarios");
      if (!respuesta.ok) {
        throw new Error("Error al obtener los usuarios");
      }

      const datos = await respuesta.json();
      setUsuario(datos);
      setCargando(false);
      setUsuariosFiltrados(datos);
    } catch (error) {
      console.error(error.message);
      setCargando(false);
    }
  };

  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);

    const filtrados = usuario.filter(
      (usuario) =>
        usuario.nombre_usuario.toLowerCase().includes(texto) ||
        usuario.contraseña_hash.toLowerCase().includes(texto) ||
        usuario.rol.toLowerCase().includes(texto)
    );
    setUsuariosFiltrados(filtrados);
  };

  useEffect(() => {
    obtenerUsuario();
  }, []);

  return (
    <>
      <Container className="mt-4">
        <h4> Usuarios </h4>
        <Row>
          <Col lg={5} md={8} sm={8} xs={7}>
            <CuadroBusquedas
              textoBusqueda={textoBusqueda}
              manejarCambioBusqueda={manejarCambioBusqueda}
            />
          </Col>
        </Row>
        <TablaUsuario usuario={UsuariosFiltrados} 
        cargando={cargando} />
      </Container>
    </>
  );
}

export default Usuarios;
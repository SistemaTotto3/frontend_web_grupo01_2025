import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import TablaUsuario from "../components/usuarios/TablaUsuarios";

const Usuarios = () => {
  const [usuario, setUsuario] = useState([]);
  const [cargando, setCargando] = useState(true);

  const obtenerUsuario = async () => {
    try {
      const respuesta = await fetch("http://localhost:3000/api/usuarios");
      if (!respuesta.ok) {
        throw new Error("Error al obtener los usuarios");
      }

      const datos = await respuesta.json();
      setUsuario(datos);
      setCargando(false);
    } catch (error) {
      console.error(error.message);
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerUsuario();
  }, []);

  return (
    <>
      <Container className = "mt-4">
        <h4> Usuarios </h4>
        <TablaUsuario usuario={usuario}
        cargando={cargando}/>
      </Container>
    </>
  );
}

export default Usuarios;
import { Table, Spinner } from "react-bootstrap";

const TablaUsuario = ({ usuario, cargando }) => {
  if (cargando) {
    return (
      <>
        <Spinner animation="border">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </>
    );
  }

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID Usuario</th>
            <th>Nombre Usuario</th>
            <th>Contraseña</th>
            <th> Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuario.map((usuario) => {
            return(
              <tr key={usuario.id_usuario}>
                <td>{usuario.id_usuario}</td>
                <td>{usuario.nombre_usuario}</td>
                <td>{usuario.contraseña_hash}</td>
                <td>{usuario.rol}</td>
                <td>Acciones</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
};

export default TablaUsuario;

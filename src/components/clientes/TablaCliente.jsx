import { Table, Spinner } from "react-bootstrap";

const TablaCliente = ({ clientes, cargando }) => {
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
            <th>ID Cliente</th>
            <th>Primer nombre</th>
            <th>Primer apellido</th>
            <th>Direccion cliente</th>
            <th>Telefono cliente</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => {
            return(
              <tr key={cliente.id_cliente}>
                <td>{cliente.nombre_1}</td>
                <td>{cliente.apellido_1}</td>
                <td>{cliente.direccion_cliente}</td>
                <td>{cliente.telefono_cliente}</td>
                <td>Acciones</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
};

export default TablaCliente;

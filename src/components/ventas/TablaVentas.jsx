import { Table, Spinner } from "react-bootstrap";

const TablaVentas = ({ ventas, cargando }) => {
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
            <th>ID Venta</th>
            <th>ID Cliente</th>
            <th>Fecha Venta</th>
            <th>Total Venta</th>
            <th>Estado Venta</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((venta) => {
            return(
              <tr key={venta.id_venta}>
                <td>{venta.id_venta}</td>
                <td>{venta.idCliente}</td>
                <td>{venta.fecha_venta}</td>
                <td>{venta.total_venta}</td>
                <td>{venta.estado_venta}</td>
                <td>Acciones</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
};

export default TablaVentas;

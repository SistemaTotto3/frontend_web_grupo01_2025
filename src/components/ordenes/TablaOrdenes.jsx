import { Table, Spinner } from "react-bootstrap";

const TablaOrdenes = ({ ordenes, cargando }) => {
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
            <th>ID Orden</th>
            <th>ID Venta</th>
            <th>Fecha Orden</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ordenes.map((orden) => {
            return(
              <tr key={orden.idOrden}>
                <td>{orden.idOrden}</td>
                <td>{orden.id_venta}</td>
                <td>{orden.fecha_orden}</td>
                <td>Acciones</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
};

export default TablaOrdenes;

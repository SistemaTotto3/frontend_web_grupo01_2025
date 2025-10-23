import { Table, Spinner } from "react-bootstrap";

const TablaInsumos = ({ insumos, cargando }) => {
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
          <th>ID Insumo</th>
          <th>Fecha Insumo</th> 
          <th>Total Insumo</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {insumos.map((insumo) => {
          return (
          <tr key={insumo.id_insumo}>
            <td>{insumo.id_insumo}</td>
            <td>{insumo.fecha_insumo}</td>
            <td>{insumo.total_insumo}</td>
            <td>Acción</td>
          </tr>
            );    
        })}
        </tbody>
      </Table>
    </>
  );
}

export default TablaInsumos;  

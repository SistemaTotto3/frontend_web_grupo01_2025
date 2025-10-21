import { Table, Spinner } from "react-bootstrap";

const TablaProducto = ({ producto, cargando }) => {
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
            <th>ID Producto</th>
            <th>ID Categoria</th>
            <th>Nombre Producto</th>
            <th>Precio Cost</th>
            <th>Precio Vent</th>
            <th>Existencia</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {producto.map((producto) => {
            return(
              <tr key={producto.id_producto}>
                <td>{producto.id_producto}</td>
                <td>{producto.id_categoria}</td>
                <td>{producto.nombre_producto}</td>
                <td>{producto.precio_costo}</td>
                <td>{producto.precio_venta}</td>
                <td>{producto.existencia}</td>
                <td>Acciones</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
};

export default TablaProducto;

import { Modal, Table, Button } from 'react-bootstrap';

const ModalDetalleOrden = ({ mostrarModal, setMostrarModal, detalles }) => {
  return (
    <Modal show={mostrarModal} onHide={setMostrarModal} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Detalles de la Orden</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID Orden</th>
              <th>Producto</th>
              <th>Estado de la orden</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {detalles.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center">No hay detalles</td>
              </tr>
            ) : (
              detalles.map((d) => (
                <tr key={d.id_detalle_orden}>
                  <td>{d.idOrden}</td>
                  <td>{d.nombre_producto ?? d.id_producto}</td>
                  <td>{d.estado_orden ?? "—"}</td>
                  <td>{d.cantidad}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={setMostrarModal}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalDetalleOrden;

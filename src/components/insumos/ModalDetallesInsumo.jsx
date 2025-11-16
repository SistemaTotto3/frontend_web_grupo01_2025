import { Modal, Table, Button } from 'react-bootstrap';

const ModalDetallesInsumo = ({ mostrarModal, setMostrarModal, detalles }) => {
  const total = detalles.reduce((sum, d) => sum + (d.cantidad_insumo * d.precio_insumo), 0);

  return (
    <Modal show={mostrarModal} onHide={setMostrarModal} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Detalles del Insumo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nombre Insumo</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {detalles.length === 0 ? (
              <tr><td colSpan={4} className="text-center">No hay detalles</td></tr>
            ) : (
              detalles.map((d) => (
                <tr key={d.id_detalle_insumo}>
                  <td>{d.nombre_insumo}</td>
                  <td>{d.cantidad_insumo}</td>
                  <td>C$ {parseFloat(d.precio_insumo).toFixed(2)}</td>
                  <td>C$ {(d.cantidad_insumo * d.precio_insumo).toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
          {detalles.length > 0 && (
            <tfoot>
              <tr>
                <td colSpan={3} className="text-end"><strong>Total:</strong></td>
                <td><strong>C$ {total.toFixed(2)}</strong></td>
              </tr>
            </tfoot>
          )}
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={setMostrarModal}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalDetallesInsumo;
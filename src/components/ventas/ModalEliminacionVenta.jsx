import { Modal, Button } from "react-bootstrap";

const ModalEliminacionVenta = ({
  mostrar,
  setMostrar,
  venta,
  confirmarEliminacion,
}) => {
  return (
    <Modal show={mostrar} onHide={() => setMostrar(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Eliminación</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>¿Seguro que deseas eliminar la venta <strong>ID {venta?.id_venta}</strong>?</p>
        <p className="text-muted small">Esta acción no se puede deshacer.</p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrar(false)}>
          Cancelar
        </Button>

        <Button variant="danger" onClick={confirmarEliminacion}>
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminacionVenta;
import { Modal, Button } from "react-bootstrap";

const ModalEliminacionOrden = ({
  mostrar,
  setMostrar,
  orden,
  confirmarEliminacion,
}) => {
  return (
    <Modal show={mostrar} onHide={() => setMostrar(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Eliminación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          ¿Estás seguro de que deseas eliminar la orden{" "}
          <strong>
            "{orden?.id_venta || "esta orden"}"
          </strong>?
        </p>
        <p className="text-muted small">
          Esta acción no se puede deshacer.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrar(false)}>
          Cancelar
        </Button>
        <Button
          variant="danger"
          onClick={confirmarEliminacion}
          aria-label="Confirmar eliminación de orden"
        >
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminacionOrden;
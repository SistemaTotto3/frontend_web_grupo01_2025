 import { Modal, Button } from "react-bootstrap";

const ModalEliminacionInsumo = ({
  mostrar,
  setMostrar,
  insumo,
  confirmarEliminacion,
}) => {
  return (
    <Modal show={mostrar} onHide={() => setMostrar(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Eliminación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        ¿Estás seguro de eliminar el insumo #{insumo?.id_insumo}?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrar(false)}>Cancelar</Button>
        <Button variant="danger" onClick={confirmarEliminacion}>Eliminar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminacionInsumo;
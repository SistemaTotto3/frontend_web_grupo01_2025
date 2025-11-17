import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionProducto = ({
  mostrar,
  setMostrar,
  productoEditado,
  setProductoEditado,
  guardarEdicion,
}) => {
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setProductoEditado((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Modal
      backdrop="static"
      show={mostrar}
      onHide={() => setMostrar(false)}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Editar Producto</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="idCategoria">
            <Form.Label>ID Categoría</Form.Label>
            <Form.Control
              type="text"
              name="id_categoria"
              value={productoEditado?.id_categoria || ""}
              onChange={manejarCambio}
              placeholder="Ej: 1"
              maxLength={10}
              required
              autoFocus
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="nombreProducto">
            <Form.Label>Nombre del Producto</Form.Label>
            <Form.Control
              type="text"
              name="nombre_producto"
              value={productoEditado?.nombre_producto || ""}
              onChange={manejarCambio}
              placeholder="Ej: Pan de molde"
              maxLength={50}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="precioCosto">
            <Form.Label>Precio Costo</Form.Label>
            <Form.Control
              type="number"
              name="precio_costo"
              value={productoEditado?.precio_costo || ""}
              onChange={manejarCambio}
              placeholder="0.00"
              step="0.01"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="precioVenta">
            <Form.Label>Precio Venta</Form.Label>
            <Form.Control
              type="number"
              name="precio_venta"
              value={productoEditado?.precio_venta || ""}
              onChange={manejarCambio}
              placeholder="0.00"
              step="0.01"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="existencia">
            <Form.Label>Existencia</Form.Label>
            <Form.Control
              type="number"
              name="existencia"
              value={productoEditado?.existencia || ""}
              onChange={manejarCambio}
              placeholder="0"
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrar(false)}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={guardarEdicion}
          disabled={!productoEditado?.nombre_producto?.trim()}
        >
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionProducto;

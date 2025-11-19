import React, { useState } from "react";
import { Modal, Form, Button, Row, Col, Table } from "react-bootstrap";
import AsyncSelect from "react-select/async";

const ModalRegistroOrden = ({
  mostrar,
  setMostrar,
  nuevaOrden,
  setNuevaOrden,
  agregarOrden,
  productos,
  detalles,
  setDetalles,
  hoy
}) => {

  const [productoSel, setProductoSel] = useState(null);

  const [nuevoDetalle, setNuevoDetalle] = useState({
    id_producto: "",
    estado_orden: "",
    cantidad: ""
  });

  const cargarOpciones = (input, callback) => {
    const filtrados = productos.filter((p) =>
      p.nombre_producto.toLowerCase().includes(input.toLowerCase())
    );

    callback(
      filtrados.map((p) => ({
        value: p.id_producto,
        label: p.nombre_producto,
      }))
    );
  };

  const manejarProducto = (option) => {
    if (!option) {
      setProductoSel(null);
      setNuevoDetalle({ id_producto: "", estado_orden: "", cantidad: "" });
      return;
    }

    setProductoSel(option);

    setNuevoDetalle((prev) => ({
      ...prev,
      id_producto: option.value,
    }));
  };

  const agregarDetalle = () => {
    if (
      !nuevoDetalle.id_producto ||
      !nuevoDetalle.estado_orden ||
      Number(nuevoDetalle.cantidad) <= 0
    ) {
      alert("Completa producto, estado y cantidad.");
      return;
    }

    setDetalles((prev) => [
      ...prev,
      {
        id_producto: Number(nuevoDetalle.id_producto),
        estado_orden: nuevoDetalle.estado_orden,
        cantidad: Number(nuevoDetalle.cantidad),
      },
    ]);

    setNuevoDetalle({ id_producto: "", estado_orden: "", cantidad: "" });
    setProductoSel(null);
  };

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevaOrden((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Modal
      show={mostrar}
      onHide={() => setMostrar(false)}
      centered
      backdrop="static"
      size="lg"            // 🔥 HACERLO ANCHO COMO EL OTRO FORMULARIO
    >
      <Modal.Header closeButton>
        <Modal.Title>Agregar Nueva Orden</Modal.Title>
      </Modal.Header>

      <Modal.Body className="px-4 pb-4">    {/* 🔥 MÁS ESPACIO INTERIOR */}
        <Form>

          {/* ----------- ID DE VENTA ----------- */}
          <Form.Group className="mb-4">
            <Form.Label>ID de la Venta</Form.Label>
            <Form.Control
              type="text"
              name="id_venta"
              value={nuevaOrden.id_venta}
              onChange={manejarCambioInput}
              placeholder="1, 2, 3..."
            />
          </Form.Group>

          {/* ----------- FECHA ----------- */}
          <Form.Group className="mb-4">
            <Form.Label>Fecha de la Orden</Form.Label>
            <Form.Control
              type="date"
              name="fecha_orden"
              value={nuevaOrden.fecha_orden || hoy}
              onChange={manejarCambioInput}
            />
          </Form.Group>

          <hr className="my-4" />

          <h5 className="mb-3">Agregar Detalle de Orden</h5>

          {/* ----------- CAMPOS DE DETALLE ----------- */}
          <Row className="g-3">

            <Col md={5}>
              <AsyncSelect
                cacheOptions
                defaultOptions
                placeholder="Buscar producto..."
                loadOptions={cargarOpciones}
                onChange={manejarProducto}
                value={productoSel}
                isClearable
              />
            </Col>

            <Col md={3}>
              <Form.Select
                value={nuevoDetalle.estado_orden}
                onChange={(e) =>
                  setNuevoDetalle((prev) => ({
                    ...prev,
                    estado_orden: e.target.value,
                  }))
                }
              >
                <option value="">Estado</option>
                <option value="pendiente">Pendiente</option>
                <option value="entregada">Entregada</option>
                <option value="cancelada">Cancelada</option>
              </Form.Select>
            </Col>

            <Col md={2}>
              <Form.Control
                type="number"
                placeholder="Cantidad"
                min="1"
                value={nuevoDetalle.cantidad}
                onChange={(e) =>
                  setNuevoDetalle((prev) => ({
                    ...prev,
                    cantidad: e.target.value,
                  }))
                }
              />
            </Col>

            <Col md={2}>
              <Button
                variant="success"
                onClick={agregarDetalle}
                className="w-100"
              >
                Agregar
              </Button>
            </Col>
          </Row>

          {/* ----------- TABLA ----------- */}
          {detalles.length > 0 && (
            <Table bordered striped className="mt-4">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {detalles.map((d, i) => {
                  const prod = productos.find((p) => Number(p.id_producto) === d.id_producto);
                  return (
                    <tr key={i}>
                      <td>{prod?.nombre_producto || "—"}</td>
                      <td>{d.cantidad}</td>
                      <td>{d.estado_orden}</td>
                      <td>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() =>
                            setDetalles((prev) => prev.filter((_, idx) => idx !== i))
                          }
                        >
                          X
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrar(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={agregarOrden}>
          Guardar Orden
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroOrden;

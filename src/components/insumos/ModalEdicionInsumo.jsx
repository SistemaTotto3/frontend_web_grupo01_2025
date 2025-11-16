import { useState, useEffect } from "react";
import { Modal, Form, Button, Table, Row, Col, FormControl } from "react-bootstrap";
import AsyncSelect from 'react-select/async';



const ModalEdicionInsumo = ({
  mostrar,
  setMostrar,
  insumo,
  insumoEnEdicion,
  setInsumoEnEdicion,
  detalles,
  setDetalles,
  productos,
  actualizarInsumo
}) => {
  const [productoSel, setProductoSel] = useState(null);
  const [nuevoDetalle, setNuevoDetalle] = useState({ id_producto: '', nombre_insumo: '', cantidad_insumo: '', precio_insumo: '' });

  const hoy = new Date().toISOString().split('T')[0];

  // === CÁLCULO DEL TOTAL ===
  const total = detalles.reduce((s, d) => s + (d.cantidad_insumo * d.precio_insumo), 0);

  // === CARGAR OPCIONES PARA ASYNCSELECT ===
  const cargarOpciones = (lista, campo) => (input, callback) => {
    const filtrados = lista.filter(item =>
      String(item[campo] || item.nombre_producto || "").toLowerCase().includes(input.toLowerCase())
    );
    callback(filtrados.map(item => ({
      value: item.id_producto,
      label: item[campo] || `${item.nombre_producto}`,
      precio_insumo: item.precio_insumo ?? item.precio_costo ?? item.precio ?? 0,
      stock: item.stock ?? item.existencia ?? 0
    })));
  };

  // === MANEJADORES ===
  const manejarProducto = (option) => {
    if (!option) {
      setProductoSel(null);
      setNuevoDetalle(prev => ({ ...prev, id_producto: '', precio_insumo: '' }));
      return;
    }
    setProductoSel(option);
    setNuevoDetalle(prev => ({
      ...prev,
      id_producto: option.value,
      precio_insumo: option.precio_insumo ?? prev.precio_insumo
    }));
  };

  const agregarDetalle = () => {
    if (!nuevoDetalle.id_producto || !nuevoDetalle.nombre_insumo || !nuevoDetalle.cantidad_insumo || nuevoDetalle.cantidad_insumo <= 0) {
      alert("Selecciona producto, ingresa nombre de insumo y cantidad válida.");
      return;
    }

    const prod = productos.find(p => Number(p.id_producto) === Number(nuevoDetalle.id_producto));
    if (!prod) return;

    if (Number(nuevoDetalle.cantidad_insumo) > Number(prod.stock || 0)) {
      alert(`Stock insuficiente: ${prod.stock}`);
      return;
    }

    setDetalles(prev => [...prev, {
      id_producto: Number(nuevoDetalle.id_producto),
      nombre_insumo: nuevoDetalle.nombre_insumo,
      cantidad_insumo: Number(nuevoDetalle.cantidad_insumo),
      precio_insumo: Number(nuevoDetalle.precio_insumo ?? (prod && prod.precio_insumo) ?? 0),
    }]);

    setNuevoDetalle({ id_producto: '', nombre_insumo: '', cantidad_insumo: '', precio_insumo: '' });
    setProductoSel(null);
  };

  const eliminarDetalle = (index) => {
    setDetalles(prev => prev.filter((_, i) => i !== index));
  };

  const manejarCambioInsumo = (e) => {
    const { name, value } = e.target;
    setInsumoEnEdicion(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Modal show={mostrar} onHide={setMostrar} size="xl" fullscreen="lg-down">
      <Modal.Header closeButton>
        <Modal.Title>Editar Insumo #{insumo?.id_insumo}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Fecha Insumo*</Form.Label>
                <Form.Control
                  type="text"
                  value={insumoEnEdicion?.fecha_insumo ||''}
                  readOnly
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="total_insumo">
                <Form.Label>Total</Form.Label>
                <Form.Control
                  type="text"
                  name="total_insumo"
                  value={total.toFixed(2)}
                  readOnly
                />
              </Form.Group>
            </Col>
          </Row>

          <hr />
          <h5>Detalles de Insumo</h5>
          <Row>
            <Col md={4}>
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={cargarOpciones(productos, 'nombre_producto')}
                onChange={manejarProducto}
                value={productoSel}
                placeholder="Buscar producto..."
                isClearable
              />
            </Col>
            <Col md={3}>
              <FormControl
                type="text"
                placeholder="Nombre Insumo"
                value={nuevoDetalle.nombre_insumo}
                onChange={e => setNuevoDetalle(prev => ({ ...prev, nombre_insumo: e.target.value }))}
              />
            </Col>
            <Col md={2}>
              <FormControl
                type="number"
                placeholder="Cantidad"
                value={nuevoDetalle.cantidad_insumo}
                onChange={e => setNuevoDetalle(prev => ({ ...prev, cantidad_insumo: e.target.value }))}
                min="1"
              />
            </Col>
            <Col md={3}>
              <Button variant="success" onClick={agregarDetalle} style={{ width: '100%' }}>
                Agregar
              </Button>
            </Col>
          </Row>

          {detalles.length > 0 && (
            <Table striped className="mt-3">
              <thead>
                <tr>
                  <th>Nombre Insumo</th>
                  <th>Cant.</th>
                  <th>Precio</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {detalles.map((d, i) => (
                  <tr key={i}>
                    <td>{d.nombre_insumo}</td>
                    <td>{d.cantidad_insumo}</td>
                    <td>C$ {(Number(d.precio_insumo || 0)).toFixed(2)}</td>
                    <td>C$ {(d.cantidad_insumo * d.precio_insumo).toFixed(2)}</td>
                    <td>
                      <Button size="sm" variant="danger" onClick={() => eliminarDetalle(i)}>
                        X
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="text-end"><strong>Total:</strong></td>
                  <td colSpan={2}><strong>C$ {total.toFixed(2)}</strong></td>
                </tr>
              </tfoot>
            </Table>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={setMostrar}>Cancelar</Button>
        <Button variant="primary" onClick={actualizarInsumo}>Actualizar Insumo</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionInsumo;
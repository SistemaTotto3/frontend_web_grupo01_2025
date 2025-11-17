import React, { useState } from "react";
import { Table, Spinner, Button } from "react-bootstrap";
import BotonOrden from "../ordenamiento/BotonOrden";
import Paginacion from "../ordenamiento/Paginacion";

const TablaUsuario = ({
  usuarios = [],
  cargando,
  abrirModalEdicion,
  abrirModalEliminacion,
  totalElementos,
  elementosPorPagina,
  paginaActual,
  establecerPaginaActual,
}) => {
  const [orden, setOrden] = useState({ campo: "id_usuario", direccion: "asc" });

  const manejarOrden = (campo) => {
    setOrden((prev) => ({
      campo,
      direccion: prev.campo === campo && prev.direccion === "asc" ? "desc" : "asc",
    }));
  };

  const usuariosOrdenados = [...(usuarios || [])].sort((a, b) => {
    const valorA = a?.[orden.campo];
    const valorB = b?.[orden.campo];

    if (typeof valorA === "number" && typeof valorB === "number") {
      return orden.direccion === "asc" ? valorA - valorB : valorB - valorA;
    }

    const comparacion = String(valorA ?? "").localeCompare(String(valorB ?? ""));
    return orden.direccion === "asc" ? comparacion : -comparacion;
  });

  if (cargando) {
    return (
      <div className="text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <>
      <Table striped bordered hover>
      <thead>
        <tr>
          <BotonOrden campo="id_usuario" orden={orden} manejarOrden={manejarOrden}>
            ID
          </BotonOrden>

          <BotonOrden campo="nombre_usuario" orden={orden} manejarOrden={manejarOrden}>
            Nombre Usuario
          </BotonOrden>

          <BotonOrden campo="contraseña_hash" orden={orden} manejarOrden={manejarOrden}>
            Contraseña (hash)
          </BotonOrden>

          <BotonOrden campo="rol" orden={orden} manejarOrden={manejarOrden}>
            Rol
          </BotonOrden>

          <th>Acciones</th>
        </tr>

      </thead>
      <tbody>
        {usuariosOrdenados.length > 0 ? (
          usuariosOrdenados.map((usuario) => (
            <tr key={usuario.id_usuario}>
              <td>{usuario.id_usuario}</td>
              <td>{usuario.nombre_usuario}</td>
              <td>{usuario.contraseña_hash}</td>
              <td>{usuario.rol}</td>
              <td>
                <Button
                  variant="outline-warning"
                  size="sm"
                  className="me-2"
                  onClick={() => abrirModalEdicion(usuario)}
                  aria-label={`Editar usuario ${usuario.id_usuario}`}
                >
                  <i className="bi bi-pencil"></i>
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => abrirModalEliminacion(usuario)}
                  aria-label={`Eliminar usuario ${usuario.id_usuario}`}
                >
                  <i className="bi bi-trash"></i>
                </Button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={5} className="text-center">
              No hay usuarios
            </td>
          </tr>
        )}
      </tbody>
      </Table>
      <Paginacion
        elementosPorPagina={elementosPorPagina}
        totalElementos={totalElementos}
        paginaActual={paginaActual}
        establecerPaginaActual={establecerPaginaActual}
      />
    </>
  );
};

export default TablaUsuario;

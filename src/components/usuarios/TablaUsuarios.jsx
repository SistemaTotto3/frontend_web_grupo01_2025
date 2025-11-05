import React, { useState } from "react";
import { Table, Spinner } from "react-bootstrap";
import BotonOrden from "../ordenamiento/BotonOrden";

const TablaUsuario = ({ usuarios = [], cargando }) => {
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
    <Table striped bordered hover>
      <thead>
        <tr>
          <BotonOrden campo="id_usuario" orden={orden} manejarOrden={manejarOrden}>
            ID
          </BotonOrden>

          <BotonOrden campo="nombre_usuario" orden={orden} manejarOrden={manejarOrden}>
            Nombre Usuario
          </BotonOrden>

          <BotonOrden campo="contraseñá" orden={orden} manejarOrden={manejarOrden}>
            Contraseñá
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
              <td>Acciones</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={6} className="text-center">
              No hay usuarios
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default TablaUsuario;

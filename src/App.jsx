import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Importar componente Encabezado
import Encabezado from "./components/navegacion/Encabezado";
// Importar las vistas
import Login from "./views/Login";
import Inicio from "./views/Inicio";
import Categorias from "./views/Categorias";
import Productos from "./views/Productos";
import Catalogo from "./views/Catalogo";
import Insumos from "./views/Insumos";
import Clientes from "./views/Clientes";
import Ordenes from "./views/Ordenes";
import Usuarios from "./views/Usuarios";
import Ventas from "./views/Ventas";

// Importar archivo de estilos
import "./App.css";

const App = () => {
  return (
    <Router>
      <Encabezado />
      <main className="margen-superior-main">
        <Routes>
          <Route path="/Inicio" element={<Inicio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/clientes" element={<Clientes />} /> 
          <Route path="/insumos" element={<Insumos />} /> 
          <Route path="/ordenes" element={<Ordenes />} />
          <Route path="/usuarios" element={<Usuarios />} /> 
          <Route path="/ventas" element={<Ventas />} /> 
          <Route path="*" element={<h2>404 - Página no encontrada</h2>} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;

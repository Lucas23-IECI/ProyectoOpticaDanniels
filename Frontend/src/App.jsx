import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Productos from "./pages/Productos";
import DetalleProducto from "./pages/DetalleProducto";
import BusquedaResultados from "./pages/BusquedaResultados";

function App() {
  return (
    <BrowserRouter basename="/OpticaDanniels">
      <Navbar />
      <div className="contenedor-principal">
        <Routes>
          <Route path="/" element={<div>Bienvenido al Inicio</div>} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/productos/:nombreProducto" element={<DetalleProducto />} />
          <Route path="/buscar" element={<BusquedaResultados />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

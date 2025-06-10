import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Productos from "./pages/Productos";

function App() {
  return (
    <BrowserRouter basename="/ProyectoOpticaDanniels">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

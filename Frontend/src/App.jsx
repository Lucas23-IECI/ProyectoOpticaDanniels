import { BrowserRouter, Routes, Route } from "react-router-dom";
import Productos from "./pages/Productos";

function App() {
  return (
    <BrowserRouter basename="/OpticaDanniels">
      <Routes>
        <Route path="/" element={<Productos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

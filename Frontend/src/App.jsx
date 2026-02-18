import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { CartProvider } from "@context/CartProvider";
import { useTokenExpiration } from "@hooks/useTokenExpiration";
import ProtectedRoute from "@components/ProtectedRoute";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import Home from "@pages/Home";
import Productos from "@pages/Productos";
import DetalleProducto from "@pages/DetalleProducto";
import BusquedaResultados from "@pages/BusquedaResultados";
import Wishlist from "@pages/Wishlist";
import Carrito from "@pages/Carrito";
import Login from "@pages/Login";
import Register from "@pages/Register";
import Perfil from "@pages/Perfil";
import QuienesSomos from "@pages/QuienesSomos";
import Contacto from "@pages/Contacto";
import Privacidad from "@pages/Privacidad";
import Terminos from "@pages/Terminos";
import Admin from "@pages/Admin";


function AppContent() {
  useTokenExpiration();

  return (
    <>
      <Navbar />
      <div className="contenedor-principal">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/productos/:nombreProducto" element={<DetalleProducto />} />
          <Route path="/buscar" element={<BusquedaResultados />} />
          <Route path="/favoritos" element={<Wishlist />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/quienes-somos" element={<QuienesSomos />} />
          <Route path="/privacidad" element={<Privacidad />} />
          <Route path="/terminos" element={<Terminos />} />

          <Route
            path="/login"
            element={
              <ProtectedRoute requireAuth={false}>
                <Login />
              </ProtectedRoute>
            }
          />
          <Route path="/auth" element={<Navigate to="/login" replace />} />
          <Route
            path="/register"
            element={
              <ProtectedRoute requireAuth={false}>
                <Register />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mis-compras"
            element={
              <ProtectedRoute>
                <div>Mis Compras - Página en desarrollo</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <Perfil />
              </ProtectedRoute>
            }
          />
          <Route path="/mis-datos" element={<Navigate to="/perfil" replace />} />

          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['administrador']}>
                <Admin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

function App() {
  return (
    <CartProvider>
      <BrowserRouter 
        basename={import.meta.env.BASE_URL}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <AppContent />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;

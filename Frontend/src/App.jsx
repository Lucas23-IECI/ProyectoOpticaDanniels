import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

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
import RecuperarPassword from "@pages/RecuperarPassword";
import Checkout from "@pages/Checkout";
import MisCompras from "@pages/MisCompras";
import CheckoutResultado from "@pages/CheckoutResultado";
import AgendarCita from "@pages/AgendarCita";
import FAQ from "@pages/FAQ";
import NotFound from "@pages/NotFound";


function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function AppContent() {
  useTokenExpiration();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      <ScrollToTop />
      {!isAdmin && <Navbar />}
      <div className={isAdmin ? '' : 'contenedor-principal'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/productos/:nombreProducto" element={<DetalleProducto />} />
          <Route path="/buscar" element={<BusquedaResultados />} />
          <Route path="/favoritos" element={<Wishlist />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout/resultado"
            element={
              <ProtectedRoute>
                <CheckoutResultado />
              </ProtectedRoute>
            }
          />
          <Route path="/contacto" element={<Contacto />} />
          <Route
            path="/agendar-cita"
            element={
              <ProtectedRoute>
                <AgendarCita />
              </ProtectedRoute>
            }
          />
          <Route path="/quienes-somos" element={<QuienesSomos />} />
          <Route path="/faq" element={<FAQ />} />
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
            path="/recuperar-password"
            element={
              <ProtectedRoute requireAuth={false}>
                <RecuperarPassword />
              </ProtectedRoute>
            }
          />
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
                <MisCompras />
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

          {/* 404 catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      {!isAdmin && <Footer />}
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

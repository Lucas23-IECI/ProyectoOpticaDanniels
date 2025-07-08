import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@context/AuthContext";
import { useTokenExpiration } from "@hooks/useTokenExpiration";
import ProtectedRoute from "@components/ProtectedRoute";
import Navbar from "@components/Navbar";
import Productos from "@pages/Productos";
import DetalleProducto from "@pages/DetalleProducto";
import BusquedaResultados from "@pages/BusquedaResultados";
import Login from "@pages/Login";
import Register from "@pages/Register";
import Perfil from "@pages/Perfil";
import Admin from "@pages/Admin";

function AppContent() {
  useTokenExpiration();

  return (
    <>
      <Navbar />
      <div className="contenedor-principal">
        <Routes>
          <Route path="/" element={<div>Bienvenido al Inicio</div>} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/productos/:nombreProducto" element={<DetalleProducto />} />
          <Route path="/buscar" element={<BusquedaResultados />} />
          
          <Route 
            path="/login" 
            element={
              <ProtectedRoute requireAuth={false}>
                <Login />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/auth" 
            element={
              <ProtectedRoute requireAuth={false}>
                <Login />
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
          <Route 
            path="/mis-datos" 
            element={
              <ProtectedRoute>
                <div>Mis Datos Personales - Página en desarrollo</div>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute allowedRoles={['administrador']}>
                <Admin />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['administrador']}>
                <Admin />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/OpticaDanniels">
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

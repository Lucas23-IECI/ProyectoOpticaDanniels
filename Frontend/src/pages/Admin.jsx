import { useState } from "react";
import { useAuth } from "@context/AuthContext";
import { getNombreCompleto } from "@helpers/nameHelpers";
import AdminProductos from "@components/AdminProductos";
import AdminUsuarios from "@components/AdminUsuarios";
import AdminOrdenes from "@components/AdminOrdenes";
import AdminReportes from "@components/AdminReportes";
import AdminReviews from "@components/AdminReviews";
import AdminCitas from "@components/AdminCitas";
import AdminMensajes from "@components/AdminMensajes";
import { FaBox, FaUsers, FaShoppingCart, FaChartBar, FaStar, FaCalendarAlt, FaEnvelope } from "react-icons/fa";
import "@styles/admin.css";

const Admin = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('productos');

    const renderContent = () => {
        switch (activeTab) {
            case 'productos':
                return <AdminProductos />;
            case 'usuarios':
                return <AdminUsuarios />;
            case 'ordenes':
                return <AdminOrdenes />;
            case 'reportes':
                return <AdminReportes />;
            case 'reviews':
                return <AdminReviews />;
            case 'citas':
                return <AdminCitas />;
            case 'mensajes':
                return <AdminMensajes />;
            default:
                return <AdminProductos />;
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-welcome">
                <h1>🛡️ Panel de Administración</h1>
                <h2>¡Bienvenido, {getNombreCompleto(user)}!</h2>
                <p>Tienes acceso completo como administrador del sistema.</p>
            </div>

            <div className="admin-tabs">
                <button 
                    className={`admin-tab ${activeTab === 'productos' ? 'active' : ''}`}
                    onClick={() => setActiveTab('productos')}
                >
                    <FaBox /> Productos
                </button>
                <button 
                    className={`admin-tab ${activeTab === 'usuarios' ? 'active' : ''}`}
                    onClick={() => setActiveTab('usuarios')}
                >
                    <FaUsers /> Usuarios
                </button>
                <button 
                    className={`admin-tab ${activeTab === 'ordenes' ? 'active' : ''}`}
                    onClick={() => setActiveTab('ordenes')}
                >
                    <FaShoppingCart /> Órdenes
                </button>
                <button 
                    className={`admin-tab ${activeTab === 'reportes' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reportes')}
                >
                    <FaChartBar /> Reportes
                </button>
                <button 
                    className={`admin-tab ${activeTab === 'reviews' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reviews')}
                >
                    <FaStar /> Reseñas
                </button>
                <button 
                    className={`admin-tab ${activeTab === 'citas' ? 'active' : ''}`}
                    onClick={() => setActiveTab('citas')}
                >
                    <FaCalendarAlt /> Citas
                </button>
                <button 
                    className={`admin-tab ${activeTab === 'mensajes' ? 'active' : ''}`}
                    onClick={() => setActiveTab('mensajes')}
                >
                    <FaEnvelope /> Mensajes
                </button>
            </div>

            <div className="admin-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default Admin;

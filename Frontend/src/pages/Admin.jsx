import { useState } from "react";
import { useAuth } from "@hooks/useAuth";
import { getNombreCompleto } from "@helpers/nameHelpers";
import AdminProductos from "@components/AdminProductos";
import AdminUsuarios from "@components/AdminUsuarios";
import AdminReportes from "@components/AdminReportes";
import { FaBox, FaUsers, FaChartBar } from "react-icons/fa";
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
            case 'reportes':
                return <AdminReportes />;
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
                    className={`admin-tab ${activeTab === 'reportes' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reportes')}
                >
                    <FaChartBar /> Reportes
                </button>
            </div>

            <div className="admin-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default Admin;

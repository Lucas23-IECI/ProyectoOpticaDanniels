import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import { getNombreCorto } from "@helpers/nameHelpers";
import AdminProductos from "@components/AdminProductos";
import AdminUsuarios from "@components/AdminUsuarios";
import AdminOrdenes from "@components/AdminOrdenes";
import AdminReportes from "@components/AdminReportes";
import AdminReviews from "@components/AdminReviews";
import AdminCitas from "@components/AdminCitas";
import AdminMensajes from "@components/AdminMensajes";
import { getProductosStockBajo } from "@services/producto.service";
import {
    FaBox, FaUsers, FaShoppingCart, FaChartBar, FaStar,
    FaCalendarAlt, FaEnvelope, FaBars, FaSignOutAlt,
    FaUserCircle, FaChevronLeft, FaTachometerAlt
} from "react-icons/fa";
import "@styles/admin.css";

const MENU_ITEMS = [
    { key: 'productos', label: 'Productos', icon: FaBox },
    { key: 'usuarios', label: 'Usuarios', icon: FaUsers },
    { key: 'ordenes', label: 'Órdenes', icon: FaShoppingCart },
    { key: 'reportes', label: 'Reportes', icon: FaChartBar },
    { key: 'reviews', label: 'Reseñas', icon: FaStar },
    { key: 'citas', label: 'Citas', icon: FaCalendarAlt },
    { key: 'mensajes', label: 'Mensajes', icon: FaEnvelope },
];

const Admin = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('productos');
    const [stockBajoCount, setStockBajoCount] = useState(0);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    useEffect(() => {
        const cargarAlerts = async () => {
            try {
                const data = await getProductosStockBajo(10);
                setStockBajoCount(data.total || 0);
            } catch { /* silent */ }
        };
        cargarAlerts();
    }, []);

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

    const currentSection = MENU_ITEMS.find(i => i.key === activeTab);

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-brand" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
                        <FaTachometerAlt className="brand-icon" />
                        {!sidebarCollapsed && <span className="brand-text">Panel Admin</span>}
                    </div>
                    <button
                        className="sidebar-collapse-btn"
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        title={sidebarCollapsed ? 'Expandir' : 'Colapsar'}
                    >
                        <FaChevronLeft />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {!sidebarCollapsed && <span className="sidebar-section-label">MENÚ</span>}
                    {MENU_ITEMS.map(item => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.key}
                                className={`sidebar-nav-item ${activeTab === item.key ? 'active' : ''}`}
                                onClick={() => { setActiveTab(item.key); setMobileSidebarOpen(false); }}
                                title={sidebarCollapsed ? item.label : undefined}
                            >
                                <Icon className="nav-icon" />
                                {!sidebarCollapsed && <span className="nav-label">{item.label}</span>}
                                {item.key === 'productos' && stockBajoCount > 0 && (
                                    <span className="sidebar-badge">{stockBajoCount}</span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                <div className="sidebar-footer">
                    <div className="sidebar-user" title={sidebarCollapsed ? (getNombreCorto(user) || 'Admin') : undefined}>
                        <FaUserCircle className="user-avatar" />
                        {!sidebarCollapsed && (
                            <div className="user-info">
                                <span className="user-name">{getNombreCorto(user) || 'Admin'}</span>
                                <span className="user-role">Administrador</span>
                            </div>
                        )}
                    </div>
                    <button className="sidebar-exit" onClick={() => navigate('/')} title="Volver a la tienda">
                        <FaSignOutAlt />
                        {!sidebarCollapsed && <span>Salir del Panel</span>}
                    </button>
                </div>
            </aside>

            {/* Mobile overlay */}
            {mobileSidebarOpen && (
                <div className="sidebar-overlay" onClick={() => setMobileSidebarOpen(false)} />
            )}

            {/* Main content */}
            <main className="admin-main">
                <header className="admin-topbar">
                    <div className="topbar-left">
                        <button className="mobile-menu-btn" onClick={() => setMobileSidebarOpen(true)}>
                            <FaBars />
                        </button>
                        <div className="topbar-title">
                            {currentSection && <currentSection.icon className="topbar-icon" />}
                            <h1>{currentSection?.label || 'Panel de Administración'}</h1>
                        </div>
                    </div>
                    <div className="topbar-right">
                        <span className="topbar-store-name">Óptica Danniels</span>
                    </div>
                </header>

                <div className="admin-content">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default Admin;

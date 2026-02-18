import { useState, useEffect } from 'react';
import { 
    FaChartBar, FaUsers, FaBox, FaSpinner, FaSync, FaCalendar,
    FaUserShield, FaUser, FaEye, FaEyeSlash, FaPercent, FaDollarSign,
    FaChartPie, FaChartLine, FaEquals, FaShoppingCart, FaMoneyBillWave,
    FaTruck, FaCheck, FaBan, FaClipboardList, FaBoxOpen
} from 'react-icons/fa';
import { 
    getEstadisticasGenerales, 
    getEstadisticasUsuarios, 
    getEstadisticasProductos 
} from '@services/reporte.service';
import { getEstadisticasOrdenes } from '@services/orden.service';
import '@styles/adminReportes.css';

const AdminReportes = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('generales');
    
    const [estadisticasGenerales, setEstadisticasGenerales] = useState(null);
    const [estadisticasUsuarios, setEstadisticasUsuarios] = useState(null);
    const [estadisticasProductos, setEstadisticasProductos] = useState(null);
    const [estadisticasOrdenes, setEstadisticasOrdenes] = useState(null);

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            setLoading(true);
            setError(null);

            const [generales, usuarios, productos, ordenes] = await Promise.all([
                getEstadisticasGenerales(),
                getEstadisticasUsuarios(),
                getEstadisticasProductos(),
                getEstadisticasOrdenes().catch(() => null),
            ]);

            setEstadisticasGenerales(generales);
            setEstadisticasUsuarios(usuarios);
            setEstadisticasProductos(productos);
            setEstadisticasOrdenes(ordenes);
        } catch (err) {
            console.error('Error al cargar reportes:', err);
            setError('Error al cargar los datos de reportes');
        } finally {
            setLoading(false);
        }
    };

    const formatearNumero = (numero) => {
        if (!numero) return '0';
        return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const formatearPrecio = (precio) => {
        if (!precio) return '$0';
        return `$${formatearNumero(precio)}`;
    };

    const formatearPorcentaje = (valor, total) => {
        if (!total || total === 0) return '0%';
        return `${((valor / total) * 100).toFixed(1)}%`;
    };

    const obtenerMesNombre = (mes) => {
        const meses = [
            'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
            'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
        ];
        return meses[mes - 1] || '';
    };

    const renderEstadisticasGenerales = () => {
        if (!estadisticasGenerales) return null;

        const { usuarios, productos, tendencias } = estadisticasGenerales;

        return (
            <div className="estadisticas-generales">
                {/* Tarjetas de resumen */}
                <div className="stats-cards">
                    <div className="stat-card usuarios-card">
                        <div className="stat-icon">
                            <FaUsers />
                        </div>
                        <div className="stat-content">
                            <h3>{formatearNumero(usuarios.total)}</h3>
                            <p>Total Usuarios</p>
                            <div className="stat-breakdown">
                                <span className="admin-count">
                                    <FaUserShield /> {usuarios.administradores} admins
                                </span>
                                <span className="user-count">
                                    <FaUser /> {usuarios.regulares} usuarios
                                </span>
                            </div>
                        </div>
                        <div className="stat-trend">
                            <span className="trend-value">+{usuarios.ultimos30Dias}</span>
                            <span className="trend-label">últimos 30 días</span>
                        </div>
                    </div>

                    <div className="stat-card productos-card">
                        <div className="stat-icon">
                            <FaBox />
                        </div>
                        <div className="stat-content">
                            <h3>{formatearNumero(productos.total)}</h3>
                            <p>Total Productos</p>
                            <div className="stat-breakdown">
                                <span className="active-count">
                                    <FaEye /> {productos.activos} activos
                                </span>
                                <span className="inactive-count">
                                    <FaEyeSlash /> {productos.inactivos} inactivos
                                </span>
                            </div>
                        </div>
                        <div className="stat-trend">
                            <span className="trend-value">{productos.enOferta}</span>
                            <span className="trend-label">en oferta</span>
                        </div>
                    </div>

                    <div className="stat-card inventario-card">
                        <div className="stat-icon">
                            <FaDollarSign />
                        </div>
                        <div className="stat-content">
                            <h3>{formatearPrecio(productos.valorInventario)}</h3>
                            <p>Valor Inventario</p>
                            <div className="stat-breakdown">
                                {(() => {
                                    const stockBajo = Number(productos.stockBajo) || 0;
                                    const tieneStockBajo = stockBajo > 0;
                                    return (
                                        <span className={`stock-alert ${tieneStockBajo ? 'alert' : 'ok'}`}>
                                            {tieneStockBajo ? '⚠️' : '✅'} {stockBajo} con stock bajo
                                        </span>
                                    );
                                })()}
                            </div>
                        </div>
                        <div className="stat-trend">
                            <span className="trend-value">{formatearPorcentaje(productos.enOferta, productos.total)}</span>
                            <span className="trend-label">en promoción</span>
                        </div>
                    </div>
                </div>

                {/* Gráficos */}
                <div className="charts-grid">
                    {/* Gráfico de usuarios por género */}
                    <div className="chart-card">
                        <h3>
                            <FaChartPie className="chart-icon" />
                            Usuarios por Género
                        </h3>
                        <div className="chart-content">
                            {usuarios.porGenero && usuarios.porGenero.length > 0 ? (
                                <div className="pie-chart-simple">
                                    {usuarios.porGenero.map((item, index) => (
                                        <div key={index} className="pie-item">
                                            <div className={`pie-color pie-color-${index}`}></div>
                                            <span className="pie-label">
                                                {item.genero}: {item.cantidad} 
                                                ({formatearPorcentaje(item.cantidad, usuarios.total)})
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="no-data">No hay datos de género disponibles</p>
                            )}
                        </div>
                    </div>

                    {/* Gráfico de productos por categoría */}
                    <div className="chart-card">
                        <h3>
                            <FaChartBar className="chart-icon" />
                            Productos por Categoría
                        </h3>
                        <div className="chart-content">
                            {productos.porCategoria && productos.porCategoria.length > 0 ? (
                                <div className="bar-chart-simple">
                                    {productos.porCategoria.map((item, index) => (
                                        <div key={index} className="bar-item">
                                            <div className="bar-label">{item.categoria}</div>
                                            <div className="bar-container">
                                                <div 
                                                    className="bar-fill"
                                                    style={{ 
                                                        width: `${(item.cantidad / Math.max(...productos.porCategoria.map(p => p.cantidad))) * 100}%` 
                                                    }}
                                                ></div>
                                                <span className="bar-value">{item.cantidad}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="no-data">No hay datos de categorías disponibles</p>
                            )}
                        </div>
                    </div>

                    {/* Gráfico de tendencias de registro */}
                    <div className="chart-card full-width">
                        <h3>
                            <FaChartLine className="chart-icon" />
                            Tendencia de Registros (Últimos 6 meses)
                        </h3>
                        <div className="chart-content">
                            {tendencias.registrosPorMes && tendencias.registrosPorMes.length > 0 ? (
                                <div className="line-chart-simple">
                                    {tendencias.registrosPorMes.map((item, index) => (
                                        <div key={index} className="line-item">
                                            <div className="line-label">
                                                {obtenerMesNombre(item.mes)} {item.año}
                                            </div>
                                            <div className="line-value">{item.cantidad}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="no-data">No hay datos de tendencias disponibles</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderEstadisticasUsuarios = () => {
        if (!estadisticasUsuarios) return null;

        return (
            <div className="estadisticas-usuarios">
                <div className="charts-grid">
                    {/* Usuarios por rol */}
                    <div className="chart-card">
                        <h3>
                            <FaChartPie className="chart-icon" />
                            Distribución por Rol
                        </h3>
                        <div className="chart-content">
                            <div className="pie-chart-simple">
                                {estadisticasUsuarios.porRol.map((item, index) => (
                                    <div key={index} className="pie-item">
                                        <div className={`pie-color pie-color-${index}`}></div>
                                        <span className="pie-label">
                                            {item.rol}: {item.cantidad}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Distribución por edad */}
                    <div className="chart-card">
                        <h3>
                            <FaChartBar className="chart-icon" />
                            Distribución por Edad
                        </h3>
                        <div className="chart-content">
                            <div className="bar-chart-simple">
                                {estadisticasUsuarios.distribucionPorEdad.map((item, index) => (
                                    <div key={index} className="bar-item">
                                        <div className="bar-label">{item.rango}</div>
                                        <div className="bar-container">
                                            <div 
                                                className="bar-fill"
                                                style={{ 
                                                    width: `${(item.cantidad / Math.max(...estadisticasUsuarios.distribucionPorEdad.map(p => p.cantidad))) * 100}%` 
                                                }}
                                            ></div>
                                            <span className="bar-value">{item.cantidad}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Últimos usuarios registrados */}
                    <div className="chart-card full-width">
                        <h3>
                            <FaCalendar className="chart-icon" />
                            Últimos Usuarios Registrados
                        </h3>
                        <div className="chart-content">
                            <div className="usuarios-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Email</th>
                                            <th>Rol</th>
                                            <th>Fecha Registro</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {estadisticasUsuarios.ultimosUsuarios.map((usuario, index) => (
                                            <tr key={index}>
                                                <td>
                                                    {usuario.primerNombre} {usuario.apellidoPaterno}
                                                </td>
                                                <td>{usuario.email}</td>
                                                <td>
                                                    <span className={`badge badge-${usuario.rol}`}>
                                                        {usuario.rol}
                                                    </span>
                                                </td>
                                                <td>
                                                    {new Date(usuario.createdAt).toLocaleDateString('es-CL')}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderEstadisticasProductos = () => {
        if (!estadisticasProductos) return null;

        return (
            <div className="estadisticas-productos">
                <div className="charts-grid">
                    {/* Top marcas */}
                    <div className="chart-card">
                        <h3>
                            <FaChartBar className="chart-icon" />
                            Top 10 Marcas
                        </h3>
                        <div className="chart-content">
                            <div className="bar-chart-simple">
                                {estadisticasProductos.porMarca.map((item, index) => (
                                    <div key={index} className="bar-item">
                                        <div className="bar-label">{item.marca}</div>
                                        <div className="bar-container">
                                            <div 
                                                className="bar-fill"
                                                style={{ 
                                                    width: `${(item.cantidad / Math.max(...estadisticasProductos.porMarca.map(p => p.cantidad))) * 100}%` 
                                                }}
                                            ></div>
                                            <span className="bar-value">{item.cantidad}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Distribución de precios */}
                    <div className="chart-card">
                        <h3>
                            <FaChartPie className="chart-icon" />
                            Distribución de Precios
                        </h3>
                        <div className="chart-content">
                            <div className="pie-chart-simple">
                                {estadisticasProductos.distribucionPrecios.map((item, index) => (
                                    <div key={index} className="pie-item">
                                        <div className={`pie-color pie-color-${index}`}></div>
                                        <span className="pie-label">
                                            ${item.rango}: {item.cantidad}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Productos con stock bajo */}
                    <div className="chart-card full-width">
                        <h3>
                            ⚠️ Productos con Stock Bajo (Menos de 10 unidades)
                        </h3>
                        <div className="chart-content">
                            {estadisticasProductos.stockBajo && estadisticasProductos.stockBajo.length > 0 ? (
                                <div className="productos-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Producto</th>
                                                <th>Marca</th>
                                                <th>Categoría</th>
                                                <th>Stock</th>
                                                <th>Precio</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {estadisticasProductos.stockBajo.map((producto, index) => (
                                                <tr key={index}>
                                                    <td>{producto.nombre}</td>
                                                    <td>{producto.marca}</td>
                                                    <td>{producto.categoria}</td>
                                                    <td>
                                                        <span className="stock-bajo">
                                                            {producto.stock} unidades
                                                        </span>
                                                    </td>
                                                    <td>{formatearPrecio(producto.precio)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="no-data">✅ No hay productos con stock bajo</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const ESTADO_ICONS = {
        pendiente: FaClipboardList,
        pagada: FaMoneyBillWave,
        'en preparación': FaBoxOpen,
        'en camino': FaTruck,
        entregada: FaCheck,
        cancelada: FaBan,
    };

    const ESTADO_COLORS = {
        pendiente: '#FFA500',
        pagada: '#2147A2',
        'en preparación': '#9B59B6',
        'en camino': '#3498DB',
        entregada: '#29A937',
        cancelada: '#FF4444',
    };

    const renderEstadisticasOrdenes = () => {
        if (!estadisticasOrdenes) {
            return (
                <div className="no-data-section">
                    <FaShoppingCart />
                    <p>No hay datos de órdenes disponibles</p>
                </div>
            );
        }

        const { resumen, porEstado, tendencias, topProductos, ultimasOrdenes } = estadisticasOrdenes;

        return (
            <div className="estadisticas-ordenes">
                {/* Summary Cards */}
                <div className="stats-cards">
                    <div className="stat-card ordenes-card">
                        <div className="stat-icon"><FaShoppingCart /></div>
                        <div className="stat-content">
                            <h3>{formatearNumero(resumen.totalOrdenes)}</h3>
                            <p>Total Órdenes</p>
                        </div>
                        <div className="stat-trend">
                            <span className="trend-value">+{resumen.ordenesUltimos30Dias}</span>
                            <span className="trend-label">últimos 30 días</span>
                        </div>
                    </div>

                    <div className="stat-card ingresos-card">
                        <div className="stat-icon"><FaMoneyBillWave /></div>
                        <div className="stat-content">
                            <h3>{formatearPrecio(resumen.ingresosTotales)}</h3>
                            <p>Ingresos Totales</p>
                        </div>
                        <div className="stat-trend">
                            <span className="trend-value">{formatearPrecio(resumen.ingresos30Dias)}</span>
                            <span className="trend-label">últimos 30 días</span>
                        </div>
                    </div>

                    <div className="stat-card promedio-card">
                        <div className="stat-icon"><FaDollarSign /></div>
                        <div className="stat-content">
                            <h3>{formatearPrecio(resumen.promedioOrden)}</h3>
                            <p>Orden Promedio</p>
                        </div>
                    </div>
                </div>

                <div className="charts-grid">
                    {/* Orders by Status */}
                    <div className="chart-card">
                        <h3><FaChartPie className="chart-icon" /> Órdenes por Estado</h3>
                        <div className="chart-content">
                            {porEstado && porEstado.length > 0 ? (
                                <div className="estado-chart">
                                    {porEstado.map((item, index) => {
                                        const Icon = ESTADO_ICONS[item.estado] || FaClipboardList;
                                        const color = ESTADO_COLORS[item.estado] || '#666';
                                        return (
                                            <div key={index} className="estado-chart-item">
                                                <div className="estado-chart-icon" style={{ color }}>
                                                    <Icon />
                                                </div>
                                                <div className="estado-chart-bar">
                                                    <div className="bar-label">{item.estado}</div>
                                                    <div className="bar-container">
                                                        <div
                                                            className="bar-fill"
                                                            style={{
                                                                width: `${(item.cantidad / Math.max(...porEstado.map(e => e.cantidad))) * 100}%`,
                                                                backgroundColor: color,
                                                            }}
                                                        ></div>
                                                        <span className="bar-value">{item.cantidad}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="no-data">No hay datos de estados disponibles</p>
                            )}
                        </div>
                    </div>

                    {/* Top Products Sold */}
                    <div className="chart-card">
                        <h3><FaChartBar className="chart-icon" /> Top Productos Vendidos</h3>
                        <div className="chart-content">
                            {topProductos && topProductos.length > 0 ? (
                                <div className="bar-chart-simple">
                                    {topProductos.map((item, index) => (
                                        <div key={index} className="bar-item">
                                            <div className="bar-label" title={`${item.nombre} (${item.marca})`}>
                                                {item.nombre}
                                            </div>
                                            <div className="bar-container">
                                                <div
                                                    className="bar-fill"
                                                    style={{
                                                        width: `${(item.cantidadVendida / Math.max(...topProductos.map(p => p.cantidadVendida))) * 100}%`,
                                                    }}
                                                ></div>
                                                <span className="bar-value">{item.cantidadVendida} uds</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="no-data">No hay datos de ventas disponibles</p>
                            )}
                        </div>
                    </div>

                    {/* Trend (last 6 months) */}
                    <div className="chart-card full-width">
                        <h3><FaChartLine className="chart-icon" /> Tendencia de Órdenes (Últimos 6 meses)</h3>
                        <div className="chart-content">
                            {tendencias && tendencias.length > 0 ? (
                                <div className="tendencia-ordenes">
                                    <div className="line-chart-simple">
                                        {tendencias.map((item, index) => (
                                            <div key={index} className="line-item">
                                                <div className="line-label">
                                                    {obtenerMesNombre(item.mes)} {item.año}
                                                </div>
                                                <div className="line-value">
                                                    {item.cantidad} órdenes
                                                </div>
                                                <div className="line-ingresos">
                                                    {formatearPrecio(item.ingresos)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <p className="no-data">No hay datos de tendencias disponibles</p>
                            )}
                        </div>
                    </div>

                    {/* Latest Orders */}
                    <div className="chart-card full-width">
                        <h3><FaCalendar className="chart-icon" /> Últimas Órdenes</h3>
                        <div className="chart-content">
                            {ultimasOrdenes && ultimasOrdenes.length > 0 ? (
                                <div className="productos-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Cliente</th>
                                                <th>Total</th>
                                                <th>Items</th>
                                                <th>Estado</th>
                                                <th>Fecha</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ultimasOrdenes.map((orden, index) => {
                                                const color = ESTADO_COLORS[orden.estado] || '#666';
                                                return (
                                                    <tr key={index}>
                                                        <td>#{orden.id}</td>
                                                        <td>{orden.nombre}</td>
                                                        <td><strong>{formatearPrecio(orden.total)}</strong></td>
                                                        <td>{orden.cantidadProductos}</td>
                                                        <td>
                                                            <span
                                                                className="badge-estado"
                                                                style={{
                                                                    backgroundColor: `${color}20`,
                                                                    color: color,
                                                                    border: `1px solid ${color}`,
                                                                }}
                                                            >
                                                                {orden.estado}
                                                            </span>
                                                        </td>
                                                        <td>{new Date(orden.fecha).toLocaleDateString('es-CL')}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="no-data">No hay órdenes registradas</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'generales':
                return renderEstadisticasGenerales();
            case 'usuarios':
                return renderEstadisticasUsuarios();
            case 'productos':
                return renderEstadisticasProductos();
            case 'ordenes':
                return renderEstadisticasOrdenes();
            default:
                return renderEstadisticasGenerales();
        }
    };

    if (loading) {
        return (
            <div className="admin-reportes loading">
                <div className="loading-container">
                    <FaSpinner className="spinner" />
                    <p>Cargando reportes y estadísticas...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-reportes error">
                <div className="error-container">
                    <p>{error}</p>
                    <button className="btn btn-primary" onClick={cargarDatos}>
                        <FaSync /> Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-reportes">
            <div className="reportes-header">
                <div className="header-title">
                    <h1>
                        <FaChartBar className="header-icon" />
                        Reportes y Estadísticas
                    </h1>
                    <p>Panel de control con métricas y estadísticas del sistema</p>
                </div>
                
                <div className="header-actions">
                    <button 
                        className="btn btn-refresh"
                        onClick={cargarDatos}
                        disabled={loading}
                    >
                        <FaSync className={loading ? 'spinning' : ''} />
                        Actualizar
                    </button>
                </div>
            </div>

            <div className="reportes-tabs">
                <button 
                    className={`reporte-tab ${activeTab === 'generales' ? 'active' : ''}`}
                    onClick={() => setActiveTab('generales')}
                >
                    <FaChartLine /> Resumen General
                </button>
                <button 
                    className={`reporte-tab ${activeTab === 'usuarios' ? 'active' : ''}`}
                    onClick={() => setActiveTab('usuarios')}
                >
                    <FaUsers /> Usuarios
                </button>
                <button 
                    className={`reporte-tab ${activeTab === 'productos' ? 'active' : ''}`}
                    onClick={() => setActiveTab('productos')}
                >
                    <FaBox /> Productos
                </button>
                <button 
                    className={`reporte-tab ${activeTab === 'ordenes' ? 'active' : ''}`}
                    onClick={() => setActiveTab('ordenes')}
                >
                    <FaShoppingCart /> Órdenes
                </button>
            </div>

            <div className="reportes-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default AdminReportes;
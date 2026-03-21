import { useState, useEffect } from 'react';
import { 
    FaChartBar, FaUsers, FaBox, FaSpinner, FaSync, FaCalendar,
    FaUserShield, FaUser, FaEye, FaEyeSlash, FaPercent, FaDollarSign,
    FaChartPie, FaChartLine, FaEquals, FaShoppingCart, FaMoneyBillWave,
    FaTruck, FaCheck, FaBan, FaClipboardList, FaBoxOpen,
    FaFilePdf, FaFileExcel, FaFileCsv, FaDownload
} from 'react-icons/fa';
import { 
    getEstadisticasGenerales, 
    getEstadisticasUsuarios, 
    getEstadisticasProductos,
    exportarReporte 
} from '@services/reporte.service';
import { getEstadisticasOrdenes } from '@services/orden.service';
import {
    SimplePieChart, HorizontalBarChart, TrendAreaChart,
    OrdersTrendChart, StatusBarChart,
} from '@components/charts/ReportCharts';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import '@styles/adminReportes.css';

const AdminReportes = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('generales');
    
    const [estadisticasGenerales, setEstadisticasGenerales] = useState(null);
    const [estadisticasUsuarios, setEstadisticasUsuarios] = useState(null);
    const [estadisticasProductos, setEstadisticasProductos] = useState(null);
    const [estadisticasOrdenes, setEstadisticasOrdenes] = useState(null);
    const [exportando, setExportando] = useState(null);

    useEffect(() => {
        cargarDatos();
    }, []);

    const handleExportar = async (formato) => {
        try {
            setExportando(formato);
            await exportarReporte(activeTab, formato);
        } catch (err) {
            console.error('Error al exportar reporte:', err);
            alert('Error al exportar el reporte. Intente nuevamente.');
        } finally {
            setExportando(null);
        }
    };

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

        const usuariosDonut = [
            { name: 'Admins', value: Number(usuarios.administradores) || 0 },
            { name: 'Usuarios', value: Number(usuarios.regulares) || 0 },
        ];
        const productosDonut = [
            { name: 'Activos', value: Number(productos.activos) || 0 },
            { name: 'Inactivos', value: Number(productos.inactivos) || 0 },
        ];
        const stockBajo = Number(productos.stockBajo) || 0;
        const stockNormal = Math.max(0, (Number(productos.total) || 0) - stockBajo);
        const inventarioDonut = [
            { name: 'Stock bajo', value: stockBajo },
            { name: 'Normal', value: stockNormal },
        ];

        return (
            <div className="estadisticas-generales">
                {/* Overview Cards */}
                <div className="overview-grid">
                    {/* Usuarios */}
                    <div className="overview-card">
                        <div className="overview-top">
                            <span className="overview-label"><FaUsers /> Usuarios</span>
                            <span className="overview-badge positive">+{usuarios.ultimos30Dias} <small>últimos 30d</small></span>
                        </div>
                        <div className="overview-body">
                            <div className="overview-info">
                                <h2 className="overview-number">{formatearNumero(usuarios.total)}</h2>
                                <div className="overview-tags">
                                    <span className="tag blue"><FaUserShield /> {usuarios.administradores} admins</span>
                                    <span className="tag green"><FaUser /> {usuarios.regulares} usuarios</span>
                                </div>
                            </div>
                            <div className="overview-mini-chart">
                                <ResponsiveContainer width={90} height={90}>
                                    <PieChart>
                                        <Pie data={usuariosDonut} dataKey="value" innerRadius={28} outerRadius={42} paddingAngle={4} strokeWidth={0}>
                                            <Cell fill="#2147A2" />
                                            <Cell fill="#29A937" />
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="overview-legend">
                            <span><i style={{ background: '#2147A2' }} /> Admins</span>
                            <span><i style={{ background: '#29A937' }} /> Usuarios</span>
                        </div>
                    </div>

                    {/* Productos */}
                    <div className="overview-card">
                        <div className="overview-top">
                            <span className="overview-label"><FaBox /> Productos</span>
                            <span className="overview-badge highlight">{productos.enOferta} en oferta</span>
                        </div>
                        <div className="overview-body">
                            <div className="overview-info">
                                <h2 className="overview-number">{formatearNumero(productos.total)}</h2>
                                <div className="overview-tags">
                                    <span className="tag green"><FaEye /> {productos.activos} activos</span>
                                    <span className="tag muted"><FaEyeSlash /> {productos.inactivos} inactivos</span>
                                </div>
                            </div>
                            <div className="overview-mini-chart">
                                <ResponsiveContainer width={90} height={90}>
                                    <PieChart>
                                        <Pie data={productosDonut} dataKey="value" innerRadius={28} outerRadius={42} paddingAngle={4} strokeWidth={0}>
                                            <Cell fill="#29A937" />
                                            <Cell fill="#94a3b8" />
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="overview-legend">
                            <span><i style={{ background: '#29A937' }} /> Activos</span>
                            <span><i style={{ background: '#94a3b8' }} /> Inactivos</span>
                        </div>
                    </div>

                    {/* Valor Inventario */}
                    <div className="overview-card">
                        <div className="overview-top">
                            <span className="overview-label"><FaDollarSign /> Valor Inventario</span>
                            <span className="overview-badge info">{formatearPorcentaje(productos.enOferta, productos.total)} promo</span>
                        </div>
                        <div className="overview-body">
                            <div className="overview-info">
                                <h2 className="overview-number money">{formatearPrecio(productos.valorInventario)}</h2>
                                <div className="overview-tags">
                                    <span className={`tag ${stockBajo > 0 ? 'red' : 'green'}`}>
                                        {stockBajo > 0 ? '⚠️' : '✅'} {stockBajo} con stock bajo
                                    </span>
                                </div>
                            </div>
                            <div className="overview-mini-chart">
                                <ResponsiveContainer width={90} height={90}>
                                    <PieChart>
                                        <Pie data={inventarioDonut} dataKey="value" innerRadius={28} outerRadius={42} paddingAngle={4} strokeWidth={0}>
                                            <Cell fill="#dc2626" />
                                            <Cell fill="#29A937" />
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="overview-legend">
                            <span><i style={{ background: '#dc2626' }} /> Stock bajo</span>
                            <span><i style={{ background: '#29A937' }} /> Normal</span>
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
                                <SimplePieChart data={usuarios.porGenero} nameKey="genero" valueKey="cantidad" />
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
                                <HorizontalBarChart data={productos.porCategoria} nameKey="categoria" valueKey="cantidad" barColor="#2147A2" />
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
                                <TrendAreaChart
                                    data={tendencias.registrosPorMes.map(t => ({
                                        ...t,
                                        label: `${obtenerMesNombre(t.mes)} ${t.año}`,
                                    }))}
                                    nameKey="label"
                                    valueKey="cantidad"
                                />
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

        const rolDonut = estadisticasUsuarios.porRol && estadisticasUsuarios.porRol.length > 0
            ? estadisticasUsuarios.porRol.map(r => ({ name: r.rol, value: Number(r.cantidad) || 0 }))
            : [];

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
                            <SimplePieChart data={estadisticasUsuarios.porRol} nameKey="rol" valueKey="cantidad" />
                        </div>
                    </div>

                    {/* Distribución por edad */}
                    <div className="chart-card">
                        <h3>
                            <FaChartBar className="chart-icon" />
                            Distribución por Edad
                        </h3>
                        <div className="chart-content">
                            <HorizontalBarChart data={estadisticasUsuarios.distribucionPorEdad} nameKey="rango" valueKey="cantidad" barColor="#9b59b6" />
                        </div>
                    </div>

                    {/* Últimos usuarios registrados */}
                    <div className="chart-card full-width">
                        <h3>
                            <FaCalendar className="chart-icon" />
                            Últimos Usuarios Registrados
                        </h3>
                        <div className="chart-content">
                            <div className="recent-users-list">
                                {estadisticasUsuarios.ultimosUsuarios.map((usuario, index) => (
                                    <div key={index} className="recent-user-row">
                                        <div className="recent-user-avatar">
                                            {(usuario.primerNombre || '?')[0].toUpperCase()}
                                        </div>
                                        <div className="recent-user-info">
                                            <span className="recent-user-name">{usuario.primerNombre} {usuario.apellidoPaterno}</span>
                                            <span className="recent-user-email">{usuario.email}</span>
                                        </div>
                                        <span className={`recent-user-badge ${usuario.rol === 'administrador' ? 'admin' : 'user'}`}>
                                            {usuario.rol === 'administrador' ? <><FaUserShield /> Admin</> : <><FaUser /> Usuario</>}
                                        </span>
                                        <span className="recent-user-date">
                                            <FaCalendar /> {new Date(usuario.createdAt).toLocaleDateString('es-CL')}
                                        </span>
                                    </div>
                                ))}
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
                            <HorizontalBarChart data={estadisticasProductos.porMarca} nameKey="marca" valueKey="cantidad" barColor="#29A937" />
                        </div>
                    </div>

                    {/* Distribución de precios */}
                    <div className="chart-card">
                        <h3>
                            <FaChartPie className="chart-icon" />
                            Distribución de Precios
                        </h3>
                        <div className="chart-content">
                            <SimplePieChart data={estadisticasProductos.distribucionPrecios} nameKey="rango" valueKey="cantidad" />
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

        const estadoDonut = porEstado && porEstado.length > 0
            ? porEstado.map(e => ({ name: e.estado, value: Number(e.cantidad) || 0 }))
            : [];
        const estadoDonutColors = estadoDonut.map(e => ESTADO_COLORS[e.name] || '#94a3b8');

        return (
            <div className="estadisticas-ordenes">
                {/* Overview Cards */}
                <div className="overview-grid">
                    <div className="overview-card">
                        <div className="overview-top">
                            <span className="overview-label"><FaShoppingCart /> Órdenes</span>
                            <span className="overview-badge positive">+{resumen.ordenesUltimos30Dias} <small>últimos 30d</small></span>
                        </div>
                        <div className="overview-body">
                            <div className="overview-info">
                                <h2 className="overview-number">{formatearNumero(resumen.totalOrdenes)}</h2>
                                <div className="overview-tags">
                                    <span className="tag blue"><FaClipboardList /> Total registradas</span>
                                </div>
                            </div>
                            <div className="overview-mini-chart">
                                {estadoDonut.length > 0 && (
                                    <ResponsiveContainer width={90} height={90}>
                                        <PieChart>
                                            <Pie data={estadoDonut} dataKey="value" innerRadius={28} outerRadius={42} paddingAngle={3} strokeWidth={0}>
                                                {estadoDonut.map((_, i) => (
                                                    <Cell key={i} fill={estadoDonutColors[i]} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>
                        {estadoDonut.length > 0 && (
                            <div className="overview-legend">
                                {estadoDonut.slice(0, 3).map((e, i) => (
                                    <span key={i}><i style={{ background: estadoDonutColors[i] }} /> {e.name}</span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="overview-card">
                        <div className="overview-top">
                            <span className="overview-label"><FaMoneyBillWave /> Ingresos</span>
                            <span className="overview-badge highlight">{formatearPrecio(resumen.ingresos30Dias)} <small>30d</small></span>
                        </div>
                        <div className="overview-body">
                            <div className="overview-info">
                                <h2 className="overview-number money">{formatearPrecio(resumen.ingresosTotales)}</h2>
                                <div className="overview-tags">
                                    <span className="tag green"><FaDollarSign /> Ingresos totales</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="overview-card">
                        <div className="overview-top">
                            <span className="overview-label"><FaDollarSign /> Orden Promedio</span>
                        </div>
                        <div className="overview-body">
                            <div className="overview-info">
                                <h2 className="overview-number money">{formatearPrecio(resumen.promedioOrden)}</h2>
                                <div className="overview-tags">
                                    <span className="tag muted"><FaEquals /> Valor promedio por orden</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="charts-grid">
                    {/* Orders by Status */}
                    <div className="chart-card">
                        <h3><FaChartPie className="chart-icon" /> Órdenes por Estado</h3>
                        <div className="chart-content">
                            {porEstado && porEstado.length > 0 ? (
                                <StatusBarChart
                                    data={porEstado}
                                    nameKey="estado"
                                    valueKey="cantidad"
                                    colorMap={ESTADO_COLORS}
                                />
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
                                <HorizontalBarChart data={topProductos} nameKey="nombre" valueKey="cantidadVendida" barColor="#e67e22" />
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
                                <OrdersTrendChart
                                    data={tendencias.map(t => ({
                                        ...t,
                                        label: `${obtenerMesNombre(t.mes)} ${t.año}`,
                                    }))}
                                />
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
                    <div className="export-buttons">
                        <span className="export-label"><FaDownload /> Exportar:</span>
                        <button 
                            className="btn btn-export btn-export-pdf"
                            onClick={() => handleExportar('pdf')}
                            disabled={loading || exportando}
                            title="Exportar a PDF"
                        >
                            {exportando === 'pdf' ? <FaSpinner className="spinning" /> : <FaFilePdf />}
                            PDF
                        </button>
                        <button 
                            className="btn btn-export btn-export-excel"
                            onClick={() => handleExportar('excel')}
                            disabled={loading || exportando}
                            title="Exportar a Excel"
                        >
                            {exportando === 'excel' ? <FaSpinner className="spinning" /> : <FaFileExcel />}
                            Excel
                        </button>
                        <button 
                            className="btn btn-export btn-export-csv"
                            onClick={() => handleExportar('csv')}
                            disabled={loading || exportando}
                            title="Exportar a CSV"
                        >
                            {exportando === 'csv' ? <FaSpinner className="spinning" /> : <FaFileCsv />}
                            CSV
                        </button>
                    </div>
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
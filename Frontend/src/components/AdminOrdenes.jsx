import { useState, useEffect, useMemo, useCallback } from 'react';
import {
    FaSearch, FaFilter, FaEye, FaTrash, FaTh, FaList, FaTable,
    FaArrowLeft, FaArrowRight, FaSort, FaSortUp, FaSortDown, FaSpinner,
    FaTimes, FaSync, FaShoppingCart, FaEnvelope, FaPhone, FaMapMarkerAlt,
    FaCalendar, FaMoneyBillWave, FaClipboardList, FaChevronDown, FaCheck,
    FaExclamationTriangle, FaBoxOpen, FaTruck, FaBan
} from 'react-icons/fa';
import { getOrdenes, actualizarEstadoOrden, eliminarOrden } from '@services/orden.service';
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert';
import '@styles/adminOrdenes.css';

const ITEMS_PER_PAGE_OPTIONS = [12, 24, 48, 96];

const ESTADOS_ORDEN = [
    { value: 'pendiente', label: 'Pendiente', icon: FaClipboardList, color: '#FFA500' },
    { value: 'pagada', label: 'Pagada', icon: FaMoneyBillWave, color: '#2147A2' },
    { value: 'en preparación', label: 'En Preparación', icon: FaBoxOpen, color: '#9B59B6' },
    { value: 'en camino', label: 'En Camino', icon: FaTruck, color: '#3498DB' },
    { value: 'entregada', label: 'Entregada', icon: FaCheck, color: '#29A937' },
    { value: 'cancelada', label: 'Cancelada', icon: FaBan, color: '#FF4444' },
];

const SORT_OPTIONS = [
    { value: 'createdAt', label: 'Fecha de creación' },
    { value: 'updatedAt', label: 'Última actualización' },
    { value: 'fecha', label: 'Fecha de orden' },
];

const VIEW_MODES = { GRID: 'grid', LIST: 'list', TABLE: 'table' };

const AdminOrdenes = () => {
    const [ordenes, setOrdenes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[0]);

    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        estado: '',
        fechaDesde: '',
        fechaHasta: '',
    });

    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [viewMode, setViewMode] = useState(VIEW_MODES.TABLE);
    const [showFilters, setShowFilters] = useState(false);

    const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
    const [showDetalle, setShowDetalle] = useState(false);
    const [showEliminar, setShowEliminar] = useState(false);
    const [estadoDropdownId, setEstadoDropdownId] = useState(null);
    const [updatingEstado, setUpdatingEstado] = useState(null);

    const cargarOrdenes = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getOrdenes({
                orden: `${sortBy}_${sortOrder.toUpperCase()}`,
            });
            setOrdenes(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error al cargar órdenes:', err);
            setError('Error al cargar las órdenes');
        } finally {
            setLoading(false);
        }
    }, [sortBy, sortOrder]);

    useEffect(() => {
        cargarOrdenes();
    }, [cargarOrdenes]);

    // --- Filtrado y búsqueda ---
    const ordenesProcessadas = useMemo(() => {
        let resultado = [...ordenes];

        if (searchTerm) {
            const words = searchTerm.toLowerCase().trim().split(/\s+/);
            resultado = resultado.filter(orden => {
                const text = [
                    orden.nombre,
                    orden.correo,
                    orden.telefono,
                    orden.direccion,
                    orden.observaciones,
                    String(orden.id),
                ].join(' ').toLowerCase();
                return words.every(w => text.includes(w));
            });
        }

        if (filters.estado) {
            resultado = resultado.filter(o => o.estado === filters.estado);
        }
        if (filters.fechaDesde) {
            const desde = new Date(filters.fechaDesde);
            resultado = resultado.filter(o => new Date(o.createdAt) >= desde);
        }
        if (filters.fechaHasta) {
            const hasta = new Date(filters.fechaHasta);
            hasta.setHours(23, 59, 59, 999);
            resultado = resultado.filter(o => new Date(o.createdAt) <= hasta);
        }

        return resultado;
    }, [ordenes, searchTerm, filters]);

    const totalItems = ordenesProcessadas.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    const startIndex = (currentPage - 1) * itemsPerPage;
    const ordenesPaginadas = ordenesProcessadas.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filters, itemsPerPage]);

    // --- Acciones ---
    const handleCambiarEstado = async (ordenId, nuevoEstado) => {
        setUpdatingEstado(ordenId);
        try {
            await actualizarEstadoOrden(ordenId, nuevoEstado);
            setOrdenes(prev =>
                prev.map(o => o.id === ordenId ? { ...o, estado: nuevoEstado, updatedAt: new Date().toISOString() } : o)
            );
            showSuccessAlert('Estado actualizado correctamente');
        } catch (err) {
            console.error('Error al actualizar estado:', err);
            showErrorAlert(err?.response?.data?.message || 'Error al actualizar estado');
        } finally {
            setUpdatingEstado(null);
            setEstadoDropdownId(null);
        }
    };

    const handleEliminarOrden = async () => {
        if (!ordenSeleccionada) return;
        try {
            await eliminarOrden(ordenSeleccionada.id);
            setOrdenes(prev => prev.filter(o => o.id !== ordenSeleccionada.id));
            setShowEliminar(false);
            setOrdenSeleccionada(null);
            showSuccessAlert('Orden eliminada correctamente');
        } catch (err) {
            console.error('Error al eliminar orden:', err);
            showErrorAlert(err?.response?.data?.message || 'Error al eliminar orden');
        }
    };

    const limpiarFiltros = () => {
        setSearchTerm('');
        setFilters({ estado: '', fechaDesde: '', fechaHasta: '' });
    };

    const getEstadoInfo = (estado) => {
        return ESTADOS_ORDEN.find(e => e.value === estado) || ESTADOS_ORDEN[0];
    };

    const formatearPrecio = (precio) => {
        if (!precio && precio !== 0) return '$0';
        return `$${Number(precio).toLocaleString('es-CL')}`;
    };

    const formatearFecha = (fechaStr) => {
        if (!fechaStr) return '—';
        return new Date(fechaStr).toLocaleDateString('es-CL', {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
        });
    };

    const cantidadProductos = (orden) => {
        return orden.productos?.reduce((sum, p) => sum + (p.cantidad || 0), 0) || 0;
    };

    // --- Render: Estado Badge ---
    const renderEstadoBadge = (estado, ordenId, compact = false) => {
        const info = getEstadoInfo(estado);
        const Icon = info.icon;
        const isDropdownOpen = estadoDropdownId === ordenId;
        const isUpdating = updatingEstado === ordenId;

        return (
            <div className="estado-badge-wrapper">
                <button
                    className={`estado-badge ${compact ? 'compact' : ''}`}
                    style={{ backgroundColor: `${info.color}20`, color: info.color, borderColor: info.color }}
                    onClick={(e) => {
                        e.stopPropagation();
                        setEstadoDropdownId(isDropdownOpen ? null : ordenId);
                    }}
                    disabled={isUpdating}
                >
                    {isUpdating ? <FaSpinner className="spinner" /> : <Icon />}
                    <span>{info.label}</span>
                    <FaChevronDown className={`chevron ${isDropdownOpen ? 'open' : ''}`} />
                </button>
                {isDropdownOpen && (
                    <div className="estado-dropdown">
                        {ESTADOS_ORDEN.map(e => {
                            const EIcon = e.icon;
                            return (
                                <button
                                    key={e.value}
                                    className={`estado-option ${e.value === estado ? 'active' : ''}`}
                                    style={{ '--estado-color': e.color }}
                                    onClick={(ev) => {
                                        ev.stopPropagation();
                                        if (e.value !== estado) handleCambiarEstado(ordenId, e.value);
                                        else setEstadoDropdownId(null);
                                    }}
                                >
                                    <EIcon /> {e.label}
                                    {e.value === estado && <FaCheck className="check" />}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    // --- Render: Detalle Modal ---
    const renderDetalleModal = () => {
        if (!showDetalle || !ordenSeleccionada) return null;
        const orden = ordenSeleccionada;

        return (
            <div className="modal-overlay" onClick={() => setShowDetalle(false)}>
                <div className="modal-content orden-detalle-modal" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2><FaShoppingCart /> Orden #{orden.id}</h2>
                        <button className="modal-close" onClick={() => setShowDetalle(false)}><FaTimes /></button>
                    </div>

                    <div className="orden-detalle-body">
                        <div className="detalle-section">
                            <h3><FaClipboardList /> Información General</h3>
                            <div className="detalle-grid">
                                <div className="detalle-item">
                                    <span className="detalle-label">Estado</span>
                                    {renderEstadoBadge(orden.estado, orden.id)}
                                </div>
                                <div className="detalle-item">
                                    <span className="detalle-label">Total</span>
                                    <span className="detalle-value total">{formatearPrecio(orden.total)}</span>
                                </div>
                                <div className="detalle-item">
                                    <span className="detalle-label">Fecha</span>
                                    <span className="detalle-value">{formatearFecha(orden.createdAt)}</span>
                                </div>
                                <div className="detalle-item">
                                    <span className="detalle-label">Actualizado</span>
                                    <span className="detalle-value">{formatearFecha(orden.updatedAt)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="detalle-section">
                            <h3><FaEnvelope /> Datos del Cliente</h3>
                            <div className="detalle-grid">
                                <div className="detalle-item">
                                    <span className="detalle-label">Nombre</span>
                                    <span className="detalle-value">{orden.nombre}</span>
                                </div>
                                <div className="detalle-item">
                                    <span className="detalle-label">Correo</span>
                                    <span className="detalle-value">{orden.correo}</span>
                                </div>
                                <div className="detalle-item">
                                    <span className="detalle-label">Teléfono</span>
                                    <span className="detalle-value">{orden.telefono || '—'}</span>
                                </div>
                                <div className="detalle-item full-width">
                                    <span className="detalle-label">Dirección</span>
                                    <span className="detalle-value">{orden.direccion}</span>
                                </div>
                                {orden.observaciones && (
                                    <div className="detalle-item full-width">
                                        <span className="detalle-label">Observaciones</span>
                                        <span className="detalle-value obs">{orden.observaciones}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="detalle-section">
                            <h3><FaBoxOpen /> Productos ({cantidadProductos(orden)} items)</h3>
                            <div className="detalle-productos-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Producto</th>
                                            <th>Precio Unitario</th>
                                            <th>Cantidad</th>
                                            <th>Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orden.productos?.map((op, idx) => (
                                            <tr key={idx}>
                                                <td>{op.producto?.nombre || 'Producto eliminado'}</td>
                                                <td>{formatearPrecio(op.precio)}</td>
                                                <td>{op.cantidad}</td>
                                                <td className="subtotal">{formatearPrecio(op.precio * op.cantidad)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colSpan="3" className="total-label">Total</td>
                                            <td className="total-value">{formatearPrecio(orden.total)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // --- Render: Eliminar Modal ---
    const renderEliminarModal = () => {
        if (!showEliminar || !ordenSeleccionada) return null;

        return (
            <div className="modal-overlay" onClick={() => setShowEliminar(false)}>
                <div className="modal-content eliminar-modal" onClick={e => e.stopPropagation()}>
                    <div className="modal-header eliminar-header">
                        <h2><FaExclamationTriangle /> Eliminar Orden</h2>
                        <button className="modal-close" onClick={() => setShowEliminar(false)}><FaTimes /></button>
                    </div>
                    <div className="eliminar-body">
                        <p>¿Estás seguro de que deseas eliminar la orden <strong>#{ordenSeleccionada.id}</strong>?</p>
                        <p className="eliminar-info">
                            Cliente: <strong>{ordenSeleccionada.nombre}</strong><br />
                            Total: <strong>{formatearPrecio(ordenSeleccionada.total)}</strong><br />
                            Estado: <strong>{getEstadoInfo(ordenSeleccionada.estado).label}</strong>
                        </p>
                        <p className="eliminar-warning">Esta acción no se puede deshacer.</p>
                    </div>
                    <div className="eliminar-actions">
                        <button className="btn-cancel" onClick={() => setShowEliminar(false)}>Cancelar</button>
                        <button className="btn-delete" onClick={handleEliminarOrden}>
                            <FaTrash /> Eliminar
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // --- Render: Cards (Grid) ---
    const renderGrid = () => (
        <div className="ordenes-grid">
            {ordenesPaginadas.map(orden => {
                const info = getEstadoInfo(orden.estado);
                return (
                    <div key={orden.id} className="orden-card" style={{ '--estado-color': info.color }}>
                        <div className="orden-card-header">
                            <span className="orden-id">#{orden.id}</span>
                            {renderEstadoBadge(orden.estado, orden.id, true)}
                        </div>
                        <div className="orden-card-body">
                            <div className="orden-card-cliente">
                                <strong>{orden.nombre}</strong>
                                <span><FaEnvelope /> {orden.correo}</span>
                                {orden.telefono && <span><FaPhone /> {orden.telefono}</span>}
                            </div>
                            <div className="orden-card-meta">
                                <span className="orden-total">{formatearPrecio(orden.total)}</span>
                                <span className="orden-items">{cantidadProductos(orden)} productos</span>
                            </div>
                            <div className="orden-card-fecha">
                                <FaCalendar /> {formatearFecha(orden.createdAt)}
                            </div>
                        </div>
                        <div className="orden-card-actions">
                            <button className="btn-action view" title="Ver detalle"
                                onClick={() => { setOrdenSeleccionada(orden); setShowDetalle(true); }}>
                                <FaEye />
                            </button>
                            <button className="btn-action delete" title="Eliminar"
                                onClick={() => { setOrdenSeleccionada(orden); setShowEliminar(true); }}>
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );

    // --- Render: List ---
    const renderList = () => (
        <div className="ordenes-list">
            {ordenesPaginadas.map(orden => {
                const info = getEstadoInfo(orden.estado);
                return (
                    <div key={orden.id} className="orden-list-item" style={{ '--estado-color': info.color }}>
                        <div className="list-item-principal">
                            <span className="orden-id">#{orden.id}</span>
                            <strong className="orden-nombre">{orden.nombre}</strong>
                            <span className="orden-correo">{orden.correo}</span>
                        </div>
                        <div className="list-item-meta">
                            <span className="orden-total">{formatearPrecio(orden.total)}</span>
                            <span className="orden-items">{cantidadProductos(orden)} items</span>
                            <span className="orden-fecha">{formatearFecha(orden.createdAt)}</span>
                        </div>
                        <div className="list-item-estado">
                            {renderEstadoBadge(orden.estado, orden.id, true)}
                        </div>
                        <div className="list-item-actions">
                            <button className="btn-action view" title="Ver detalle"
                                onClick={() => { setOrdenSeleccionada(orden); setShowDetalle(true); }}>
                                <FaEye />
                            </button>
                            <button className="btn-action delete" title="Eliminar"
                                onClick={() => { setOrdenSeleccionada(orden); setShowEliminar(true); }}>
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );

    // --- Render: Table ---
    const renderTable = () => (
        <div className="ordenes-table-wrapper">
            <table className="ordenes-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Correo</th>
                        <th>Total</th>
                        <th>Items</th>
                        <th>Estado</th>
                        <th>Fecha</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {ordenesPaginadas.map(orden => (
                        <tr key={orden.id}>
                            <td className="td-id">#{orden.id}</td>
                            <td className="td-cliente">{orden.nombre}</td>
                            <td className="td-correo">{orden.correo}</td>
                            <td className="td-total">{formatearPrecio(orden.total)}</td>
                            <td className="td-items">{cantidadProductos(orden)}</td>
                            <td className="td-estado">{renderEstadoBadge(orden.estado, orden.id, true)}</td>
                            <td className="td-fecha">{formatearFecha(orden.createdAt)}</td>
                            <td className="td-actions">
                                <button className="btn-action view" title="Ver detalle"
                                    onClick={() => { setOrdenSeleccionada(orden); setShowDetalle(true); }}>
                                    <FaEye />
                                </button>
                                <button className="btn-action delete" title="Eliminar"
                                    onClick={() => { setOrdenSeleccionada(orden); setShowEliminar(true); }}>
                                    <FaTrash />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    // --- Render: Paginación ---
    const renderPaginacion = () => {
        if (totalPages <= 1) return null;

        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);
        if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);

        for (let i = start; i <= end; i++) pages.push(i);

        return (
            <div className="ordenes-pagination">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                    <FaArrowLeft />
                </button>
                {start > 1 && (
                    <>
                        <button onClick={() => setCurrentPage(1)}>1</button>
                        {start > 2 && <span className="pagination-dots">...</span>}
                    </>
                )}
                {pages.map(p => (
                    <button key={p} className={p === currentPage ? 'active' : ''}
                        onClick={() => setCurrentPage(p)}>{p}</button>
                ))}
                {end < totalPages && (
                    <>
                        {end < totalPages - 1 && <span className="pagination-dots">...</span>}
                        <button onClick={() => setCurrentPage(totalPages)}>{totalPages}</button>
                    </>
                )}
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                    <FaArrowRight />
                </button>
            </div>
        );
    };

    // --- Loading / Error ---
    if (loading) {
        return (
            <div className="ordenes-loading">
                <FaSpinner className="spinner" />
                <p>Cargando órdenes...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="ordenes-error">
                <FaExclamationTriangle />
                <p>{error}</p>
                <button onClick={cargarOrdenes}><FaSync /> Reintentar</button>
            </div>
        );
    }

    // --- Main Render ---
    return (
        <div className="admin-ordenes">
            {/* Header */}
            <div className="ordenes-header">
                <div className="ordenes-title">
                    <h2><FaShoppingCart /> Gestión de Órdenes</h2>
                    <span className="ordenes-count">{totalItems} orden{totalItems !== 1 ? 'es' : ''}</span>
                </div>
                <button className="btn-refresh" onClick={cargarOrdenes} title="Actualizar">
                    <FaSync />
                </button>
            </div>

            {/* Toolbar */}
            <div className="ordenes-toolbar">
                <div className="search-box">
                    <FaSearch />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, correo, ID..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button className="search-clear" onClick={() => setSearchTerm('')}><FaTimes /></button>
                    )}
                </div>

                <div className="toolbar-actions">
                    <button
                        className={`btn-filter ${showFilters ? 'active' : ''}`}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <FaFilter /> Filtros
                    </button>

                    <div className="sort-controls">
                        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                            {SORT_OPTIONS.map(o => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                        <button
                            className="btn-sort-dir"
                            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                            title={sortOrder === 'asc' ? 'Ascendente' : 'Descendente'}
                        >
                            {sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />}
                        </button>
                    </div>

                    <div className="view-modes">
                        <button className={viewMode === VIEW_MODES.GRID ? 'active' : ''}
                            onClick={() => setViewMode(VIEW_MODES.GRID)} title="Vista grid">
                            <FaTh />
                        </button>
                        <button className={viewMode === VIEW_MODES.LIST ? 'active' : ''}
                            onClick={() => setViewMode(VIEW_MODES.LIST)} title="Vista lista">
                            <FaList />
                        </button>
                        <button className={viewMode === VIEW_MODES.TABLE ? 'active' : ''}
                            onClick={() => setViewMode(VIEW_MODES.TABLE)} title="Vista tabla">
                            <FaTable />
                        </button>
                    </div>

                    <select className="items-per-page" value={itemsPerPage}
                        onChange={e => setItemsPerPage(Number(e.target.value))}>
                        {ITEMS_PER_PAGE_OPTIONS.map(n => (
                            <option key={n} value={n}>{n} por página</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="ordenes-filters">
                    <div className="filter-group">
                        <label>Estado</label>
                        <select value={filters.estado} onChange={e => setFilters(f => ({ ...f, estado: e.target.value }))}>
                            <option value="">Todos</option>
                            {ESTADOS_ORDEN.map(e => (
                                <option key={e.value} value={e.value}>{e.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>Desde</label>
                        <input type="date" value={filters.fechaDesde}
                            onChange={e => setFilters(f => ({ ...f, fechaDesde: e.target.value }))} />
                    </div>
                    <div className="filter-group">
                        <label>Hasta</label>
                        <input type="date" value={filters.fechaHasta}
                            onChange={e => setFilters(f => ({ ...f, fechaHasta: e.target.value }))} />
                    </div>
                    <button className="btn-clear-filters" onClick={limpiarFiltros}>
                        <FaTimes /> Limpiar
                    </button>
                </div>
            )}

            {/* Quick Stats */}
            <div className="ordenes-stats-bar">
                {ESTADOS_ORDEN.map(e => {
                    const count = ordenes.filter(o => o.estado === e.value).length;
                    if (count === 0) return null;
                    const Icon = e.icon;
                    return (
                        <button
                            key={e.value}
                            className={`stat-pill ${filters.estado === e.value ? 'active' : ''}`}
                            style={{ '--pill-color': e.color }}
                            onClick={() => setFilters(f => ({ ...f, estado: f.estado === e.value ? '' : e.value }))}
                        >
                            <Icon /> {e.label}: {count}
                        </button>
                    );
                })}
            </div>

            {/* Content */}
            {ordenesPaginadas.length === 0 ? (
                <div className="ordenes-empty">
                    <FaShoppingCart />
                    <p>{searchTerm || filters.estado ? 'No se encontraron órdenes con esos filtros' : 'No hay órdenes registradas'}</p>
                </div>
            ) : (
                <>
                    {viewMode === VIEW_MODES.GRID && renderGrid()}
                    {viewMode === VIEW_MODES.LIST && renderList()}
                    {viewMode === VIEW_MODES.TABLE && renderTable()}
                </>
            )}

            {/* Pagination */}
            {renderPaginacion()}

            {/* Modals */}
            {renderDetalleModal()}
            {renderEliminarModal()}
        </div>
    );
};

export default AdminOrdenes;

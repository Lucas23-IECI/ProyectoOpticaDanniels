import { useState, useEffect, useCallback } from 'react';
import {
    FaCalendarAlt, FaFilter, FaCheck, FaTimes, FaSpinner,
    FaSync, FaSearch, FaUser, FaClock, FaPhone, FaStickyNote, FaBan,
    FaCheckCircle, FaTimesCircle, FaEye
} from 'react-icons/fa';
import { getAllCitas, actualizarEstadoCita } from '@services/cita.service';
import { showSuccessAlert, showErrorAlert, showConfirmAlert } from '@helpers/sweetAlert';
import '@styles/adminCitas.css';

const SERVICIOS_LABEL = {
    examen_visual: "Examen Visual",
    asesoria_lentes: "Asesoría de Lentes",
    reparacion_marcos: "Reparación de Marcos",
    adaptacion_contacto: "Adaptación de Contacto",
    control_oftalmologico: "Control Oftalmológico",
    consulta_general: "Consulta General",
};

const ESTADOS_CITA = [
    { value: '', label: 'Todos' },
    { value: 'pendiente', label: 'Pendiente', color: '#FFA500' },
    { value: 'confirmada', label: 'Confirmada', color: '#2147A2' },
    { value: 'completada', label: 'Completada', color: '#29A937' },
    { value: 'cancelada', label: 'Cancelada', color: '#FF4444' },
    { value: 'no_asistio', label: 'No asistió', color: '#6B7280' },
];

const AdminCitas = () => {
    const [citas, setCitas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtroEstado, setFiltroEstado] = useState('');
    const [busqueda, setBusqueda] = useState('');
    const [actionLoading, setActionLoading] = useState(null);
    const [citaDetalle, setCitaDetalle] = useState(null);
    const [notasAdmin, setNotasAdmin] = useState('');

    const fetchCitas = useCallback(async () => {
        setLoading(true);
        try {
            const filtros = {};
            if (filtroEstado) filtros.estado = filtroEstado;
            const data = await getAllCitas(filtros);
            setCitas(data);
        } catch {
            showErrorAlert('Error', 'No se pudieron cargar las citas.');
        } finally {
            setLoading(false);
        }
    }, [filtroEstado]);

    useEffect(() => {
        fetchCitas();
    }, [fetchCitas]);

    const handleCambiarEstado = async (id, nuevoEstado, notas = '') => {
        const confirmado = await showConfirmAlert(
            'Cambiar estado',
            `¿Cambiar estado a "${ESTADOS_CITA.find(e => e.value === nuevoEstado)?.label}"?`
        );
        if (!confirmado) return;

        setActionLoading(id);
        try {
            await actualizarEstadoCita(id, { estado: nuevoEstado, notasAdmin: notas || undefined });
            showSuccessAlert('Actualizado', 'Estado de la cita actualizado.');
            setCitaDetalle(null);
            fetchCitas();
        } catch {
            showErrorAlert('Error', 'No se pudo actualizar el estado.');
        } finally {
            setActionLoading(null);
        }
    };

    const citasFiltradas = citas.filter((c) => {
        if (!busqueda) return true;
        const b = busqueda.toLowerCase();
        const nombre = c.usuario ? `${c.usuario.primerNombre} ${c.usuario.apellidoPaterno}`.toLowerCase() : '';
        const email = c.usuario?.email?.toLowerCase() || '';
        return nombre.includes(b) || email.includes(b) || c.telefono?.includes(b) || String(c.id).includes(b);
    });

    const getEstadoColor = (estado) => {
        return ESTADOS_CITA.find(e => e.value === estado)?.color || '#6B7280';
    };

    return (
        <div className="admin-citas">
            <div className="admin-section-header">
                <h2><FaCalendarAlt /> Gestión de Citas</h2>
                <button className="btn-refresh" onClick={fetchCitas} disabled={loading}>
                    <FaSync className={loading ? 'spinning' : ''} /> Actualizar
                </button>
            </div>

            {/* Filtros */}
            <div className="admin-citas-filtros">
                <div className="filtro-grupo">
                    <FaFilter />
                    {ESTADOS_CITA.map((e) => (
                        <button
                            key={e.value}
                            className={`filtro-btn ${filtroEstado === e.value ? 'active' : ''}`}
                            onClick={() => setFiltroEstado(e.value)}
                            style={filtroEstado === e.value && e.color ? { background: e.color, color: '#fff' } : {}}
                        >
                            {e.label}
                        </button>
                    ))}
                </div>
                <div className="filtro-busqueda">
                    <FaSearch />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, email o teléfono..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>
            </div>

            {/* Estadísticas rápidas */}
            <div className="admin-citas-stats">
                <div className="stat-card">
                    <span className="stat-num">{citas.filter(c => c.estado === 'pendiente').length}</span>
                    <span className="stat-label">Pendientes</span>
                </div>
                <div className="stat-card">
                    <span className="stat-num">{citas.filter(c => c.estado === 'confirmada').length}</span>
                    <span className="stat-label">Confirmadas</span>
                </div>
                <div className="stat-card">
                    <span className="stat-num">{citas.filter(c => c.estado === 'completada').length}</span>
                    <span className="stat-label">Completadas</span>
                </div>
                <div className="stat-card">
                    <span className="stat-num">{citas.length}</span>
                    <span className="stat-label">Total</span>
                </div>
            </div>

            {/* Tabla */}
            {loading ? (
                <div className="admin-loading"><FaSpinner className="spinning" /> Cargando citas...</div>
            ) : citasFiltradas.length === 0 ? (
                <div className="admin-empty">No hay citas para mostrar.</div>
            ) : (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Cliente</th>
                                <th>Servicio</th>
                                <th>Fecha</th>
                                <th>Hora</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {citasFiltradas.map((cita) => (
                                <tr key={cita.id}>
                                    <td>{cita.id}</td>
                                    <td>
                                        <div className="cita-cliente">
                                            <FaUser />
                                            <div>
                                                <span className="nombre">
                                                    {cita.usuario ? `${cita.usuario.primerNombre} ${cita.usuario.apellidoPaterno}` : 'N/A'}
                                                </span>
                                                <span className="email">{cita.usuario?.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{SERVICIOS_LABEL[cita.tipoServicio] || cita.tipoServicio}</td>
                                    <td>{cita.fecha}</td>
                                    <td>{String(cita.hora).substring(0, 5)}</td>
                                    <td>
                                        <span
                                            className="estado-badge"
                                            style={{ background: getEstadoColor(cita.estado) + '20', color: getEstadoColor(cita.estado) }}
                                        >
                                            {ESTADOS_CITA.find(e => e.value === cita.estado)?.label || cita.estado}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="cita-acciones">
                                            <button
                                                className="btn-accion btn-ver"
                                                title="Ver detalle"
                                                onClick={() => { setCitaDetalle(cita); setNotasAdmin(cita.notasAdmin || ''); }}
                                            >
                                                <FaEye />
                                            </button>
                                            {cita.estado === 'pendiente' && (
                                                <>
                                                    <button
                                                        className="btn-accion btn-confirmar"
                                                        title="Confirmar"
                                                        disabled={actionLoading === cita.id}
                                                        onClick={() => handleCambiarEstado(cita.id, 'confirmada')}
                                                    >
                                                        {actionLoading === cita.id ? <FaSpinner className="spinning" /> : <FaCheck />}
                                                    </button>
                                                    <button
                                                        className="btn-accion btn-cancelar"
                                                        title="Cancelar"
                                                        disabled={actionLoading === cita.id}
                                                        onClick={() => handleCambiarEstado(cita.id, 'cancelada')}
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                </>
                                            )}
                                            {cita.estado === 'confirmada' && (
                                                <>
                                                    <button
                                                        className="btn-accion btn-completar"
                                                        title="Completar"
                                                        disabled={actionLoading === cita.id}
                                                        onClick={() => handleCambiarEstado(cita.id, 'completada')}
                                                    >
                                                        <FaCheckCircle />
                                                    </button>
                                                    <button
                                                        className="btn-accion btn-noasistio"
                                                        title="No asistió"
                                                        disabled={actionLoading === cita.id}
                                                        onClick={() => handleCambiarEstado(cita.id, 'no_asistio')}
                                                    >
                                                        <FaBan />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal detalle */}
            {citaDetalle && (
                <div className="cita-modal-overlay" onClick={() => setCitaDetalle(null)}>
                    <div className="cita-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="cita-modal-header">
                            <h3>Cita #{citaDetalle.id}</h3>
                            <button onClick={() => setCitaDetalle(null)}><FaTimes /></button>
                        </div>
                        <div className="cita-modal-body">
                            <div className="detalle-row">
                                <FaUser /> <strong>Cliente:</strong>
                                {citaDetalle.usuario ? `${citaDetalle.usuario.primerNombre} ${citaDetalle.usuario.apellidoPaterno}` : 'N/A'}
                            </div>
                            <div className="detalle-row">
                                <FaCalendarAlt /> <strong>Servicio:</strong>
                                {SERVICIOS_LABEL[citaDetalle.tipoServicio] || citaDetalle.tipoServicio}
                            </div>
                            <div className="detalle-row">
                                <FaClock /> <strong>Fecha/Hora:</strong>
                                {citaDetalle.fecha} a las {String(citaDetalle.hora).substring(0, 5)}
                            </div>
                            <div className="detalle-row">
                                <FaPhone /> <strong>Teléfono:</strong> {citaDetalle.telefono}
                            </div>
                            {citaDetalle.notas && (
                                <div className="detalle-row">
                                    <FaStickyNote /> <strong>Notas cliente:</strong> {citaDetalle.notas}
                                </div>
                            )}
                            <div className="detalle-row">
                                <span className="estado-badge" style={{ background: getEstadoColor(citaDetalle.estado) + '20', color: getEstadoColor(citaDetalle.estado) }}>
                                    {ESTADOS_CITA.find(e => e.value === citaDetalle.estado)?.label || citaDetalle.estado}
                                </span>
                            </div>

                            <div className="detalle-notas-admin">
                                <label><FaStickyNote /> Notas del admin:</label>
                                <textarea
                                    value={notasAdmin}
                                    onChange={(e) => setNotasAdmin(e.target.value)}
                                    placeholder="Agregar notas internas..."
                                    rows={3}
                                />
                            </div>

                            {['pendiente', 'confirmada'].includes(citaDetalle.estado) && (
                                <div className="detalle-acciones">
                                    {citaDetalle.estado === 'pendiente' && (
                                        <button className="btn-primary" onClick={() => handleCambiarEstado(citaDetalle.id, 'confirmada', notasAdmin)}>
                                            <FaCheck /> Confirmar
                                        </button>
                                    )}
                                    {citaDetalle.estado === 'confirmada' && (
                                        <button className="btn-primary btn-success" onClick={() => handleCambiarEstado(citaDetalle.id, 'completada', notasAdmin)}>
                                            <FaCheckCircle /> Completar
                                        </button>
                                    )}
                                    <button className="btn-danger" onClick={() => handleCambiarEstado(citaDetalle.id, 'cancelada', notasAdmin)}>
                                        <FaTimesCircle /> Cancelar
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCitas;

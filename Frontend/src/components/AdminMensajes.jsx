import { useState, useEffect, useCallback } from 'react';
import {
    FaEnvelope, FaFilter, FaTrash, FaSpinner,
    FaSync, FaSearch, FaEye, FaEyeSlash, FaReply,
    FaTimes, FaPhone, FaUser, FaClock, FaCheck
} from 'react-icons/fa';
import { getAllMensajes, marcarMensajeLeido, marcarMensajeRespondido, eliminarMensaje } from '@services/contacto.service';
import { showSuccessAlert, showErrorAlert, showConfirmAlert } from '@helpers/sweetAlert';
import '@styles/adminMensajes.css';

const FILTROS_ESTADO = [
    { value: '', label: 'Todos' },
    { value: 'no_leidos', label: 'No leídos' },
    { value: 'leidos', label: 'Leídos' },
    { value: 'respondidos', label: 'Respondidos' },
];

const AdminMensajes = () => {
    const [mensajes, setMensajes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState('');
    const [busqueda, setBusqueda] = useState('');
    const [actionLoading, setActionLoading] = useState(null);
    const [mensajeDetalle, setMensajeDetalle] = useState(null);

    const fetchMensajes = useCallback(async () => {
        setLoading(true);
        try {
            const filtros = {};
            if (filtro === 'no_leidos') filtros.leido = 'false';
            if (filtro === 'leidos') filtros.leido = 'true';
            if (filtro === 'respondidos') filtros.respondido = 'true';
            const data = await getAllMensajes(filtros);
            setMensajes(data);
        } catch {
            showErrorAlert('Error', 'No se pudieron cargar los mensajes.');
        } finally {
            setLoading(false);
        }
    }, [filtro]);

    useEffect(() => {
        fetchMensajes();
    }, [fetchMensajes]);

    const handleMarcarLeido = async (id) => {
        setActionLoading(id);
        try {
            await marcarMensajeLeido(id);
            fetchMensajes();
        } catch {
            showErrorAlert('Error', 'No se pudo marcar como leído.');
        } finally {
            setActionLoading(null);
        }
    };

    const handleMarcarRespondido = async (id) => {
        setActionLoading(id);
        try {
            await marcarMensajeRespondido(id);
            showSuccessAlert('Respondido', 'Mensaje marcado como respondido.');
            setMensajeDetalle(null);
            fetchMensajes();
        } catch {
            showErrorAlert('Error', 'No se pudo marcar como respondido.');
        } finally {
            setActionLoading(null);
        }
    };

    const handleEliminar = async (id) => {
        const confirmado = await showConfirmAlert('Eliminar mensaje', '¿Estás seguro de eliminar este mensaje?');
        if (!confirmado) return;
        setActionLoading(id);
        try {
            await eliminarMensaje(id);
            showSuccessAlert('Eliminado', 'Mensaje eliminado correctamente.');
            setMensajeDetalle(null);
            fetchMensajes();
        } catch {
            showErrorAlert('Error', 'No se pudo eliminar el mensaje.');
        } finally {
            setActionLoading(null);
        }
    };

    const handleVerDetalle = async (msg) => {
        setMensajeDetalle(msg);
        if (!msg.leido) {
            await marcarMensajeLeido(msg.id);
            fetchMensajes();
        }
    };

    const mensajesFiltrados = mensajes.filter((m) => {
        if (!busqueda) return true;
        const b = busqueda.toLowerCase();
        return m.nombre?.toLowerCase().includes(b) || m.email?.toLowerCase().includes(b) ||
               m.asunto?.toLowerCase().includes(b) || m.mensaje?.toLowerCase().includes(b);
    });

    const noLeidos = mensajes.filter(m => !m.leido).length;

    const formatFecha = (fecha) => {
        if (!fecha) return '';
        const d = new Date(fecha);
        return d.toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="admin-mensajes">
            <div className="admin-section-header">
                <h2>
                    <FaEnvelope /> Mensajes de Contacto
                    {noLeidos > 0 && <span className="badge-count">{noLeidos}</span>}
                </h2>
                <button className="btn-refresh" onClick={fetchMensajes} disabled={loading}>
                    <FaSync className={loading ? 'spinning' : ''} /> Actualizar
                </button>
            </div>

            {/* Filtros */}
            <div className="admin-mensajes-filtros">
                <div className="filtro-grupo">
                    <FaFilter />
                    {FILTROS_ESTADO.map((f) => (
                        <button
                            key={f.value}
                            className={`filtro-btn ${filtro === f.value ? 'active' : ''}`}
                            onClick={() => setFiltro(f.value)}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
                <div className="filtro-busqueda">
                    <FaSearch />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, email, asunto..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>
            </div>

            {/* Lista de mensajes */}
            {loading ? (
                <div className="admin-loading"><FaSpinner className="spinning" /> Cargando mensajes...</div>
            ) : mensajesFiltrados.length === 0 ? (
                <div className="admin-empty">No hay mensajes para mostrar.</div>
            ) : (
                <div className="mensajes-lista">
                    {mensajesFiltrados.map((msg) => (
                        <div
                            key={msg.id}
                            className={`mensaje-card ${!msg.leido ? 'no-leido' : ''} ${msg.respondido ? 'respondido' : ''}`}
                            onClick={() => handleVerDetalle(msg)}
                        >
                            <div className="mensaje-indicadores">
                                {!msg.leido && <span className="punto-nuevo" />}
                                {msg.respondido && <FaCheck className="icono-respondido" title="Respondido" />}
                            </div>
                            <div className="mensaje-info">
                                <div className="mensaje-header-row">
                                    <span className="mensaje-nombre"><FaUser /> {msg.nombre}</span>
                                    <span className="mensaje-fecha"><FaClock /> {formatFecha(msg.createdAt)}</span>
                                </div>
                                <span className="mensaje-email">{msg.email}</span>
                                {msg.asunto && <span className="mensaje-asunto">{msg.asunto}</span>}
                                <p className="mensaje-preview">{msg.mensaje?.substring(0, 120)}{msg.mensaje?.length > 120 ? '...' : ''}</p>
                            </div>
                            <div className="mensaje-acciones" onClick={(e) => e.stopPropagation()}>
                                <button
                                    className="btn-accion btn-eliminar"
                                    title="Eliminar"
                                    disabled={actionLoading === msg.id}
                                    onClick={() => handleEliminar(msg.id)}
                                >
                                    {actionLoading === msg.id ? <FaSpinner className="spinning" /> : <FaTrash />}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal detalle */}
            {mensajeDetalle && (
                <div className="mensaje-modal-overlay" onClick={() => setMensajeDetalle(null)}>
                    <div className="mensaje-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="mensaje-modal-header">
                            <h3>{mensajeDetalle.asunto || 'Mensaje de contacto'}</h3>
                            <button onClick={() => setMensajeDetalle(null)}><FaTimes /></button>
                        </div>
                        <div className="mensaje-modal-body">
                            <div className="detalle-row"><FaUser /> <strong>Nombre:</strong> {mensajeDetalle.nombre}</div>
                            <div className="detalle-row"><FaEnvelope /> <strong>Email:</strong> <a href={`mailto:${mensajeDetalle.email}`}>{mensajeDetalle.email}</a></div>
                            {mensajeDetalle.telefono && (
                                <div className="detalle-row"><FaPhone /> <strong>Teléfono:</strong> {mensajeDetalle.telefono}</div>
                            )}
                            <div className="detalle-row"><FaClock /> <strong>Fecha:</strong> {formatFecha(mensajeDetalle.createdAt)}</div>
                            <div className="mensaje-contenido">
                                <p>{mensajeDetalle.mensaje}</p>
                            </div>
                            <div className="detalle-estados">
                                {mensajeDetalle.leido ? (
                                    <span className="estado-tag leido"><FaEye /> Leído</span>
                                ) : (
                                    <span className="estado-tag no-leido"><FaEyeSlash /> No leído</span>
                                )}
                                {mensajeDetalle.respondido && (
                                    <span className="estado-tag respondido"><FaReply /> Respondido</span>
                                )}
                            </div>
                        </div>
                        <div className="mensaje-modal-footer">
                            <a
                                href={`mailto:${mensajeDetalle.email}?subject=Re: ${mensajeDetalle.asunto || 'Consulta Óptica Danniels'}`}
                                className="btn-primary"
                                onClick={() => handleMarcarRespondido(mensajeDetalle.id)}
                            >
                                <FaReply /> Responder por email
                            </a>
                            {!mensajeDetalle.respondido && (
                                <button className="btn-secondary" onClick={() => handleMarcarRespondido(mensajeDetalle.id)}>
                                    <FaCheck /> Marcar como respondido
                                </button>
                            )}
                            <button className="btn-danger" onClick={() => handleEliminar(mensajeDetalle.id)}>
                                <FaTrash /> Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminMensajes;

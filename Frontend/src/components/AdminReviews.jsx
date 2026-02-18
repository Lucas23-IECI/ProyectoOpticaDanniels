import { useState, useEffect, useCallback } from 'react';
import {
    FaStar, FaFilter, FaTrash, FaCheck, FaTimes, FaSpinner,
    FaSync, FaSearch, FaUser, FaBox
} from 'react-icons/fa';
import { getAllReviews, updateReviewEstado, deleteReviewAdmin } from '@services/review.service';
import { showSuccessAlert, showErrorAlert, showConfirmAlert } from '@helpers/sweetAlert';
import '@styles/adminReviews.css';

const ESTADOS_REVIEW = [
    { value: '', label: 'Todos' },
    { value: 'pendiente', label: 'Pendiente', color: '#FFA500' },
    { value: 'aprobada', label: 'Aprobada', color: '#29A937' },
    { value: 'rechazada', label: 'Rechazada', color: '#FF4444' },
];

const AdminReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtroEstado, setFiltroEstado] = useState('');
    const [busqueda, setBusqueda] = useState('');
    const [actionLoading, setActionLoading] = useState(null);

    const fetchReviews = useCallback(async () => {
        setLoading(true);
        try {
            const filtros = {};
            if (filtroEstado) filtros.estado = filtroEstado;
            const data = await getAllReviews(filtros);
            setReviews(data);
        } catch {
            showErrorAlert('Error', 'No se pudieron cargar las reseñas.');
        } finally {
            setLoading(false);
        }
    }, [filtroEstado]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const handleAprobar = async (id) => {
        setActionLoading(id);
        try {
            await updateReviewEstado(id, 'aprobada');
            showSuccessAlert('Aprobada', 'La reseña fue aprobada exitosamente.');
            fetchReviews();
        } catch {
            showErrorAlert('Error', 'No se pudo aprobar la reseña.');
        } finally {
            setActionLoading(null);
        }
    };

    const handleRechazar = async (id) => {
        setActionLoading(id);
        try {
            await updateReviewEstado(id, 'rechazada');
            showSuccessAlert('Rechazada', 'La reseña fue rechazada.');
            fetchReviews();
        } catch {
            showErrorAlert('Error', 'No se pudo rechazar la reseña.');
        } finally {
            setActionLoading(null);
        }
    };

    const handleEliminar = async (id) => {
        const result = await showConfirmAlert(
            '¿Eliminar reseña?',
            'Esta acción no se puede deshacer.',
            'Sí, eliminar'
        );
        if (!result.isConfirmed) return;
        setActionLoading(id);
        try {
            await deleteReviewAdmin(id);
            showSuccessAlert('Eliminada', 'La reseña fue eliminada.');
            fetchReviews();
        } catch {
            showErrorAlert('Error', 'No se pudo eliminar la reseña.');
        } finally {
            setActionLoading(null);
        }
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <FaStar key={i} className={i < rating ? 'star-filled' : 'star-empty'} />
        ));
    };

    const getEstadoBadge = (estado) => {
        const config = ESTADOS_REVIEW.find((e) => e.value === estado);
        return (
            <span
                className="review-estado-badge"
                style={{ backgroundColor: config?.color || '#6c757d' }}
            >
                {estado}
            </span>
        );
    };

    const filteredReviews = reviews.filter((r) => {
        if (!busqueda) return true;
        const term = busqueda.toLowerCase();
        const userName = `${r.usuario?.primerNombre || ''} ${r.usuario?.apellidoPaterno || ''}`.toLowerCase();
        const productoName = r.producto?.nombre?.toLowerCase() || '';
        const comentario = r.comentario?.toLowerCase() || '';
        return userName.includes(term) || productoName.includes(term) || comentario.includes(term);
    });

    const pendingCount = reviews.filter((r) => r.estado === 'pendiente').length;

    return (
        <div className="admin-reviews">
            <div className="admin-reviews-header">
                <div className="admin-reviews-title">
                    <h2><FaStar /> Gestión de Reseñas</h2>
                    {pendingCount > 0 && (
                        <span className="pending-badge">{pendingCount} pendiente{pendingCount !== 1 ? 's' : ''}</span>
                    )}
                </div>
                <button className="btn-refresh" onClick={fetchReviews} disabled={loading}>
                    <FaSync className={loading ? 'spin' : ''} /> Actualizar
                </button>
            </div>

            {/* Filtros */}
            <div className="admin-reviews-filters">
                <div className="filter-group">
                    <FaFilter />
                    {ESTADOS_REVIEW.map((e) => (
                        <button
                            key={e.value}
                            className={`filter-btn ${filtroEstado === e.value ? 'active' : ''}`}
                            onClick={() => setFiltroEstado(e.value)}
                        >
                            {e.label}
                        </button>
                    ))}
                </div>
                <div className="search-box">
                    <FaSearch />
                    <input
                        type="text"
                        placeholder="Buscar por usuario, producto o comentario..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>
            </div>

            {/* Tabla */}
            {loading ? (
                <div className="admin-reviews-loading">
                    <FaSpinner className="spin" /> Cargando reseñas...
                </div>
            ) : filteredReviews.length === 0 ? (
                <div className="admin-reviews-empty">
                    No se encontraron reseñas{filtroEstado ? ` con estado "${filtroEstado}"` : ''}.
                </div>
            ) : (
                <div className="admin-reviews-table-wrap">
                    <table className="admin-reviews-table">
                        <thead>
                            <tr>
                                <th>Usuario</th>
                                <th>Producto</th>
                                <th>Rating</th>
                                <th>Comentario</th>
                                <th>Estado</th>
                                <th>Fecha</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReviews.map((review) => (
                                <tr key={review.id}>
                                    <td className="cell-user">
                                        <FaUser className="cell-icon" />
                                        <span>{review.usuario?.primerNombre} {review.usuario?.apellidoPaterno}</span>
                                    </td>
                                    <td className="cell-producto">
                                        <FaBox className="cell-icon" />
                                        <span title={review.producto?.nombre}>
                                            {review.producto?.nombre?.length > 30
                                                ? review.producto.nombre.slice(0, 30) + '...'
                                                : review.producto?.nombre}
                                        </span>
                                    </td>
                                    <td className="cell-rating">
                                        <div className="cell-stars">{renderStars(review.rating)}</div>
                                    </td>
                                    <td className="cell-comment">
                                        {review.comentario
                                            ? review.comentario.length > 80
                                                ? review.comentario.slice(0, 80) + '...'
                                                : review.comentario
                                            : <em className="no-comment">Sin comentario</em>}
                                    </td>
                                    <td>{getEstadoBadge(review.estado)}</td>
                                    <td className="cell-date">
                                        {new Date(review.createdAt).toLocaleDateString('es-CL', {
                                            day: '2-digit', month: 'short', year: 'numeric'
                                        })}
                                    </td>
                                    <td className="cell-actions">
                                        {actionLoading === review.id ? (
                                            <FaSpinner className="spin" />
                                        ) : (
                                            <>
                                                {review.estado !== 'aprobada' && (
                                                    <button
                                                        className="action-btn approve"
                                                        title="Aprobar"
                                                        onClick={() => handleAprobar(review.id)}
                                                    >
                                                        <FaCheck />
                                                    </button>
                                                )}
                                                {review.estado !== 'rechazada' && (
                                                    <button
                                                        className="action-btn reject"
                                                        title="Rechazar"
                                                        onClick={() => handleRechazar(review.id)}
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                )}
                                                <button
                                                    className="action-btn delete"
                                                    title="Eliminar"
                                                    onClick={() => handleEliminar(review.id)}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminReviews;

import { FaTimes, FaExclamationTriangle, FaUser } from 'react-icons/fa';
import useDeleteUser from '@hooks/users/useDeleteUser';
import { getNombreCompleto } from '@helpers/nameHelpers';
import '@styles/popup.css';

const ConfirmarEliminarUsuarioPopup = ({ show, setShow, usuario, onConfirm }) => {
    const { handleDeleteUser, loading } = useDeleteUser();

    const handleConfirmarEliminar = async () => {
        if (!usuario) return;

        const query = { id: usuario.id };
        const result = await handleDeleteUser(query);
        
        if (result.success) {
            onConfirm();
        }
    };

    const handleClose = () => {
        setShow(false);
    };

    if (!show || !usuario) return null;

    // No permitir eliminar administradores
    if (usuario.rol === 'administrador') {
        return (
            <div className="popup-overlay" onClick={handleClose}>
                <div className="popup-content confirmar-eliminar-popup" onClick={(e) => e.stopPropagation()}>
                    <div className="popup-header">
                        <h2>
                            <FaExclamationTriangle className="header-icon warning" />
                            No se puede eliminar
                        </h2>
                        <button 
                            className="popup-close"
                            onClick={handleClose}
                        >
                            <FaTimes />
                        </button>
                    </div>

                    <div className="popup-body">
                        <div className="warning-content">
                            <FaUser className="user-icon large" />
                            <p className="warning-message">
                                No se puede eliminar a <strong>{getNombreCompleto(usuario)}</strong> 
                                porque tiene rol de administrador.
                            </p>
                            <p className="warning-submessage">
                                Los usuarios con rol de administrador no pueden ser eliminados por seguridad.
                            </p>
                        </div>
                    </div>

                    <div className="popup-actions">
                        <button 
                            type="button" 
                            className="btn btn-primary"
                            onClick={handleClose}
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="popup-overlay" onClick={handleClose}>
            <div className="popup-content confirmar-eliminar-popup" onClick={(e) => e.stopPropagation()}>
                <div className="popup-header">
                    <h2>
                        <FaExclamationTriangle className="header-icon warning" />
                        Confirmar Eliminación
                    </h2>
                    <button 
                        className="popup-close"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        <FaTimes />
                    </button>
                </div>

                <div className="popup-body">
                    <div className="confirm-content">
                        <FaUser className="user-icon large" />
                        <p className="confirm-message">
                            ¿Estás seguro de que quieres eliminar al usuario?
                        </p>
                        
                        <div className="usuario-info-eliminar">
                            <h3>{getNombreCompleto(usuario)}</h3>
                            <div className="usuario-details">
                                <p><strong>Email:</strong> {usuario.email}</p>
                                <p><strong>RUT:</strong> {usuario.rut}</p>
                                <p><strong>Rol:</strong> {usuario.rol}</p>
                                {usuario.telefono && (
                                    <p><strong>Teléfono:</strong> {usuario.telefono}</p>
                                )}
                            </div>
                        </div>
                        
                        <p className="warning-submessage">
                            <strong>⚠️ Esta acción no se puede deshacer.</strong>
                        </p>
                        <p className="warning-details">
                            Se eliminarán todos los datos asociados al usuario, incluyendo:
                        </p>
                        <ul className="warning-list">
                            <li>Información personal</li>
                            <li>Direcciones registradas</li>
                            <li>Historial de acceso</li>
                        </ul>
                    </div>
                </div>

                <div className="popup-actions">
                    <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button 
                        type="button" 
                        className="btn btn-danger"
                        onClick={handleConfirmarEliminar}
                        disabled={loading}
                    >
                        {loading ? 'Eliminando...' : 'Eliminar Usuario'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmarEliminarUsuarioPopup;
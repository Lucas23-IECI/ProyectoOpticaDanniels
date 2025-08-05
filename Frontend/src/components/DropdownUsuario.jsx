import { useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { getNombreCorto } from '@helpers/nameHelpers';
import { showSuccessAlert } from '@helpers/sweetAlert';
import '@styles/dropdownUsuario.css';

function DropdownUsuario({ onClose }) {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        showSuccessAlert("¡Hasta luego!", "Sesión cerrada correctamente.");
        
        if (onClose) onClose();
        
        setTimeout(() => {
            logout();
        }, 1000);
    };

    return (
        <div className="dropdown-usuario">
            <p className="usuario-saludo">
                {user?.rol === 'administrador' ? '👑' : '👤'} {getNombreCorto(user) || 'Usuario'}
                {user?.rol === 'administrador' && <span className="admin-badge">Admin</span>}
            </p>
            <button onClick={() => { navigate('/perfil'); if (onClose) onClose(); }}>
                Mi perfil
            </button>
            <button onClick={() => { navigate('/favoritos'); onClose(); }}>
                Mis favoritos
            </button>
            {user?.rol === 'administrador' && (
                <button 
                    onClick={() => { navigate('/admin'); onClose(); }}
                >
                    Panel de Administración
                </button>
            )}
            <button onClick={() => { navigate('/mis-compras'); onClose(); }}>
                Mis compras
            </button>
            <button onClick={handleLogout}>
                Cerrar sesión
            </button>
        </div>
    );
}

export default DropdownUsuario;

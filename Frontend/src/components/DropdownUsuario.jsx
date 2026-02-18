import { useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { getNombreCorto } from '@helpers/nameHelpers';
import { showSuccessAlert } from '@helpers/sweetAlert';
import { FaUser, FaHeart, FaShieldAlt, FaShoppingBag, FaSignOutAlt } from 'react-icons/fa';
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

    const goTo = (path) => {
        navigate(path);
        if (onClose) onClose();
    };

    return (
        <div className="dropdown-usuario">
            <p className="usuario-saludo">
                {user?.rol === 'administrador' ? '👑' : '👤'} {getNombreCorto(user) || 'Usuario'}
                {user?.rol === 'administrador' && <span className="admin-badge">Admin</span>}
            </p>

            <button onClick={() => goTo('/perfil')}>
                <span className="dropdown-icon"><FaUser /></span>
                Mi perfil
            </button>

            <button onClick={() => goTo('/favoritos')}>
                <span className="dropdown-icon"><FaHeart /></span>
                Mis favoritos
            </button>

            <button onClick={() => goTo('/mis-compras')}>
                <span className="dropdown-icon"><FaShoppingBag /></span>
                Mis compras
            </button>

            {user?.rol === 'administrador' && (
                <>
                    <div className="dropdown-separator" />
                    <button className="admin-button" onClick={() => goTo('/admin')}>
                        <span className="dropdown-icon"><FaShieldAlt /></span>
                        Panel de Administración
                    </button>
                </>
            )}

            <div className="dropdown-separator" />
            
            <button className="logout-button" onClick={handleLogout}>
                <span className="dropdown-icon"><FaSignOutAlt /></span>
                Cerrar sesión
            </button>
        </div>
    );
}

export default DropdownUsuario;

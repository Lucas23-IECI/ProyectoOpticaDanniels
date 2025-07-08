import { useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { logout } from '@services/auth.service';
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert';
import { clearTokenCache } from '@helpers/jwt.helper';
import '@styles/dropdownUsuario.css';

function DropdownUsuario({ onClose }) {
    const { setUser, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            clearTokenCache();
            
            setUser(null);
            
            showSuccessAlert("¡Hasta luego!", "Sesión cerrada correctamente.");
            
            if (onClose) onClose();
            
            navigate('/');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            clearTokenCache(); 
            setUser(null);
            
            showErrorAlert("Error", "Hubo un problema al cerrar sesión, pero tu sesión local ha sido limpiada.");
            
            if (onClose) onClose();
            navigate('/');
        }
    };

    return (
        <div className="dropdown-usuario">
            <p className="usuario-saludo">
                {user?.rol === 'administrador' ? '👑' : '👤'} {user?.nombreCompleto?.split(' ')[0] || 'Usuario'}
                {user?.rol === 'administrador' && <span className="admin-badge">Admin</span>}
            </p>
            <button onClick={() => { navigate('/perfil'); onClose(); }}>
                Mi perfil
            </button>
            {user?.rol === 'administrador' && (
                <button 
                    className="admin-button" 
                    onClick={() => { navigate('/admin'); onClose(); }}
                >
                    🛡️ Panel de Admin
                </button>
            )}
            <button onClick={() => { navigate('/mis-compras'); onClose(); }}>
                Mis compras
            </button>
            <button onClick={() => { navigate('/mis-datos'); onClose(); }}>
                Datos personales
            </button>
            <button onClick={handleLogout}>
                Cerrar sesión
            </button>
        </div>
    );
}

export default DropdownUsuario;

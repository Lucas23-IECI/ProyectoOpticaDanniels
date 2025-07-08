import { useAuth } from "@context/AuthContext";
import "@styles/perfil.css";

const Perfil = () => {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return (
            <div className="perfil-container">
                <h1>Acceso Denegado</h1>
                <p>Debes iniciar sesión para ver tu perfil</p>
            </div>
        );
    }

    return (
        <div className="perfil-container">
            <h1>Mi Perfil</h1>
            <div className="perfil-info">
                <div className="info-item">
                    <strong>Nombre:</strong> {user?.nombreCompleto}
                </div>
                <div className="info-item">
                    <strong>Email:</strong> {user?.email}
                </div>
                <div className="info-item">
                    <strong>RUT:</strong> {user?.rut}
                </div>
                <div className="info-item role-badge">
                    <strong>Rol:</strong> 
                    <span className={`role ${user?.rol}`}>
                        {user?.rol === 'administrador' ? '👑 Administrador' : '👤 Usuario'}
                    </span>
                </div>
                
                {user?.rol === 'administrador' && (
                    <div className="admin-notice">
                        🎉 ¡Tienes permisos de administrador!
                    </div>
                )}
            </div>
        </div>
    );
};

export default Perfil;

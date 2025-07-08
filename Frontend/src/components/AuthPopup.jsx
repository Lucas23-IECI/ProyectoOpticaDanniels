import { useNavigate } from 'react-router-dom';
import '@styles/authPopup.css';

function AuthPopup({ onClose }) {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login');
        onClose();
    };

    const handleRegister = () => {
        navigate('/register');
        onClose();
    };

    const handleInvitado = () => {
        onClose();
    };

    return (
        <div className="popup-auth">
            <button onClick={handleLogin}>Iniciar sesión</button>
            <button onClick={handleRegister}>Crear cuenta</button>
            <button onClick={handleInvitado}>Continuar como invitado</button>
        </div>
    );
}

export default AuthPopup;

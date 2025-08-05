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
            <button onClick={handleLogin}>Ingresar</button>
            <button onClick={handleRegister}>Registrarse</button>
            <button onClick={handleInvitado}>Invitado</button>
        </div>
    );
}

export default AuthPopup;

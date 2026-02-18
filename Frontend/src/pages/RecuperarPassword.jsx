import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaEnvelope, FaLock, FaArrowLeft, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { forgotPassword, resetPassword } from '@services/auth.service';
import '@styles/recuperarPassword.css';

const RecuperarPassword = () => {
    const [searchParams] = useSearchParams();
    const tokenFromUrl = searchParams.get('token');

    const [step, setStep] = useState(tokenFromUrl ? 'reset' : 'request');
    const [email, setEmail] = useState('');
    const [token, setToken] = useState(tokenFromUrl || '');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!email.trim()) {
            setError('Ingresa tu correo electrónico.');
            return;
        }

        setLoading(true);
        try {
            const response = await forgotPassword(email);
            setMessage(response.message || 'Si el correo existe, recibirás un enlace de recuperación.');
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al procesar la solicitud.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!token.trim()) {
            setError('El token de recuperación es requerido.');
            return;
        }

        if (newPassword.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        setLoading(true);
        try {
            const response = await resetPassword(token, newPassword);
            setMessage(response.message || 'Contraseña actualizada correctamente.');
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al restablecer la contraseña.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="recuperar-container">
            <div className="recuperar-card">
                <Link to="/login" className="back-link">
                    <FaArrowLeft />
                    Volver al inicio de sesión
                </Link>

                {step === 'request' && !success && (
                    <>
                        <div className="recuperar-header">
                            <FaEnvelope className="header-icon" />
                            <h1>Recuperar contraseña</h1>
                            <p>Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.</p>
                        </div>

                        <form onSubmit={handleForgotPassword} className="recuperar-form">
                            <div className="form-group">
                                <label htmlFor="email">Correo electrónico</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="tu@correo.com"
                                    disabled={loading}
                                    autoFocus
                                />
                            </div>

                            {error && (
                                <div className="alert alert-error">
                                    <FaExclamationCircle />
                                    {error}
                                </div>
                            )}

                            <button type="submit" className="btn-primary" disabled={loading}>
                                {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
                            </button>
                        </form>

                        <div className="recuperar-footer">
                            <p>¿Ya tienes el token? <button type="button" className="link-btn" onClick={() => setStep('reset')}>Ingresa tu nueva contraseña</button></p>
                        </div>
                    </>
                )}

                {step === 'request' && success && (
                    <div className="recuperar-success">
                        <FaCheckCircle className="success-icon" />
                        <h2>Enlace enviado</h2>
                        <p>{message}</p>
                        <p className="info-text">Revisa la consola del backend para obtener el token de recuperación (modo desarrollo).</p>
                        <button type="button" className="btn-secondary" onClick={() => { setStep('reset'); setSuccess(false); }}>
                            Tengo mi token
                        </button>
                    </div>
                )}

                {step === 'reset' && !success && (
                    <>
                        <div className="recuperar-header">
                            <FaLock className="header-icon" />
                            <h1>Nueva contraseña</h1>
                            <p>Ingresa el token de recuperación y tu nueva contraseña.</p>
                        </div>

                        <form onSubmit={handleResetPassword} className="recuperar-form">
                            <div className="form-group">
                                <label htmlFor="token">Token de recuperación</label>
                                <input
                                    id="token"
                                    type="text"
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                    placeholder="Pega tu token aquí"
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="newPassword">Nueva contraseña</label>
                                <input
                                    id="newPassword"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Mínimo 6 caracteres"
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirmar contraseña</label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Repite tu nueva contraseña"
                                    disabled={loading}
                                />
                            </div>

                            {error && (
                                <div className="alert alert-error">
                                    <FaExclamationCircle />
                                    {error}
                                </div>
                            )}

                            <button type="submit" className="btn-primary" disabled={loading}>
                                {loading ? 'Actualizando...' : 'Restablecer contraseña'}
                            </button>
                        </form>

                        <div className="recuperar-footer">
                            <p>¿No tienes token? <button type="button" className="link-btn" onClick={() => setStep('request')}>Solicita uno aquí</button></p>
                        </div>
                    </>
                )}

                {step === 'reset' && success && (
                    <div className="recuperar-success">
                        <FaCheckCircle className="success-icon" />
                        <h2>Contraseña actualizada</h2>
                        <p>{message}</p>
                        <Link to="/login" className="btn-primary">
                            Iniciar sesión
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecuperarPassword;

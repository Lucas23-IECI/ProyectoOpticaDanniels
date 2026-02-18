import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { login } from "@services/auth.service";
import { decodeToken } from "@helpers/jwt.helper";
import { useAuth } from "@context/AuthContext";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSignInAlt, FaExclamationCircle } from "react-icons/fa";
import "@styles/login.css";
import "@styles/alerts.css";

const Login = () => {
    const { refreshUser } = useAuth();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    // Auto-clear field errors after 3 seconds
    useEffect(() => {
        Object.keys(fieldErrors).forEach(field => {
            if (fieldErrors[field]) {
                const timer = setTimeout(() => {
                    setFieldErrors(prev => ({
                        ...prev,
                        [field]: null
                    }));
                }, 3000);
                return () => clearTimeout(timer);
            }
        });
    }, [fieldErrors]);

    const showFieldError = (field, message) => {
        setFieldErrors(prev => ({
            ...prev,
            [field]: message
        }));
    };

    const clearFieldError = (field) => {
        setFieldErrors(prev => ({
            ...prev,
            [field]: null
        }));
    };

    const parseBackendError = (errorMessage) => {
        // Mapeo de errores específicos a campos con mensajes más detallados
        if (errorMessage.includes("email") || errorMessage.includes("correo")) {
            if (errorMessage.includes("not found") || errorMessage.includes("no encontrado") || errorMessage.includes("no existe")) {
                return { field: "email", message: "❌ Este email no está registrado en el sistema" };
            }
            if (errorMessage.includes("dominio") || errorMessage.includes("domain") || errorMessage.includes(".cl") || errorMessage.includes(".com")) {
                return { field: "email", message: "Email debe terminar en .cl o .com" };
            }
            if (errorMessage.includes("invalid") || errorMessage.includes("inválido") || errorMessage.includes("format")) {
                return { field: "email", message: "Formato de email inválido" };
            }
            if (errorMessage.includes("min") || errorMessage.includes("caracteres")) {
                return { field: "email", message: "Email debe tener entre 5-100 caracteres" };
            }
            return { field: "email", message: "Email inválido - verifica el formato" };
        }

        if (errorMessage.includes("password") || errorMessage.includes("contraseña")) {
            if (errorMessage.includes("incorrect") || errorMessage.includes("incorrecta") || errorMessage.includes("wrong")) {
                return { field: "password", message: "❌ Contraseña incorrecta - verifica que sea la correcta" };
            }
            if (errorMessage.includes("invalid") || errorMessage.includes("inválida") || errorMessage.includes("format")) {
                return { field: "password", message: "Contraseña inválida - revisa el formato" };
            }
            if (errorMessage.includes("min") || errorMessage.includes("caracteres")) {
                return { field: "password", message: "Contraseña debe tener entre 6-50 caracteres" };
            }
            return { field: "password", message: "Contraseña inválida" };
        }

        if (errorMessage.includes("credentials") || errorMessage.includes("credenciales")) {
            return { field: "general", message: "❌ Email o contraseña incorrectos - verifica tus datos" };
        }

        if (errorMessage.includes("user") || errorMessage.includes("usuario")) {
            if (errorMessage.includes("not found") || errorMessage.includes("no encontrado")) {
                return { field: "email", message: "❌ No existe una cuenta con este email" };
            }
            if (errorMessage.includes("disabled") || errorMessage.includes("deshabilitado")) {
                return { field: "general", message: "⚠️ Tu cuenta está deshabilitada - contacta soporte" };
            }
            if (errorMessage.includes("suspended") || errorMessage.includes("suspendido")) {
                return { field: "general", message: "⚠️ Tu cuenta está suspendida temporalmente" };
            }
        }

        if (errorMessage.includes("attempt") || errorMessage.includes("intento")) {
            return { field: "general", message: "⚠️ Demasiados intentos fallidos - espera unos minutos" };
        }

        return { field: "general", message: "Error en el inicio de sesión - revisa tus datos" };
    };

    const validateFieldRealTime = (name, value) => {
        // Validaciones en tiempo real — alineadas con backend Joi (auth.validation.js)
        switch (name) {
            case 'email':
                if (value.length > 0) {
                    if (value.length < 5) {
                        return "Email debe tener al menos 5 caracteres";
                    }
                    if (value.length > 100) {
                        return "Email no puede tener más de 100 caracteres";
                    }
                    if (!value.includes('@')) {
                        return "Email debe contener @";
                    }
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                        return "Formato de email inválido";
                    }
                }
                break;

            case 'password':
                if (value.length > 0) {
                    if (value.length < 6) {
                        return "Contraseña debe tener al menos 6 caracteres";
                    }
                    if (value.length > 50) {
                        return "Contraseña no puede tener más de 50 caracteres";
                    }
                }
                break;
        }
        return null;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error when user starts typing
        if (fieldErrors[name]) {
            clearFieldError(name);
        }

        // Validación en tiempo real con debounce
        setTimeout(() => {
            const realtimeError = validateFieldRealTime(name, value);
            if (realtimeError) {
                showFieldError(name, realtimeError);
            }
        }, 600); // Espera 600ms después de que el usuario deje de escribir
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = "El email es obligatorio";
        } else if (formData.email.trim().length < 5) {
            newErrors.email = "Email debe tener al menos 5 caracteres";
        } else if (formData.email.trim().length > 100) {
            newErrors.email = "Email no puede tener más de 100 caracteres";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Formato de email inválido";
        }

        if (!formData.password.trim()) {
            newErrors.password = "La contraseña es obligatoria";
        } else if (formData.password.length < 6) {
            newErrors.password = "Contraseña debe tener al menos 6 caracteres";
        } else if (formData.password.length > 50) {
            newErrors.password = "Contraseña no puede tener más de 50 caracteres";
        }

        setFieldErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const response = await login(formData);

            if (response.status === "Success") {
                localStorage.setItem('token', response.data.token);
                const userDecoded = await decodeToken(response.data.token);
                if (userDecoded) {
                    localStorage.setItem('user', JSON.stringify(userDecoded));
                }

                refreshUser();

                setTimeout(() => {
                    window.location.reload();
                }, 500);
            } else if (response.status === "Client error") {
                const errorDetails = parseBackendError(response.details || response.message);
                showFieldError(errorDetails.field, errorDetails.message);
            }
        } catch (error) {
            console.error("Error en login:", error);

            if (error.response) {
                const { status, data } = error.response;

                if (status === 400) {
                    if (data.details && typeof data.details === 'string') {
                        const errorDetails = parseBackendError(data.details);
                        showFieldError(errorDetails.field, errorDetails.message);
                    } else {
                        showFieldError("general", "Error de validación");
                    }
                } else if (status === 401) {
                    showFieldError("general", "❌ Email o contraseña incorrectos - verifica tus datos");
                } else if (status === 403) {
                    showFieldError("general", "⚠️ Cuenta bloqueada o sin permisos - contacta soporte");
                } else if (status === 404) {
                    showFieldError("email", "❌ No existe una cuenta con este email");
                } else if (status === 429) {
                    showFieldError("general", "⏱️ Demasiados intentos - espera unos minutos");
                } else if (status >= 500) {
                    showFieldError("general", "🔧 Error del servidor - intenta nuevamente en unos minutos");
                } else {
                    showFieldError("general", "❌ Error inesperado - recarga la página y vuelve a intentar");
                }
            } else if (error.request) {
                showFieldError("general", "🌐 Sin conexión al servidor - verifica tu internet");
            } else {
                showFieldError("general", "💻 Error del navegador - recarga la página");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h1 className="login-title">Iniciar sesión</h1>

            <form className="login-form" onSubmit={handleSubmit}>
                {fieldErrors.general && (
                    <div className="general-error-message">
                        <FaExclamationCircle />
                        {fieldErrors.general}
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="email">
                        <FaEnvelope className="field-icon" />
                        Correo electrónico
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="ejemplo@gmail.com"
                        className={fieldErrors.email ? 'error' : ''}
                        disabled={loading}
                        autoComplete="email"
                        required
                    />
                    {fieldErrors.email && <span className="error-message"><FaExclamationCircle /> {fieldErrors.email}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="password">
                        <FaLock className="field-icon" />
                        Contraseña
                    </label>
                    <div className="password-input-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Ingresa tu contraseña"
                            className={fieldErrors.password ? 'error' : ''}
                            disabled={loading}
                            autoComplete="current-password"
                            required
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={loading}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    {fieldErrors.password && <span className="error-message"><FaExclamationCircle /> {fieldErrors.password}</span>}
                </div>

                <div className="form-options">
                    <label className="checkbox-container">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            disabled={loading}
                        />
                        <span className="checkmark"></span>
                        Recordarme
                    </label>
                    <Link to="/recuperar-password" className="forgot-password">¿Olvidaste tu contraseña?</Link>
                </div>

                <button
                    type="submit"
                    className="login-button"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span className="loading-spinner"></span>
                            Ingresando...
                        </>
                    ) : (
                        <>
                            <FaSignInAlt />
                            Ingresar
                        </>
                    )}
                </button>
            </form>

            <div className="login-footer">
                <p>¿No tienes cuenta? <Link to="/register" className="auth-link">Crea una aquí</Link></p>
            </div>
        </div>
    );
};

export default Login;

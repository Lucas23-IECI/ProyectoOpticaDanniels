import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { login } from "@services/auth.service";
import { showErrorAlert, showSuccessAlert } from "@helpers/sweetAlert";
import { decodeToken } from "@helpers/jwt.helper";
import { useAuth } from "@hooks/useAuth";
import "@styles/login.css";

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { refreshUser } = useAuth();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        
        validateField(name, value);
    };

    const validateField = (fieldName, value) => {
        const newErrors = { ...errors };

        switch (fieldName) {
            case 'email': {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) {
                    newErrors.email = "El email es requerido";
                } else if (value.length < 12) {
                    newErrors.email = `Email muy corto. Mínimo 12 caracteres (tienes ${value.length})`;
                } else if (!value.includes('@')) {
                    newErrors.email = "El email debe contener '@'";
                } else if (!emailRegex.test(value)) {
                    newErrors.email = "Formato de email inválido (ejemplo: usuario@gmail.com)";
                } else {
                    delete newErrors.email;
                }
                break;
            }

            case 'password': {
                if (!value) {
                    newErrors.password = "La contraseña es requerida";
                } else if (value.length < 3) {
                    newErrors.password = `Contraseña muy corta (tienes ${value.length} caracteres)`;
                } else {
                    delete newErrors.password;
                }
                break;
            }

            default:
                break;
        }

        setErrors(newErrors);
    };

    const validateForm = () => {
        const newErrors = {};

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = "El email es requerido";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Ingresa un email válido";
        }

        if (!formData.password) {
            newErrors.password = "La contraseña es requerida";
        }

        setErrors(newErrors);
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
                
                showSuccessAlert("¡Bienvenido!", "Sesión iniciada correctamente.");
                
                const from = location.state?.from?.pathname || '/productos';
                navigate(from);
            } else if (response.status === "Client error") {
                showErrorAlert("Error", response.details.message);
            }
        } catch (error) {
            console.log(error);
            
            if (error.response) {
                const { status, data } = error.response;
                
                if (status === 400) {
                    showErrorAlert("Error de validación", data.details || "Credenciales inválidas");
                } else if (status === 401) {
                    showErrorAlert("Credenciales incorrectas", "Email o contraseña incorrectos");
                } else if (status === 404) {
                    showErrorAlert("Usuario no encontrado", "No existe una cuenta con este email");
                } else if (status >= 500) {
                    showErrorAlert("Error del servidor", "Hay problemas temporales. Intenta más tarde");
                } else {
                    showErrorAlert("Error", data.message || "Ocurrió un problema al iniciar sesión");
                }
            } else if (error.request) {
                showErrorAlert("Error de conexión", "No se puede conectar al servidor. Verifica tu conexión a internet");
            } else {
                showErrorAlert("Error", "Ocurrió un problema inesperado al iniciar sesión");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h1 className="login-title">Iniciar sesión</h1>
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Correo electrónico</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="ejemplo@correo.cl"
                        className={errors.email ? 'error' : ''}
                        required
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
                <div className="form-group">
                    <label>Contraseña</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="********"
                        className={errors.password ? 'error' : ''}
                        required
                    />
                    {errors.password && <span className="error-message">{errors.password}</span>}
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? "Ingresando..." : "Ingresar"}
                </button>
            </form>
            <p className="login-footer">
                ¿No tienes cuenta? <a href="/register">Crea una aquí</a>
            </p>
        </div>
    );
};

export default Login;

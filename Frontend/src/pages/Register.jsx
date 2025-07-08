import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register, login } from "@services/auth.service";
import { showErrorAlert, showSuccessAlert } from "@helpers/sweetAlert";
import { decodeToken } from "@helpers/jwt.helper";
import { useAuth } from "@context/AuthContext";
import "@styles/form.css";

const Register = () => {
    const navigate = useNavigate();
    const { refreshUser } = useAuth();
    const [formData, setFormData] = useState({
        nombreCompleto: "",
        email: "",
        rut: "",
        password: "",
        confirmPassword: "",
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
        
        if (name === 'password' && formData.confirmPassword) {
            validateField('confirmPassword', formData.confirmPassword);
        }
    };

    const validateField = (fieldName, value) => {
        const newErrors = { ...errors };

        switch (fieldName) {
            case 'nombreCompleto': {
                if (!value.trim()) {
                    newErrors.nombreCompleto = "El nombre completo es requerido";
                } else if (value.trim().length < 3) {
                    newErrors.nombreCompleto = "El nombre debe tener al menos 3 caracteres";
                } else if (value.trim().split(' ').length < 2) {
                    newErrors.nombreCompleto = "Ingresa tu nombre y apellido";
                } else {
                    delete newErrors.nombreCompleto;
                }
                break;
            }

            case 'email': {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) {
                    newErrors.email = "El email es requerido";
                } else if (value.length < 12) {
                    newErrors.email = `Email muy corto. Mínimo 12 caracteres (tienes ${value.length})`;
                } else if (!emailRegex.test(value)) {
                    newErrors.email = "Formato de email inválido (ejemplo: usuario@gmail.com)";
                } else {
                    delete newErrors.email;
                }
                break;
            }

            case 'rut': {
                const rutRegex = /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/;
                if (!value) {
                    newErrors.rut = "El RUT es requerido";
                } else if (value.length < 9) {
                    newErrors.rut = "RUT incompleto (formato: 12.345.678-9)";
                } else if (!rutRegex.test(value)) {
                    newErrors.rut = "Formato de RUT inválido. Usa: 12.345.678-9";
                } else {
                    delete newErrors.rut;
                }
                break;
            }

            case 'password': {
                if (!value) {
                    newErrors.password = "La contraseña es requerida";
                } else if (value.length < 6) {
                    newErrors.password = `Contraseña muy corta. Mínimo 6 caracteres (tienes ${value.length})`;
                } else if (!/(?=.*[a-z])/.test(value)) {
                    newErrors.password = "Debe incluir al menos una letra minúscula";
                } else if (!/(?=.*[A-Z])/.test(value)) {
                    newErrors.password = "Debe incluir al menos una letra mayúscula";
                } else if (!/(?=.*\d)/.test(value)) {
                    newErrors.password = "Debe incluir al menos un número";
                } else {
                    delete newErrors.password;
                }
                break;
            }

            case 'confirmPassword': {
                if (!value) {
                    newErrors.confirmPassword = "Confirma tu contraseña";
                } else if (value !== formData.password) {
                    newErrors.confirmPassword = "Las contraseñas no coinciden";
                } else {
                    delete newErrors.confirmPassword;
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

        if (!formData.nombreCompleto.trim()) {
            newErrors.nombreCompleto = "El nombre completo es requerido";
        } else if (formData.nombreCompleto.trim().length < 3) {
            newErrors.nombreCompleto = "El nombre debe tener al menos 3 caracteres";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = "El email es requerido";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Ingresa un email válido";
        }

        const rutRegex = /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/;
        if (!formData.rut) {
            newErrors.rut = "El RUT es requerido";
        } else if (!rutRegex.test(formData.rut)) {
            newErrors.rut = "Formato de RUT inválido (ej: 12.345.678-9)";
        }

        if (!formData.password) {
            newErrors.password = "La contraseña es requerida";
        } else if (formData.password.length < 6) {
            newErrors.password = "La contraseña debe tener al menos 6 caracteres";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Confirma tu contraseña";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Las contraseñas no coinciden";
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
            const { confirmPassword: _, ...dataToSend } = formData;
            const response = await register(dataToSend);
            
            if (response.status === "Success") {
                showSuccessAlert("¡Registro exitoso!", "Usuario creado correctamente.");
                
                try {
                    const loginResponse = await login({
                        email: formData.email,
                        password: formData.password
                    });
                    
                    if (loginResponse.status === "Success") {
                        localStorage.setItem('token', loginResponse.data.token);
                        const userDecoded = await decodeToken(loginResponse.data.token);
                        if (userDecoded) {
                            localStorage.setItem('user', JSON.stringify(userDecoded));
                        }
                        
                        refreshUser();
                        
                        showSuccessAlert("¡Bienvenido!", "Registro completado. Has sido logueado automáticamente.");
                        navigate("/productos");
                    } else {
                        navigate("/auth");
                    }
                } catch (loginError) {
                    console.error("Error en login automático:", loginError);
                    navigate("/auth");
                }
            } else if (response.status === "Client error") {
                showErrorAlert("Error", response.details.message);
            }
        } catch (error) {
            console.error("Error en registro:", error);
            
            if (error.response) {
                const { status, data } = error.response;
                
                if (status === 400) {
                    if (data.details && data.details.includes("email")) {
                        showErrorAlert("Email ya registrado", "Ya existe una cuenta con este email");
                    } else if (data.details && data.details.includes("rut")) {
                        showErrorAlert("RUT ya registrado", "Ya existe una cuenta con este RUT");
                    } else {
                        showErrorAlert("Error de validación", data.details || "Datos inválidos");
                    }
                } else if (status >= 500) {
                    showErrorAlert("Error del servidor", "Hay problemas temporales. Intenta más tarde");
                } else {
                    showErrorAlert("Error", data.message || "Ocurrió un problema al registrarse");
                }
            } else if (error.request) {
                showErrorAlert("Error de conexión", "No se puede conectar al servidor. Verifica tu conexión a internet");
            } else {
                showErrorAlert("Error", "Ocurrió un problema inesperado al registrarse");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h1>Crear Cuenta</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="text"
                        name="nombreCompleto"
                        placeholder="Ejemplo: Juan Pérez Gómez"
                        value={formData.nombreCompleto}
                        onChange={handleChange}
                        className={errors.nombreCompleto ? 'error' : ''}
                        required
                    />
                    {errors.nombreCompleto && <span className="error-message">{errors.nombreCompleto}</span>}
                </div>
                
                <div className="form-group">
                    <input
                        type="email"
                        name="email"
                        placeholder="ejemplo@gmail.com"
                        value={formData.email}
                        onChange={handleChange}
                        className={errors.email ? 'error' : ''}
                        required
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
                
                <div className="form-group">
                    <input
                        type="text"
                        name="rut"
                        placeholder="RUT (ej: 12.345.678-9)"
                        value={formData.rut}
                        onChange={handleChange}
                        className={errors.rut ? 'error' : ''}
                        required
                    />
                    {errors.rut && <span className="error-message">{errors.rut}</span>}
                </div>
                
                <div className="form-group">
                    <input
                        type="password"
                        name="password"
                        placeholder="Mínimo 6 caracteres, incluye mayúscula, minúscula y número"
                        value={formData.password}
                        onChange={handleChange}
                        className={errors.password ? 'error' : ''}
                        required
                    />
                    {errors.password && <span className="error-message">{errors.password}</span>}
                </div>
                
                <div className="form-group">
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirmar Contraseña"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={errors.confirmPassword ? 'error' : ''}
                        required
                    />
                    {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                </div>
                
                <button type="submit" disabled={loading}>
                    {loading ? "Registrando..." : "Registrarse"}
                </button>
            </form>
            <p>
                ¿Ya tienes cuenta? <a href="/auth">Inicia sesión</a>
            </p>
        </div>
    );
};

export default Register;

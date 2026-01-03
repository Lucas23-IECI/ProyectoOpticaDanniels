import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register, login } from "@services/auth.service";
import { decodeToken } from "@helpers/jwt.helper";
import { useAuth } from "@context/AuthContext";
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaIdCard, FaLock, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import "@styles/register.css";
import "@styles/alerts.css";

const Register = () => {
    const navigate = useNavigate();
    const { refreshUser } = useAuth();
    const [formData, setFormData] = useState({
        primerNombre: "",
        segundoNombre: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        email: "",
        rut: "",
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

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
        if (errorMessage.includes("primer nombre") || errorMessage.includes("primerNombre")) {
            if (errorMessage.includes("empty") || errorMessage.includes("vacío")) {
                return { field: "primerNombre", message: "El primer nombre es obligatorio" };
            }
            if (errorMessage.includes("min") || errorMessage.includes("caracteres")) {
                return { field: "primerNombre", message: "Mínimo 2 caracteres" };
            }
            if (errorMessage.includes("pattern") || errorMessage.includes("letras")) {
                return { field: "primerNombre", message: "Solo se permiten letras y espacios" };
            }
            return { field: "primerNombre", message: "Nombre inválido (2-30 caracteres, solo letras)" };
        }
        
        if (errorMessage.includes("segundo nombre") || errorMessage.includes("segundoNombre")) {
            return { field: "segundoNombre", message: "Segundo nombre inválido (2-30 caracteres, solo letras)" };
        }
        
        if (errorMessage.includes("apellido paterno") || errorMessage.includes("apellidoPaterno")) {
            if (errorMessage.includes("empty") || errorMessage.includes("vacío")) {
                return { field: "apellidoPaterno", message: "El apellido paterno es obligatorio" };
            }
            return { field: "apellidoPaterno", message: "Apellido paterno inválido (2-30 caracteres, solo letras)" };
        }
        
        if (errorMessage.includes("apellido materno") || errorMessage.includes("apellidoMaterno")) {
            return { field: "apellidoMaterno", message: "Apellido materno inválido (2-30 caracteres, solo letras)" };
        }
        
        if (errorMessage.includes("email") || errorMessage.includes("correo")) {
            if (errorMessage.includes("already exists") || errorMessage.includes("ya existe") || errorMessage.includes("duplicate") || 
                errorMessage.includes("exists") || errorMessage.includes("duplicated") || errorMessage.includes("taken") ||
                errorMessage.includes("usuario1@gmail.cl") || errorMessage.includes("duplicat") || 
                errorMessage.includes("en uso") || errorMessage.includes("in use")) {
                return { field: "email", message: "⚠️ Este email ya está siendo usado por otra persona" };
            }
            if (errorMessage.includes("dominio") || errorMessage.includes("domain") || errorMessage.includes(".cl") || errorMessage.includes(".com")) {
                return { field: "email", message: "Email debe terminar en .cl o .com (ej: usuario@gmail.com)" };
            }
            if (errorMessage.includes("min") || errorMessage.includes("caracteres")) {
                return { field: "email", message: "Email debe tener entre 15-35 caracteres" };
            }
            if (errorMessage.includes("invalid") || errorMessage.includes("inválido") || errorMessage.includes("format")) {
                return { field: "email", message: "Formato inválido (ej: nombre@gmail.cl)" };
            }
            return { field: "email", message: "Email inválido - revisa el formato" };
        }
        
        if (errorMessage.includes("rut") || errorMessage.includes("RUT")) {
            if (errorMessage.includes("already exists") || errorMessage.includes("ya existe") || errorMessage.includes("duplicate") ||
                errorMessage.includes("asociado") || errorMessage.includes("associated") || errorMessage.includes("en uso")) {
                return { field: "rut", message: "⚠️ Este RUT ya está registrado por otra persona" };
            }
            if (errorMessage.includes("invalid") || errorMessage.includes("inválido") || errorMessage.includes("format")) {
                return { field: "rut", message: "Formato inválido (debe ser: 12.345.678-9)" };
            }
            if (errorMessage.includes("min") || errorMessage.includes("caracteres")) {
                return { field: "rut", message: "RUT debe tener 9-12 caracteres" };
            }
            return { field: "rut", message: "RUT inválido - verifica el formato y dígito verificador" };
        }
        
        if (errorMessage.includes("password") || errorMessage.includes("contraseña")) {
            if (errorMessage.includes("min") || errorMessage.includes("caracteres")) {
                return { field: "password", message: "Contraseña debe tener entre 8-26 caracteres" };
            }
            if (errorMessage.includes("pattern") || errorMessage.includes("letras")) {
                return { field: "password", message: "Solo letras y números permitidos" };
            }
            return { field: "password", message: "Contraseña inválida - revisa los requisitos" };
        }
        
        // Errores de validación específicos
        if (errorMessage.includes("unknown") || errorMessage.includes("adicionales")) {
            return { field: "general", message: "Datos adicionales no permitidos detectados" };
        }
        
        return { field: "general", message: "Error en los datos - revisa todos los campos" };
    };

    const validateFieldRealTime = (name, value) => {
        // Validaciones en tiempo real mientras el usuario escribe
        switch (name) {
            case 'email':
                if (value.length > 0) {
                    if (value.length < 15) {
                        return "Email debe tener al menos 15 caracteres";
                    }
                    if (value.length > 35) {
                        return "Email no puede tener más de 35 caracteres";
                    }
                    if (!value.includes('@')) {
                        return "Email debe contener @";
                    }
                    if (value.includes('@') && !value.endsWith('.cl') && !value.endsWith('.com')) {
                        return "Email debe terminar en .cl o .com";
                    }
                    if (!/^[^\s@]+@[^\s@]+\.(cl|com)$/i.test(value)) {
                        return "Formato de email inválido";
                    }
                }
                break;
                
            case 'rut':
                if (value.length > 0) {
                    if (value.length < 9) {
                        return "RUT debe tener al menos 9 caracteres";
                    }
                    if (value.length > 12) {
                        return "RUT no puede tener más de 12 caracteres";
                    }
                    if (!/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/.test(value)) {
                        return "Formato inválido (ej: 12.345.678-9)";
                    }
                }
                break;
                
            case 'password':
                if (value.length > 0) {
                    if (value.length < 8) {
                        return "Contraseña debe tener al menos 8 caracteres";
                    }
                    if (value.length > 26) {
                        return "Contraseña no puede tener más de 26 caracteres";
                    }
                    if (!/^[a-zA-Z0-9]+$/.test(value)) {
                        return "Solo letras y números permitidos";
                    }
                    if (!/[A-Z]/.test(value)) {
                        return "Debe contener al menos una mayúscula";
                    }
                    if (!/[a-z]/.test(value)) {
                        return "Debe contener al menos una minúscula";
                    }
                    if (!/[0-9]/.test(value)) {
                        return "Debe contener al menos un número";
                    }
                }
                break;
                
            case 'confirmPassword':
                if (value.length > 0 && value !== formData.password) {
                    return "Las contraseñas no coinciden";
                }
                break;
                
            case 'primerNombre':
            case 'apellidoPaterno':
                if (value.length > 0) {
                    if (value.length < 2) {
                        return "Debe tener al menos 2 caracteres";
                    }
                    if (value.length > 30) {
                        return "No puede tener más de 30 caracteres";
                    }
                    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
                        return "Solo se permiten letras y espacios";
                    }
                }
                break;
                
            case 'segundoNombre':
            case 'apellidoMaterno':
                if (value.length > 0) {
                    if (value.length < 2) {
                        return "Debe tener al menos 2 caracteres";
                    }
                    if (value.length > 30) {
                        return "No puede tener más de 30 caracteres";
                    }
                    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
                        return "Solo se permiten letras y espacios";
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

        if (name === 'password') {
            setPasswordStrength(evaluatePasswordStrength(value));
        }
        
        // Validación en tiempo real con debounce ligero
        setTimeout(() => {
            const realtimeError = validateFieldRealTime(name, value);
            if (realtimeError) {
                showFieldError(name, realtimeError);
            }
        }, 800); // Espera 800ms después de que el usuario deje de escribir
    };

    const evaluatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        return strength;
    };

    const getPasswordStrengthText = () => {
        switch (passwordStrength) {
            case 0:
            case 1: return { text: "Muy débil", color: "#ff4444" };
            case 2: return { text: "Débil", color: "#ff8800" };
            case 3: return { text: "Media", color: "#ffbb00" };
            case 4: return { text: "Fuerte", color: "#88cc00" };
            case 5: return { text: "Muy fuerte", color: "#44cc44" };
            default: return { text: "", color: "#ccc" };
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.primerNombre.trim()) {
            newErrors.primerNombre = "El primer nombre es obligatorio";
        } else if (formData.primerNombre.trim().length < 2) {
            newErrors.primerNombre = `El primer nombre debe tener al menos 2 caracteres (tienes ${formData.primerNombre.trim().length})`;
        } else if (formData.primerNombre.trim().length > 30) {
            newErrors.primerNombre = `El primer nombre no puede tener más de 30 caracteres (tienes ${formData.primerNombre.trim().length})`;
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.primerNombre)) {
            newErrors.primerNombre = "El primer nombre solo puede contener letras y espacios (no números ni símbolos)";
        } else if (/^\s|\s$/.test(formData.primerNombre)) {
            newErrors.primerNombre = "El primer nombre no puede empezar ni terminar con espacios";
        }

        if (formData.segundoNombre && formData.segundoNombre.trim()) {
            if (formData.segundoNombre.trim().length < 2) {
                newErrors.segundoNombre = `El segundo nombre debe tener al menos 2 caracteres (tienes ${formData.segundoNombre.trim().length})`;
            } else if (formData.segundoNombre.trim().length > 30) {
                newErrors.segundoNombre = `El segundo nombre no puede tener más de 30 caracteres (tienes ${formData.segundoNombre.trim().length})`;
            } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.segundoNombre)) {
                newErrors.segundoNombre = "El segundo nombre solo puede contener letras y espacios (no números ni símbolos)";
            } else if (/^\s|\s$/.test(formData.segundoNombre)) {
                newErrors.segundoNombre = "El segundo nombre no puede empezar ni terminar con espacios";
            }
        }

        if (!formData.apellidoPaterno.trim()) {
            newErrors.apellidoPaterno = "El apellido paterno es obligatorio";
        } else if (formData.apellidoPaterno.trim().length < 2) {
            newErrors.apellidoPaterno = `El apellido paterno debe tener al menos 2 caracteres (tienes ${formData.apellidoPaterno.trim().length})`;
        } else if (formData.apellidoPaterno.trim().length > 30) {
            newErrors.apellidoPaterno = `El apellido paterno no puede tener más de 30 caracteres (tienes ${formData.apellidoPaterno.trim().length})`;
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.apellidoPaterno)) {
            newErrors.apellidoPaterno = "El apellido paterno solo puede contener letras y espacios (no números ni símbolos)";
        } else if (/^\s|\s$/.test(formData.apellidoPaterno)) {
            newErrors.apellidoPaterno = "El apellido paterno no puede empezar ni terminar con espacios";
        }

        if (formData.apellidoMaterno && formData.apellidoMaterno.trim()) {
            if (formData.apellidoMaterno.trim().length < 2) {
                newErrors.apellidoMaterno = `El apellido materno debe tener al menos 2 caracteres (tienes ${formData.apellidoMaterno.trim().length})`;
            } else if (formData.apellidoMaterno.trim().length > 30) {
                newErrors.apellidoMaterno = `El apellido materno no puede tener más de 30 caracteres (tienes ${formData.apellidoMaterno.trim().length})`;
            } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.apellidoMaterno)) {
                newErrors.apellidoMaterno = "El apellido materno solo puede contener letras y espacios (no números ni símbolos)";
            } else if (/^\s|\s$/.test(formData.apellidoMaterno)) {
                newErrors.apellidoMaterno = "El apellido materno no puede empezar ni terminar con espacios";
            }
        }

        if (!formData.email.trim()) {
            newErrors.email = "El email es obligatorio";
        } else if (formData.email.trim().length < 10) {
            newErrors.email = `El email debe tener al menos 10 caracteres (tienes ${formData.email.trim().length})`;
        } else if (formData.email.trim().length > 35) {
            newErrors.email = `El email no puede tener más de 35 caracteres (tienes ${formData.email.trim().length})`;
        } else if (!/^[^\s@]+@[^\s@]+\.(cl|com)$/i.test(formData.email)) {
            newErrors.email = "El formato del email es incorrecto. Debe terminar en .cl o .com";
        } else if (formData.email.split('@')[0].length < 3) {
            newErrors.email = "La parte antes del @ debe tener al menos 3 caracteres";
        }

        if (!formData.rut.trim()) {
            newErrors.rut = "El RUT es obligatorio";
        } else if (formData.rut.trim().length < 9) {
            newErrors.rut = `El RUT debe tener al menos 9 caracteres (tienes ${formData.rut.trim().length})`;
        } else if (formData.rut.trim().length > 12) {
            newErrors.rut = `El RUT no puede tener más de 12 caracteres (tienes ${formData.rut.trim().length})`;
        } else if (!/^[0-9]+-[0-9kK]$/.test(formData.rut)) {
            newErrors.rut = "El RUT debe tener el formato correcto: 12345678-9 (números-dígito verificador)";
        } else if (!formData.rut.includes('-')) {
            newErrors.rut = "El RUT debe incluir un guión (-) antes del dígito verificador";
        } else {
            const rutParts = formData.rut.split('-');
            if (rutParts[0].length < 7) {
                newErrors.rut = `La parte numérica del RUT debe tener al menos 7 dígitos (tienes ${rutParts[0].length})`;
            } else if (rutParts[1].length !== 1) {
                newErrors.rut = "El dígito verificador debe ser exactamente 1 carácter";
            } else if (!/^[0-9kK]$/.test(rutParts[1])) {
                newErrors.rut = "El dígito verificador debe ser un número (0-9) o la letra K";
            }
        }

        if (!formData.password) {
            newErrors.password = "La contraseña es obligatoria";
        } else if (formData.password.length < 8) {
            newErrors.password = `La contraseña debe tener al menos 8 caracteres (tienes ${formData.password.length})`;
        } else if (formData.password.length > 26) {
            newErrors.password = `La contraseña no puede tener más de 26 caracteres (tienes ${formData.password.length})`;
        } else if (!/^[a-zA-Z0-9]+$/.test(formData.password)) {
            newErrors.password = "La contraseña solo puede contener letras y números (no espacios ni símbolos especiales)";
        } else if (!/[a-zA-Z]/.test(formData.password)) {
            newErrors.password = "La contraseña debe contener al menos una letra";
        } else if (!/[0-9]/.test(formData.password)) {
            newErrors.password = "La contraseña debe contener al menos un número";
        } else if (formData.password === formData.password.toLowerCase()) {
            newErrors.password = "La contraseña debe contener al menos una letra mayúscula";
        } else if (formData.password === formData.password.toUpperCase()) {
            newErrors.password = "La contraseña debe contener al menos una letra minúscula";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Debes confirmar tu contraseña";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Las contraseñas no coinciden exactamente";
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
            const { confirmPassword: _, ...dataToSend } = formData;
            const response = await register(dataToSend);
            
            if (response.status === "Success") {
                // showSuccessAlert("¡Registro exitoso!", "Usuario creado correctamente."); // Removed as per new_code
                
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
                        
                        // showSuccessAlert("¡Bienvenido!", "Registro completado. Has sido logueado automáticamente."); // Removed as per new_code
                        
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    } else {
                        navigate("/auth");
                    }
                } catch (loginError) {
                    console.error("Error en login automático:", loginError);
                    navigate("/auth");
                }
            } else if (response.status === "Client error") {
                // showErrorAlert("Error", response.details.message); // Removed as per new_code
                const errorDetails = parseBackendError(response.details.message);
                showFieldError(errorDetails.field, errorDetails.message);
            }
        } catch (error) {
            console.error("Error en registro:", error);
            
            if (error.response) {
                const { status, data } = error.response;
                console.log("Error response data:", data);
                console.log("Error response status:", status);
                console.log("Full error response:", JSON.stringify(data, null, 2));
                
                if (status === 400) {
                    // Primero verificar si es error de email duplicado (mensaje específico del backend)
                    if (data.message && (data.message.includes("Correo electrónico en uso") || 
                        (data.message.includes("email") || data.message.includes("correo")) && 
                        (data.message.includes("exists") || data.message.includes("existe") || data.message.includes("duplicate") || data.message.includes("en uso")))) {
                        showFieldError("email", "⚠️ Este email ya está siendo usado por otra persona");
                    }
                    // Verificar si es error de RUT duplicado (mensaje específico del backend)
                    else if (data.message && (data.message.includes("Rut ya asociado a una cuenta") ||
                        data.message.includes("rut") && 
                        (data.message.includes("exists") || data.message.includes("existe") || data.message.includes("duplicate") || data.message.includes("asociado")))) {
                        showFieldError("rut", "⚠️ Este RUT ya está registrado por otra persona");
                    }
                    // Verificar si data.details es string
                    else if (data.details && typeof data.details === 'string') {
                        const errorDetails = parseBackendError(data.details);
                        showFieldError(errorDetails.field, errorDetails.message);
                    }
                    // Verificar si data.details es un objeto con información
                    else if (data.details && typeof data.details === 'object') {
                        const detailsStr = JSON.stringify(data.details);
                        if (detailsStr.includes("email") && (detailsStr.includes("exists") || detailsStr.includes("existe"))) {
                            showFieldError("email", "⚠️ Este email ya está siendo usado por otra persona");
                        } else if (detailsStr.includes("rut") && (detailsStr.includes("exists") || detailsStr.includes("existe"))) {
                            showFieldError("rut", "⚠️ Este RUT ya está registrado por otra persona");
                            } else {
                            const errorDetails = parseBackendError(detailsStr);
                            showFieldError(errorDetails.field, errorDetails.message);
                        }
                    }
                    else if (JSON.stringify(data).includes("usuario1@gmail.cl") || 
                             JSON.stringify(data).includes("email") && JSON.stringify(data).includes("exist")) {
                        showFieldError("email", "⚠️ Este email ya está siendo usado por otra persona");
                    }
                    else {
                        const fullResponse = JSON.stringify(error.response);
                        if (fullResponse.includes("Correo electrónico en uso") || 
                            (fullResponse.includes("email") && fullResponse.includes("en uso")) ||
                            (fullResponse.includes("email") && (fullResponse.includes("exist") || fullResponse.includes("duplicate") || fullResponse.includes("taken")))) {
                            showFieldError("email", "⚠️ Este email ya está siendo usado por otra persona");
                        } else if (fullResponse.includes("Rut ya asociado a una cuenta") ||
                                   (fullResponse.includes("rut") && fullResponse.includes("asociado"))) {
                            showFieldError("rut", "⚠️ Este RUT ya está registrado por otra persona");
                        } else {
                            showFieldError("general", "⚠️ Error de validación - revisa todos los campos");
                        }
                    }
                } else if (status === 409) {
                    if (data.message && data.message.includes("email")) {
                        showFieldError("email", "⚠️ Este email ya está siendo usado por otra persona");
                    } else if (data.message && data.message.includes("rut")) {
                        showFieldError("rut", "⚠️ Este RUT ya está registrado por otra persona");
                    } else {
                        showFieldError("general", "⚠️ Ya existe una cuenta con estos datos");
                    }
                } else if (status === 422) {
                    showFieldError("general", "⚠️ Datos de registro inválidos o incompletos");
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

    return (        <div className="register-container">
            <div className="register-card">
                <div className="register-header">
                    <h1 className="register-title">Crear cuenta</h1>
                    <p className="register-subtitle">Únete a Óptica Danniels</p>
                </div>

                <form className="register-form" onSubmit={handleSubmit}>
                    {fieldErrors.general && (
                        <div className="general-error-message">
                            <FaExclamationCircle />
                            {fieldErrors.general}
                        </div>
                    )}
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="primerNombre">
                                <FaUser className="field-icon" />
                                Primer Nombre *
                            </label>
                            <input
                                type="text"
                                id="primerNombre"
                                name="primerNombre"
                                value={formData.primerNombre}
                                onChange={handleChange}
                                placeholder="Ej: Juan"
                                className={fieldErrors.primerNombre ? "error" : ""}
                                disabled={loading}
                                autoComplete="given-name"
                            />
                            {fieldErrors.primerNombre && <span className="error-message"><FaExclamationCircle /> {fieldErrors.primerNombre}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="segundoNombre">
                                <FaUser className="field-icon" />
                                Segundo Nombre
                            </label>
                            <input
                                type="text"
                                id="segundoNombre"
                                name="segundoNombre"
                                value={formData.segundoNombre}
                                onChange={handleChange}
                                placeholder="Ej: Carlos (opcional)"
                                className={fieldErrors.segundoNombre ? "error" : ""}
                                disabled={loading}
                                autoComplete="additional-name"
                            />
                            {fieldErrors.segundoNombre && <span className="error-message"><FaExclamationCircle /> {fieldErrors.segundoNombre}</span>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="apellidoPaterno">
                                <FaUser className="field-icon" />
                                Apellido Paterno *
                            </label>
                            <input
                                type="text"
                                id="apellidoPaterno"
                                name="apellidoPaterno"
                                value={formData.apellidoPaterno}
                                onChange={handleChange}
                                placeholder="Ej: Pérez"
                                className={fieldErrors.apellidoPaterno ? "error" : ""}
                                disabled={loading}
                                autoComplete="family-name"
                            />
                            {fieldErrors.apellidoPaterno && <span className="error-message"><FaExclamationCircle /> {fieldErrors.apellidoPaterno}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="apellidoMaterno">
                                <FaUser className="field-icon" />
                                Apellido Materno
                            </label>
                            <input
                                type="text"
                                id="apellidoMaterno"
                                name="apellidoMaterno"
                                value={formData.apellidoMaterno}
                                onChange={handleChange}
                                placeholder="Ej: González (opcional)"
                                className={fieldErrors.apellidoMaterno ? "error" : ""}
                                disabled={loading}
                                autoComplete="family-name"
                            />
                            {fieldErrors.apellidoMaterno && <span className="error-message"><FaExclamationCircle /> {fieldErrors.apellidoMaterno}</span>}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">
                            <FaEnvelope className="field-icon" />
                            Correo Electrónico *
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="ejemplo@gmail.com"
                            className={fieldErrors.email ? "error" : ""}
                            disabled={loading}
                            autoComplete="email"
                        />
                        {fieldErrors.email && <span className="error-message"><FaExclamationCircle /> {fieldErrors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="rut">
                            <FaIdCard className="field-icon" />
                            RUT *
                        </label>
                        <input
                            type="text"
                            id="rut"
                            name="rut"
                            value={formData.rut}
                            onChange={handleChange}
                            placeholder="12345678-9"
                            className={fieldErrors.rut ? "error" : ""}
                            disabled={loading}
                            autoComplete="off"
                        />
                        {fieldErrors.rut && <span className="error-message"><FaExclamationCircle /> {fieldErrors.rut}</span>}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="password">
                                <FaLock className="field-icon" />
                                Contraseña *
                            </label>
                            <div className="password-input-container">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Mínimo 8 caracteres"
                                    className={fieldErrors.password ? "error" : ""}
                                    disabled={loading}
                                    autoComplete="new-password"
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
                            {formData.password && (
                                <div className="password-strength">
                                    <div className="password-strength-bar">
                                        <div 
                                            className="password-strength-fill"
                                            style={{ 
                                                width: `${(passwordStrength / 5) * 100}%`,
                                                backgroundColor: getPasswordStrengthText().color
                                            }}
                                        />
                                    </div>
                                    <span 
                                        className="password-strength-text"
                                        style={{ color: getPasswordStrengthText().color }}
                                    >
                                        {getPasswordStrengthText().text}
                                    </span>
                                </div>
                            )}
                            {fieldErrors.password && <span className="error-message"><FaExclamationCircle /> {fieldErrors.password}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">
                                <FaCheckCircle className="field-icon" />
                                Confirmar Contraseña *
                            </label>
                            <div className="password-input-container">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Repite tu contraseña"
                                    className={fieldErrors.confirmPassword ? "error" : ""}
                                    disabled={loading}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    disabled={loading}
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {fieldErrors.confirmPassword && <span className="error-message"><FaExclamationCircle /> {fieldErrors.confirmPassword}</span>}
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="register-button"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="loading-spinner"></span>
                                Registrando...
                            </>
                        ) : (
                            "Crear cuenta"
                        )}
                    </button>
                </form>

                <div className="register-footer">
                    <p>¿Ya tienes cuenta? <Link to="/login" className="auth-link">Inicia sesión aquí</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;

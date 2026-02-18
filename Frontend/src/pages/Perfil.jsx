import { useState, useEffect } from 'react';
import { useAuth } from "@context/AuthContext";
import useDirecciones from "@hooks/direcciones/useDirecciones.js";
import DireccionCard from "@components/DireccionCard";
import CrearDireccionForm from "@components/CrearDireccionForm";
import { getNombreCompleto } from "@helpers/nameHelpers";
import { 
    validatePrimerNombre, 
    validateSegundoNombre, 
    validateApellidoPaterno, 
    validateApellidoMaterno,
    validateTelefono,
    validateFechaNacimiento,
    validateGenero
} from "@helpers/validation.helper";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaTimes, FaEye, FaEyeSlash, FaSpinner, FaCheckCircle, FaExclamationTriangle, FaCrown, FaIdCard, FaShieldAlt, FaPlus, FaTrash, FaCalendarAlt } from 'react-icons/fa';
import "@styles/perfil.css";

const Perfil = () => {
    const { user, isAuthenticated, updateUser } = useAuth();
    const { 
        direcciones: direccionesApi, 
        loading: direccionesApiLoading, 
        error: direccionesApiError, 
        fetchDirecciones,
        createDireccion,
        updateDireccion,
        deleteDireccion,
        setPrincipal
    } = useDirecciones();
    
    // Estados separados para cada sección
    const [isEditingPersonal, setIsEditingPersonal] = useState(false);
    const [isEditingDirecciones, setIsEditingDirecciones] = useState(false);
    const [isEditingSecurity, setIsEditingSecurity] = useState(false);
    
    // Estados de loading y mensajes por sección
    const [loadingPersonal, setLoadingPersonal] = useState(false);
    const [loadingSecurity, setLoadingSecurity] = useState(false);
    
    const [messagePersonal, setMessagePersonal] = useState({ type: '', text: '' });
    const [messageDirecciones, setMessageDirecciones] = useState({ type: '', text: '' });
    const [messageSecurity, setMessageSecurity] = useState({ type: '', text: '' });
    
    // Estados para validaciones específicas
    const [errorsPersonal, setErrorsPersonal] = useState({});
    const [errorsDirecciones, setErrorsDirecciones] = useState({});
    const [errorsSecurity, setErrorsSecurity] = useState({});
    
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    // Datos del formulario personal
    const [personalData, setPersonalData] = useState({
        primerNombre: '',
        segundoNombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        email: '',
        telefono: '',
        fechaNacimiento: '',
        genero: ''
    });

    // Datos de direcciones - ahora manejado por el hook

    // Datos de seguridad
    const [securityData, setSecurityData] = useState({
        password: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Función para convertir fecha de DD/MM/YYYY a YYYY-MM-DD
    const convertDateFormat = (dateString) => {
        if (!dateString) return '';
        
        // Si ya está en formato YYYY-MM-DD, retornarlo
        if (dateString.includes('-')) return dateString;
        
        // Si está en formato DD/MM/YYYY, convertirlo
        if (dateString.includes('/')) {
            const [day, month, year] = dateString.split('/');
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
        
        return dateString;
    };

    useEffect(() => {
        if (user) {
            setPersonalData({
                primerNombre: user.primerNombre || '',
                segundoNombre: user.segundoNombre || '',
                apellidoPaterno: user.apellidoPaterno || '',
                apellidoMaterno: user.apellidoMaterno || '',
                email: user.email || '',
                telefono: user.telefono || '',
                fechaNacimiento: convertDateFormat(user.fechaNacimiento),
                genero: user.genero || ''
            });
        }
    }, [user]);

    // Cargar direcciones cuando el usuario esté autenticado
    useEffect(() => {
        if (isAuthenticated && user) {
            fetchDirecciones();
        }
    }, [isAuthenticated, user, fetchDirecciones]);

    // Auto-clear de errores después de 2 segundos
    useEffect(() => {
        const timers = [];
        Object.keys(errorsPersonal).forEach(field => {
            if (errorsPersonal[field]) {
                const timer = setTimeout(() => {
                    setErrorsPersonal(prev => ({
            ...prev,
                        [field]: null
        }));
                }, 2000);
                timers.push(timer);
            }
        });
        return () => timers.forEach(timer => clearTimeout(timer));
    }, [errorsPersonal]);

    useEffect(() => {
        const timers = [];
        Object.keys(errorsDirecciones).forEach(field => {
            if (errorsDirecciones[field]) {
                const timer = setTimeout(() => {
                    setErrorsDirecciones(prev => ({
            ...prev,
                        [field]: null
                    }));
                }, 2000);
                timers.push(timer);
            }
        });
        return () => timers.forEach(timer => clearTimeout(timer));
    }, [errorsDirecciones]);

    useEffect(() => {
        const timers = [];
        Object.keys(errorsSecurity).forEach(field => {
            if (errorsSecurity[field]) {
                const timer = setTimeout(() => {
                    setErrorsSecurity(prev => ({
            ...prev,
                        [field]: null
                    }));
                }, 2000);
                timers.push(timer);
            }
        });
        return () => timers.forEach(timer => clearTimeout(timer));
    }, [errorsSecurity]);

    // Auto-clear de mensajes generales después de 2 segundos
    useEffect(() => {
        if (messagePersonal.text) {
            const timer = setTimeout(() => {
                setMessagePersonal({ type: '', text: '' });
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [messagePersonal]);

    useEffect(() => {
        if (messageDirecciones.text) {
            const timer = setTimeout(() => {
                setMessageDirecciones({ type: '', text: '' });
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [messageDirecciones]);

    useEffect(() => {
        if (messageSecurity.text) {
            const timer = setTimeout(() => {
                setMessageSecurity({ type: '', text: '' });
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [messageSecurity]);

    // Funciones de validación
    const validatePersonalData = () => {
        const errors = {};
        
        // Validar primer nombre (obligatorio)
        const primerNombreError = validatePrimerNombre(personalData.primerNombre);
        if (primerNombreError) errors.primerNombre = primerNombreError;
        
        // Validar segundo nombre (opcional - solo si tiene contenido)
        if (personalData.segundoNombre && personalData.segundoNombre.trim()) {
            const segundoNombreError = validateSegundoNombre(personalData.segundoNombre);
            if (segundoNombreError) errors.segundoNombre = segundoNombreError;
        }
        
        // Validar apellido paterno (obligatorio)
        const apellidoPaternoError = validateApellidoPaterno(personalData.apellidoPaterno);
        if (apellidoPaternoError) errors.apellidoPaterno = apellidoPaternoError;
        
        // Validar apellido materno (opcional - solo si tiene contenido)
        if (personalData.apellidoMaterno && personalData.apellidoMaterno.trim()) {
            const apellidoMaternoError = validateApellidoMaterno(personalData.apellidoMaterno);
            if (apellidoMaternoError) errors.apellidoMaterno = apellidoMaternoError;
        }
        
        // Validar email (obligatorio)
        if (!personalData.email.trim()) {
            errors.email = 'El email es obligatorio';
        } else if (!/\S+@\S+\.\S+/.test(personalData.email)) {
            errors.email = 'Email inválido';
        }
        
        // Validar teléfono (opcional - solo si tiene contenido)
        if (personalData.telefono && personalData.telefono.trim()) {
            const telefonoError = validateTelefono(personalData.telefono);
            if (telefonoError) errors.telefono = telefonoError;
        }
        
        // Validar fecha de nacimiento (opcional - solo si tiene contenido)
        if (personalData.fechaNacimiento && personalData.fechaNacimiento.trim()) {
            const fechaError = validateFechaNacimiento(personalData.fechaNacimiento);
            if (fechaError) errors.fechaNacimiento = fechaError;
        }
        
        // Validar género (opcional - solo si tiene contenido)
        if (personalData.genero && personalData.genero.trim()) {
            const generoError = validateGenero(personalData.genero);
            if (generoError) errors.genero = generoError;
        }
        
        return errors;
    };

    // validateDireccion ya no se necesita - se maneja en los componentes individuales

    const validateSecurityData = () => {
        const errors = {};
        if (securityData.newPassword) {
            if (!securityData.password) errors.password = 'Ingresa tu contraseña actual';
            if (securityData.newPassword.length < 6) {
                errors.newPassword = 'La nueva contraseña debe tener al menos 6 caracteres';
            }
            if (securityData.newPassword !== securityData.confirmPassword) {
                errors.confirmPassword = 'Las contraseñas no coinciden';
            }
        }
        return errors;
    };

    // Función para parsear errores del backend
    const parseBackendError = (errorMessage, section = 'personal') => {
        // Parsear errores estructurados del backend
        if (typeof errorMessage === 'object' && errorMessage.dataInfo && errorMessage.message) {
            const { dataInfo, message } = errorMessage;
            return { field: dataInfo, message: message };
        }
        
        if (section === 'personal') {
            if (errorMessage.includes("primer nombre") || errorMessage.includes("primerNombre")) {
                if (errorMessage.includes("empty") || errorMessage.includes("vacío")) {
                    return { field: "primerNombre", message: "El primer nombre es obligatorio" };
                }
                if (errorMessage.includes("min") || errorMessage.includes("caracteres")) {
                    return { field: "primerNombre", message: "Mínimo 2 caracteres" };
                }
                if (errorMessage.includes("pattern") || errorMessage.includes("letras") || errorMessage.includes("espacios")) {
                    return { field: "primerNombre", message: "Solo se permiten letras (sin espacios)" };
                }
                return { field: "primerNombre", message: "Nombre inválido (2-30 caracteres, solo letras)" };
            }
            
            if (errorMessage.includes("segundo nombre") || errorMessage.includes("segundoNombre")) {
                if (errorMessage.includes("pattern") || errorMessage.includes("letras") || errorMessage.includes("espacios")) {
                    return { field: "segundoNombre", message: "Solo se permiten letras (sin espacios)" };
                }
                return { field: "segundoNombre", message: "Segundo nombre inválido (2-30 caracteres, solo letras)" };
            }
            
            if (errorMessage.includes("apellido paterno") || errorMessage.includes("apellidoPaterno")) {
                if (errorMessage.includes("empty") || errorMessage.includes("vacío")) {
                    return { field: "apellidoPaterno", message: "El apellido paterno es obligatorio" };
                }
                if (errorMessage.includes("pattern") || errorMessage.includes("letras") || errorMessage.includes("espacios")) {
                    return { field: "apellidoPaterno", message: "Solo se permiten letras (sin espacios)" };
                }
                return { field: "apellidoPaterno", message: "Apellido paterno inválido (2-30 caracteres, solo letras)" };
            }
            
            if (errorMessage.includes("apellido materno") || errorMessage.includes("apellidoMaterno")) {
                if (errorMessage.includes("pattern") || errorMessage.includes("letras") || errorMessage.includes("espacios")) {
                    return { field: "apellidoMaterno", message: "Solo se permiten letras (sin espacios)" };
                }
                return { field: "apellidoMaterno", message: "Apellido materno inválido (2-30 caracteres, solo letras)" };
            }
            
            if (errorMessage.includes("email") || errorMessage.includes("correo") || errorMessage.includes("Correo")) {
                if (errorMessage.includes("already exists") || errorMessage.includes("ya existe") || errorMessage.includes("duplicate") || 
                    errorMessage.includes("exists") || errorMessage.includes("duplicated") || errorMessage.includes("taken") ||
                    errorMessage.includes("en uso") || errorMessage.includes("in use")) {
                    return { field: "email", message: "⚠️ Este email ya está siendo usado por otra persona" };
                }
                if (errorMessage.includes("invalid") || errorMessage.includes("inválido") || errorMessage.includes("format")) {
                    return { field: "email", message: "Formato inválido (ej: nombre@gmail.cl)" };
                }
                return { field: "email", message: "Email inválido - revisa el formato" };
            }
            
            if (errorMessage.includes("telefono") || errorMessage.includes("teléfono")) {
                if (errorMessage.includes("Formato inválido") || errorMessage.includes("formato")) {
                    return { field: "telefono", message: "Formato inválido. Use: +56 9 XXXX XXXX (móvil) o +56 2 XXXX XXXX (fijo)" };
                }
                return { field: "telefono", message: "Teléfono inválido - usa formato +56 9 1234 5678" };
            }
            
            if (errorMessage.includes("fecha") || errorMessage.includes("nacimiento")) {
                if (errorMessage.includes("futura")) {
                    return { field: "fechaNacimiento", message: "La fecha de nacimiento no puede ser futura" };
                }
                if (errorMessage.includes("1904")) {
                    return { field: "fechaNacimiento", message: "La fecha de nacimiento no puede ser anterior a 1904" };
                }
                if (errorMessage.includes("13 años")) {
                    return { field: "fechaNacimiento", message: "Debes tener al menos 13 años" };
                }
                return { field: "fechaNacimiento", message: "Fecha de nacimiento inválida" };
            }
            
            if (errorMessage.includes("genero") || errorMessage.includes("género")) {
                return { field: "genero", message: "Selecciona un género válido: Masculino, Femenino, No binario o Prefiero no decir" };
            }
            
            if (errorMessage.includes("password") || errorMessage.includes("contraseña")) {
                if (errorMessage.includes("actual") || errorMessage.includes("current")) {
                    return { field: "password", message: "Contraseña actual incorrecta" };
                }
                return { field: "password", message: "Error en la contraseña" };
            }
        }
        
        if (section === 'security') {
            if (errorMessage.includes("password") || errorMessage.includes("contraseña")) {
                if (errorMessage.includes("actual") || errorMessage.includes("current") || errorMessage.includes("incorrecta")) {
                    return { field: "password", message: "❌ Contraseña actual incorrecta" };
                }
                if (errorMessage.includes("nueva") || errorMessage.includes("new")) {
                    return { field: "newPassword", message: "Nueva contraseña debe tener al menos 6 caracteres" };
                }
                if (errorMessage.includes("min") || errorMessage.includes("caracteres")) {
                    return { field: "newPassword", message: "Contraseña debe tener entre 6-50 caracteres" };
                }
                return { field: "password", message: "Error con contraseña - verifica los datos" };
            }
        }
        
        return { field: "general", message: "Error en los datos - revisa todos los campos" };
    };

    const showFieldError = (field, message, section = 'personal') => {
        if (section === 'personal') {
            setErrorsPersonal(prev => ({
            ...prev,
                [field]: message
            }));
        } else if (section === 'direcciones') {
            setErrorsDirecciones(prev => ({
                ...prev,
                [field]: message
            }));
        } else if (section === 'security') {
            setErrorsSecurity(prev => ({
                ...prev,
                [field]: message
            }));
        }
    };

    // Función para formatear teléfono automáticamente
    const formatTelefono = (value) => {
        if (!value) return '';
        
        // Remover todo excepto números
        const numbers = value.replace(/\D/g, '');
        
        // Si empieza con 56, removerlo
        let cleanNumbers = numbers;
        if (numbers.startsWith('56')) {
            cleanNumbers = numbers.substring(2);
        }
        
        // Si tiene 8 dígitos, formatear como 9 XXXX XXXX o 2 XXXX XXXX
        if (cleanNumbers.length === 8) {
            return `${cleanNumbers[0]} ${cleanNumbers.substring(1, 5)} ${cleanNumbers.substring(5)}`;
        }
        
        // Si tiene 9 dígitos, formatear como 9 XXXX XXXX
        if (cleanNumbers.length === 9) {
            return `${cleanNumbers[0]} ${cleanNumbers.substring(1, 5)} ${cleanNumbers.substring(5)}`;
        }
        
        // Si tiene menos de 8 dígitos, retornar como está
        return cleanNumbers;
    };

    // Handlers para datos personales
    const handlePersonalChange = (e) => {
        const { name, value } = e.target;
        
        // Formatear teléfono automáticamente
        if (name === 'telefono') {
            const formattedValue = formatTelefono(value);
            setPersonalData(prev => ({ ...prev, [name]: formattedValue }));
        } else {
            setPersonalData(prev => ({ ...prev, [name]: value }));
        }
        
        // Validación en tiempo real
        let error = null;
        
        switch (name) {
            case 'primerNombre':
                error = validatePrimerNombre(value);
                break;
            case 'segundoNombre':
                // Solo validar si tiene contenido
                if (value && value.trim()) {
                    error = validateSegundoNombre(value);
                }
                break;
            case 'apellidoPaterno':
                error = validateApellidoPaterno(value);
                break;
            case 'apellidoMaterno':
                // Solo validar si tiene contenido
                if (value && value.trim()) {
                    error = validateApellidoMaterno(value);
                }
                break;
            case 'telefono':
                // Solo validar si tiene contenido
                if (value && value.trim()) {
                    error = validateTelefono(value);
                }
                break;
            case 'fechaNacimiento':
                // Solo validar si tiene contenido
                if (value && value.trim()) {
                    error = validateFechaNacimiento(value);
                }
                break;
            case 'genero':
                // Solo validar si tiene contenido
                if (value && value.trim()) {
                    error = validateGenero(value);
                }
                break;
            default:
                break;
        }
        
        if (error) {
            showFieldError(name, error, 'personal');
        } else {
            // Limpiar error si la validación pasa
            setErrorsPersonal(prev => ({ ...prev, [name]: null }));
        }
    };

    const handlePersonalSubmit = async () => {
        const errors = validatePersonalData();
        setErrorsPersonal(errors);
        
        if (Object.keys(errors).length > 0) {
            return;
        }
        
        setLoadingPersonal(true);
        setMessagePersonal({ type: '', text: '' });

        try {
            await updateUser(personalData);
            setMessagePersonal({ type: 'success', text: 'Información personal actualizada correctamente' });
            setIsEditingPersonal(false);
        } catch (error) {
            console.error("Error al actualizar perfil:", error);
            
            if (error.response) {
                const { status, data } = error.response;
                
                if (status === 400) {
                    // Verificar errores específicos del backend
                    if (data.message && typeof data.message === 'object' && data.message.dataInfo) {
                        // Error estructurado del backend
                        const { dataInfo, message } = data.message;
                        showFieldError(dataInfo, message, 'personal');
                    } else if (data.message && typeof data.message === 'string') {
                        const errorDetails = parseBackendError(data.message, 'personal');
                        showFieldError(errorDetails.field, errorDetails.message, 'personal');
                    } else if (data.details && typeof data.details === 'string') {
                        const errorDetails = parseBackendError(data.details, 'personal');
                        showFieldError(errorDetails.field, errorDetails.message, 'personal');
                    } else if (data.details && typeof data.details === 'object') {
                        const detailsStr = JSON.stringify(data.details);
                        const errorDetails = parseBackendError(detailsStr, 'personal');
                        showFieldError(errorDetails.field, errorDetails.message, 'personal');
                    } else {
                        setMessagePersonal({ type: 'error', text: 'Error de validación - revisa todos los campos' });
                    }
                } else if (status === 409) {
                    // Email duplicado
                    if (data.message && data.message.includes("email")) {
                        showFieldError("email", "⚠️ Este email ya está siendo usado por otra persona", 'personal');
                    } else {
                        setMessagePersonal({ type: 'error', text: 'Conflicto con los datos proporcionados' });
                    }
                } else {
                    setMessagePersonal({ type: 'error', text: 'Error al actualizar información personal' });
                }
            } else {
                setMessagePersonal({ type: 'error', text: 'Error al actualizar información personal' });
            }
        } finally {
            setLoadingPersonal(false);
        }
    };

    // Handlers para direcciones - ahora usando el CRUD individual
    const handleCreateDireccion = async (direccionData) => {
        try {
            await createDireccion(direccionData);
            setMessageDirecciones({ type: 'success', text: 'Dirección creada correctamente' });
            setIsEditingDirecciones(false);
        } catch (error) {
            console.error('❌ Perfil: Error al crear dirección:', error);
            if (error.response?.data?.message) {
                setMessageDirecciones({ type: 'error', text: error.response.data.message });
            } else {
                setMessageDirecciones({ type: 'error', text: 'Error al crear dirección' });
            }
            throw error;
        }
    };

    const handleUpdateDireccion = async (direccionId, direccionData) => {
        try {
            await updateDireccion(direccionId, direccionData);
            setMessageDirecciones({ type: 'success', text: 'Dirección actualizada correctamente' });
        } catch (error) {
            console.error('❌ Perfil: Error al actualizar dirección:', error);
            if (error.response?.data?.message) {
                setMessageDirecciones({ type: 'error', text: error.response.data.message });
            } else {
                setMessageDirecciones({ type: 'error', text: 'Error al actualizar dirección' });
            }
            throw error;
        }
    };

    const handleDeleteDireccion = async (direccionId) => {
        try {
            await deleteDireccion(direccionId);
            setMessageDirecciones({ type: 'success', text: 'Dirección eliminada correctamente' });
        } catch (error) {
            console.error('❌ Perfil: Error al eliminar dirección:', error);
            if (error.response?.data?.message) {
                setMessageDirecciones({ type: 'error', text: error.response.data.message });
            } else {
                setMessageDirecciones({ type: 'error', text: 'Error al eliminar dirección' });
            }
            throw error;
        }
    };

    const handleSetPrincipal = async (direccionId) => {
        try {
            await setPrincipal(direccionId);
            setMessageDirecciones({ type: 'success', text: 'Dirección principal actualizada' });
        } catch (error) {
            console.error('❌ Perfil: Error al establecer dirección principal:', error);
            if (error.response?.data?.message) {
                setMessageDirecciones({ type: 'error', text: error.response.data.message });
            } else {
                setMessageDirecciones({ type: 'error', text: 'Error al establecer dirección principal' });
            }
                         throw error;
        }
    };

    // Handlers para seguridad
    const handleSecurityChange = (e) => {
        const { name, value } = e.target;
        setSecurityData(prev => ({ ...prev, [name]: value }));
        // Limpiar error del campo
        if (errorsSecurity[name]) {
            setErrorsSecurity(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSecuritySubmit = async () => {
        const errors = validateSecurityData();
        setErrorsSecurity(errors);
        
        if (Object.keys(errors).length > 0) {
            return;
        }
        
        if (!securityData.newPassword) {
            setMessageSecurity({ type: 'error', text: 'Ingresa una nueva contraseña para cambiarla' });
            return;
        }

        setLoadingSecurity(true);
        setMessageSecurity({ type: '', text: '' });

        try {
            await updateUser({
                password: securityData.password,
                newPassword: securityData.newPassword
            });
            
            setMessageSecurity({ type: 'success', text: 'Contraseña cambiada correctamente' });
            setIsEditingSecurity(false);
            setSecurityData({ password: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            console.error("Error al cambiar contraseña:", error);
            
            if (error.response) {
                const { status, data } = error.response;
                
                if (status === 400) {
                    if (data.message && typeof data.message === 'object' && data.message.dataInfo) {
                        // Error estructurado del backend
                        const { dataInfo, message } = data.message;
                        showFieldError(dataInfo, message, 'security');
                    } else if (data.message && typeof data.message === 'string') {
                        const errorDetails = parseBackendError(data.message, 'security');
                        showFieldError(errorDetails.field, errorDetails.message, 'security');
                    } else if (data.details && typeof data.details === 'string') {
                        const errorDetails = parseBackendError(data.details, 'security');
                        showFieldError(errorDetails.field, errorDetails.message, 'security');
                    } else {
                        setMessageSecurity({ type: 'error', text: 'Error de validación - revisa los campos de contraseña' });
                    }
                } else if (status === 401) {
                    // Contraseña actual incorrecta
                    showFieldError("password", "❌ Contraseña actual incorrecta", 'security');
                } else if (status === 403) {
                    setMessageSecurity({ type: 'error', text: 'No tienes permisos para cambiar la contraseña' });
                } else {
                    setMessageSecurity({ type: 'error', text: 'Error al cambiar contraseña' });
                }
            } else {
                setMessageSecurity({ type: 'error', text: 'Error al cambiar contraseña' });
            }
        } finally {
            setLoadingSecurity(false);
        }
    };

    // Funciones auxiliares
    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleNewPasswordVisibility = () => setShowNewPassword(!showNewPassword);

    if (!isAuthenticated) {
        return (
            <div className="perfil-container">
                <div className="access-denied">
                    <FaShieldAlt className="denied-icon" />
                    <h1>Acceso Denegado</h1>
                    <p>Debes iniciar sesión para ver tu perfil</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="perfil-loading">
                <FaSpinner className="spinner" />
                <p>Cargando datos del usuario...</p>
            </div>
        );
    }

    return (
        <div className="perfil-container">
            <div className="perfil-header">
                <div className="header-content">
                    <div className="user-avatar">
                        <div className="avatar-circle">
                            <FaUser className="avatar-icon" />
                        </div>
                        {user?.rol === 'administrador' && (
                            <div className="admin-badge">
                                <FaCrown />
                            </div>
                        )}
                    </div>
                    <div className="user-info">
                        <h1>{getNombreCompleto(user)}</h1>
                        <p className="user-email">{user?.email}</p>
                        <div className="user-meta">
                            <span className="user-role">
                                {user?.rol === 'administrador' ? 'Administrador' : 'Usuario'}
                            </span>
                            {user?.rut && (
                                <span className="user-rut">RUT: {user?.rut}</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="perfil-content">
                {/* SECCIÓN INFORMACIÓN PERSONAL */}
                <div className="form-section">
                    <div className="section-header">
                        <div className="section-title">
                            <FaUser className="section-icon" />
                            <h2>Información Personal</h2>
                        </div>
                        <p className="section-description">
                            Tu información básica de contacto
                        </p>
                        <div className="section-actions">
                            {!isEditingPersonal ? (
                            <button 
                                className="btn-edit"
                                    onClick={() => setIsEditingPersonal(true)}
                            >
                                <FaEdit />
                                    Editar
                            </button>
                        ) : (
                            <div className="edit-actions">
                                <button 
                                    className="btn-cancel"
                                        onClick={() => {
                                            setIsEditingPersonal(false);
                                            setErrorsPersonal({});
                                            setMessagePersonal({ type: '', text: '' });
                                            // Restaurar datos originales
                                            if (user) {
                                                setPersonalData({
                                                    primerNombre: user.primerNombre || '',
                                                    segundoNombre: user.segundoNombre || '',
                                                    apellidoPaterno: user.apellidoPaterno || '',
                                                    apellidoMaterno: user.apellidoMaterno || '',
                                                    email: user.email || '',
                                                    telefono: user.telefono || '',
                                                    fechaNacimiento: user.fechaNacimiento || '',
                                                    genero: user.genero || ''
                                                });
                                            }
                                        }}
                                        disabled={loadingPersonal}
                                >
                                    <FaTimes />
                                    Cancelar
                                </button>
                                <button 
                                    className="btn-save"
                                        onClick={handlePersonalSubmit}
                                        disabled={loadingPersonal}
                                >
                                        {loadingPersonal ? (
                                        <>
                                            <FaSpinner className="spinner" />
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            <FaSave />
                                            Guardar
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                </div>
            </div>

                    {messagePersonal.text && (
                        <div className={`message ${messagePersonal.type}`}>
                            {messagePersonal.type === 'success' ? <FaCheckCircle /> : <FaExclamationTriangle />}
                            <span>{messagePersonal.text}</span>
                </div>
            )}
                        
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Primer Nombre *</label>
                                <input
                                    type="text"
                                    name="primerNombre"
                                value={personalData.primerNombre}
                                onChange={handlePersonalChange}
                                disabled={!isEditingPersonal}
                                    required
                                    placeholder="Tu primer nombre"
                                className={errorsPersonal.primerNombre ? 'error' : ''}
                                />
                            {errorsPersonal.primerNombre && (
                                <span className="error-message">{errorsPersonal.primerNombre}</span>
                            )}
                            </div>
                            <div className="form-group">
                                <label>Segundo Nombre</label>
                                <input
                                    type="text"
                                    name="segundoNombre"
                                value={personalData.segundoNombre}
                                onChange={handlePersonalChange}
                                disabled={!isEditingPersonal}
                                    placeholder="Tu segundo nombre (opcional)"
                                className={errorsPersonal.segundoNombre ? 'error' : ''}
                                />
                            {errorsPersonal.segundoNombre && (
                                <span className="error-message">{errorsPersonal.segundoNombre}</span>
                            )}
                            </div>
                            <div className="form-group">
                                <label>Apellido Paterno *</label>
                                <input
                                    type="text"
                                    name="apellidoPaterno"
                                value={personalData.apellidoPaterno}
                                onChange={handlePersonalChange}
                                disabled={!isEditingPersonal}
                                    required
                                    placeholder="Tu apellido paterno"
                                className={errorsPersonal.apellidoPaterno ? 'error' : ''}
                                />
                            {errorsPersonal.apellidoPaterno && (
                                <span className="error-message">{errorsPersonal.apellidoPaterno}</span>
                            )}
                            </div>
                            <div className="form-group">
                                <label>Apellido Materno</label>
                                <input
                                    type="text"
                                    name="apellidoMaterno"
                                value={personalData.apellidoMaterno}
                                onChange={handlePersonalChange}
                                disabled={!isEditingPersonal}
                                    placeholder="Tu apellido materno (opcional)"
                                className={errorsPersonal.apellidoMaterno ? 'error' : ''}
                                />
                            {errorsPersonal.apellidoMaterno && (
                                <span className="error-message">{errorsPersonal.apellidoMaterno}</span>
                            )}
                            </div>
                            <div className="form-group">
                                <label>Email *</label>
                                <div className="input-with-icon">
                                    <FaEnvelope className="input-icon" />
                                    <input
                                        type="email"
                                        name="email"
                                    value={personalData.email}
                                    onChange={handlePersonalChange}
                                    disabled={!isEditingPersonal}
                                        required
                                        placeholder="tu@email.com"
                                    className={errorsPersonal.email ? 'error' : ''}
                                    />
                                </div>
                            {errorsPersonal.email && (
                                <span className="error-message">{errorsPersonal.email}</span>
                            )}
                            </div>
                            <div className="form-group">
                                <label>Teléfono</label>
                                <div className="input-with-icon">
                                    <FaPhone className="input-icon" />
                                    <input
                                        type="tel"
                                        name="telefono"
                                    value={personalData.telefono}
                                    onChange={handlePersonalChange}
                                    disabled={!isEditingPersonal}
                                    placeholder="9 1234 5678"
                                    className={errorsPersonal.telefono ? 'error' : ''}
                                    />
                                </div>
                            {errorsPersonal.telefono && (
                                <span className="error-message">{errorsPersonal.telefono}</span>
                            )}
                            </div>
                            <div className="form-group">
                                <label>Fecha de Nacimiento</label>
                                <div className="input-with-icon">
                                    <FaCalendarAlt className="input-icon" />
                                    <input
                                        type="date"
                                        name="fechaNacimiento"
                                    value={personalData.fechaNacimiento}
                                    onChange={handlePersonalChange}
                                    disabled={!isEditingPersonal}
                                    className={errorsPersonal.fechaNacimiento ? 'error' : ''}
                                    />
                                </div>
                            {errorsPersonal.fechaNacimiento && (
                                <span className="error-message">{errorsPersonal.fechaNacimiento}</span>
                            )}
                            </div>
                            <div className="form-group">
                                <label>Género</label>
                                    <select
                                        name="genero"
                                value={personalData.genero}
                                onChange={handlePersonalChange}
                                disabled={!isEditingPersonal}
                                className={errorsPersonal.genero ? 'error' : ''}
                                    >
                                        <option value="">Seleccionar...</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Femenino">Femenino</option>
                                <option value="No binario">No binario</option>
                                <option value="Prefiero no decir">Prefiero no decir</option>
                                    </select>
                            {errorsPersonal.genero && (
                                <span className="error-message">{errorsPersonal.genero}</span>
                            )}
                            </div>
                        </div>
                    </div>

                {/* SECCIÓN DIRECCIONES */}
                    <div className="form-section">
                        <div className="section-header">
                            <div className="section-title">
                                <FaMapMarkerAlt className="section-icon" />
                                <h2>Direcciones</h2>
                            </div>
                            <p className="section-description">
                                Gestiona tus direcciones para envíos
                            </p>
                        <div className="section-actions">
                                <button 
                                    type="button" 
                                    className="btn-add"
                                onClick={() => setIsEditingDirecciones(true)}
                                >
                                    <FaPlus />
                                    Agregar
                                </button>
                        </div>
                    </div>
                    
                    {messageDirecciones.text && (
                        <div className={`message ${messageDirecciones.type}`}>
                            {messageDirecciones.type === 'success' ? <FaCheckCircle /> : <FaExclamationTriangle />}
                            <span>{messageDirecciones.text}</span>
                        </div>
                    )}
                    
                    {/* Formulario para crear nueva dirección */}
                    {isEditingDirecciones && (
                        <CrearDireccionForm
                            onSave={handleCreateDireccion}
                            onCancel={() => setIsEditingDirecciones(false)}
                            showFieldError={showFieldError}
                            errors={errorsDirecciones}
                            existeDireccionPrincipal={direccionesApi.some(dir => dir.esPrincipal)}
                        />
                    )}
                    
                    {/* Loading state */}
                    {direccionesApiLoading && (
                        <div className="loading-direcciones">
                            <FaSpinner className="spinner" />
                            <span>Cargando direcciones...</span>
                        </div>
                    )}
                    
                    {/* Error state */}
                    {direccionesApiError && (
                        <div className="error-direcciones">
                            <FaExclamationTriangle />
                            <span>{direccionesApiError}</span>
                        </div>
                    )}
                    
                    {/* Empty state */}
                    {!direccionesApiLoading && direccionesApi.length === 0 && !isEditingDirecciones ? (
                        <div className="direcciones-empty-state">
                            <FaMapMarkerAlt className="direcciones-empty-icon" />
                                <h3>No tienes direcciones</h3>
                                <p>Agrega tu primera dirección para recibir envíos</p>
                                <button 
                                    type="button" 
                                className="btn-add-direccion"
                                onClick={() => setIsEditingDirecciones(true)}
                                >
                                    <FaPlus />
                                    Agregar Dirección
                                </button>
                            </div>
                        ) : (
                        /* Lista de direcciones */
                            <div className="direcciones-list">
                            {direccionesApi.map((direccion) => (
                                <DireccionCard
                                    key={direccion.id}
                                    direccion={direccion}
                                    onUpdate={handleUpdateDireccion}
                                    onDelete={handleDeleteDireccion}
                                    onSetPrincipal={handleSetPrincipal}
                                    showFieldError={showFieldError}
                                    errors={errorsDirecciones}
                                />
                                ))}
                            </div>
                        )}
                    </div>

                {/* SECCIÓN SEGURIDAD */}
                        <div className="form-section security-section">
                            <div className="section-header">
                                <div className="section-title">
                                    <FaShieldAlt className="section-icon" />
                                    <h2>Seguridad</h2>
                                </div>
                                <p className="section-description">
                            {isEditingSecurity ? "Cambia tu contraseña para mantener tu cuenta segura" : "Mantén tu cuenta segura"}
                                </p>
                        <div className="section-actions">
                            {!isEditingSecurity ? (
                                <button 
                                    className="btn-edit"
                                    onClick={() => setIsEditingSecurity(true)}
                                >
                                    <FaEdit />
                                    Cambiar Contraseña
                                </button>
                            ) : (
                                <div className="edit-actions">
                                    <button 
                                        className="btn-cancel"
                                        onClick={() => {
                                            setIsEditingSecurity(false);
                                            setErrorsSecurity({});
                                            setMessageSecurity({ type: '', text: '' });
                                            setSecurityData({ password: '', newPassword: '', confirmPassword: '' });
                                        }}
                                        disabled={loadingSecurity}
                                    >
                                        <FaTimes />
                                        Cancelar
                                    </button>
                                    <button 
                                        className="btn-save"
                                        onClick={handleSecuritySubmit}
                                        disabled={loadingSecurity}
                                    >
                                        {loadingSecurity ? (
                                            <>
                                                <FaSpinner className="spinner" />
                                                Cambiando...
                                            </>
                                        ) : (
                                            <>
                                                <FaSave />
                                                Cambiar Contraseña
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                            </div>
                            
                    {messageSecurity.text && (
                        <div className={`message ${messageSecurity.type}`}>
                            {messageSecurity.type === 'success' ? <FaCheckCircle /> : <FaExclamationTriangle />}
                            <span>{messageSecurity.text}</span>
                        </div>
                    )}
                    
                    {isEditingSecurity && (
                            <div className="security-notice">
                                <FaShieldAlt className="notice-icon" />
                                <div>
                                    <h4>Cambiar Contraseña</h4>
                                <p>Completa todos los campos para cambiar tu contraseña</p>
                                </div>
                            </div>
                    )}
                            
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Contraseña Actual</label>
                                    <div className="password-input">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                    value={securityData.password}
                                    onChange={handleSecurityChange}
                                    disabled={!isEditingSecurity}
                                    placeholder={isEditingSecurity ? "Ingresa tu contraseña actual" : "••••••••"}
                                    className={errorsSecurity.password ? 'error' : ''}
                                        />
                                {isEditingSecurity && (
                                        <button
                                            type="button"
                                            className="password-toggle"
                                            onClick={togglePasswordVisibility}
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                )}
                                    </div>
                            {errorsSecurity.password && (
                                <span className="error-message">{errorsSecurity.password}</span>
                            )}
                                </div>
                                <div className="form-group">
                                    <label>Nueva Contraseña</label>
                                    <div className="password-input">
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            name="newPassword"
                                    value={securityData.newPassword}
                                    onChange={handleSecurityChange}
                                    disabled={!isEditingSecurity}
                                    placeholder={isEditingSecurity ? "Mínimo 6 caracteres" : "••••••••"}
                                    className={errorsSecurity.newPassword ? 'error' : ''}
                                        />
                                {isEditingSecurity && (
                                        <button
                                            type="button"
                                            className="password-toggle"
                                            onClick={toggleNewPasswordVisibility}
                                        >
                                            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                )}
                                    </div>
                            {errorsSecurity.newPassword && (
                                <span className="error-message">{errorsSecurity.newPassword}</span>
                            )}
                                </div>
                                <div className="form-group">
                                    <label>Confirmar Nueva Contraseña</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                value={securityData.confirmPassword}
                                onChange={handleSecurityChange}
                                disabled={!isEditingSecurity}
                                placeholder={isEditingSecurity ? "Repite la nueva contraseña" : "••••••••"}
                                className={errorsSecurity.confirmPassword ? 'error' : ''}
                            />
                            {errorsSecurity.confirmPassword && (
                                <span className="error-message">{errorsSecurity.confirmPassword}</span>
                            )}
                                </div>
                            </div>
                        </div>
            </div>
        </div>
    );
};

export default Perfil;

import { useState, useEffect } from 'react';
import { FaTimes, FaUser, FaEnvelope, FaIdCard, FaPhone, FaCalendar, FaLock, FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import useCreateUser from '@hooks/users/useCreateUser';
import { validationRules } from '@helpers/validation.helper';
import { formatRut, formatTelefono } from '@helpers/formatData';
import DatePicker from './DatePicker';
import '@styles/crearUsuario.css';

const CrearUsuarioPopup = ({ show, setShow, onUsuarioCreated }) => {
    const { handleCreateUser, loading } = useCreateUser();
    
    const [formData, setFormData] = useState({
        primerNombre: '',
        segundoNombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        rut: '',
        email: '',
        password: '',
        confirmPassword: '',
        telefono: '',
        fechaNacimiento: '',
        genero: '',
        rol: 'usuario'
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        if (show) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }

        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, [show]);

    const showAlert = (message) => {
        setAlert(message);
        setTimeout(() => setAlert(null), 2000);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;
        
        // Validaciones específicas durante la escritura
        if (name === 'rut') {
            // Solo permitir números y K
            if (!/^[0-9kK\.\-]*$/.test(value)) {
                showAlert('El RUT solo puede contener números y la letra K');
                return;
            }
            newValue = formatRut(value);
        } else if (name === 'telefono') {
            // Solo permitir números y el símbolo +
            if (!/^[\+\d\s]*$/.test(value)) {
                showAlert('El teléfono solo puede contener números y el símbolo +');
                return;
            }
            newValue = value.replace(/[^\+\d]/g, '');
        } else if (['primerNombre', 'apellidoPaterno'].includes(name)) {
            // Validaciones para nombres sin espacios
            if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]*$/.test(value)) {
                showAlert('Los nombres solo pueden contener letras (sin espacios)');
                return;
            }
            
            // No permitir espacios
            if (/\s/.test(value)) {
                showAlert('El nombre no puede contener espacios');
                return;
            }
            
            // No permitir completamente en mayúsculas
            if (value === value.toUpperCase() && value.length > 1) {
                showAlert('El nombre no puede estar completamente en mayúsculas');
                return;
            }
            
            // Validar mayúsculas correctas (solo si tiene más de 1 carácter)
            if (value.length > 1) {
                // La primera letra debe ser mayúscula
                if (value[0] !== value[0].toUpperCase()) {
                    showAlert('El nombre debe tener mayúscula al inicio');
                    return;
                }
                // El resto debe ser minúscula
                if (value.slice(1) !== value.slice(1).toLowerCase()) {
                    showAlert('El nombre solo debe tener mayúscula al inicio');
                    return;
                }
            }
            
            // No más de 2 letras iguales consecutivas
            if (/(.)\1{2,}/.test(value)) {
                showAlert('El nombre no puede tener más de 2 letras iguales consecutivas');
                return;
            }
            
            // Limitar longitud
            if (value.length > 50) {
                showAlert('El nombre no puede exceder 50 caracteres');
                return;
            }
        } else if (name === 'segundoNombre') {
            // Validaciones para segundo nombre (puede tener 1 espacio)
            if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) {
                showAlert('El segundo nombre solo puede contener letras y espacios');
                return;
            }
            
            // No permitir más de 1 espacio consecutivo
            if (/\s{2,}/.test(value)) {
                showAlert('No se permiten más de 1 espacio consecutivo');
                return;
            }
            
            // No permitir empezar con espacio
            if (/^\s/.test(value) && value.length === 1) {
                showAlert('El segundo nombre no puede empezar con un espacio');
                return;
            }
            
            // No permitir completamente en mayúsculas
            if (value === value.toUpperCase() && value.length > 1) {
                showAlert('El segundo nombre no puede estar completamente en mayúsculas');
                return;
            }
            
            // Validar mayúsculas correctas (solo si tiene más de 1 carácter)
            if (value.length > 1) {
                const words = value.split(' ');
                for (let i = 0; i < words.length; i++) {
                    const word = words[i];
                    if (word.length > 0) {
                        // La primera letra debe ser mayúscula
                        if (word[0] !== word[0].toUpperCase()) {
                            showAlert('El segundo nombre debe tener mayúscula al inicio de cada palabra');
                            return;
                        }
                        // El resto debe ser minúscula
                        if (word.length > 1 && word.slice(1) !== word.slice(1).toLowerCase()) {
                            showAlert('El segundo nombre solo debe tener mayúscula al inicio de cada palabra');
                            return;
                        }
                    }
                }
            }
            
            // No más de 2 letras iguales consecutivas
            if (/(.)\1{2,}/.test(value)) {
                showAlert('El segundo nombre no puede tener más de 2 letras iguales consecutivas');
                return;
            }
            
            // Limitar longitud
            if (value.length > 50) {
                showAlert('El segundo nombre no puede exceder 50 caracteres');
                return;
            }
        } else if (name === 'apellidoMaterno') {
            // Validaciones para apellido materno (hasta 2 espacios)
            if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) {
                showAlert('El apellido materno solo puede contener letras y espacios');
                return;
            }
            
            // No permitir más de 1 espacio consecutivo
            if (/\s{2,}/.test(value)) {
                showAlert('No se permiten más de 1 espacio consecutivo');
                return;
            }
            
            // No permitir empezar con espacio
            if (/^\s/.test(value) && value.length === 1) {
                showAlert('El apellido materno no puede empezar con un espacio');
                return;
            }
            
            // No permitir completamente en mayúsculas
            if (value === value.toUpperCase() && value.length > 1) {
                showAlert('El apellido materno no puede estar completamente en mayúsculas');
                return;
            }
            
            // Validar mayúsculas correctas (solo si tiene más de 1 carácter)
            if (value.length > 1) {
                const words = value.split(' ');
                for (let i = 0; i < words.length; i++) {
                    const word = words[i];
                    if (word.length > 0) {
                        // La primera letra debe ser mayúscula
                        if (word[0] !== word[0].toUpperCase()) {
                            showAlert('El apellido materno debe tener mayúscula al inicio de cada palabra');
                            return;
                        }
                        // El resto debe ser minúscula
                        if (word.length > 1 && word.slice(1) !== word.slice(1).toLowerCase()) {
                            showAlert('El apellido materno solo debe tener mayúscula al inicio de cada palabra');
                            return;
                        }
                    }
                }
            }
            
            // No más de 2 letras iguales consecutivas
            if (/(.)\1{2,}/.test(value)) {
                showAlert('El apellido materno no puede tener más de 2 letras iguales consecutivas');
                return;
            }
            
            // Limitar longitud
            if (value.length > 50) {
                showAlert('El apellido materno no puede exceder 50 caracteres');
                return;
            }
        } else if (name === 'email') {
            // Básicamente no validar durante escritura, solo al enviar
            newValue = value.toLowerCase();
        }
        
        setFormData(prev => ({ ...prev, [name]: newValue }));
        
        // Limpiar error al escribir
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const isFormValid = () => {
        return (
            formData.primerNombre.trim().length >= 2 &&
            formData.apellidoPaterno.trim().length >= 2 &&
            formData.rut.trim().length >= 11 &&
            formData.email.trim().length >= 5 &&
            formData.password.length >= 6 &&
            formData.confirmPassword.length >= 6 &&
            formData.password === formData.confirmPassword
        );
    };

    const validateForm = () => {
        const newErrors = {};

        // Validar primer nombre
        const primerNombreError = validationRules.nombre(formData.primerNombre, 'Primer nombre');
        if (primerNombreError || !formData.primerNombre.trim()) {
            newErrors.primerNombre = primerNombreError || 'El primer nombre es requerido';
        }

        // Validar segundo nombre (opcional)
        if (formData.segundoNombre.trim()) {
            const segundoNombreError = validationRules.segundoNombre(formData.segundoNombre, 'Segundo nombre');
            if (segundoNombreError) {
                newErrors.segundoNombre = segundoNombreError;
            }
        }

        // Validar apellido paterno
        const apellidoPaternoError = validationRules.apellidoPaterno(formData.apellidoPaterno, 'Apellido paterno');
        if (apellidoPaternoError || !formData.apellidoPaterno.trim()) {
            newErrors.apellidoPaterno = apellidoPaternoError || 'El apellido paterno es requerido';
        }

        // Validar apellido materno (opcional)
        if (formData.apellidoMaterno.trim()) {
            const apellidoMaternoError = validationRules.apellidoMaterno(formData.apellidoMaterno, 'Apellido materno');
            if (apellidoMaternoError) {
                newErrors.apellidoMaterno = apellidoMaternoError;
            }
        }

        // Validar RUT
        const rutError = validationRules.rut(formData.rut);
        if (rutError) {
            newErrors.rut = rutError;
        }

        // Validar email
        const emailError = validationRules.email(formData.email);
        if (emailError || !formData.email.trim()) {
            newErrors.email = emailError || 'El email es requerido';
        }

        // Validar contraseña
        if (!formData.password.trim()) {
            newErrors.password = 'La contraseña es requerida';
        } else {
            const passwordError = validationRules.password(formData.password);
            if (passwordError) {
                newErrors.password = passwordError;
            }
        }

        // Validar confirmación de contraseña
        if (!formData.confirmPassword.trim()) {
            newErrors.confirmPassword = 'Confirmar contraseña es requerido';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }

        // Validar teléfono (opcional)
        if (formData.telefono.trim()) {
            const telefonoError = validationRules.telefonoChileno(formData.telefono);
            if (telefonoError) {
                newErrors.telefono = telefonoError;
            }
        }

        // Validar fecha de nacimiento (opcional)
        if (formData.fechaNacimiento) {
            const fechaError = validationRules.fechaNacimiento(formData.fechaNacimiento);
            if (fechaError) {
                newErrors.fechaNacimiento = fechaError;
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
        setFormData({
            primerNombre: '',
            segundoNombre: '',
            apellidoPaterno: '',
            apellidoMaterno: '',
            rut: '',
            email: '',
            password: '',
            confirmPassword: '',
            telefono: '',
            fechaNacimiento: '',
            genero: '',
            rol: 'usuario'
        });
        setErrors({});
        setAlert(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            showAlert('Por favor, corrige los errores en el formulario');
            return;
        }

        const userData = {
            primerNombre: formData.primerNombre.trim(),
            segundoNombre: formData.segundoNombre.trim() || null,
            apellidoPaterno: formData.apellidoPaterno.trim(),
            apellidoMaterno: formData.apellidoMaterno.trim() || null,
            rut: formData.rut.trim(),
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
            telefono: formData.telefono.trim() || null,
            fechaNacimiento: formData.fechaNacimiento || null,
            genero: formData.genero || null,
            rol: formData.rol
        };

        const result = await handleCreateUser(userData);
        
        if (result.success) {
            onUsuarioCreated();
            handleClose();
        } else if (result.field) {
            setErrors(prev => ({ ...prev, [result.field]: result.error }));
        } else {
            showAlert(result.error || 'Error al crear el usuario');
        }
    };

    const handleClose = () => {
        setShow(false);
        resetForm();
    };

    if (!show) return null;

    return (
        <div className="crear-usuario-overlay">
            <div className="crear-usuario-modal">
                {alert && (
                    <div className="alert-notification">
                        <span>{alert}</span>
                    </div>
                )}
                
                <div className="crear-usuario-header">
                    <h2>👤 Crear Nuevo Usuario</h2>
                    <button 
                        className="close-button" 
                        onClick={handleClose}
                        type="button"
                        disabled={loading}
                    >
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="crear-usuario-form">
                    <div className="usuario-form-grid">
                        <div className="form-section">
                            <h3>📝 Información Personal</h3>
                            
                        <div className="form-row">
                            <div className="form-group">
                                    <label htmlFor="primerNombre">Primer Nombre *</label>
                                <input
                                    type="text"
                                    id="primerNombre"
                                    name="primerNombre"
                                    value={formData.primerNombre}
                                    onChange={handleInputChange}
                                    className={errors.primerNombre ? 'error' : ''}
                                    disabled={loading}
                                        placeholder="Ej: Juan"
                                        maxLength={50}
                                />
                                {errors.primerNombre && <span className="error-message">{errors.primerNombre}</span>}
                            </div>

                            <div className="form-group">
                                    <label htmlFor="segundoNombre">Segundo Nombre</label>
                                <input
                                    type="text"
                                    id="segundoNombre"
                                    name="segundoNombre"
                                    value={formData.segundoNombre}
                                    onChange={handleInputChange}
                                        className={errors.segundoNombre ? 'error' : ''}
                                    disabled={loading}
                                        placeholder="Ej: Carlos (opcional)"
                                        maxLength={50}
                                />
                                    {errors.segundoNombre && <span className="error-message">{errors.segundoNombre}</span>}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                    <label htmlFor="apellidoPaterno">Apellido Paterno *</label>
                                <input
                                    type="text"
                                    id="apellidoPaterno"
                                    name="apellidoPaterno"
                                    value={formData.apellidoPaterno}
                                    onChange={handleInputChange}
                                    className={errors.apellidoPaterno ? 'error' : ''}
                                    disabled={loading}
                                        placeholder="Ej: Pérez"
                                        maxLength={50}
                                />
                                {errors.apellidoPaterno && <span className="error-message">{errors.apellidoPaterno}</span>}
                            </div>

                            <div className="form-group">
                                    <label htmlFor="apellidoMaterno">Apellido Materno</label>
                                <input
                                    type="text"
                                    id="apellidoMaterno"
                                    name="apellidoMaterno"
                                    value={formData.apellidoMaterno}
                                    onChange={handleInputChange}
                                        className={errors.apellidoMaterno ? 'error' : ''}
                                    disabled={loading}
                                        placeholder="Ej: González (opcional)"
                                        maxLength={50}
                                />
                                    {errors.apellidoMaterno && <span className="error-message">{errors.apellidoMaterno}</span>}
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <h3>🆔 Identificación y Contacto</h3>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="rut">
                                    <FaIdCard className="label-icon" />
                                    RUT *
                                </label>
                                <input
                                    type="text"
                                    id="rut"
                                    name="rut"
                                    value={formData.rut}
                                    onChange={handleInputChange}
                                    className={errors.rut ? 'error' : ''}
                                    disabled={loading}
                                    placeholder="12.345.678-9"
                                        maxLength={12}
                                />
                                    {formData.rut && (
                                        <small className="rut-formatted">
                                            RUT: {formData.rut}
                                        </small>
                                    )}
                                {errors.rut && <span className="error-message">{errors.rut}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">
                                    <FaEnvelope className="label-icon" />
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={errors.email ? 'error' : ''}
                                    disabled={loading}
                                    placeholder="usuario@ejemplo.com"
                                        maxLength={100}
                                />
                                {errors.email && <span className="error-message">{errors.email}</span>}
                            </div>
                        </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="telefono">
                                        <FaPhone className="label-icon" />
                                        Teléfono
                                    </label>
                                    <input
                                        type="tel"
                                        id="telefono"
                                        name="telefono"
                                        value={formData.telefono}
                                        onChange={handleInputChange}
                                        className={errors.telefono ? 'error' : ''}
                                        disabled={loading}
                                        placeholder="+56912345678"
                                        maxLength={15}
                                    />
                                    {formData.telefono && (
                                        <small className="telefono-formatted">
                                            Teléfono: {formatTelefono(formData.telefono)}
                                        </small>
                                    )}
                                    {errors.telefono && <span className="error-message">{errors.telefono}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="fechaNacimiento">
                                        <FaCalendar className="label-icon" />
                                        Fecha de Nacimiento
                                    </label>
                                    <DatePicker
                                        value={formData.fechaNacimiento}
                                        onChange={(value) => {
                                            setFormData(prev => ({ ...prev, fechaNacimiento: value }));
                                            if (errors.fechaNacimiento) {
                                                setErrors(prev => ({ ...prev, fechaNacimiento: '' }));
                                            }
                                        }}
                                        placeholder="Seleccionar fecha"
                                        disabled={loading}
                                    />
                                    {errors.fechaNacimiento && <span className="error-message">{errors.fechaNacimiento}</span>}
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <h3>🔐 Seguridad</h3>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="password">
                                    <FaLock className="label-icon" />
                                    Contraseña *
                                </label>
                                <div className="password-input-container">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className={errors.password ? 'error' : ''}
                                        disabled={loading}
                                        placeholder="Mínimo 6 caracteres"
                                            maxLength={50}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {errors.password && <span className="error-message">{errors.password}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword">
                                    <FaLock className="label-icon" />
                                    Confirmar Contraseña *
                                </label>
                                <div className="password-input-container">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className={errors.confirmPassword ? 'error' : ''}
                                        disabled={loading}
                                        placeholder="Confirme la contraseña"
                                            maxLength={50}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                            </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <h3>⚙️ Configuración</h3>

                        <div className="form-row">
                            <div className="form-group">
                                    <label htmlFor="genero">Género</label>
                                <select
                                    id="genero"
                                    name="genero"
                                    value={formData.genero}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                >
                                    <option value="">Seleccionar género</option>
                                    <option value="masculino">Masculino</option>
                                    <option value="femenino">Femenino</option>
                                    <option value="otro">Otro</option>
                                    <option value="no especificar">Prefiero no especificar</option>
                                </select>
                            </div>

                            <div className="form-group">
                                    <label htmlFor="rol">Rol *</label>
                                <select
                                    id="rol"
                                    name="rol"
                                    value={formData.rol}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                >
                                    <option value="usuario">Usuario</option>
                                    <option value="administrador">Administrador</option>
                                </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button 
                            type="button" 
                            onClick={handleClose}
                            className="btn-cancel"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            className="btn-create"
                            disabled={loading || !isFormValid()}
                        >
                            {loading ? (
                                <>
                                    <FaSpinner className="spinner" />
                                    Creando usuario...
                                </>
                            ) : (
                                'Crear Usuario'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CrearUsuarioPopup;
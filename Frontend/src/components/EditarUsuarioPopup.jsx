import { useState, useEffect } from 'react';
import { FaTimes, FaUser, FaEnvelope, FaIdCard, FaPhone, FaCalendar, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import useEditUser from '@hooks/users/useEditUser';
import { validateRUT } from '@helpers/validation.helper';
import { formatRut } from '@helpers/formatData';
import { getNombreCompleto } from '@helpers/nameHelpers';
import '@styles/popup.css';
import '@styles/form.css';

const EditarUsuarioPopup = ({ show, setShow, usuario, onUsuarioUpdated }) => {
    const { handleEditUser, loading } = useEditUser();
    
    const [formData, setFormData] = useState({
        primerNombre: '',
        segundoNombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        rut: '',
        email: '',
        password: '',
        newPassword: '',
        confirmNewPassword: '',
        telefono: '',
        fechaNacimiento: '',
        genero: '',
        rol: 'usuario'
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [changePassword, setChangePassword] = useState(false);
    const [rutModified, setRutModified] = useState(false);

    // Cargar datos del usuario cuando se abre el modal
    useEffect(() => {
        if (show && usuario) {
            setFormData({
                primerNombre: usuario.primerNombre || '',
                segundoNombre: usuario.segundoNombre || '',
                apellidoPaterno: usuario.apellidoPaterno || '',
                apellidoMaterno: usuario.apellidoMaterno || '',
                rut: usuario.rut || '',
                email: usuario.email || '',
                password: '',
                newPassword: '',
                confirmNewPassword: '',
                telefono: usuario.telefono || '',
                fechaNacimiento: usuario.fechaNacimiento ? usuario.fechaNacimiento.split('T')[0] : '',
                genero: usuario.genero || '',
                rol: usuario.rol || 'usuario'
            });
            setChangePassword(false);
            setErrors({});
            setRutModified(false);
        }
    }, [show, usuario]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'rut') {
            const formattedRut = formatRut(value);
            setFormData(prev => ({ ...prev, [name]: formattedRut }));
            setRutModified(true);
        } else if (name === 'telefono') {
            // Formatear teléfono permitiendo solo números y el símbolo +
            const cleanedValue = value.replace(/[^+\d]/g, '');
            setFormData(prev => ({ ...prev, [name]: cleanedValue }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        
        // Limpiar error al escribir
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Validar campos requeridos
        if (!formData.primerNombre.trim()) {
            newErrors.primerNombre = 'El primer nombre es requerido';
        }

        if (!formData.apellidoPaterno.trim()) {
            newErrors.apellidoPaterno = 'El apellido paterno es requerido';
        }

        if (!formData.rut.trim()) {
            newErrors.rut = 'El RUT es requerido';
        } else if (rutModified) {
            // Solo validar si el RUT ha sido modificado por el usuario
            const isValid = validateRUT(formData.rut);
            if (!isValid) {
                newErrors.rut = 'El RUT no es válido';
            }
        }

        if (!formData.email.trim()) {
            newErrors.email = 'El email es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'El email no es válido';
        }

        // Validar contraseña actual si se quiere cambiar contraseña
        if (changePassword) {
            if (!formData.password.trim()) {
                newErrors.password = 'La contraseña actual es requerida';
            }

            if (!formData.newPassword.trim()) {
                newErrors.newPassword = 'La nueva contraseña es requerida';
            } else if (formData.newPassword.length < 6) {
                newErrors.newPassword = 'La nueva contraseña debe tener al menos 6 caracteres';
            }

            if (!formData.confirmNewPassword.trim()) {
                newErrors.confirmNewPassword = 'Confirmar nueva contraseña es requerido';
            } else if (formData.newPassword !== formData.confirmNewPassword) {
                newErrors.confirmNewPassword = 'Las contraseñas no coinciden';
            }
        }

        // Validar teléfono si se proporciona
        if (formData.telefono) {
            const cleanPhone = formData.telefono.replace(/\s/g, '');
            if (!/^\+?[1-9]\d{7,14}$/.test(cleanPhone)) {
                newErrors.telefono = 'El teléfono debe tener entre 8 y 15 dígitos (ej: +56912345678)';
            }
        }

        // Validar fecha de nacimiento si se proporciona
        if (formData.fechaNacimiento) {
            const birthDate = new Date(formData.fechaNacimiento);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            
            if (age < 18 || age > 120) {
                newErrors.fechaNacimiento = 'La edad debe estar entre 18 y 120 años';
            }
        }

        setErrors(newErrors);
        
        // Auto-dismiss errors after 2 seconds
        if (Object.keys(newErrors).length > 0) {
            setTimeout(() => {
                setErrors({});
            }, 2000);
        }
        
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        const userData = {
            primerNombre: formData.primerNombre.trim(),
            segundoNombre: formData.segundoNombre.trim() || null,
            apellidoPaterno: formData.apellidoPaterno.trim(),
            apellidoMaterno: formData.apellidoMaterno.trim() || null,
            rut: formData.rut.trim(),
            email: formData.email.trim().toLowerCase(),
            telefono: formData.telefono.trim() || null,
            fechaNacimiento: formData.fechaNacimiento || null,
            genero: formData.genero || null,
            rol: formData.rol
        };

        // Agregar campos de contraseña solo si se quiere cambiar
        if (changePassword) {
            userData.password = formData.password;
            userData.newPassword = formData.newPassword;
        }

        const query = { id: usuario.id };
        const result = await handleEditUser(userData, query);
        
        if (result.success) {
            onUsuarioUpdated();
            handleClose();
        } else if (result.field) {
            setErrors(prev => ({ ...prev, [result.field]: result.error }));
        }
    };

    const handleClose = () => {
        setFormData({
            primerNombre: '',
            segundoNombre: '',
            apellidoPaterno: '',
            apellidoMaterno: '',
            rut: '',
            email: '',
            password: '',
            newPassword: '',
            confirmNewPassword: '',
            telefono: '',
            fechaNacimiento: '',
            genero: '',
            rol: 'usuario'
        });
        setErrors({});
        setChangePassword(false);
        setRutModified(false);
        setShow(false);
    };

    if (!show || !usuario) return null;

    return (
        <div className="popup-overlay" onClick={handleClose}>
            <div className="popup-content editar-usuario-popup" onClick={(e) => e.stopPropagation()}>
                <div className="popup-header">
                    <h2>
                        <FaUser className="header-icon" />
                        Editar Usuario: {getNombreCompleto(usuario)}
                    </h2>
                    <button 
                        className="popup-close"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="usuario-form">
                    <div className="editar-usuario-grid">
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="primerNombre">
                                    Primer Nombre *
                                </label>
                                <input
                                    type="text"
                                    id="primerNombre"
                                    name="primerNombre"
                                    value={formData.primerNombre}
                                    onChange={handleInputChange}
                                    className={errors.primerNombre ? 'error' : ''}
                                    disabled={loading}
                                    placeholder="Ingrese el primer nombre"
                                />
                                {errors.primerNombre && <span className="error-message">{errors.primerNombre}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="segundoNombre">
                                    Segundo Nombre
                                </label>
                                <input
                                    type="text"
                                    id="segundoNombre"
                                    name="segundoNombre"
                                    value={formData.segundoNombre}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    placeholder="Ingrese el segundo nombre (opcional)"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="apellidoPaterno">
                                    Apellido Paterno *
                                </label>
                                <input
                                    type="text"
                                    id="apellidoPaterno"
                                    name="apellidoPaterno"
                                    value={formData.apellidoPaterno}
                                    onChange={handleInputChange}
                                    className={errors.apellidoPaterno ? 'error' : ''}
                                    disabled={loading}
                                    placeholder="Ingrese el apellido paterno"
                                />
                                {errors.apellidoPaterno && <span className="error-message">{errors.apellidoPaterno}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="apellidoMaterno">
                                    Apellido Materno
                                </label>
                                <input
                                    type="text"
                                    id="apellidoMaterno"
                                    name="apellidoMaterno"
                                    value={formData.apellidoMaterno}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    placeholder="Ingrese el apellido materno (opcional)"
                                />
                            </div>
                        </div>

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
                                />
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
                                    placeholder="+56 9 1234 5678"
                                />
                                {errors.telefono && <span className="error-message">{errors.telefono}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="fechaNacimiento">
                                    <FaCalendar className="label-icon" />
                                    Fecha de Nacimiento
                                </label>
                                <input
                                    type="date"
                                    id="fechaNacimiento"
                                    name="fechaNacimiento"
                                    value={formData.fechaNacimiento}
                                    onChange={handleInputChange}
                                    className={errors.fechaNacimiento ? 'error' : ''}
                                    disabled={loading}
                                />
                                {errors.fechaNacimiento && <span className="error-message">{errors.fechaNacimiento}</span>}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="genero">
                                    Género
                                </label>
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
                                <label htmlFor="rol">
                                    Rol *
                                </label>
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

                        {/* Sección de cambio de contraseña */}
                        <div className="form-section">
                            <div className="form-section-header">
                                <label className="checkbox-container">
                                    <input
                                        type="checkbox"
                                        checked={changePassword}
                                        onChange={(e) => setChangePassword(e.target.checked)}
                                        disabled={loading}
                                    />
                                    <span className="checkmark"></span>
                                    Cambiar contraseña
                                </label>
                            </div>

                            {changePassword && (
                                <>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="password">
                                                <FaLock className="label-icon" />
                                                Contraseña Actual *
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
                                                    placeholder="Contraseña actual"
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
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="newPassword">
                                                <FaLock className="label-icon" />
                                                Nueva Contraseña *
                                            </label>
                                            <div className="password-input-container">
                                                <input
                                                    type={showNewPassword ? 'text' : 'password'}
                                                    id="newPassword"
                                                    name="newPassword"
                                                    value={formData.newPassword}
                                                    onChange={handleInputChange}
                                                    className={errors.newPassword ? 'error' : ''}
                                                    disabled={loading}
                                                    placeholder="Mínimo 6 caracteres"
                                                />
                                                <button
                                                    type="button"
                                                    className="password-toggle"
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                >
                                                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                                                </button>
                                            </div>
                                            {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="confirmNewPassword">
                                                <FaLock className="label-icon" />
                                                Confirmar Nueva Contraseña *
                                            </label>
                                            <div className="password-input-container">
                                                <input
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    id="confirmNewPassword"
                                                    name="confirmNewPassword"
                                                    value={formData.confirmNewPassword}
                                                    onChange={handleInputChange}
                                                    className={errors.confirmNewPassword ? 'error' : ''}
                                                    disabled={loading}
                                                    placeholder="Confirme la nueva contraseña"
                                                />
                                                <button
                                                    type="button"
                                                    className="password-toggle"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                >
                                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                                </button>
                                            </div>
                                            {errors.confirmNewPassword && <span className="error-message">{errors.confirmNewPassword}</span>}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="popup-actions">
                        <button 
                            type="button" 
                            className="btn btn-secondary"
                            onClick={handleClose}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Actualizando...' : 'Actualizar Usuario'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditarUsuarioPopup;
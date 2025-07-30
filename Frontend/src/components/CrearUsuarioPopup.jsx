import { useState } from 'react';
import { FaTimes, FaUser, FaEnvelope, FaIdCard, FaPhone, FaCalendar, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import useCreateUser from '@hooks/users/useCreateUser';
import { validateRUT } from '@helpers/validation.helper';
import { formatRut } from '@helpers/formatData';
import '@styles/popup.css';
import '@styles/form.css';

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'rut') {
            const formattedRut = formatRut(value);
            setFormData(prev => ({ ...prev, [name]: formattedRut }));
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
        } else if (!validateRUT(formData.rut)) {
            newErrors.rut = 'El RUT no es válido';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'El email es requerido';
        } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(formData.email)) {
            newErrors.email = 'El email no es válido';
        }

        if (!formData.password.trim()) {
            newErrors.password = 'La contraseña es requerida';
        } else if (formData.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        if (!formData.confirmPassword.trim()) {
            newErrors.confirmPassword = 'Confirmar contraseña es requerido';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }

        // Validar teléfono si se proporciona
        if (formData.telefono && !/^\\+?[1-9]\\d{1,14}$/.test(formData.telefono.replace(/\\s/g, ''))) {
            newErrors.telefono = 'El teléfono no es válido';
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
            confirmPassword: '',
            telefono: '',
            fechaNacimiento: '',
            genero: '',
            rol: 'usuario'
        });
        setErrors({});
        setShow(false);
    };

    if (!show) return null;

    return (
        <div className="popup-overlay" onClick={handleClose}>
            <div className="popup-content crear-usuario-popup" onClick={(e) => e.stopPropagation()}>
                <div className="popup-header">
                    <h2>
                        <FaUser className="header-icon" />
                        Crear Nuevo Usuario
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
                    <div className="form-grid">
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
                            {loading ? 'Creando...' : 'Crear Usuario'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CrearUsuarioPopup;
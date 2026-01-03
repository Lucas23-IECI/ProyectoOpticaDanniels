import { useState } from 'react';
import { FaSave, FaTimes, FaSpinner, FaInfoCircle, FaCrown } from 'react-icons/fa';

const CrearDireccionForm = ({ onSave, onCancel, errors = {}, existeDireccionPrincipal = false }) => {
    const [loading, setLoading] = useState(false);
    const [localErrors, setLocalErrors] = useState({});
    const [formData, setFormData] = useState({
        tipo: 'casa',
        direccion: '',
        ciudad: '',
        region: '',
        codigoPostal: '',
        esPrincipal: !existeDireccionPrincipal // Auto-principal si es la primera
    });

    const regiones = [
        'Arica y Parinacota', 'Tarapacá', 'Antofagasta', 'Atacama', 'Coquimbo',
        'Valparaíso', 'Metropolitana', 'O\'Higgins', 'Maule', 'Ñuble', 'Biobío',
        'La Araucanía', 'Los Ríos', 'Los Lagos', 'Aysén', 'Magallanes'
    ];

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Limpiar errores cuando el usuario empieza a escribir
        if (localErrors[field]) {
            setLocalErrors(prev => ({ ...prev, [field]: null }));
        }
        if (errors[field]) {
            // Esto podría no funcionar directamente, pero es para limpiar errores del padre
        }

        // Validación en tiempo real para algunos campos
        if (field === 'codigoPostal' && value) {
            if (!/^\d+$/.test(value)) {
                setLocalErrors(prev => ({ ...prev, codigoPostal: 'Solo se permiten números' }));
            } else if (value.length > 7) {
                setLocalErrors(prev => ({ ...prev, codigoPostal: 'Máximo 7 dígitos' }));
            }
        }
    };

    const handleSave = async () => {
        // Limpiar errores previos
        setLocalErrors({});

        const validateData = {
            direccion: formData.direccion.trim(),
            ciudad: formData.ciudad.trim(),
            region: formData.region.trim(),
            codigoPostal: formData.codigoPostal.trim()
        };

        const newErrors = {};

        // Validaciones básicas
        if (!validateData.direccion) {
            newErrors.direccion = 'La dirección es obligatoria';
        } else if (validateData.direccion.length < 5) {
            newErrors.direccion = 'La dirección debe tener al menos 5 caracteres';
        }

        if (!validateData.ciudad) {
            newErrors.ciudad = 'La ciudad es obligatoria';
        } else if (validateData.ciudad.length < 2) {
            newErrors.ciudad = 'La ciudad debe tener al menos 2 caracteres';
        }

        if (!validateData.region) {
            newErrors.region = 'Selecciona una región';
        }

        // Validar código postal si se proporciona
        if (validateData.codigoPostal) {
            if (!/^\d{7}$/.test(validateData.codigoPostal)) {
                newErrors.codigoPostal = 'El código postal debe tener exactamente 7 dígitos';
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setLocalErrors(newErrors);
            return;
        }

        setLoading(true);
        try {
            // Preparar datos para enviar - solo campos con valor
            const dataToSave = {
                tipo: formData.tipo,
                direccion: validateData.direccion,
                ciudad: validateData.ciudad,
                region: validateData.region,
                esPrincipal: formData.esPrincipal
            };

            // Solo agregar código postal si tiene valor
            if (validateData.codigoPostal && validateData.codigoPostal.trim()) {
                dataToSave.codigoPostal = validateData.codigoPostal.trim();
            }

            await onSave(dataToSave);
        } catch (error) {
            console.error('Error al crear dirección:', error);
        } finally {
            setLoading(false);
        }
    };

    const allErrors = { ...errors, ...localErrors };

    return (
        <div className="crear-direccion-form">
            <div className="direccion-card nueva">
                <div className="direccion-header">
                    <div className="direccion-title">
                        <h3>📍 Nueva Dirección</h3>
                        <p className="direccion-subtitle">Completa la información para agregar una nueva dirección</p>
                    </div>
                    <div className="direccion-actions">
                        <button
                            type="button"
                            className="btn-save"
                            onClick={handleSave}
                            disabled={loading}
                        >
                            {loading ? <FaSpinner className="spinner" /> : <FaSave />}
                            {loading ? 'Guardando...' : 'Guardar'}
                        </button>
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={onCancel}
                            disabled={loading}
                            title="Cancelar"
                        >
                            <FaTimes />
                        </button>
                    </div>
                </div>

                <div className="direccion-content">
                    <div className="direccion-form">
                        <div className="form-group">
                            <label>Tipo</label>
                            <select
                                value={formData.tipo}
                                onChange={(e) => handleChange('tipo', e.target.value)}
                                className="tipo-select"
                            >
                                <option value="casa">🏠 Casa</option>
                                <option value="trabajo">🏢 Trabajo</option>
                                <option value="otro">📍 Otro</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Dirección *</label>
                            <input
                                type="text"
                                value={formData.direccion}
                                onChange={(e) => handleChange('direccion', e.target.value)}
                                placeholder="Ej: Las Flores 275, Depto 4B"
                                className={allErrors.direccion ? 'error' : ''}
                            />
                            {allErrors.direccion && (
                                <span className="error-message">{allErrors.direccion}</span>
                            )}
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Ciudad *</label>
                                <input
                                    type="text"
                                    value={formData.ciudad}
                                    onChange={(e) => handleChange('ciudad', e.target.value)}
                                    placeholder="Ej: Santiago, Valparaíso, Concepción"
                                    className={allErrors.ciudad ? 'error' : ''}
                                />
                                {allErrors.ciudad && (
                                    <span className="error-message">{allErrors.ciudad}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Región *</label>
                                <select
                                    value={formData.region}
                                    onChange={(e) => handleChange('region', e.target.value)}
                                    className={allErrors.region ? 'error' : ''}
                                >
                                    <option value="">Selecciona tu región</option>
                                    {regiones.map(region => (
                                        <option key={region} value={region}>{region}</option>
                                    ))}
                                </select>
                                {allErrors.region && (
                                    <span className="error-message">{allErrors.region}</span>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Código Postal <span className="optional">(Opcional)</span></label>
                            <input
                                type="text"
                                value={formData.codigoPostal}
                                onChange={(e) => handleChange('codigoPostal', e.target.value)}
                                placeholder="Ej: 7500000 (7 dígitos)"
                                maxLength="7"
                                className={allErrors.codigoPostal ? 'error' : ''}
                            />
                            {allErrors.codigoPostal && (
                                <span className="error-message">{allErrors.codigoPostal}</span>
                            )}
                        </div>

                        <div className="form-group checkbox-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={formData.esPrincipal}
                                    onChange={(e) => handleChange('esPrincipal', e.target.checked)}
                                />
                                <span>
                                    <FaCrown className="crown-icon" />
                                    Establecer como dirección principal
                                </span>
                            </label>
                            {formData.esPrincipal && (
                                <div className="checkbox-info">
                                    <FaInfoCircle className="info-icon" />
                                    <span>Esta será tu dirección predeterminada para envíos</span>
                                </div>
                            )}
                            {existeDireccionPrincipal && !formData.esPrincipal && (
                                <div className="checkbox-info warning">
                                    <FaInfoCircle className="info-icon" />
                                    <span>Ya tienes una dirección principal. Marcar esta opción la reemplazará.</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CrearDireccionForm; 
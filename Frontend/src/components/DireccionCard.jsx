import { useState } from 'react';
import { FaEdit, FaSave, FaTimes, FaTrash, FaCrown, FaSpinner } from 'react-icons/fa';

const DireccionCard = ({ 
    direccion, 
    onUpdate, 
    onDelete, 
    onSetPrincipal, 
    showFieldError,
    errors = {}
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        tipo: direccion.tipo || 'casa',
        direccion: direccion.direccion || '',
        ciudad: direccion.ciudad || '',
        region: direccion.region || '',
        codigoPostal: direccion.codigoPostal || '',
        esPrincipal: direccion.esPrincipal || false
    });

    const regiones = [
        'Arica y Parinacota', 'Tarapacá', 'Antofagasta', 'Atacama', 'Coquimbo',
        'Valparaíso', 'Metropolitana', 'O\'Higgins', 'Maule', 'Ñuble', 'Biobío',
        'La Araucanía', 'Los Ríos', 'Los Lagos', 'Aysén', 'Magallanes'
    ];

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        const validateData = {
            direccion: formData.direccion.trim(),
            ciudad: formData.ciudad.trim(),
            region: formData.region.trim()
        };

        // Validaciones básicas
        if (!validateData.direccion) {
            showFieldError('direccion', 'La dirección es obligatoria');
            return;
        }
        if (!validateData.ciudad) {
            showFieldError('ciudad', 'La ciudad es obligatoria');
            return;
        }
        if (!validateData.region) {
            showFieldError('region', 'La región es obligatoria');
            return;
        }

        setLoading(true);
        try {
            // Solo enviar campos que tienen valor o han cambiado
            const datosParaEnviar = {};
            
            // Campos que siempre se envían si tienen valor
            if (formData.tipo) datosParaEnviar.tipo = formData.tipo;
            if (validateData.direccion) datosParaEnviar.direccion = validateData.direccion;
            if (validateData.ciudad) datosParaEnviar.ciudad = validateData.ciudad;
            if (validateData.region) datosParaEnviar.region = validateData.region;
            if (formData.codigoPostal && formData.codigoPostal.trim()) {
                datosParaEnviar.codigoPostal = formData.codigoPostal.trim();
            }
            
            // Campo booleano siempre se envía
            datosParaEnviar.esPrincipal = formData.esPrincipal;
            
            await onUpdate(direccion.id, datosParaEnviar);
            setIsEditing(false);
        } catch (error) {
            console.error('Error al actualizar dirección:', error);
            // Mostrar error temporal que desaparece
            const errorMessage = error.response?.data?.message || 'Error al actualizar dirección';
            showFieldError('general', errorMessage);
            
            // Limpiar error después de 3 segundos
            setTimeout(() => {
                showFieldError('general', null);
            }, 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            tipo: direccion.tipo || 'casa',
            direccion: direccion.direccion || '',
            ciudad: direccion.ciudad || '',
            region: direccion.region || '',
            codigoPostal: direccion.codigoPostal || '',
            esPrincipal: direccion.esPrincipal || false
        });
        setIsEditing(false);
    };

    const handleDelete = async () => {
        const mensaje = direccion.esPrincipal 
            ? '⚠️ Esta es tu dirección principal. ¿Estás seguro de eliminarla?\n\nSi tienes otras direcciones, una se convertirá automáticamente en principal.'
            : '¿Estás seguro de que quieres eliminar esta dirección?';
            
        if (window.confirm(mensaje)) {
            setLoading(true);
            try {
                await onDelete(direccion.id);
            } catch (error) {
                console.error('Error al eliminar dirección:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSetPrincipal = async () => {
        if (window.confirm('¿Establecer esta dirección como principal?\n\nEsta será tu dirección predeterminada para envíos.')) {
            setLoading(true);
            try {
                await onSetPrincipal(direccion.id);
            } catch (error) {
                console.error('Error al establecer como principal:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="direccion-card">
            <div className="direccion-header">
                <div className="direccion-info">
                    {isEditing ? (
                        <select
                            value={formData.tipo}
                            onChange={(e) => handleChange('tipo', e.target.value)}
                            className="tipo-select"
                        >
                            <option value="casa">🏠 Casa</option>
                            <option value="trabajo">🏢 Trabajo</option>
                            <option value="otro">📍 Otro</option>
                        </select>
                    ) : (
                        <span className="direccion-tipo">
                            {formData.tipo === 'casa' ? '🏠 Casa' : 
                             formData.tipo === 'trabajo' ? '🏢 Trabajo' : '📍 Otro'}
                        </span>
                    )}
                    {direccion.esPrincipal && (
                        <span className="badge-primary">
                            <FaCrown /> Principal
                        </span>
                    )}
                </div>
                <div className="direccion-actions">
                    {isEditing ? (
                        <>
                            <button
                                type="button"
                                className="btn-save"
                                onClick={handleSave}
                                disabled={loading}
                            >
                                {loading ? <FaSpinner className="spinner" /> : <FaSave />}
                                Guardar
                            </button>
                            <button
                                type="button"
                                className="btn-cancel"
                                onClick={handleCancel}
                                disabled={loading}
                            >
                                <FaTimes />
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={() => setIsEditing(true)}
                                disabled={loading}
                            >
                                <FaEdit />
                            </button>
                            {!direccion.esPrincipal && (
                                <button
                                    type="button"
                                    className="btn-primary"
                                    onClick={handleSetPrincipal}
                                    disabled={loading}
                                >
                                    {loading ? <FaSpinner className="spinner" /> : <FaCrown />}
                                    Principal
                                </button>
                            )}
                            <button
                                type="button"
                                className="btn-danger"
                                onClick={handleDelete}
                                disabled={loading}
                            >
                                {loading ? <FaSpinner className="spinner" /> : <FaTrash />}
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="direccion-content">
                {/* Error general temporal */}
                {errors.general && (
                    <div className="error-message-general">
                        <span>{errors.general}</span>
                    </div>
                )}
                
                {isEditing ? (
                    <div className="direccion-form">
                        <div className="form-group">
                            <label>Dirección *</label>
                            <input
                                type="text"
                                value={formData.direccion}
                                onChange={(e) => handleChange('direccion', e.target.value)}
                                placeholder="Ej: Las Flores 275"
                                className={errors.direccion ? 'error' : ''}
                            />
                            {errors.direccion && (
                                <span className="error-message">{errors.direccion}</span>
                            )}
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Ciudad *</label>
                                <input
                                    type="text"
                                    value={formData.ciudad}
                                    onChange={(e) => handleChange('ciudad', e.target.value)}
                                    placeholder="Ej: Santiago"
                                    className={errors.ciudad ? 'error' : ''}
                                />
                                {errors.ciudad && (
                                    <span className="error-message">{errors.ciudad}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Región *</label>
                                <select
                                    value={formData.region}
                                    onChange={(e) => handleChange('region', e.target.value)}
                                    className={errors.region ? 'error' : ''}
                                >
                                    <option value="">Selecciona región</option>
                                    {regiones.map(region => (
                                        <option key={region} value={region}>{region}</option>
                                    ))}
                                </select>
                                {errors.region && (
                                    <span className="error-message">{errors.region}</span>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Código Postal</label>
                            <input
                                type="text"
                                value={formData.codigoPostal}
                                onChange={(e) => handleChange('codigoPostal', e.target.value)}
                                placeholder="Ej: 7500000"
                                maxLength="7"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="direccion-display">
                        <div className="direccion-main-info">
                            <p className="direccion-text">📍 {direccion.direccion}</p>
                            <p className="direccion-location">
                                📍 {direccion.ciudad}, {direccion.region}
                                {direccion.codigoPostal && ` • CP: ${direccion.codigoPostal}`}
                            </p>
                        </div>
                        {direccion.esPrincipal && (
                            <div className="direccion-badge-info">
                                <span className="badge-principal-large">
                                    <FaCrown />
                                    Dirección Principal
                                </span>
                                <p className="badge-description">Esta es tu dirección predeterminada para envíos</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DireccionCard; 
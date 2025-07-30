import { useForm } from 'react-hook-form';
import { useState } from 'react';
import '@styles/form.css';
import HideIcon from '@assets/HideIcon.svg';
import ViewIcon from '@assets/ViewIcon.svg';

const Form = ({ title, fields, buttonText, onSubmit, footerContent, backgroundColor }) => {
    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    };

    const onFormSubmit = (data) => {
        onSubmit(data);
    };

    // Función para manejar cambios en campos numéricos
    const handleNumericChange = (e, fieldName) => {
        const value = e.target.value;
        // Solo permitir números
        const cleanValue = value.replace(/[^0-9]/g, '');
        
        if (value !== cleanValue) {
            e.target.value = cleanValue;
            setValue(fieldName, cleanValue);
        }
    };

    return (
        <form
            className="form"
            style={{ backgroundColor: backgroundColor }}
            onSubmit={handleSubmit(onFormSubmit)}
            autoComplete="off"
        >
            <h1>{title}</h1>
            {fields.map((field, index) => (
                <div className="container_inputs" key={index}>
                    {field.label && <label htmlFor={field.name}>{field.label}</label>}
                    {field.fieldType === 'input' && (
                        <input
                            {...register(field.name, {
                                required: field.required ? 'Este campo es obligatorio' : false,
                                minLength: field.minLength ? { value: field.minLength, message: `Debe tener al menos ${field.minLength} caracteres` } : false,
                                maxLength: field.maxLength ? { value: field.maxLength, message: `Debe tener máximo ${field.maxLength} caracteres` } : false,
                                pattern: field.pattern ? { value: field.pattern, message: field.patternMessage || 'Formato no válido' } : false,
                                validate: field.validate || {},
                            })}
                            name={field.name}
                            placeholder={field.placeholder}
                            type={field.type === 'password' && field.name === 'password' ? (showPassword ? 'text' : 'password') :
                                field.type === 'password' && field.name === 'newPassword' ? (showNewPassword ? 'text' : 'password') :
                                    field.type}
                            defaultValue={field.defaultValue || ''}
                            disabled={field.disabled}
                            onChange={(e) => {
                                // Para campos numéricos, usar la función personalizada
                                if (field.type === 'text' && field.pattern && field.pattern.toString().includes('[0-9]')) {
                                    handleNumericChange(e, field.name);
                                }
                                if (field.onChange) {
                                    field.onChange(e);
                                }
                            }}
                            min={field.min}
                            max={field.max}
                            onKeyPress={(e) => {
                                // Para campos numéricos (tanto type="number" como type="text" con patrón numérico)
                                if (field.type === 'number' || (field.type === 'text' && field.pattern && field.pattern.toString().includes('[0-9]'))) {
                                    // Solo permitir números del 0-9
                                    if (!/[0-9]/.test(e.key)) {
                                        e.preventDefault();
                                    }
                                }
                            }}
                            onInput={(e) => {
                                // Para campos numéricos (tanto type="number" como type="text" con patrón numérico)
                                if (field.type === 'number' || (field.type === 'text' && field.pattern && field.pattern.toString().includes('[0-9]'))) {
                                    const value = e.target.value;
                                    // Eliminar cualquier carácter que no sea número
                                    let cleanValue = value.replace(/[^0-9]/g, '');
                                    
                                    // Verificar límites si están definidos
                                    if (field.max && cleanValue) {
                                        const numValue = parseInt(cleanValue);
                                        if (numValue > field.max) {
                                            cleanValue = field.max.toString();
                                        }
                                    }
                                    
                                    if (value !== cleanValue) {
                                        e.target.value = cleanValue;
                                        setValue(field.name, cleanValue);
                                        // Forzar la actualización del formulario
                                        e.target.dispatchEvent(new Event('input', { bubbles: true }));
                                        // También disparar el evento change para react-hook-form
                                        e.target.dispatchEvent(new Event('change', { bubbles: true }));
                                    }
                                }
                            }}
                            onPaste={(e) => {
                                // Para campos numéricos (tanto type="number" como type="text" con patrón numérico)
                                if (field.type === 'number' || (field.type === 'text' && field.pattern && field.pattern.toString().includes('[0-9]'))) {
                                    e.preventDefault();
                                    const pastedText = (e.clipboardData || window.clipboardData).getData('text');
                                    // Solo permitir números
                                    const numbersOnly = pastedText.replace(/[^0-9]/g, '');
                                    e.target.value = numbersOnly;
                                    setValue(field.name, numbersOnly);
                                    // Forzar la actualización del formulario
                                    e.target.dispatchEvent(new Event('input', { bubbles: true }));
                                    // También disparar el evento change para react-hook-form
                                    e.target.dispatchEvent(new Event('change', { bubbles: true }));
                                }
                            }}
                            onDrop={(e) => {
                                // Para campos numéricos (tanto type="number" como type="text" con patrón numérico)
                                if (field.type === 'number' || (field.type === 'text' && field.pattern && field.pattern.toString().includes('[0-9]'))) {
                                    e.preventDefault();
                                }
                            }}
                        />
                    )}
                    {field.fieldType === 'textarea' && (
                        <textarea
                            {...register(field.name, {
                                required: field.required ? 'Este campo es obligatorio' : false,
                                minLength: field.minLength ? { value: field.minLength, message: `Debe tener al menos ${field.minLength} caracteres` } : false,
                                maxLength: field.maxLength ? { value: field.maxLength, message: `Debe tener máximo ${field.maxLength} caracteres` } : false,
                                pattern: field.pattern ? { value: field.pattern, message: field.patternMessage || 'Formato no válido' } : false,
                                validate: field.validate || {},
                            })}
                            name={field.name}
                            placeholder={field.placeholder}
                            defaultValue={field.defaultValue || ''}
                            disabled={field.disabled}
                            onChange={field.onChange}
                        />
                    )}
                    {field.fieldType === 'select' && (
                        <select
                            {...register(field.name, {
                                required: field.required ? 'Este campo es obligatorio' : false,
                                validate: field.validate || {},
                            })}
                            name={field.name}
                            defaultValue={field.defaultValue || ''}
                            disabled={field.disabled}
                            onChange={field.onChange}
                        >
                            <option value="">Seleccionar opción</option>
                            {field.options && field.options.map((option, optIndex) => (
                                <option className="options-class" key={optIndex} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    )}
                    {field.type === 'password' && field.name === 'password' && (
                        <span className="toggle-password-icon" onClick={togglePasswordVisibility}>
                            <img src={showPassword ? ViewIcon : HideIcon} />
                        </span>
                    )}
                    {field.type === 'password' && field.name === 'newPassword' && (
                        <span className="toggle-password-icon" onClick={toggleNewPasswordVisibility}>
                            <img src={showNewPassword ? ViewIcon : HideIcon} />
                        </span>
                    )}
                    <div className={`error-message ${errors[field.name] || field.errorMessageData ? 'visible' : ''}`}>
                        {errors[field.name]?.message || field.errorMessageData || ''}
                    </div>
                </div>
            ))}
            {buttonText && <button type="submit">{buttonText}</button>}
            {footerContent && <div className="footerContent">{footerContent}</div>}
        </form>
    );
};

export default Form;

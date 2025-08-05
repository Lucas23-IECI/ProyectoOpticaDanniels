import { validarRutChileno } from './formatData.js';

export const validationRules = {
    required: (value, fieldName = 'Campo') => {
        if (!value || value.toString().trim() === '') {
            return `${fieldName} es requerido`;
        }
        return null;
    },

    minLength: (value, min, fieldName = 'Campo') => {
        if (value && value.length < min) {
            return `${fieldName} debe tener al menos ${min} caracteres (tienes ${value.length})`;
        }
        return null;
    },

    maxLength: (value, max, fieldName = 'Campo') => {
        if (value && value.length > max) {
            return `${fieldName} no puede exceder ${max} caracteres (tienes ${value.length})`;
        }
        return null;
    },

    email: (value) => {
        if (!value) return null;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            return 'Formato de email inválido (ejemplo: usuario@gmail.com)';
        }
        return null;
    },

    number: (value, fieldName = 'Campo') => {
        if (value !== null && value !== undefined && value !== '') {
            const num = parseFloat(value);
            if (isNaN(num)) {
                return `${fieldName} debe ser un número válido`;
            }
        }
        return null;
    },

    positiveNumber: (value, fieldName = 'Campo') => {
        if (value !== null && value !== undefined && value !== '') {
            const num = parseFloat(value);
            if (isNaN(num) || num <= 0) {
                return `${fieldName} debe ser un número positivo`;
            }
        }
        return null;
    },

    nonNegativeNumber: (value, fieldName = 'Campo') => {
        if (value !== null && value !== undefined && value !== '') {
            const num = parseFloat(value);
            if (isNaN(num) || num < 0) {
                return `${fieldName} no puede ser negativo`;
            }
        }
        return null;
    },

    range: (value, min, max, fieldName = 'Campo') => {
        if (value !== null && value !== undefined && value !== '') {
            const num = parseFloat(value);
            if (isNaN(num)) {
                return `${fieldName} debe ser un número válido`;
            }
            if (num < min || num > max) {
                return `${fieldName} debe estar entre ${min} y ${max}`;
            }
        }
        return null;
    },

    // Validaciones específicas para nombres (sin espacios)
    nombre: (value, fieldName = 'Nombre') => {
        if (!value) return null;
        
        // Si está vacío después de hacer trim, no validar
        if (value.trim() === '') {
            return null;
        }
        
        if (value.length < 2) {
            return `${fieldName} debe tener al menos 2 caracteres`;
        }
        
        if (value.length > 50) {
            return `${fieldName} no puede exceder 50 caracteres`;
        }
        
        // Solo letras (incluye acentos), sin espacios ni números ni caracteres especiales
        const nombrePattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/;
        if (!nombrePattern.test(value)) {
            return `${fieldName} solo puede contener letras (sin espacios)`;
        }
        
        // No puede empezar con espacio
        if (/^\s/.test(value)) {
            return `${fieldName} no puede empezar con espacios`;
        }
        
        // No puede terminar con espacio
        if (/\s$/.test(value)) {
            return `${fieldName} no puede terminar con espacios`;
        }
        
        // No puede contener espacios
        if (/\s/.test(value)) {
            return `${fieldName} no puede contener espacios`;
        }
        
        // No más de 2 letras iguales consecutivas
        if (/(.)\1{2,}/.test(value)) {
            return `${fieldName} no puede tener más de 2 letras iguales consecutivas`;
        }
        
        // No puede estar completamente en mayúsculas
        if (value === value.toUpperCase() && value.length > 1) {
            return `${fieldName} no puede estar completamente en mayúsculas`;
        }
        
        // Validar que solo la primera letra sea mayúscula
        if (value.length > 0) {
            // La primera letra debe ser mayúscula
            if (value[0] !== value[0].toUpperCase()) {
                return `${fieldName} debe tener mayúscula al inicio`;
            }
            // El resto debe ser minúscula
            if (value.length > 1 && value.slice(1) !== value.slice(1).toLowerCase()) {
                return `${fieldName} solo debe tener mayúscula al inicio`;
            }
        }
        
        return null;
    },

    // Validación específica para segundo nombre (máximo 1 espacio)
    segundoNombre: (value, fieldName = 'Segundo nombre') => {
        if (!value) return null;
        
        // Si está vacío después de hacer trim, no validar
        if (value.trim() === '') {
            return null;
        }
        
        if (value.length < 2) {
            return `${fieldName} debe tener al menos 2 caracteres`;
        }
        
        if (value.length > 50) {
            return `${fieldName} no puede exceder 50 caracteres`;
        }
        
        // Solo letras (incluye acentos), sin números ni caracteres especiales
        const nombrePattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        if (!nombrePattern.test(value)) {
            return `${fieldName} solo puede contener letras y espacios`;
        }
        
        // No puede empezar con espacio
        if (/^\s/.test(value)) {
            return `${fieldName} no puede empezar con espacios`;
        }
        
        // No puede terminar con espacio
        if (/\s$/.test(value)) {
            return `${fieldName} no puede terminar con espacios`;
        }
        
        // No más de 1 espacio seguido
        if (/\s{2,}/.test(value)) {
            return `${fieldName} no puede tener espacios consecutivos`;
        }
        
        // Máximo 1 espacio en total
        const spaceCount = (value.match(/\s/g) || []).length;
        if (spaceCount > 1) {
            return `${fieldName} no puede tener más de 1 espacio`;
        }
        
        // No más de 2 letras iguales consecutivas
        if (/(.)\1{2,}/.test(value)) {
            return `${fieldName} no puede tener más de 2 letras iguales consecutivas`;
        }
        
        // No puede estar completamente en mayúsculas
        if (value === value.toUpperCase() && value.length > 1) {
            return `${fieldName} no puede estar completamente en mayúsculas`;
        }
        
        // Validar que solo la primera letra de cada palabra sea mayúscula
        const words = value.split(' ');
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            if (word.length > 0) {
                // La primera letra debe ser mayúscula
                if (word[0] !== word[0].toUpperCase()) {
                    return `${fieldName} debe tener mayúscula al inicio de cada palabra`;
                }
                // El resto debe ser minúscula
                if (word.length > 1 && word.slice(1) !== word.slice(1).toLowerCase()) {
                    return `${fieldName} solo debe tener mayúscula al inicio de cada palabra`;
                }
            }
        }
        
        return null;
    },

    // Validación específica para apellido paterno (sin espacios)
    apellidoPaterno: (value, fieldName = 'Apellido paterno') => {
        if (!value) return null;
        
        // Si está vacío después de hacer trim, no validar
        if (value.trim() === '') {
            return null;
        }
        
        if (value.length < 2) {
            return `${fieldName} debe tener al menos 2 caracteres`;
        }
        
        if (value.length > 50) {
            return `${fieldName} no puede exceder 50 caracteres`;
        }
        
        // Solo letras (incluye acentos), sin espacios ni números ni caracteres especiales
        const apellidoPattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/;
        if (!apellidoPattern.test(value)) {
            return `${fieldName} solo puede contener letras (sin espacios)`;
        }
        
        // No puede empezar con espacio
        if (/^\s/.test(value)) {
            return `${fieldName} no puede empezar con espacios`;
        }
        
        // No puede terminar con espacio
        if (/\s$/.test(value)) {
            return `${fieldName} no puede terminar con espacios`;
        }
        
        // No puede contener espacios
        if (/\s/.test(value)) {
            return `${fieldName} no puede contener espacios`;
        }
        
        // No más de 2 letras iguales consecutivas
        if (/(.)\1{2,}/.test(value)) {
            return `${fieldName} no puede tener más de 2 letras iguales consecutivas`;
        }
        
        // No puede estar completamente en mayúsculas
        if (value === value.toUpperCase() && value.length > 1) {
            return `${fieldName} no puede estar completamente en mayúsculas`;
        }
        
        // Validar que solo la primera letra sea mayúscula
        if (value.length > 0) {
            // La primera letra debe ser mayúscula
            if (value[0] !== value[0].toUpperCase()) {
                return `${fieldName} debe tener mayúscula al inicio`;
            }
            // El resto debe ser minúscula
            if (value.length > 1 && value.slice(1) !== value.slice(1).toLowerCase()) {
                return `${fieldName} solo debe tener mayúscula al inicio`;
            }
        }
        
        return null;
    },

    // Validación específica para apellido materno (hasta 2 espacios)
    apellidoMaterno: (value, fieldName = 'Apellido materno') => {
        if (!value) return null;
        
        // Si está vacío después de hacer trim, no validar
        if (value.trim() === '') {
            return null;
        }
        
        if (value.length < 2) {
            return `${fieldName} debe tener al menos 2 caracteres`;
        }
        
        if (value.length > 50) {
            return `${fieldName} no puede exceder 50 caracteres`;
        }
        
        // Solo letras (incluye acentos), con espacios ni números ni caracteres especiales
        const apellidoPattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        if (!apellidoPattern.test(value)) {
            return `${fieldName} solo puede contener letras y espacios`;
        }
        
        // No puede empezar con espacio
        if (/^\s/.test(value)) {
            return `${fieldName} no puede empezar con espacios`;
        }
        
        // No puede terminar con espacio
        if (/\s$/.test(value)) {
            return `${fieldName} no puede terminar con espacios`;
        }
        
        // No más de 1 espacio seguido
        if (/\s{2,}/.test(value)) {
            return `${fieldName} no puede tener espacios consecutivos`;
        }
        
        // Máximo 2 espacios en total
        const spaceCount = (value.match(/\s/g) || []).length;
        if (spaceCount > 2) {
            return `${fieldName} no puede tener más de 2 espacios`;
        }
        
        // No más de 2 letras iguales consecutivas
        if (/(.)\1{2,}/.test(value)) {
            return `${fieldName} no puede tener más de 2 letras iguales consecutivas`;
        }
        
        // No puede estar completamente en mayúsculas
        if (value === value.toUpperCase() && value.length > 1) {
            return `${fieldName} no puede estar completamente en mayúsculas`;
        }
        
        // Validar que solo la primera letra de cada palabra sea mayúscula
        const words = value.split(' ');
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            if (word.length > 0) {
                // La primera letra debe ser mayúscula
                if (word[0] !== word[0].toUpperCase()) {
                    return `${fieldName} debe tener mayúscula al inicio de cada palabra`;
                }
                // El resto debe ser minúscula
                if (word.length > 1 && word.slice(1) !== word.slice(1).toLowerCase()) {
                    return `${fieldName} solo debe tener mayúscula al inicio de cada palabra`;
                }
            }
        }
        
        return null;
    },

    // Validación de teléfono chileno (WhatsApp) - Solo números
    telefonoChileno: (value) => {
        if (!value) return null;
        
        // Debe contener solo números y el símbolo +
        if (!/^[\+\d\s]+$/.test(value)) {
            return 'El teléfono solo puede contener números y el símbolo +';
        }
        
        // Limpiar espacios extra y normalizar
        let cleanValue = value.trim().replace(/\s/g, '');
        
        // Remover +56 si está presente
        cleanValue = cleanValue.replace(/^\+56/, '');
        
        // Debe tener exactamente 8 o 9 dígitos
        if (!/^\d{8,9}$/.test(cleanValue)) {
            return 'Formato inválido. Use: +56912345678 o 912345678 (8-9 dígitos)';
        }
        
        // Validar que empiece con 9 (móvil) o 2 (fijo)
        if (!cleanValue.startsWith('9') && !cleanValue.startsWith('2')) {
            return 'Debe empezar con 9 (móvil) o 2 (fijo)';
        }
        
        return null;
    },

    // Validación de fecha de nacimiento
    fechaNacimiento: (value) => {
        if (!value) return null;
        
        let fecha;
        
        // Si es un input type="date", viene en formato YYYY-MM-DD
        if (value.includes('-')) {
            fecha = new Date(value);
        } else if (value.includes('/')) {
            // Si viene en formato DD/MM/YYYY, convertirlo
            const [day, month, year] = value.split('/');
            // Validar que los números sean válidos
            const dayNum = parseInt(day);
            const monthNum = parseInt(month);
            const yearNum = parseInt(year);
            
            if (isNaN(dayNum) || isNaN(monthNum) || isNaN(yearNum)) {
                return 'Fecha de nacimiento inválida';
            }
            
            if (monthNum < 1 || monthNum > 12) {
                return 'Mes inválido';
            }
            
            if (dayNum < 1 || dayNum > 31) {
                return 'Día inválido';
            }
            
            fecha = new Date(yearNum, monthNum - 1, dayNum);
        } else {
            fecha = new Date(value);
        }
        
        const hoy = new Date();
        
        if (isNaN(fecha.getTime())) {
            return 'Fecha de nacimiento inválida';
        }
        
        if (fecha > hoy) {
            return 'La fecha de nacimiento no puede ser futura';
        }
        
        const edadMinima = new Date();
        edadMinima.setFullYear(hoy.getFullYear() - 120); // Máximo 120 años
        
        if (fecha < edadMinima) {
            return 'La fecha de nacimiento no puede ser anterior a 1904';
        }
        
        const edadMaxima = new Date();
        edadMaxima.setFullYear(hoy.getFullYear() - 13); // Mínimo 13 años
        
        if (fecha > edadMaxima) {
            return 'Debes tener al menos 13 años';
        }
        
        return null;
    },

    // Validación de género
    genero: (value) => {
        if (!value) return null;
        
        const generosValidos = ['Masculino', 'Femenino', 'No binario', 'Prefiero no decir'];
        
        if (!generosValidos.includes(value)) {
            return 'Selecciona un género válido';
        }
        
        return null;
    },

    precio: (value) => {
        if (!value || value.toString().trim() === '') {
            return 'El precio es requerido';
        }
        
        const precio = parseFloat(value.toString().replace(/\D/g, ''));
        
        if (isNaN(precio)) {
            return 'El precio debe ser un número válido';
        }
        
        if (precio <= 0) {
            return 'El precio debe ser mayor a 0';
        }
        
        if (precio > 10000000) {
            return 'El precio no puede exceder $10.000.000';
        }
        
        return null;
    },

    stock: (value) => {
        if (value === null || value === undefined || value === '') {
            return 'El stock es requerido';
        }
        
        // Verificar que solo contenga números
        if (!/^[0-9]+$/.test(value.toString())) {
            return 'El stock solo puede contener números enteros';
        }
        
        const stock = parseInt(value);
        
        if (isNaN(stock)) {
            return 'El stock debe ser un número entero';
        }
        
        if (stock < 0) {
            return 'El stock no puede ser negativo';
        }
        
        if (stock > 99999) {
            return 'El stock no puede exceder 99,999 unidades';
        }
        
        return null;
    },

    descuento: (value) => {
        if (value === null || value === undefined || value === '') {
            return null;
        }
        
        // Verificar que solo contenga números
        if (!/^[0-9]+$/.test(value.toString())) {
            return 'El descuento solo puede contener números enteros';
        }
        
        const descuento = parseInt(value);
        
        if (isNaN(descuento)) {
            return 'El descuento debe ser un número válido';
        }
        
        if (descuento < 0 || descuento > 100) {
            return 'El descuento debe estar entre 0% y 100%';
        }
        
        return null;
    },

    categoria: (value) => {
        const categoriasValidas = ['opticos', 'sol', 'accesorios'];
        if (!value || !categoriasValidas.includes(value)) {
            return 'Selecciona una categoría válida';
        }
        return null;
    },

    imagen: (file) => {
        if (!file || file.size === 0) {
            return 'La imagen del producto es requerida';
        }
        
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            return 'La imagen debe ser JPG, PNG o WebP';
        }
        
        if (file.size > 5 * 1024 * 1024) {
            return 'La imagen no puede exceder 5MB';
        }
        
        return null;
    },

    imagenOpcional: (file) => {
        if (!file || file.size === 0) {
            return null;
        }
        
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            return 'La imagen debe ser JPG, PNG o WebP';
        }
        
        if (file.size > 5 * 1024 * 1024) {
            return 'La imagen no puede exceder 5MB';
        }
        
        return null;
    },

    sku: (value) => {
        if (!value || value.trim() === '') {
            return 'El código SKU es requerido';
        }
        
        if (value.trim().length > 50) {
            return 'El SKU no puede exceder 50 caracteres';
        }
        
        const skuRegex = /^[A-Za-z0-9\-_]+$/;
        if (!skuRegex.test(value.trim())) {
            return 'El SKU solo puede contener letras, números, guiones y guiones bajos';
        }
        
        // Validar que no termine con guión solo al enviar el formulario
        if (value.trim().endsWith('-')) {
            return 'El código SKU no puede terminar con guión';
        }
        
        return null;
    },

    password: (value) => {
        if (!value) {
            return 'La contraseña es requerida';
        }
        
        if (value.length < 6) {
            return `Contraseña muy corta. Mínimo 6 caracteres (tienes ${value.length})`;
        }
        
        if (value.length > 50) {
            return `Contraseña muy larga. Máximo 50 caracteres (tienes ${value.length})`;
        }
        
        if (!/(?=.*[a-z])/.test(value)) {
            return 'La contraseña debe incluir al menos una letra minúscula (a-z)';
        }
        
        if (!/(?=.*[A-Z])/.test(value)) {
            return 'La contraseña debe incluir al menos una letra mayúscula (A-Z)';
        }
        
        if (!/(?=.*\d)/.test(value)) {
            return 'La contraseña debe incluir al menos un número (0-9)';
        }
        
        return null;
    },

    newPassword: (value) => {
        if (!value) {
            return null; // La nueva contraseña es opcional
        }
        
        if (value.length < 6) {
            return `Nueva contraseña muy corta. Mínimo 6 caracteres (tienes ${value.length})`;
        }
        
        if (value.length > 50) {
            return `Nueva contraseña muy larga. Máximo 50 caracteres (tienes ${value.length})`;
        }
        
        if (!/(?=.*[a-z])/.test(value)) {
            return 'La nueva contraseña debe incluir al menos una letra minúscula (a-z)';
        }
        
        if (!/(?=.*[A-Z])/.test(value)) {
            return 'La nueva contraseña debe incluir al menos una letra mayúscula (A-Z)';
        }
        
        if (!/(?=.*\d)/.test(value)) {
            return 'La nueva contraseña debe incluir al menos un número (0-9)';
        }
        
        return null;
    },

    rut: (value) => {
        if (!value) {
            return 'El RUT es requerido';
        }
        
        // Limpiar el RUT para validación
        const cleanRut = value.replace(/[^0-9kK]/g, '');
        
        // Verificar longitud mínima
        if (cleanRut.length < 7) {
            return 'RUT inválido. Debe tener al menos 7 dígitos';
        }
        
        // Verificar longitud máxima
        if (cleanRut.length > 9) {
            return 'RUT inválido. No puede tener más de 9 dígitos';
        }
        
        // Validar usando la función de validación chilena
        if (!validarRutChileno(value)) {
            return 'El dígito verificador del RUT es incorrecto';
        }
        
        return null;
    }
};

export const validateFields = (data, rules) => {
    const errors = {};
    
    Object.keys(rules).forEach(field => {
        const fieldRules = rules[field];
        const value = data[field];
        
        for (const rule of fieldRules) {
            const error = rule(value);
            if (error) {
                errors[field] = error;
                break;
            }
        }
    });
    
    return errors;
};

export const validateField = (value, rules) => {
    for (const rule of rules) {
        const error = rule(value);
        if (error) {
            return error;
        }
    }
    return null;
};

export const validateRequiredText = (value, fieldName) => {
    return validationRules.required(value, fieldName);
};

export const validateEmail = (value) => {
    return validationRules.email(value);
};

export const validatePassword = (value) => {
    return validationRules.password(value);
};

export const validateRUT = (value) => {
    return validationRules.rut(value);
};

export const validatePositiveNumber = (value, fieldName) => {
    return validationRules.positiveNumber(value, fieldName);
};

export const validatePrice = (value) => {
    return validationRules.precio(value);
};

export const validateStock = (value) => {
    return validationRules.stock(value);
};

export const validateDiscount = (value) => {
    return validationRules.descuento(value);
};

export const validateSKU = (value) => {
    return validationRules.sku(value);
};

export const validateCategory = (value) => {
    return validationRules.categoria(value);
};

export const validateBrand = (value) => {
    return validationRules.required(value?.trim(), 'La marca') ||
           validationRules.minLength(value?.trim(), 2, 'La marca');
};

export const validateDescription = (value) => {
    return validationRules.required(value?.trim(), 'La descripción') ||
           validationRules.minLength(value?.trim(), 5, 'La descripción') ||
           validationRules.maxLength(value?.trim(), 1000, 'La descripción');
};

export const validateProductName = (value) => {
    if (!value || value.toString().trim() === '') {
        return 'El nombre del producto es requerido';
    }
    
    if (value.length < 3) {
        return 'El nombre debe tener al menos 3 caracteres';
    }
    
    if (value.length > 255) {
        return 'El nombre no puede exceder 255 caracteres';
    }
    
    // Validar máximo 10 espacios en total
    const spaceCount = (value.match(/\s/g) || []).length;
    if (spaceCount > 10) {
        return 'El nombre no puede tener más de 10 espacios en total';
    }
    
    return null;
};

export const validateImage = (file) => {
    return validationRules.imagen(file);
};

// Funciones específicas para validación de perfil
export const validatePrimerNombre = (value) => validationRules.nombre(value, 'Primer nombre');
export const validateSegundoNombre = (value) => validationRules.segundoNombre(value, 'Segundo nombre');
export const validateApellidoPaterno = (value) => validationRules.apellidoPaterno(value, 'Apellido paterno');
export const validateApellidoMaterno = (value) => validationRules.apellidoMaterno(value, 'Apellido materno');
export const validateTelefono = (value) => validationRules.telefonoChileno(value);
export const validateFechaNacimiento = (value) => validationRules.fechaNacimiento(value);
export const validateGenero = (value) => validationRules.genero(value);

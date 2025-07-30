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

    // Validaciones específicas para nombres
    nombre: (value, fieldName = 'Nombre') => {
        if (!value) return null;
        
        if (value.length < 2) {
            return `${fieldName} debe tener al menos 2 caracteres`;
        }
        
        if (value.length > 30) {
            return `${fieldName} no puede exceder 30 caracteres`;
        }
        
        // Solo letras, sin espacios
        const nombrePattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/;
        if (!nombrePattern.test(value)) {
            return `${fieldName} solo puede contener letras (sin espacios)`;
        }
        
        return null;
    },

    // Validación de teléfono chileno (WhatsApp)
    telefonoChileno: (value) => {
        if (!value) return null;
        
        // Limpiar espacios extra y normalizar
        let cleanValue = value.trim();
        
        // Remover +56 si está presente
        cleanValue = cleanValue.replace(/^\+56\s*/, '');
        
        // Patrón para teléfonos chilenos (WhatsApp): 9 XXXX XXXX o 2 XXXX XXXX
        // Acepta tanto 8 como 9 dígitos
        const telefonoPattern = /^[29]\s*\d{3,4}\s*\d{4}$/;
        
        if (!telefonoPattern.test(cleanValue)) {
            return 'Formato inválido. Use: 9 XXXX XXXX (móvil) o 2 XXXX XXXX (fijo)';
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
        
        return null;
    },

    password: (value) => {
        if (!value) {
            return 'La contraseña es requerida';
        }
        
        if (value.length < 6) {
            return `Contraseña muy corta. Mínimo 6 caracteres (tienes ${value.length})`;
        }
        
        if (!/(?=.*[a-z])/.test(value)) {
            return 'Debe incluir al menos una letra minúscula';
        }
        
        if (!/(?=.*[A-Z])/.test(value)) {
            return 'Debe incluir al menos una letra mayúscula';
        }
        
        if (!/(?=.*\d)/.test(value)) {
            return 'Debe incluir al menos un número';
        }
        
        return null;
    },

    rut: (value) => {
        if (!value) {
            return 'El RUT es requerido';
        }
        
        const rutRegex = /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/;
        if (!rutRegex.test(value)) {
            return 'Formato de RUT inválido. Usa: 12.345.678-9';
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
    
    return null;
};

export const validateImage = (file) => {
    return validationRules.imagen(file);
};

// Funciones específicas para validación de perfil
export const validatePrimerNombre = (value) => validationRules.nombre(value, 'Primer nombre');
export const validateSegundoNombre = (value) => validationRules.nombre(value, 'Segundo nombre');
export const validateApellidoPaterno = (value) => validationRules.nombre(value, 'Apellido paterno');
export const validateApellidoMaterno = (value) => validationRules.nombre(value, 'Apellido materno');
export const validateTelefono = (value) => validationRules.telefonoChileno(value);
export const validateFechaNacimiento = (value) => validationRules.fechaNacimiento(value);
export const validateGenero = (value) => validationRules.genero(value);

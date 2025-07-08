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
        
        const descuento = parseFloat(value);
        
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
        
        if (value.trim().length < 3) {
            return 'El SKU debe tener al menos 3 caracteres';
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
           validationRules.minLength(value?.trim(), 10, 'La descripción') ||
           validationRules.maxLength(value?.trim(), 1000, 'La descripción');
};

export const validateProductName = (value) => {
    return validationRules.required(value?.trim(), 'El nombre del producto') ||
           validationRules.minLength(value?.trim(), 3, 'El nombre del producto') ||
           validationRules.maxLength(value?.trim(), 100, 'El nombre del producto');
};

export const validateImage = (file) => {
    return validationRules.imagen(file);
};

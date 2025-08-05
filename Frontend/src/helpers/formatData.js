import { getNombreCompleto } from './nameHelpers.js';

// Función nativa para capitalizar palabras (reemplaza startCase de lodash)
function startCase(str) {
    if (!str) return str;
    return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Función para validar RUT chileno
function validarRutChileno(rut) {
    if (!rut) return false;
    
    // Limpiar el RUT
    let cleanRut = rut.replace(/[^0-9kK]/g, '');
    
    // Verificar longitud mínima
    if (cleanRut.length < 7) return false;
    
    // Convertir a mayúscula
    cleanRut = cleanRut.toUpperCase();
    
    // Separar número y dígito verificador
    const numero = cleanRut.slice(0, -1);
    const dv = cleanRut.slice(-1);
    
    // Verificar que el número sea válido
    if (!/^\d+$/.test(numero)) return false;
    
    // Calcular dígito verificador
    let suma = 0;
    let multiplicador = 2;
    
    for (let i = numero.length - 1; i >= 0; i--) {
        suma += parseInt(numero[i]) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }
    
    const resto = suma % 11;
    let dvCalculado;
    
    if (resto === 0) {
        dvCalculado = '0';
    } else if (resto === 1) {
        dvCalculado = 'K';
    } else {
        dvCalculado = (11 - resto).toString();
    }
    
    return dv === dvCalculado;
}

// Función nativa para formatear RUT (reemplaza rut.js)
function formatRut(rut) {
    if (!rut) return '';
    
    // Limpiar el RUT de todo lo que no sea número o letras (K)
    let cleanRut = rut.replace(/[^0-9kK]/g, '');
    
    // Si está vacío o muy corto, devolver tal como está
    if (cleanRut.length === 0) return '';
    if (cleanRut.length === 1) return cleanRut;
    
    // Convertir a mayúscula si es K
    cleanRut = cleanRut.toUpperCase();
    
    // Si no tiene dígito verificador aún, devolver sin formatear
    if (cleanRut.length < 2) return cleanRut;
    
    // Separar número y dígito verificador
    const numero = cleanRut.slice(0, -1);
    const dv = cleanRut.slice(-1);
    
    // Si el número es muy corto, no formatear con puntos aún
    if (numero.length < 4) {
        return `${numero}-${dv}`;
    }
    
    // Formatear número con puntos cada 3 dígitos desde la derecha
    let formattedNumero = '';
    for (let i = numero.length - 1, j = 0; i >= 0; i--, j++) {
        if (j > 0 && j % 3 === 0) {
            formattedNumero = '.' + formattedNumero;
        }
        formattedNumero = numero[i] + formattedNumero;
    }
    
    return `${formattedNumero}-${dv}`;
}

// Función nativa para formatear fecha (reemplaza @formkit/tempo)
function formatTempo(date, format) {
    if (!date) return '';
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    
    if (format === 'DD-MM-YYYY') {
        return `${day}-${month}-${year}`;
    }
    
    return `${day}/${month}/${year}`;
}

export function formatUserData(user) {
    return {
        ...user,
        primerNombre: startCase(user.primerNombre),
        segundoNombre: user.segundoNombre ? startCase(user.segundoNombre) : null,
        apellidoPaterno: startCase(user.apellidoPaterno),
        apellidoMaterno: user.apellidoMaterno ? startCase(user.apellidoMaterno) : null,
        nombreCompleto: getNombreCompleto(user),
        rol: startCase(user.rol),
        rut: formatRut(user.rut),
        createdAt: formatTempo(user.createdAt, 'DD-MM-YYYY'),
    };
}

export function convertirMinusculas(obj) {
    const result = {};
    for (const key in obj) {
        if (typeof obj[key] === 'string') {
            result[key] = obj[key].toLowerCase();
        } else {
            result[key] = obj[key];
        }
    }
    return result;
}

// Función para formatear teléfonos
function formatTelefono(telefono) {
    if (!telefono) return '';
    
    // Limpiar todo lo que no sea número o el símbolo +
    let cleanTelefono = telefono.replace(/[^+\d]/g, '');
    
    // Si está vacío, devolver vacío
    if (cleanTelefono.length === 0) return '';
    
    // Si empieza con +56, mantenerlo
    if (cleanTelefono.startsWith('+56')) {
        const numero = cleanTelefono.substring(3);
        if (numero.length === 0) return '+56';
        if (numero.length <= 4) return `+56 ${numero}`;
        return `+56 ${numero.substring(0, 1)} ${numero.substring(1, 5)} ${numero.substring(5)}`;
    }
    
    // Si empieza con 56 (sin +), añadir el +
    if (cleanTelefono.startsWith('56') && cleanTelefono.length > 2) {
        const numero = cleanTelefono.substring(2);
        if (numero.length <= 4) return `+56 ${numero}`;
        return `+56 ${numero.substring(0, 1)} ${numero.substring(1, 5)} ${numero.substring(5)}`;
    }
    
    // Si no tiene prefijo, asumir que es número local
    if (cleanTelefono.length <= 4) return cleanTelefono;
    return `${cleanTelefono.substring(0, 1)} ${cleanTelefono.substring(1, 5)} ${cleanTelefono.substring(5)}`;
}

/**
 * Formatea el nombre de un producto para usarlo en URLs
 * @param {string} nombre - El nombre del producto
 * @returns {string} - El nombre formateado para URL
 */
export const formatearNombreParaURL = (nombre) => {
    if (!nombre) return '';
    
    return nombre
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[áéíóú]/g, (m) => ({
            á: 'a',
            é: 'e',
            í: 'i',
            ó: 'o',
            ú: 'u'
        }[m]))
        .replace(/[^a-z0-9-]/g, "");
};

// Exportar formatRut y formatTelefono para que puedan ser usados en otros archivos
export { formatRut, formatTelefono, validarRutChileno };

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

// Función nativa para formatear RUT (reemplaza rut.js)
function formatRut(rut) {
    if (!rut) return rut;
    
    // Limpiar el RUT de puntos y guiones
    let cleanRut = rut.replace(/[.-]/g, '');
    
    // Si no tiene dígito verificador, no formatear
    if (cleanRut.length < 2) return rut;
    
    // Separar número y dígito verificador
    const numero = cleanRut.slice(0, -1);
    const dv = cleanRut.slice(-1);
    
    // Formatear número con puntos
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

// Exportar formatRut para que pueda ser usado en otros archivos
export { formatRut };

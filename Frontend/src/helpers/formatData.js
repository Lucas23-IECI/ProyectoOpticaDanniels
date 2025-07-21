import { startCase } from 'lodash';
import { format as formatRut } from 'rut.js';
import { format as formatTempo } from '@formkit/tempo';
import { getNombreCompleto } from './nameHelpers.js';

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

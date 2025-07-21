export const transformUserToNewStructure = (user) => {
    if (!user.nombreCompleto) {
        return {
            primerNombre: user.primerNombre || "",
            segundoNombre: user.segundoNombre || "",
            apellidoPaterno: user.apellidoPaterno || "",
            apellidoMaterno: user.apellidoMaterno || ""
        };
    }

    const nombreCompleto = user.nombreCompleto.trim();
    const partes = nombreCompleto.split(" ").filter(parte => parte.length > 0);

    if (partes.length === 0) {
        return {
            primerNombre: "",
            segundoNombre: "",
            apellidoPaterno: "",
            apellidoMaterno: ""
        };
    }

    if (partes.length === 1) {
        return {
            primerNombre: partes[0],
            segundoNombre: "",
            apellidoPaterno: "",
            apellidoMaterno: ""
        };
    }

    if (partes.length === 2) {
        return {
            primerNombre: partes[0],
            segundoNombre: "",
            apellidoPaterno: partes[1],
            apellidoMaterno: ""
        };
    }

    if (partes.length === 3) {
        return {
            primerNombre: partes[0],
            segundoNombre: "",
            apellidoPaterno: partes[1],
            apellidoMaterno: partes[2]
        };
    }

    if (partes.length === 4) {
        return {
            primerNombre: partes[0],
            segundoNombre: partes[1],
            apellidoPaterno: partes[2],
            apellidoMaterno: partes[3]
        };
    }

    if (partes.length >= 5) {
        const nombres = partes.slice(0, -2);
        const apellidos = partes.slice(-2);
        
        return {
            primerNombre: nombres[0],
            segundoNombre: nombres.slice(1).join(" "),
            apellidoPaterno: apellidos[0],
            apellidoMaterno: apellidos[1]
        };
    }

    return {
        primerNombre: "",
        segundoNombre: "",
        apellidoPaterno: "",
        apellidoMaterno: ""
    };
};

export const getNombreCompleto = (user) => {
    if (!user || !user.primerNombre) return "";
    
    const parts = [
        user.primerNombre,
        user.segundoNombre,
        user.apellidoPaterno,
        user.apellidoMaterno
    ].filter(Boolean);
    
    return parts.join(" ");
};

export const getNombreCorto = (user) => {
    if (!user?.primerNombre) return "";
    
    return user.primerNombre.trim().split(' ')[0];
};

export const getNombreFormal = (user) => {
    if (!user || !user.primerNombre) return "";
    
    const parts = [user.primerNombre, user.apellidoPaterno].filter(Boolean);
    return parts.join(" ");
};

export const getNombres = (user) => {
    if (!user || !user.primerNombre) return "";
    
    const parts = [user.primerNombre, user.segundoNombre].filter(Boolean);
    return parts.join(" ");
};

export const getApellidos = (user) => {
    if (!user || !user.apellidoPaterno) return "";
    
    const parts = [user.apellidoPaterno, user.apellidoMaterno].filter(Boolean);
    return parts.join(" ");
};

export const getIniciales = (user) => {
    if (!user || !user.primerNombre) return "";
    
    const inicial1 = user.primerNombre.charAt(0).toUpperCase();
    const inicial2 = user.apellidoPaterno ? user.apellidoPaterno.charAt(0).toUpperCase() : "";
    
    return inicial1 + inicial2;
};

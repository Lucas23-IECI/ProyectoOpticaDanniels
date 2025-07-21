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

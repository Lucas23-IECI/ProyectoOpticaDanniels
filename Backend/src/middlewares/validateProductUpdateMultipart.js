import { handleErrorClient } from "../handlers/responseHandlers.js";

export const validateProductUpdateMultipart = (req, res, next) => {
    try {
        if (req.headers["content-type"]?.includes("multipart/form-data")) {
            const convertedData = {};
            
            Object.keys(req.body).forEach(key => {
                const value = req.body[key];
                
                if (key === "precio" || key === "stock" || key === "descuento") {
                    convertedData[key] = value ? parseFloat(value) : 0;
                } else if (key === "activo" || key === "oferta") {
                    convertedData[key] = value === "true";
                } else {
                    convertedData[key] = value;
                }
            });
            
            req.body = convertedData;
        }
        
        next();
    } catch (error) {
        return handleErrorClient(
            res,
            400,
            "Error en el formato de los datos",
            { error: error.message }
        );
    }
};

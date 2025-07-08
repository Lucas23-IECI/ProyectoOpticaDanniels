import { productSchema } from "../validations/producto.validation.js";

export const validateProductoMultipart = (req, res, next) => {
    try {
        const data = {
            ...req.body,
            precio: req.body.precio ? Number(req.body.precio) : undefined,
            stock: req.body.stock ? Number(req.body.stock) : undefined,
            descuento: req.body.descuento ? Number(req.body.descuento) : 0,
            activo: req.body.activo === "true" || req.body.activo === true,
            oferta: req.body.oferta === "true" || req.body.oferta === true,
        };

        const { error } = productSchema.validate(data);
        
        if (error) {
            return res.status(400).json({
                mensaje: "Datos de producto inválidos",
                errores: error.details.map(detail => ({
                    campo: detail.path.join("."),
                    mensaje: detail.message
                }))
            });
        }

        req.body = data;
        next();
    } catch (error) {
        return res.status(400).json({
            mensaje: "Error de validación",
            error: error.message
        });
    }
};

import Joi from "joi";

export const productSchema = Joi.object({
    nombre: Joi.string().max(255).required(),
    descripcion: Joi.string().required(),
    precio: Joi.number().positive().precision(2).required(),
    categoria: Joi.string()
        .valid("opticos", "sol", "accesorios")
        .required(),
    imagen_url: Joi.string().uri().max(500).required(),
    stock: Joi.number().integer().min(0).required(),
    activo: Joi.boolean().required(),
    marca: Joi.string().max(100).required(),
    codigoSKU: Joi.string().max(100).required(),
    oferta: Joi.boolean().required(),
    descuento: Joi.number().min(0).max(100).precision(2).required(),
});

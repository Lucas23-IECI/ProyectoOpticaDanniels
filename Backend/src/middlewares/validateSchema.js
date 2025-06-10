export const validateSchema = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({
                status: "error",
                message: "Datos inválidos",
                errors: error.details.map((e) => e.message),
            });
        }
        next();
    };
};
  
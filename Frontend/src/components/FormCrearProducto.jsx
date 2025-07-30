import Form from '@components/Form';
import useCreateProducto from '@hooks/productos/useCreateProducto';

const FormCrearProducto = ({ setShow, onSuccess }) => {
    const { handleCreate, loading } = useCreateProducto((nuevo) => {
        setShow(false);
        if (onSuccess) onSuccess(nuevo);
    });


    return (
        <Form
            title="Nuevo Producto"
            onSubmit={handleCreate}
            buttonText={loading ? 'Creando...' : 'Crear Producto'}
            fields={[
                { name: "nombre", label: "Nombre", placeholder: "Nombre del producto", fieldType: "input", type: "text", required: true },
                { name: "descripcion", label: "Descripción", placeholder: "Descripción detallada", fieldType: "textarea", required: true },
                { name: "precio", label: "Precio", placeholder: "Ej: 49990", fieldType: "input", type: "number", required: true },
                {
                    name: "categoria", label: "Categoría", fieldType: "select", required: true, options: [
                        { value: "opticos", label: "Ópticos" },
                        { value: "sol", label: "Sol" },
                        { value: "accesorios", label: "Accesorios" },
                    ]
                },
                { name: "imagen_url", label: "URL Imagen", placeholder: "https://...", fieldType: "input", type: "url", required: true },
                { 
                    name: "stock", 
                    label: "Stock", 
                    placeholder: "Cantidad", 
                    fieldType: "input", 
                    type: "text", 
                    required: true,
                    min: 0,
                    max: 99999,
                    pattern: /^[0-9]+$/,
                    patternMessage: "Solo se permiten números enteros positivos",
                    validate: {
                        onlyNumbers: (value) => {
                            if (!value) return true; // Permitir vacío si no es required
                            return /^[0-9]+$/.test(value) || "Solo se permiten números";
                        },
                        maxValue: (value) => {
                            if (!value) return true;
                            const num = parseInt(value);
                            return num <= 99999 || "El stock no puede exceder 99,999";
                        }
                    }
                },
                {
                    name: "activo", label: "Activo", fieldType: "select", required: true, options: [
                        { value: true, label: "Sí" },
                        { value: false, label: "No" }
                    ]
                },
                { name: "marca", label: "Marca", placeholder: "RayBan", fieldType: "input", type: "text", required: true },
                { name: "codigoSKU", label: "SKU", placeholder: "RB-123", fieldType: "input", type: "text", required: true },
                {
                    name: "oferta", label: "¿En oferta?", fieldType: "select", required: true, options: [
                        { value: true, label: "Sí" },
                        { value: false, label: "No" }
                    ]
                },
                { 
                    name: "descuento", 
                    label: "Descuento (%)", 
                    placeholder: "Ej: 10", 
                    fieldType: "input", 
                    type: "text", 
                    required: true,
                    min: 0,
                    max: 100,
                    pattern: /^[0-9]+$/,
                    patternMessage: "Solo se permiten números enteros positivos",
                    validate: {
                        onlyNumbers: (value) => {
                            if (!value) return true; // Permitir vacío si no es required
                            return /^[0-9]+$/.test(value) || "Solo se permiten números";
                        },
                        maxValue: (value) => {
                            if (!value) return true;
                            const num = parseInt(value);
                            return num <= 100 || "El descuento no puede exceder 100%";
                        }
                    }
                },
            ]}
        />
    );
};

export default FormCrearProducto;

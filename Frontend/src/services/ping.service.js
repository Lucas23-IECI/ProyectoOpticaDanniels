const API_URL = import.meta.env.VITE_BASE_URL;

export default async function ping() {
    try {
        const res = await fetch(`${API_URL}/`);
        const text = await res.text();
        return text;
    } catch (error) {
        console.error("Error conectando al backend:", error);
        return "No se pudo conectar al backend.";
    }
}

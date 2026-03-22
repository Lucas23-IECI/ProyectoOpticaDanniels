/**
 * Listado estático de marcas conocidas con sus rutas de logo SVG.
 * Usado por el Navbar (mega menú) y como fallback cuando la API no está disponible.
 */
export const MARCAS_CONOCIDAS = [
    { id: "rayban",          nombre: "Ray-Ban",          logo: "/images/marcas/rayban.svg" },
    { id: "oakley",          nombre: "Oakley",           logo: "/images/marcas/oakley.svg" },
    { id: "essilor",         nombre: "Essilor",          logo: "/images/marcas/essilor.svg" },
    { id: "varilux",         nombre: "Varilux",          logo: "/images/marcas/varilux.svg" },
    { id: "transitions",     nombre: "Transitions",      logo: "/images/marcas/transitions.svg" },
    { id: "carrera",         nombre: "Carrera",          logo: "/images/marcas/carrera.svg" },
    { id: "arnette",         nombre: "Arnette",          logo: "/images/marcas/arnette.svg" },
    { id: "hawkers",         nombre: "Hawkers",          logo: "/images/marcas/hawkers.svg" },
    { id: "vogue",           nombre: "Vogue",            logo: "/images/marcas/vogue.svg" },
    { id: "michael-kors",    nombre: "Michael Kors",     logo: "/images/marcas/michael-kors.svg" },
    { id: "emporio-armani",  nombre: "Emporio Armani",   logo: "/images/marcas/emporio-armani.svg" },
    { id: "silhouette",      nombre: "Silhouette",       logo: "/images/marcas/silhouette.svg" },
    { id: "polaroid",        nombre: "Polaroid",         logo: "/images/marcas/polaroid.svg" },
    { id: "carolina-herrera",nombre: "Carolina Herrera", logo: "/images/marcas/carolina-herrera.svg" },
    { id: "nikon",           nombre: "Nikon",            logo: "/images/marcas/nikon.svg" },
    { id: "versace",         nombre: "Versace",          logo: "/images/marcas/versace.svg" },
    { id: "prada",           nombre: "Prada",            logo: "/images/marcas/prada.svg" },
    { id: "ralph-lauren",    nombre: "Ralph Lauren",     logo: "/images/marcas/ralph-lauren.svg" },
];

/**
 * Devuelve la ruta del logo SVG para un nombre de marca dado.
 * Comparación insensible a mayúsculas/minúsculas.
 * @param {string} nombre
 * @returns {string|null}
 */
export const getMarcaLogo = (nombre) => {
    if (!nombre) return null;
    const match = MARCAS_CONOCIDAS.find(
        (m) => m.nombre.toLowerCase() === nombre.toLowerCase()
    );
    return match ? match.logo : null;
};

export const categorias = [
    {
        id: 'opticos',
        nombre: 'Lentes Ópticos',
        descripcion: 'Lentes para corrección visual',
        icono: '👓',
        subcategorias: [
            {
                id: 'graduados',
                nombre: 'Graduados',
                descripcion: 'Lentes con graduación personalizada'
            },
            {
                id: 'progresivos',
                nombre: 'Progresivos',
                descripcion: 'Lentes multifocales progresivos'
            },
            {
                id: 'bifocales',
                nombre: 'Bifocales',
                descripcion: 'Lentes con dos zonas de visión'
            },
            {
                id: 'monofocales',
                nombre: 'Monofocales',
                descripcion: 'Lentes de una sola graduación'
            },
            {
                id: 'lectura',
                nombre: 'Lectura',
                descripcion: 'Lentes para visión de cerca'
            }
        ]
    },
    {
        id: 'sol',
        nombre: 'Lentes de Sol',
        descripcion: 'Protección solar y estilo',
        icono: '🕶️',
        subcategorias: [
            {
                id: 'deportivos',
                nombre: 'Deportivos',
                descripcion: 'Para actividades deportivas y aire libre'
            },
            {
                id: 'clasicos',
                nombre: 'Clásicos',
                descripcion: 'Diseños atemporales y elegantes'
            },
            {
                id: 'aviador',
                nombre: 'Aviador',
                descripcion: 'Estilo aviador clásico'
            },
            {
                id: 'wayfarer',
                nombre: 'Wayfarer',
                descripcion: 'Estilo wayfarer moderno'
            },
            {
                id: 'oversized',
                nombre: 'Oversized',
                descripcion: 'Lentes de gran tamaño'
            },
            {
                id: 'polarizados',
                nombre: 'Polarizados',
                descripcion: 'Con filtro polarizado'
            }
        ]
    },
    {
        id: 'accesorios',
        nombre: 'Accesorios',
        descripcion: 'Complementos para lentes',
        icono: '🧰',
        subcategorias: [
            {
                id: 'fundas',
                nombre: 'Fundas',
                descripcion: 'Protección y almacenamiento'
            },
            {
                id: 'cadenas',
                nombre: 'Cadenas',
                descripcion: 'Cadenas y cordones'
            },
            {
                id: 'limpieza',
                nombre: 'Limpieza',
                descripcion: 'Productos de limpieza'
            },
            {
                id: 'reparacion',
                nombre: 'Reparación',
                descripcion: 'Kits de reparación'
            },
            {
                id: 'deportivos',
                nombre: 'Deportivos',
                descripcion: 'Accesorios deportivos'
            }
        ]
    }
];

export const CATEGORIAS = {
    opticos: {
        nombre: 'Lentes Ópticos',
        descripcion: 'Lentes para corrección visual',
        icono: '👓',
        subcategorias: {
            graduados: {
                nombre: 'Graduados',
                descripcion: 'Lentes con graduación personalizada'
            },
            progresivos: {
                nombre: 'Progresivos',
                descripcion: 'Lentes multifocales progresivos'
            },
            bifocales: {
                nombre: 'Bifocales',
                descripcion: 'Lentes con dos zonas de visión'
            },
            monofocales: {
                nombre: 'Monofocales',
                descripcion: 'Lentes de una sola graduación'
            },
            lectura: {
                nombre: 'Lectura',
                descripcion: 'Lentes para visión de cerca'
            }
        }
    },
    sol: {
        nombre: 'Lentes de Sol',
        descripcion: 'Protección solar y estilo',
        icono: '🕶️',
        subcategorias: {
            deportivos: {
                nombre: 'Deportivos',
                descripcion: 'Para actividades deportivas y aire libre'
            },
            clasicos: {
                nombre: 'Clásicos',
                descripcion: 'Diseños atemporales y elegantes'
            },
            aviador: {
                nombre: 'Aviador',
                descripcion: 'Estilo aviador clásico'
            },
            wayfarer: {
                nombre: 'Wayfarer',
                descripcion: 'Estilo wayfarer moderno'
            },
            oversized: {
                nombre: 'Oversized',
                descripcion: 'Lentes de gran tamaño'
            },
            polarizados: {
                nombre: 'Polarizados',
                descripcion: 'Con filtro polarizado'
            }
        }
    },
    accesorios: {
        nombre: 'Accesorios',
        descripcion: 'Complementos para lentes',
        icono: '🧰',
        subcategorias: {
            fundas: {
                nombre: 'Fundas',
                descripcion: 'Protección y almacenamiento'
            },
            cadenas: {
                nombre: 'Cadenas',
                descripcion: 'Cadenas y cordones'
            },
            limpieza: {
                nombre: 'Limpieza',
                descripcion: 'Productos de limpieza'
            },
            reparacion: {
                nombre: 'Reparación',
                descripcion: 'Kits de reparación'
            },
            deportivos: {
                nombre: 'Deportivos',
                descripcion: 'Accesorios deportivos'
            }
        }
    }
};

export const getCategoriasList = () => {
    return Object.keys(CATEGORIAS).map(key => ({
        value: key,
        label: CATEGORIAS[key].nombre,
        icon: CATEGORIAS[key].icono
    }));
};

export const getSubcategoriasList = (categoria) => {
    if (!categoria || !CATEGORIAS[categoria]) return [];
    
    return Object.keys(CATEGORIAS[categoria].subcategorias).map(key => ({
        value: key,
        label: CATEGORIAS[categoria].subcategorias[key].nombre
    }));
};

export const validateCategoria = (categoria) => {
    return categoria && Object.keys(CATEGORIAS).includes(categoria);
};

export const validateSubcategoria = (categoria, subcategoria) => {
    if (!validateCategoria(categoria)) return false;
    if (!subcategoria) return true;
    return Object.keys(CATEGORIAS[categoria].subcategorias).includes(subcategoria);
};

export const getCategoriaInfo = (categoriaId) => {
    return categorias.find(cat => cat.id === categoriaId);
};

export const getSubcategoriaInfo = (categoriaId, subcategoriaId) => {
    const categoria = getCategoriaInfo(categoriaId);
    if (!categoria) return null;
    
    return categoria.subcategorias.find(sub => sub.id === subcategoriaId);
};

export const formatearCategoria = (categoriaId, subcategoriaId) => {
    const categoria = getCategoriaInfo(categoriaId);
    if (!categoria) return 'Sin categoría';
    
    if (!subcategoriaId) {
        return categoria.nombre;
    }
    
    const subcategoria = getSubcategoriaInfo(categoriaId, subcategoriaId);
    if (!subcategoria) return categoria.nombre;
    
    return `${categoria.nombre} > ${subcategoria.nombre}`;
};

export const formatearCategoriaCorta = (categoriaId, subcategoriaId) => {
    const categoria = getCategoriaInfo(categoriaId);
    if (!categoria) return 'Sin categoría';
    
    if (!subcategoriaId) {
        return categoria.nombre;
    }
    
    const subcategoria = getSubcategoriaInfo(categoriaId, subcategoriaId);
    if (!subcategoria) return categoria.nombre;
    
    return subcategoria.nombre;
};

export const getCategoriaIcon = (categoriaId) => {
    const categoria = getCategoriaInfo(categoriaId);
    return categoria ? categoria.icono : '📦';
};

export const getAllCategorias = () => {
    return categorias;
};

export const getAllSubcategorias = (categoriaId) => {
    const categoria = getCategoriaInfo(categoriaId);
    return categoria ? categoria.subcategorias : [];
};

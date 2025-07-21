import { categorias } from '../constants/categorias.js';

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

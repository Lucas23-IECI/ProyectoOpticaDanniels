import '@styles/productos/category-banner.css';

const CATEGORY_LABELS = {
    opticos: 'Lentes Ópticos',
    sol: 'Lentes de Sol',
    accesorios: 'Accesorios',
};

const CATEGORY_SUBTITLES = {
    opticos: 'Colección completa',
    sol: 'Colección completa',
    accesorios: 'Estuches, limpiadores & más',
};

const CategoryBanner = ({ categoria, totalProductos }) => {
    const title = categoria ? CATEGORY_LABELS[categoria] || categoria : 'Catálogo';
    const subtitle = categoria ? CATEGORY_SUBTITLES[categoria] || null : 'Todos los productos';

    return (
        <div className="category-banner">
            <div className="category-banner-inner">
                <div>
                    <h1 className="category-banner-title">{title}</h1>
                    {subtitle && (
                        <p className="category-banner-subtitle">{subtitle}</p>
                    )}
                </div>
                <div className="category-banner-meta">
                    {totalProductos != null && (
                        <span className="category-banner-count">
                            {totalProductos} producto{totalProductos !== 1 ? 's' : ''}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryBanner;

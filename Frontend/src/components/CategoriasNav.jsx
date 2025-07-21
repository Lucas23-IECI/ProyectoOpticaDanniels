import { FaHome, FaChevronRight } from 'react-icons/fa';
import { getCategoriaInfo, getSubcategoriaInfo } from '../constants/categorias.js';
import '@styles/categoriasNav.css';

const CategoriasNav = ({ 
    categoria, 
    subcategoria, 
    onCategoriaClick, 
    onSubcategoriaClick,
    showProductCount = false,
    productCount = 0
}) => {
    const categoriaInfo = categoria ? getCategoriaInfo(categoria) : null;
    const subcategoriaInfo = categoria && subcategoria ? getSubcategoriaInfo(categoria, subcategoria) : null;

    const breadcrumbs = [];

    if (categoriaInfo) {
        breadcrumbs.push({
            label: categoriaInfo.nombre,
            icon: categoriaInfo.icono,
            onClick: () => onCategoriaClick(categoria),
            active: categoria && !subcategoria
        });
    }

    if (subcategoriaInfo) {
        breadcrumbs.push({
            label: subcategoriaInfo.nombre,
            onClick: () => onSubcategoriaClick(categoria, subcategoria),
            active: true
        });
    }

    return (
        <div className="categorias-nav">
            <div className="breadcrumbs">
                {breadcrumbs.map((item, index) => (
                    <div key={index} className="breadcrumb-item">
                        {index > 0 && <FaChevronRight className="breadcrumb-separator" />}
                        
                        <button
                            className={`breadcrumb-btn ${item.active ? 'active' : ''}`}
                            onClick={item.onClick}
                        >
                            {item.icon && (
                                <span className="breadcrumb-icon">{item.icon}</span>
                            )}
                            <span className="breadcrumb-label">{item.label}</span>
                        </button>
                    </div>
                ))}
            </div>

            {showProductCount && (
                <div className="product-count">
                    <span className="count-text">
                        {productCount} {productCount === 1 ? 'producto' : 'productos'} encontrados
                    </span>
                </div>
            )}

            {categoriaInfo && (
                <div className="categoria-info">
                    <div className="categoria-header">
                        <span className="categoria-icono-grande">{categoriaInfo.icono}</span>
                        <div className="categoria-textos">
                            <h2 className="categoria-titulo">{categoriaInfo.nombre}</h2>
                            <p className="categoria-descripcion">{categoriaInfo.descripcion}</p>
                        </div>
                    </div>

                    {subcategoriaInfo && (
                        <div className="subcategoria-info">
                            <h3 className="subcategoria-titulo">{subcategoriaInfo.nombre}</h3>
                            <p className="subcategoria-descripcion">{subcategoriaInfo.descripcion}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CategoriasNav;

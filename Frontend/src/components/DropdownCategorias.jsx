import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { getCategoriasList, getSubcategoriasList } from '../constants/categorias.js';
import '@styles/dropdownCategorias.css';

const DropdownCategorias = ({ 
    selectedCategoria, 
    selectedSubcategoria, 
    onCategoriaChange, 
    onSubcategoriaChange,
    showSubcategories = true,
    placeholder = "Seleccionar categoría",
    dropdownActivo,
    setDropdownActivo,
    id = 'default'
}) => {
    const categoriaId = `categorias-${id}`;
    const subcategoriaId = `subcategorias-${id}`;
    const isOpen = dropdownActivo === categoriaId;
    const isSubOpen = dropdownActivo === subcategoriaId;

    const categorias = getCategoriasList();
    const subcategorias = selectedCategoria ? getSubcategoriasList(selectedCategoria) : [];
    
    const categoriaInfo = categorias.find(cat => cat.value === selectedCategoria);
    const subcategoriaInfo = subcategorias.find(sub => sub.value === selectedSubcategoria);

    const handleCategoriaSelect = (valor) => {
        onCategoriaChange(valor);
        if (valor !== selectedCategoria) {
            onSubcategoriaChange('');
        }
        setDropdownActivo(null);
    };

    const handleSubcategoriaSelect = (valor) => {
        onSubcategoriaChange(valor);
        setDropdownActivo(null);
    };

    const limpiarSeleccion = () => {
        onCategoriaChange('');
        onSubcategoriaChange('');
        setDropdownActivo(null);
    };

    return (
        <div className="dropdown-categorias">
            <div className="categoria-principal">
                <button
                    type="button"
                    className={`dropdown-btn ${selectedCategoria ? 'selected' : ''}`}
                    onClick={() => setDropdownActivo(isOpen ? null : categoriaId)}
                >
                    <div className="btn-content">
                        {categoriaInfo ? (
                            <>
                                <span className="categoria-icono">{categoriaInfo.icon}</span>
                                <span className="categoria-texto">{categoriaInfo.label}</span>
                            </>
                        ) : (
                            <span className="placeholder-texto">{placeholder}</span>
                        )}
                    </div>
                    {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                </button>

                {isOpen && (
                    <div className="dropdown-menu">
                        <div className="dropdown-header">
                            <h4>Categorías</h4>
                            {selectedCategoria && (
                                <button 
                                    type="button"
                                    className="limpiar-btn"
                                    onClick={limpiarSeleccion}
                                >
                                    Limpiar
                                </button>
                            )}
                        </div>
                        
                        <div className="categorias-grid">
                            {categorias.map((cat) => (
                                <button
                                    key={cat.value}
                                    type="button"
                                    className={`categoria-item ${selectedCategoria === cat.value ? 'active' : ''}`}
                                    onClick={() => handleCategoriaSelect(cat.value)}
                                >
                                    <span className="categoria-icono">{cat.icon}</span>
                                    <span className="categoria-nombre">{cat.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {showSubcategories && selectedCategoria && subcategorias.length > 0 && (
                <div className="subcategoria-secundaria">
                    <button
                        type="button"
                        className={`dropdown-btn subcategoria-btn ${selectedSubcategoria ? 'selected' : ''}`}
                        onClick={() => setDropdownActivo(isSubOpen ? null : subcategoriaId)}
                    >
                        <div className="btn-content">
                            {subcategoriaInfo ? (
                                <span className="subcategoria-texto">{subcategoriaInfo.label}</span>
                            ) : (
                                <span className="placeholder-texto">Subcategoría</span>
                            )}
                        </div>
                        {isSubOpen ? <FaChevronUp /> : <FaChevronDown />}
                    </button>

                    {isSubOpen && (
                        <div className="dropdown-menu subcategoria-menu">
                            <div className="dropdown-header">
                                <h4>Subcategorías</h4>
                                {selectedSubcategoria && (
                                                                    <button 
                                    type="button"
                                    className="limpiar-btn"
                                    onClick={() => {
                                        onSubcategoriaChange('');
                                        setDropdownActivo(null);
                                    }}
                                >
                                    Limpiar
                                </button>
                                )}
                            </div>
                            
                            <div className="subcategorias-list">
                                {subcategorias.map((sub) => (
                                    <button
                                        key={sub.value}
                                        type="button"
                                        className={`subcategoria-item ${selectedSubcategoria === sub.value ? 'active' : ''}`}
                                        onClick={() => handleSubcategoriaSelect(sub.value)}
                                    >
                                        <div className="subcategoria-info">
                                            <span className="subcategoria-nombre">{sub.label}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DropdownCategorias;

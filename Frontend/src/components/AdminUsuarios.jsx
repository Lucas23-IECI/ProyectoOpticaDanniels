import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
    FaPlus, FaSearch, FaFilter, FaEye, FaEdit, FaTrash, FaTh, FaList, FaTable,
    FaArrowLeft, FaArrowRight, FaSort, FaSortUp, FaSortDown, FaSpinner,
    FaUsers, FaCalendar, FaEnvelope, FaPhone, FaTimes, FaSync, FaIdCard,
    FaUserShield, FaUser, FaVenus, FaMars, FaGenderless
} from 'react-icons/fa';
import useUsers from '@hooks/users/useUsers';
import CrearUsuarioPopup from './CrearUsuarioPopup';
import EditarUsuarioPopup from './EditarUsuarioPopup';
import ConfirmarEliminarUsuarioPopup from './ConfirmarEliminarUsuarioPopup';
import { getNombreCompleto } from '@helpers/nameHelpers';
import '@styles/adminUsuarios.css';

const ITEMS_PER_PAGE_OPTIONS = [12, 24, 48, 96];
const SORT_OPTIONS = [
    { value: 'primerNombre', label: 'Nombre' },
    { value: 'apellidoPaterno', label: 'Apellido' },
    { value: 'email', label: 'Email' },
    { value: 'rol', label: 'Rol' },
    { value: 'createdAt', label: 'Fecha registro' },
    { value: 'updatedAt', label: 'Última actualización' }
];

const VIEW_MODES = {
    GRID: 'grid',
    LIST: 'list',
    TABLE: 'table'
};

const ROLES = ['usuario', 'administrador'];
const GENEROS = ['masculino', 'femenino', 'otro', 'no especificar'];

const AdminUsuarios = () => {
    const { usuarios, loading, error, refetchUsuarios } = useUsers();
    
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[0]);
    const [totalItems, setTotalItems] = useState(0);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        rol: '',
        genero: '',
        fechaRegistroDesde: '',
        fechaRegistroHasta: ''
    });
    
    const [sortBy, setSortBy] = useState('primerNombre');
    const [sortOrder, setSortOrder] = useState('asc');
    
    const [viewMode, setViewMode] = useState(VIEW_MODES.GRID);
    const [showFilters, setShowFilters] = useState(false);
    
    const [showCrearModal, setShowCrearModal] = useState(false);
    const [showEditarModal, setShowEditarModal] = useState(false);
    const [showEliminarModal, setShowEliminarModal] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

    // Procesar usuarios con filtros y búsqueda
    const usuariosProcessados = useMemo(() => {
        let resultado = [...usuarios];
        
        // Aplicar búsqueda
        if (searchTerm) {
            const searchWords = searchTerm.toLowerCase().trim().split(/\\s+/);
            resultado = resultado.filter(usuario => {
                const searchableText = [
                    usuario.primerNombre,
                    usuario.segundoNombre,
                    usuario.apellidoPaterno,
                    usuario.apellidoMaterno,
                    usuario.email,
                    usuario.rut,
                    usuario.telefono,
                    usuario.rol
                ].join(' ').toLowerCase();
                
                return searchWords.every(word => 
                    searchableText.includes(word)
                );
            });
        }
        
        // Aplicar filtros
        if (filters.rol) {
            resultado = resultado.filter(usuario => usuario.rol === filters.rol);
        }
        
        if (filters.genero) {
            resultado = resultado.filter(usuario => usuario.genero === filters.genero);
        }
        
        if (filters.fechaRegistroDesde) {
            const fechaDesde = new Date(filters.fechaRegistroDesde);
            resultado = resultado.filter(usuario => 
                new Date(usuario.createdAt) >= fechaDesde
            );
        }
        
        if (filters.fechaRegistroHasta) {
            const fechaHasta = new Date(filters.fechaRegistroHasta);
            fechaHasta.setHours(23, 59, 59, 999); // Incluir todo el día
            resultado = resultado.filter(usuario => 
                new Date(usuario.createdAt) <= fechaHasta
            );
        }
        
        // Aplicar ordenamiento
        resultado.sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];
            
            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }
            
            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });
        
        return resultado;
    }, [usuarios, searchTerm, filters, sortBy, sortOrder]);

    // Calcular paginación
    useEffect(() => {
        setTotalItems(usuariosProcessados.length);
    }, [usuariosProcessados]);

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const usuariosPaginados = usuariosProcessados.slice(startIndex, endIndex);

    // Resetear página cuando cambian filtros
    useEffect(() => {
        if (currentPage !== 1) {
            setCurrentPage(1);
        }
    }, [searchTerm, filters, currentPage]);

    // Handlers
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    };

    const handleSortChange = (newSortBy) => {
        if (newSortBy === sortBy) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(newSortBy);
            setSortOrder('asc');
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };

    const handleEditarUsuario = (usuario) => {
        setUsuarioSeleccionado(usuario);
        setShowEditarModal(true);
    };

    const handleEliminarUsuario = (usuario) => {
        setUsuarioSeleccionado(usuario);
        setShowEliminarModal(true);
    };

    const handleUsuarioCreado = () => {
        refetchUsuarios();
        setShowCrearModal(false);
    };

    const handleUsuarioActualizado = () => {
        refetchUsuarios();
        setShowEditarModal(false);
        setUsuarioSeleccionado(null);
    };

    const handleUsuarioEliminado = () => {
        refetchUsuarios();
        setShowEliminarModal(false);
        setUsuarioSeleccionado(null);
    };

    const limpiarFiltros = () => {
        setSearchTerm('');
        setFilters({
            rol: '',
            genero: '',
            fechaRegistroDesde: '',
            fechaRegistroHasta: ''
        });
    };

    const getSortIcon = (field) => {
        if (sortBy !== field) return <FaSort className="sort-icon" />;
        return sortOrder === 'asc' ? 
            <FaSortUp className="sort-icon active" /> : 
            <FaSortDown className="sort-icon active" />;
    };

    const formatearFecha = (fecha) => {
        if (!fecha) return 'No especificada';
        return new Date(fecha).toLocaleDateString('es-CL', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getGenderIcon = (genero) => {
        switch (genero) {
            case 'masculino': return <FaMars className="gender-icon" />;
            case 'femenino': return <FaVenus className="gender-icon" />;
            default: return <FaGenderless className="gender-icon" />;
        }
    };

    const getRoleIcon = (rol) => {
        return rol === 'administrador' ? 
            <FaUserShield className="role-icon" /> : 
            <FaUser className="role-icon" />;
    };

    return (
        <div className="admin-usuarios">
            <div className="admin-header">
                <div className="header-title">
                    <h1>Administración de Usuarios</h1>
                    <span className="usuarios-count">
                        {loading ? 'Cargando...' : `${totalItems} usuarios`}
                    </span>
                </div>
                
                <div className="header-actions">
                    <button 
                        className="btn btn-refresh"
                        onClick={refetchUsuarios}
                        disabled={loading}
                    >
                        <FaSync className={loading ? 'spinning' : ''} />
                        Actualizar
                    </button>
                    
                    <button 
                        className="btn btn-primary"
                        onClick={() => setShowCrearModal(true)}
                    >
                        <FaPlus /> Crear Usuario
                    </button>
                </div>
            </div>

            <div className="search-filters-bar">
                <div className="search-section">
                    <div className="search-input-container">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar usuarios..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="search-input"
                        />
                        {searchTerm && (
                            <button 
                                className="clear-search"
                                onClick={() => setSearchTerm('')}
                            >
                                <FaTimes />
                            </button>
                        )}
                    </div>
                    
                    <button 
                        className={`btn btn-filter usuarios-filter-btn ${showFilters ? 'active' : ''}`}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <FaFilter /> Filtros
                    </button>
                </div>

                <div className="view-controls">
                    <div className="view-mode-buttons">
                        <button 
                            className={`btn btn-view ${viewMode === VIEW_MODES.GRID ? 'active' : ''}`}
                            onClick={() => setViewMode(VIEW_MODES.GRID)}
                            title="Vista cuadriculada"
                        >
                            <FaTh />
                        </button>
                        <button 
                            className={`btn btn-view ${viewMode === VIEW_MODES.LIST ? 'active' : ''}`}
                            onClick={() => setViewMode(VIEW_MODES.LIST)}
                            title="Vista lista"
                        >
                            <FaList />
                        </button>
                        <button 
                            className={`btn btn-view ${viewMode === VIEW_MODES.TABLE ? 'active' : ''}`}
                            onClick={() => setViewMode(VIEW_MODES.TABLE)}
                            title="Vista tabla"
                        >
                            <FaTable />
                        </button>
                    </div>
                    
                    <div className="items-per-page">
                        <label>Mostrar:</label>
                        <select 
                            value={itemsPerPage} 
                            onChange={handleItemsPerPageChange}
                            className="items-select"
                        >
                            {ITEMS_PER_PAGE_OPTIONS.map(option => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {showFilters && (
                <div className="filters-panel">
                    <div className="filters-grid">
                        <div className="filter-group">
                            <label>Rol:</label>
                            <select 
                                value={filters.rol} 
                                onChange={(e) => handleFilterChange('rol', e.target.value)}
                            >
                                <option value="">Todos los roles</option>
                                {ROLES.map(rol => (
                                    <option key={rol} value={rol}>{rol}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="filter-group">
                            <label>Género:</label>
                            <select 
                                value={filters.genero} 
                                onChange={(e) => handleFilterChange('genero', e.target.value)}
                            >
                                <option value="">Todos los géneros</option>
                                {GENEROS.map(genero => (
                                    <option key={genero} value={genero}>{genero}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="filter-group">
                            <label>Registrado desde:</label>
                            <input 
                                type="date" 
                                value={filters.fechaRegistroDesde}
                                onChange={(e) => handleFilterChange('fechaRegistroDesde', e.target.value)}
                            />
                        </div>
                        
                        <div className="filter-group">
                            <label>Registrado hasta:</label>
                            <input 
                                type="date" 
                                value={filters.fechaRegistroHasta}
                                onChange={(e) => handleFilterChange('fechaRegistroHasta', e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <div className="filters-actions">
                        <button className="btn btn-secondary" onClick={limpiarFiltros}>
                            Limpiar filtros
                        </button>
                    </div>
                </div>
            )}

            <div className="sort-bar">
                <div className="sort-section">
                    <span>Ordenar por:</span>
                    {SORT_OPTIONS.map(option => (
                        <button
                            key={option.value}
                            className={`btn btn-sort ${sortBy === option.value ? 'active' : ''}`}
                            onClick={() => handleSortChange(option.value)}
                        >
                            {option.label}
                            {getSortIcon(option.value)}
                        </button>
                    ))}
                </div>
                
                <div className="results-info">
                    Mostrando {startIndex + 1}-{endIndex} de {totalItems} usuarios
                </div>
            </div>

            <div className="usuarios-content">
                {loading && (
                    <div className="loading-container">
                        <FaSpinner className="spinner" />
                        <p>Cargando usuarios...</p>
                    </div>
                )}
                
                {error && (
                    <div className="error-container">
                        <p>{error}</p>
                        <button className="btn btn-primary" onClick={refetchUsuarios}>
                            Reintentar
                        </button>
                    </div>
                )}
                
                {!loading && !error && usuariosPaginados.length === 0 && (
                    <div className="empty-container">
                        <p>No se encontraron usuarios</p>
                        <button className="btn btn-primary" onClick={limpiarFiltros}>
                            Limpiar filtros
                        </button>
                    </div>
                )}
                
                {!loading && !error && usuariosPaginados.length > 0 && (
                    <>
                        {viewMode === VIEW_MODES.GRID && (
                            <div className="usuarios-grid">
                                {usuariosPaginados.map(usuario => (
                                    <UsuarioCard
                                        key={usuario.id}
                                        usuario={usuario}
                                        onEditar={handleEditarUsuario}
                                        onEliminar={handleEliminarUsuario}
                                        formatearFecha={formatearFecha}
                                        getGenderIcon={getGenderIcon}
                                        getRoleIcon={getRoleIcon}
                                    />
                                ))}
                            </div>
                        )}
                        
                        {viewMode === VIEW_MODES.LIST && (
                            <div className="usuarios-list">
                                {usuariosPaginados.map(usuario => (
                                    <UsuarioListItem
                                        key={usuario.id}
                                        usuario={usuario}
                                        onEditar={handleEditarUsuario}
                                        onEliminar={handleEliminarUsuario}
                                        formatearFecha={formatearFecha}
                                        getGenderIcon={getGenderIcon}
                                        getRoleIcon={getRoleIcon}
                                    />
                                ))}
                            </div>
                        )}
                        
                        {viewMode === VIEW_MODES.TABLE && (
                            <div className="usuarios-table-container">
                                <UsuarioTable
                                    usuarios={usuariosPaginados}
                                    onEditar={handleEditarUsuario}
                                    onEliminar={handleEliminarUsuario}
                                    formatearFecha={formatearFecha}
                                    getGenderIcon={getGenderIcon}
                                    getRoleIcon={getRoleIcon}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>

            {totalPages > 1 && (
                <div className="pagination-container">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                    />
                </div>
            )}

            {showCrearModal && (
                <CrearUsuarioPopup
                    show={showCrearModal}
                    setShow={setShowCrearModal}
                    onUsuarioCreated={handleUsuarioCreado}
                />
            )}
            
            {showEditarModal && (
                <EditarUsuarioPopup
                    show={showEditarModal}
                    setShow={setShowEditarModal}
                    usuario={usuarioSeleccionado}
                    onUsuarioUpdated={handleUsuarioActualizado}
                />
            )}
            
            {showEliminarModal && (
                <ConfirmarEliminarUsuarioPopup
                    show={showEliminarModal}
                    setShow={setShowEliminarModal}
                    usuario={usuarioSeleccionado}
                    onConfirm={handleUsuarioEliminado}
                />
            )}
        </div>
    );
};

// Componente para tarjeta de usuario
const UsuarioCard = ({ usuario, onEditar, onEliminar, formatearFecha, getGenderIcon, getRoleIcon }) => {
    return (
        <div className="usuario-card">
            <div className="usuario-avatar">
                <FaUser className="avatar-icon" />
                <div className="usuario-badges">
                    <span className={`badge badge-${usuario.rol}`}>
                        {getRoleIcon(usuario.rol)}
                        {usuario.rol}
                    </span>
                </div>
            </div>
            
            <div className="usuario-info">
                <h3 className="usuario-name">{getNombreCompleto(usuario)}</h3>
                <div className="usuario-details">
                    <p className="usuario-email">
                        <FaEnvelope className="detail-icon" />
                        {usuario.email}
                    </p>
                    <p className="usuario-rut">
                        <FaIdCard className="detail-icon" />
                        {usuario.rut}
                    </p>
                    {usuario.telefono && (
                        <p className="usuario-phone">
                            <FaPhone className="detail-icon" />
                            {usuario.telefono}
                        </p>
                    )}
                    {usuario.genero && (
                        <p className="usuario-gender">
                            {getGenderIcon(usuario.genero)}
                            {usuario.genero}
                        </p>
                    )}
                    <p className="usuario-created">
                        <FaCalendar className="detail-icon" />
                        {formatearFecha(usuario.createdAt)}
                    </p>
                </div>
            </div>
            
            <div className="usuario-actions">
                <button 
                    className="btn btn-sm btn-secondary"
                    onClick={() => onEditar(usuario)}
                    title="Editar"
                >
                    <FaEdit />
                </button>
                {usuario.rol !== 'administrador' && (
                    <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => onEliminar(usuario)}
                        title="Eliminar"
                    >
                        <FaTrash />
                    </button>
                )}
            </div>
        </div>
    );
};

// Componente para item de lista de usuario
const UsuarioListItem = ({ usuario, onEditar, onEliminar, formatearFecha, getGenderIcon, getRoleIcon }) => {
    return (
        <div className="usuario-list-item">
            <div className="usuario-avatar">
                <FaUser className="avatar-icon" />
            </div>
            
            <div className="usuario-info">
                <div className="usuario-main-info">
                    <h3 className="usuario-name">{getNombreCompleto(usuario)}</h3>
                    <div className="usuario-meta">
                        <span className="usuario-email">{usuario.email}</span>
                        <span className="usuario-rut">{usuario.rut}</span>
                        {usuario.telefono && <span className="usuario-phone">{usuario.telefono}</span>}
                    </div>
                </div>
                
                <div className="usuario-secondary-info">
                    <span className={`badge badge-${usuario.rol}`}>
                        {getRoleIcon(usuario.rol)}
                        {usuario.rol}
                    </span>
                    {usuario.genero && (
                        <span className="usuario-gender">
                            {getGenderIcon(usuario.genero)}
                            {usuario.genero}
                        </span>
                    )}
                    <span className="usuario-created">
                        <FaCalendar className="detail-icon" />
                        {formatearFecha(usuario.createdAt)}
                    </span>
                </div>
            </div>
            
            <div className="usuario-actions">
                <button 
                    className="btn btn-sm btn-secondary"
                    onClick={() => onEditar(usuario)}
                    title="Editar"
                >
                    <FaEdit />
                </button>
                {usuario.rol !== 'administrador' && (
                    <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => onEliminar(usuario)}
                        title="Eliminar"
                    >
                        <FaTrash />
                    </button>
                )}
            </div>
        </div>
    );
};

// Componente para tabla de usuarios
const UsuarioTable = ({ usuarios, onEditar, onEliminar, formatearFecha, getGenderIcon, getRoleIcon }) => {
    return (
        <table className="usuarios-table">
            <thead>
                <tr>
                    <th>Nombre Completo</th>
                    <th>Email</th>
                    <th>RUT</th>
                    <th>Teléfono</th>
                    <th>Rol</th>
                    <th>Género</th>
                    <th>Fecha Registro</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {usuarios.map(usuario => (
                    <UsuarioTableRow
                        key={usuario.id}
                        usuario={usuario}
                        onEditar={onEditar}
                        onEliminar={onEliminar}
                        formatearFecha={formatearFecha}
                        getGenderIcon={getGenderIcon}
                        getRoleIcon={getRoleIcon}
                    />
                ))}
            </tbody>
        </table>
    );
};

// Componente para fila de tabla de usuario
const UsuarioTableRow = ({ usuario, onEditar, onEliminar, formatearFecha, getGenderIcon, getRoleIcon }) => {
    return (
        <tr className="usuario-table-row">
            <td>
                <div className="usuario-name-cell">
                    <strong>{getNombreCompleto(usuario)}</strong>
                </div>
            </td>
            <td>{usuario.email}</td>
            <td>{usuario.rut}</td>
            <td>{usuario.telefono || 'No especificado'}</td>
            <td>
                <span className={`badge badge-${usuario.rol}`}>
                    {getRoleIcon(usuario.rol)}
                    {usuario.rol}
                </span>
            </td>
            <td>
                {usuario.genero ? (
                    <span className="usuario-gender">
                        {getGenderIcon(usuario.genero)}
                        {usuario.genero}
                    </span>
                ) : 'No especificado'}
            </td>
            <td>{formatearFecha(usuario.createdAt)}</td>
            <td>
                <div className="table-actions">
                    <button 
                        className="btn btn-sm btn-secondary"
                        onClick={() => onEditar(usuario)}
                        title="Editar"
                    >
                        <FaEdit />
                    </button>
                    {usuario.rol !== 'administrador' && (
                        <button 
                            className="btn btn-sm btn-danger"
                            onClick={() => onEliminar(usuario)}
                            title="Eliminar"
                        >
                            <FaTrash />
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
};

// Componente de paginación
const Pagination = ({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) => {
    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 7;
        
        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 4) {
                for (let i = 1; i <= 5; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 3) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 4; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }
        
        return pages;
    };

    return (
        <div className="pagination">
            <div className="pagination-info">
                Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} usuarios
            </div>
            
            <div className="pagination-controls">
                <button 
                    className="btn btn-pagination"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <FaArrowLeft /> Anterior
                </button>
                
                <div className="page-numbers">
                    {getPageNumbers().map((page, index) => (
                        <button
                            key={index}
                            className={`btn btn-page ${page === currentPage ? 'active' : ''} ${page === '...' ? 'disabled' : ''}`}
                            onClick={() => page !== '...' && onPageChange(page)}
                            disabled={page === '...'}
                        >
                            {page}
                        </button>
                    ))}
                </div>
                
                <button 
                    className="btn btn-pagination"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Siguiente <FaArrowRight />
                </button>
            </div>
        </div>
    );
};

export default AdminUsuarios;
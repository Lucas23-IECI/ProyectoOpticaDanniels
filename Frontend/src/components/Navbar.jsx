import { NavLink, Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '@context/AuthContext';
import { getNombreCorto } from '@helpers/nameHelpers';
import { FaChevronDown, FaCalendarCheck, FaChevronLeft, FaChevronRight, FaEye, FaStore } from 'react-icons/fa';
import BarraBusqueda from '@components/BarraBusqueda';
import AuthPopup from '@components/AuthPopup';
import DropdownUsuario from '@components/DropdownUsuario';
import CartIcon from '@components/CartIcon';
import { getMarcaLogo } from '@constants/marcas';
import '@styles/navbar.css';
import '@styles/cartIcon.css';

import LogoOficial from '/LogoOficial.png';

const categoriasNav = [
    {
        id: 'opticos',
        nombre: 'Lentes Ópticos',
        link: '/productos?categoria=opticos',
        imagen: '/images/FotosGenerales/PruebaOptometrica.png',
        descripcion: 'Lentes de alta calidad para tu visión',
        marcas: ['Ray-Ban', 'Oakley', 'Vogue', 'Transitions', 'Emporio Armani', 'Silhouette'],
        subcategorias: [
            { nombre: 'Graduados', link: '/productos?categoria=opticos&subcategoria=graduados' },
            { nombre: 'Progresivos', link: '/productos?categoria=opticos&subcategoria=progresivos' },
            { nombre: 'Bifocales', link: '/productos?categoria=opticos&subcategoria=bifocales' },
            { nombre: 'Monofocales', link: '/productos?categoria=opticos&subcategoria=monofocales' },
            { nombre: 'Lectura', link: '/productos?categoria=opticos&subcategoria=lectura' },
        ]
    },
    {
        id: 'sol',
        nombre: 'Lentes de Sol',
        link: '/productos?categoria=sol',
        imagen: '/images/FotosGenerales/MujerLentesDeSol.png',
        descripcion: 'Estilo y protección UV para cada ocasión',
        marcas: ['Ray-Ban', 'Oakley', 'Carrera', 'Arnette', 'Hawkers', 'Versace'],
        subcategorias: [
            { nombre: 'Deportivos', link: '/productos?categoria=sol&subcategoria=deportivos' },
            { nombre: 'Clásicos', link: '/productos?categoria=sol&subcategoria=clasicos' },
            { nombre: 'Aviador', link: '/productos?categoria=sol&subcategoria=aviador' },
            { nombre: 'Wayfarer', link: '/productos?categoria=sol&subcategoria=wayfarer' },
            { nombre: 'Polarizados', link: '/productos?categoria=sol&subcategoria=polarizados' },
        ]
    },
    {
        id: 'accesorios',
        nombre: 'Accesorios',
        link: '/productos?categoria=accesorios',
        imagen: '/images/FotosGenerales/GafasRayBan.png',
        descripcion: 'Complementos y cuidado para tus lentes',
        marcas: ['Silhouette', 'Essilor', 'Nikon', 'Polaroid', 'Varilux', 'Transitions'],
        subcategorias: [
            { nombre: 'Fundas', link: '/productos?categoria=accesorios&subcategoria=fundas' },
            { nombre: 'Cadenas', link: '/productos?categoria=accesorios&subcategoria=cadenas' },
            { nombre: 'Limpieza', link: '/productos?categoria=accesorios&subcategoria=limpieza' },
            { nombre: 'Reparación', link: '/productos?categoria=accesorios&subcategoria=reparacion' },
        ]
    }
];

const promociones = [
    'Hasta 50% dcto en productos seleccionados',
    'Despacho gratis en compras sobre $50.000',
    '12 cuotas sin interés',
    'GAFAS 2x $39.990 — ¡Stock Limitado!',
    '2 Pares de Lentes Completos por $69.990',
];

function Navbar() {
    const { user, isAuthenticated } = useAuth();
    const [mostrarPopup, setMostrarPopup] = useState(false);
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [megaMenuActivo, setMegaMenuActivo] = useState(null);
    const [mobileSubmenu, setMobileSubmenu] = useState(null);
    const [promoIndex, setPromoIndex] = useState(0);
    const dropdownRef = useRef(null);
    const menuRef = useRef(null);
    const megaMenuTimeout = useRef(null);
    const location = useLocation();

    // Auto-rotate promos
    useEffect(() => {
        const timer = setInterval(() => {
            setPromoIndex((prev) => (prev + 1) % promociones.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    const togglePopup = () => setMostrarPopup((v) => !v);
    const toggleMenu = () => setMenuAbierto((v) => !v);

    const cerrarMenu = useCallback(() => {
        setMenuAbierto(false);
        setMobileSubmenu(null);
    }, []);

    const abrirMegaMenu = (id) => {
        clearTimeout(megaMenuTimeout.current);
        setMegaMenuActivo(id);
    };

    const cerrarMegaMenu = () => {
        megaMenuTimeout.current = setTimeout(() => {
            setMegaMenuActivo(null);
        }, 200);
    };

    useEffect(() => {
        cerrarMenu();
        setMegaMenuActivo(null);
    }, [location.pathname, location.search, cerrarMenu]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuAbierto && menuRef.current && !menuRef.current.contains(e.target) && !e.target.closest('.hamburger-btn')) {
                cerrarMenu();
            }
        };
        if (menuAbierto) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [menuAbierto, cerrarMenu]);

    useEffect(() => {
        if (menuAbierto) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [menuAbierto]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setMostrarPopup(false);
            }
        };
        if (mostrarPopup) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [mostrarPopup]);

    const primerNombre = getNombreCorto(user);
    const isHomePage = location.pathname === '/';

    return (
        <header className={`navbar-container ${isHomePage ? 'navbar-fixed' : ''}`}>
            {/* Top info bar — promo carousel */}
            <div className="navbar-info">
                <div className="navbar-info-inner">
                    <div className="navbar-info-left">
                        <Link to="/agendar-cita" className="navbar-info-link">
                            <FaEye /> Agenda tu examen visual
                        </Link>
                    </div>
                    <div className="navbar-info-center">
                        <button 
                            className="navbar-promo-arrow" 
                            onClick={() => setPromoIndex((prev) => (prev - 1 + promociones.length) % promociones.length)}
                            aria-label="Promoción anterior"
                        >
                            <FaChevronLeft />
                        </button>
                        <div className="navbar-promo-text">
                            <span key={promoIndex} className="navbar-promo-slide">
                                {promociones[promoIndex]}
                            </span>
                        </div>
                        <button 
                            className="navbar-promo-arrow" 
                            onClick={() => setPromoIndex((prev) => (prev + 1) % promociones.length)}
                            aria-label="Siguiente promoción"
                        >
                            <FaChevronRight />
                        </button>
                    </div>
                    <div className="navbar-info-right">
                        <Link to="/contacto" className="navbar-cita-btn">
                            <FaStore /> Nuestras tiendas
                        </Link>
                        <Link to="/agendar-cita" className="navbar-cita-btn">
                            <FaCalendarCheck /> Agenda tu Cita
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main navbar */}
            <nav className="navbar">
                <div className="logo">
                    <NavLink to="/">
                        <img src={LogoOficial} alt="Óptica Danniels" />
                    </NavLink>
                </div>

                {/* Mobile actions */}
                <div className="navbar-mobile-actions">
                    <BarraBusqueda />
                    <CartIcon />
                    <div className="navbar-icons" ref={dropdownRef}>
                        <button className="icono-usuario">
                            <span className="usuario-nombre" onClick={togglePopup}>
                                {isAuthenticated ? `¡Hola, ${primerNombre}!` : <i className="fa-solid fa-user" />}
                            </span>
                        </button>
                        {mostrarPopup && (
                            isAuthenticated
                                ? <DropdownUsuario onClose={() => setMostrarPopup(false)} />
                                : <AuthPopup onClose={() => setMostrarPopup(false)} />
                        )}
                    </div>
                    <button className={`hamburger-btn ${menuAbierto ? 'active' : ''}`} onClick={toggleMenu} aria-label="Menú">
                        <span className="hamburger-line"></span>
                        <span className="hamburger-line"></span>
                        <span className="hamburger-line"></span>
                    </button>
                </div>

                {/* Desktop: Categories inline — sin mega menu aquí, se renderiza a nivel de header */}
                <ul className="categories-list">
                    {categoriasNav.map((cat) => (
                        <li
                            key={cat.id}
                            className={`category-item ${megaMenuActivo === cat.id ? 'active' : ''}`}
                            onMouseEnter={() => abrirMegaMenu(cat.id)}
                            onMouseLeave={cerrarMegaMenu}
                        >
                            <Link to={cat.link} className="category-link">
                                {cat.nombre}
                                <FaChevronDown className="category-arrow" />
                            </Link>
                        </li>
                    ))}
                    <li className="category-item">
                        <Link to="/productos" className="category-link">Todos</Link>
                    </li>
                </ul>

                {/* Desktop nav right */}
                <div className="nav-derecha">
                    <BarraBusqueda />
                    <CartIcon />
                    <div className="navbar-icons" ref={dropdownRef}>
                        <button className="icono-usuario">
                            <span className="usuario-nombre" onClick={togglePopup}>
                                {isAuthenticated ? `¡Hola, ${primerNombre}!` : <i className="fa-solid fa-user" />}
                            </span>
                        </button>
                        {mostrarPopup && (
                            isAuthenticated
                                ? <DropdownUsuario onClose={() => setMostrarPopup(false)} />
                                : <AuthPopup onClose={() => setMostrarPopup(false)} />
                        )}
                    </div>
                </div>
            </nav>

            {/* ====== MEGA MENU PANEL — full width, posicionado relativo al header ====== */}
            {megaMenuActivo && (() => {
                const cat = categoriasNav.find(c => c.id === megaMenuActivo);
                if (!cat) return null;
                return (
                    <div
                        className="mega-menu-panel"
                        onMouseEnter={() => abrirMegaMenu(cat.id)}
                        onMouseLeave={cerrarMegaMenu}
                    >
                        <div className="mega-menu-panel-inner">
                            {/* Columna izquierda: subcategorías */}
                            <div className="mega-menu-left">
                                <p className="mega-menu-section-title">Subcategorías</p>
                                <ul className="mega-menu-subcat-list">
                                    {cat.subcategorias.map((sub) => (
                                        <li key={sub.nombre}>
                                            <Link to={sub.link} className="mega-menu-subcat-link">
                                                <span className="mega-menu-subcat-dot" />
                                                {sub.nombre}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                                <Link to={cat.link} className="mega-menu-ver-todo-btn">
                                    VER TODO {cat.nombre.toUpperCase()}
                                </Link>
                            </div>

                            {/* Columna central: marcas destacadas */}
                            <div className="mega-menu-center">
                                <p className="mega-menu-section-title">Marcas Destacadas</p>
                                <ul className="mega-menu-brand-list">
                                    {cat.marcas.map((marca) => {
                                        const logo = getMarcaLogo(marca);
                                        return (
                                            <li key={marca}>
                                                <Link
                                                    to={`/productos?marca=${encodeURIComponent(marca)}`}
                                                    className="mega-menu-brand-item"
                                                    title={marca}
                                                >
                                                    {logo ? (
                                                        <img
                                                            src={logo}
                                                            alt={marca}
                                                            className="mega-menu-brand-logo"
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                                e.target.nextSibling && (e.target.nextSibling.style.display = 'block');
                                                            }}
                                                        />
                                                    ) : (
                                                        <span className="mega-menu-brand-fallback">{marca}</span>
                                                    )}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>

                            {/* Columna derecha: imagen con overlay */}
                            <div className="mega-menu-right">
                                <div className="mega-menu-image-card">
                                    <img src={cat.imagen} alt={cat.nombre} />
                                    <div className="mega-menu-image-overlay">
                                        <span className="mega-menu-image-desc">{cat.descripcion}</span>
                                        <Link to={cat.link} className="mega-menu-image-cta">
                                            Explorar →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* Overlay oscuro detrás del mega menu — renderizado fuera del header via portal */}
            {megaMenuActivo && createPortal(
                <div className="mega-menu-overlay" onClick={() => setMegaMenuActivo(null)} />,
                document.body
            )}

            {/* Mobile overlay */}
            {menuAbierto && <div className="mobile-menu-overlay" onClick={cerrarMenu} />}

            {/* Mobile slide-in menu */}
            <div className={`mobile-menu ${menuAbierto ? 'open' : ''}`} ref={menuRef}>
                <div className="mobile-menu-header">
                    <img src={LogoOficial} alt="Óptica Danniels" className="mobile-menu-logo" />
                    <button className="mobile-menu-close" onClick={cerrarMenu} aria-label="Cerrar menú">
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                {isAuthenticated && (
                    <div className="mobile-menu-user">
                        <i className="fa-solid fa-user-circle"></i>
                        <span>¡Hola, {primerNombre}!</span>
                    </div>
                )}
                <ul className="mobile-menu-links">
                    <li><NavLink to="/" onClick={cerrarMenu}><i className="fa-solid fa-house"></i> Inicio</NavLink></li>
                    
                    {/* Category dropdowns in mobile */}
                    {categoriasNav.map((cat) => (
                        <li key={cat.id} className="mobile-category-group">
                            <button 
                                className={`mobile-category-toggle ${mobileSubmenu === cat.id ? 'open' : ''}`}
                                onClick={() => setMobileSubmenu(mobileSubmenu === cat.id ? null : cat.id)}
                            >
                                <span>{cat.nombre}</span>
                                <FaChevronDown className="mobile-category-arrow" />
                            </button>
                            <ul className={`mobile-submenu ${mobileSubmenu === cat.id ? 'open' : ''}`}>
                                <li>
                                    <NavLink to={cat.link} onClick={cerrarMenu}>
                                        Ver todos los {cat.nombre.toLowerCase()}
                                    </NavLink>
                                </li>
                                {cat.subcategorias.map((sub) => (
                                    <li key={sub.nombre}>
                                        <NavLink to={sub.link} onClick={cerrarMenu}>{sub.nombre}</NavLink>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}

                    <li><NavLink to="/productos" onClick={cerrarMenu}><i className="fa-solid fa-glasses"></i> Todos los Productos</NavLink></li>
                    <li><NavLink to="/agendar-cita" onClick={cerrarMenu}><i className="fa-solid fa-calendar-check"></i> Agendar Cita</NavLink></li>
                    <li><NavLink to="/quienes-somos" onClick={cerrarMenu}><i className="fa-solid fa-users"></i> Quiénes Somos</NavLink></li>
                    <li><NavLink to="/contacto" onClick={cerrarMenu}><i className="fa-solid fa-store"></i> Contacto y Tiendas</NavLink></li>
                    <li><NavLink to="/faq" onClick={cerrarMenu}><i className="fa-solid fa-circle-question"></i> FAQ</NavLink></li>
                </ul>
                {!isAuthenticated && (
                    <div className="mobile-menu-auth">
                        <NavLink to="/login" className="mobile-auth-btn login" onClick={cerrarMenu}>Iniciar Sesión</NavLink>
                        <NavLink to="/register" className="mobile-auth-btn register" onClick={cerrarMenu}>Registrarse</NavLink>
                    </div>
                )}
                {isAuthenticated && (
                    <div className="mobile-menu-auth">
                        <NavLink to="/perfil" className="mobile-auth-btn login" onClick={cerrarMenu}><i className="fa-solid fa-gear"></i> Mi Perfil</NavLink>
                        <NavLink to="/mis-compras" className="mobile-auth-btn login" onClick={cerrarMenu}><i className="fa-solid fa-bag-shopping"></i> Mis Compras</NavLink>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Navbar;
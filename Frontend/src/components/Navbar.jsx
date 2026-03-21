import { NavLink, Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@context/AuthContext';
import { getNombreCorto } from '@helpers/nameHelpers';
import { FaChevronDown, FaCalendarCheck, FaPhone, FaWhatsapp } from 'react-icons/fa';
import BarraBusqueda from '@components/BarraBusqueda';
import AuthPopup from '@components/AuthPopup';
import DropdownUsuario from '@components/DropdownUsuario';
import CartIcon from '@components/CartIcon';
import '@styles/navbar.css';
import '@styles/cartIcon.css';

import LogoOficial from '/LogoOficial.png';

const categoriasNav = [
    {
        id: 'opticos',
        nombre: 'Lentes Ópticos',
        link: '/productos?categoria=opticos',
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
        subcategorias: [
            { nombre: 'Fundas', link: '/productos?categoria=accesorios&subcategoria=fundas' },
            { nombre: 'Cadenas', link: '/productos?categoria=accesorios&subcategoria=cadenas' },
            { nombre: 'Limpieza', link: '/productos?categoria=accesorios&subcategoria=limpieza' },
            { nombre: 'Reparación', link: '/productos?categoria=accesorios&subcategoria=reparacion' },
        ]
    }
];

function Navbar() {
    const { user, isAuthenticated } = useAuth();
    const [mostrarPopup, setMostrarPopup] = useState(false);
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [megaMenuActivo, setMegaMenuActivo] = useState(null);
    const [mobileSubmenu, setMobileSubmenu] = useState(null);
    const dropdownRef = useRef(null);
    const menuRef = useRef(null);
    const megaMenuTimeout = useRef(null);
    const location = useLocation();

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
            {/* Top info bar */}
            <div className="navbar-info">
                <div className="navbar-info-inner">
                    <div className="navbar-info-left">
                        <span><FaPhone /> +56 9 3769 2691</span>
                        <span className="navbar-info-separator">|</span>
                        <span>L-V 10:30 - 12:30 / 15:30 - 17:00</span>
                    </div>
                    <div className="navbar-info-center">
                        <a 
                            href="https://api.whatsapp.com/send?phone=56937692691&text=Hola!%20Quisiera%20información"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="navbar-info-whatsapp"
                        >
                            <FaWhatsapp /> WhatsApp
                        </a>
                    </div>
                    <div className="navbar-info-right">
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

                {/* Desktop: Categories inline */}
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
                            {megaMenuActivo === cat.id && (
                                <div 
                                    className="mega-menu"
                                    onMouseEnter={() => abrirMegaMenu(cat.id)}
                                    onMouseLeave={cerrarMegaMenu}
                                >
                                    <div className="mega-menu-content">
                                        <div className="mega-menu-column">
                                            <h4>{cat.nombre}</h4>
                                            <ul>
                                                {cat.subcategorias.map((sub) => (
                                                    <li key={sub.nombre}>
                                                        <Link to={sub.link}>{sub.nombre}</Link>
                                                    </li>
                                                ))}
                                            </ul>
                                            <Link to={cat.link} className="mega-menu-ver-todo">
                                                Ver todos →
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}
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
                    <li><NavLink to="/contacto" onClick={cerrarMenu}><i className="fa-solid fa-envelope"></i> Contacto</NavLink></li>
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
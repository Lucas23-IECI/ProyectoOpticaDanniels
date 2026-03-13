import { NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@context/AuthContext';
import { getNombreCorto } from '@helpers/nameHelpers';
import BarraBusqueda from '@components/BarraBusqueda';
import AuthPopup from '@components/AuthPopup';
import DropdownUsuario from '@components/DropdownUsuario';
import CartIcon from '@components/CartIcon';
import '@styles/navbar.css';
import '@styles/cartIcon.css';

import LogoOficial from '/LogoOficial.png';

function Navbar() {
    const { user, isAuthenticated } = useAuth();
    const [mostrarPopup, setMostrarPopup] = useState(false);
    const [menuAbierto, setMenuAbierto] = useState(false);
    const dropdownRef = useRef(null);
    const menuRef = useRef(null);
    const location = useLocation();

    const togglePopup = () => setMostrarPopup((v) => !v);
    const toggleMenu = () => setMenuAbierto((v) => !v);

    const cerrarMenu = useCallback(() => {
        setMenuAbierto(false);
    }, []);

    // Cerrar menú móvil al cambiar de ruta
    useEffect(() => {
        cerrarMenu();
    }, [location.pathname, cerrarMenu]);

    // Cerrar menú móvil al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuAbierto && menuRef.current && !menuRef.current.contains(e.target) && !e.target.closest('.hamburger-btn')) {
                cerrarMenu();
            }
        };
        if (menuAbierto) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [menuAbierto, cerrarMenu]);

    // Bloquear scroll del body cuando el menú está abierto
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
            <div className="navbar-info">
                <p className="navbar-info-desktop">Av. Manuel Rodriguez 426 - Chiguayante - Bio-Bio | Lunes a Viernes 10:30 a 12:30 horas - 15:30 a 17:00 horas</p>
                <p className="navbar-info-mobile">Chiguayante | L-V 10:30-12:30 / 15:30-17:00</p>
            </div>
            <nav className="navbar">
                <div className="logo">
                    <NavLink to="/">
                        <img src={LogoOficial} alt="Óptica Danniels" />
                    </NavLink>
                </div>

                {/* Iconos móviles a la derecha del logo */}
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

                {/* Desktop nav */}
                <div className="nav-derecha">
                    <ul>
                        <li><NavLink to="/quienes-somos">Quienes Somos</NavLink></li>
                        <li><NavLink to="/productos">Productos</NavLink></li>
                        {isAuthenticated && (
                            <li><NavLink to="/favoritos">Favoritos</NavLink></li>
                        )}
                        <li><NavLink to="/carrito">Carrito</NavLink></li>
                        <li><NavLink to="/contacto">Contacto</NavLink></li>
                    </ul>

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

                {/* Overlay para cerrar el menú */}
                {menuAbierto && <div className="mobile-menu-overlay" onClick={cerrarMenu} />}

                {/* Menú móvil lateral */}
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
                        <li><NavLink to="/quienes-somos" onClick={cerrarMenu}><i className="fa-solid fa-users"></i> Quiénes Somos</NavLink></li>
                        <li><NavLink to="/productos" onClick={cerrarMenu}><i className="fa-solid fa-glasses"></i> Productos</NavLink></li>
                        {isAuthenticated && (
                            <li><NavLink to="/favoritos" onClick={cerrarMenu}><i className="fa-solid fa-heart"></i> Favoritos</NavLink></li>
                        )}
                        <li><NavLink to="/carrito" onClick={cerrarMenu}><i className="fa-solid fa-cart-shopping"></i> Carrito</NavLink></li>
                        <li><NavLink to="/contacto" onClick={cerrarMenu}><i className="fa-solid fa-envelope"></i> Contacto</NavLink></li>
                        <li><NavLink to="/agendar-cita" onClick={cerrarMenu}><i className="fa-solid fa-calendar-check"></i> Agendar Cita</NavLink></li>
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
            </nav>
        </header>
    );
}

export default Navbar;
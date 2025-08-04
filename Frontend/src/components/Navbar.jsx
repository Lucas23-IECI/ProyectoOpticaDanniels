import { NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@hooks/useAuth';
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
    const dropdownRef = useRef(null);
    const location = useLocation();

    const togglePopup = () => setMostrarPopup((v) => !v);

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
                <p>Av. Manuel Rodriguez 426 - Chiguayante - Bio-Bio | Lunes a Viernes 10:30 a 12:30 horas - 15:30 a 17:00 horas</p>
            </div>
            <nav className="navbar">
                <div className="logo">
                    <NavLink to="/">
                        <img src={LogoOficial} alt="Óptica Danniels" />
                    </NavLink>
                </div>

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
            </nav>
        </header>
    );
}

export default Navbar;
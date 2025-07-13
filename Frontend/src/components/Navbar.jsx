import { NavLink } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@hooks/useAuth';
import BarraBusqueda from '@components/BarraBusqueda';
import AuthPopup from '@components/AuthPopup';
import DropdownUsuario from '@components/DropdownUsuario';
import '@styles/navbar.css';

import LogoOficial from '/LogoOficial.png';

function Navbar() {
    const { user, isAuthenticated } = useAuth();
    const [mostrarPopup, setMostrarPopup] = useState(false);
    const dropdownRef = useRef(null);

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

    const primerNombre = user?.nombreCompleto?.split(' ')[0] || '';

    return (
        <nav>
            <div className="logo">
                <NavLink to="/">
                    <img src={LogoOficial} alt="Óptica Danniels" />
                </NavLink>
            </div>

            <div className="nav-derecha">
                <ul>
                    <li><NavLink to="/quienes-somos">Quienes Somos</NavLink></li>
                    <li><NavLink to="/productos">Productos</NavLink></li>
                    <li><NavLink to="/favoritos">Favoritos</NavLink></li>
                    <li><NavLink to="/contacto">Contacto</NavLink></li>
                </ul>

                <BarraBusqueda />

                <div className="navbar-icons" ref={dropdownRef}>
                    <button className="icono-usuario" onClick={togglePopup}>
                        <span className="usuario-nombre">
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
    );
}

export default Navbar;

import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@context/AuthContext';
import BarraBusqueda from '@components/BarraBusqueda';
import AuthPopup from '@components/AuthPopup';
import DropdownUsuario from '@components/DropdownUsuario';
import '@styles/navbar.css';

function Navbar() {
    const { user, isAuthenticated } = useAuth();
    const [mostrarPopup, setMostrarPopup] = useState(false);

    const togglePopup = () => {
        setMostrarPopup(!mostrarPopup);
    };

    const primerNombre = user?.nombreCompleto?.split(' ')[0] || '';

    return (
        <nav>
            <div className="logo">
                <span>Óptica Danniels</span>
            </div>
            <ul>
                <li><NavLink to="/">Inicio</NavLink></li>
                <li><NavLink to="/productos">Productos</NavLink></li>
            </ul>

            <div className="navbar-icons">
                <button className="icono-usuario" onClick={togglePopup}>
                    <span className="usuario-nombre">
                        {isAuthenticated ? `¡Hola, ${primerNombre}!` : (
                            <i className="fa-solid fa-user"></i>
                        )}
                    </span>
                </button>
                {mostrarPopup && (
                    isAuthenticated ? (
                        <DropdownUsuario onClose={() => setMostrarPopup(false)} />
                    ) : (
                        <AuthPopup onClose={() => setMostrarPopup(false)} />
                    )
                )}
            </div>

            <BarraBusqueda />
        </nav>
    );
}

export default Navbar;

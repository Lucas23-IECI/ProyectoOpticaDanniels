import { NavLink } from 'react-router-dom';
import BarraBusqueda from '@components/BarraBusqueda';
import '@styles/navbar.css';

function Navbar() {
    return (
        <nav>
            <div className="logo">
                <span>Óptica Danniels</span>
            </div>
            <ul>
                <li><NavLink to="/">Inicio</NavLink></li>
                <li><NavLink to="/productos">Productos</NavLink></li>
            </ul>
            <BarraBusqueda />
        </nav>
    );
}

export default Navbar;

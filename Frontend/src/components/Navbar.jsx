import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

function Navbar() {
    const { darkMode, toggleTheme } = useContext(ThemeContext);

    return (
        <nav>
            <ul>
                <li><Link to="/">Inicio</Link></li>
                <li><Link to="/proyectos">Proyectos</Link></li>
                <li><Link to="/contacto">Contacto</Link></li>
                <li>
                    <button onClick={toggleTheme}>
                        {darkMode ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
                    </button>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;

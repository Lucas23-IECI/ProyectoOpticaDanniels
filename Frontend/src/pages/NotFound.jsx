import { Link } from "react-router-dom";
import { FaHome, FaSearch, FaGlasses } from "react-icons/fa";
import "@styles/notFound.css";

function NotFound() {
    return (
        <div className="not-found-page">
            <div className="not-found-content">
                <div className="not-found-icon">
                    <FaGlasses />
                </div>
                <h1 className="not-found-code">404</h1>
                <h2 className="not-found-title">Página no encontrada</h2>
                <p className="not-found-text">
                    Parece que necesitas unos nuevos lentes... Esta página no existe o fue movida.
                </p>
                <div className="not-found-actions">
                    <Link to="/" className="not-found-btn primary">
                        <FaHome />
                        Ir al Inicio
                    </Link>
                    <Link to="/productos" className="not-found-btn secondary">
                        <FaSearch />
                        Ver Productos
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default NotFound;

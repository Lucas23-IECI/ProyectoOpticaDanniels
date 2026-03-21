import { Link } from 'react-router-dom';
import '../../styles/home/categorias-destacadas.css';

const categorias = [
    {
        id: 'opticos',
        titulo: 'Lentes Ópticos',
        descripcion: 'Graduados, progresivos, bifocales y más',
        imagen: '/images/categorias/opticos.jpg',
        link: '/productos?categoria=opticos'
    },
    {
        id: 'sol',
        titulo: 'Lentes de Sol',
        descripcion: 'Protección UV con estilo',
        imagen: '/images/categorias/sol.jpg',
        link: '/productos?categoria=sol'
    },
    {
        id: 'accesorios',
        titulo: 'Accesorios',
        descripcion: 'Fundas, cadenas, limpieza y más',
        imagen: '/images/categorias/accesorios.jpg',
        link: '/productos?categoria=accesorios'
    }
];

const CategoriasDestacadas = () => {
    return (
        <section className="eco-categorias">
            <div className="eco-categorias-inner">
                <h2 className="eco-categorias-title">Compra por Categoría</h2>
                <div className="eco-categorias-grid">
                    {categorias.map((cat) => (
                        <Link key={cat.id} to={cat.link} className="eco-cat-card">
                            <div className="eco-cat-img-wrap">
                                <img src={cat.imagen} alt={cat.titulo} loading="lazy" />
                            </div>
                            <div className="eco-cat-info">
                                <h3>{cat.titulo}</h3>
                                <p>{cat.descripcion}</p>
                                <span className="eco-cat-link">Ver productos →</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoriasDestacadas;

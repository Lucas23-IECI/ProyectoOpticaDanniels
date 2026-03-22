import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaClock } from "react-icons/fa";
import { formatearNombreParaURL } from "@helpers/formatData";
import LazyImage from "./LazyImage";

const STORAGE_KEY = "recentlyViewed";
const MAX_ITEMS = 8;

export const addToRecentlyViewed = (producto) => {
    try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        const filtered = stored.filter((p) => p.id !== producto.id);
        const updated = [
            {
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                imagen_url: producto.imagen_url,
                marca: producto.marca,
                oferta: producto.oferta,
                descuento: producto.descuento,
            },
            ...filtered,
        ].slice(0, MAX_ITEMS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
        // localStorage unavailable
    }
};

const RecentlyViewed = ({ currentProductId }) => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        try {
            const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
            const filtered = currentProductId
                ? stored.filter((p) => p.id !== currentProductId)
                : stored;
            setItems(filtered);
        } catch {
            setItems([]);
        }
    }, [currentProductId]);

    if (items.length === 0) return null;

    return (
        <section className="recently-viewed">
            <div className="recently-viewed-header">
                <FaClock />
                <h3>Vistos recientemente</h3>
            </div>
            <div className="recently-viewed-scroll">
                {items.map((item) => {
                    const precioFinal = item.oferta
                        ? item.precio * (1 - item.descuento / 100)
                        : item.precio;
                    return (
                        <Link
                            key={item.id}
                            to={`/productos/${formatearNombreParaURL(item.nombre)}`}
                            className="recently-viewed-card"
                        >
                            <div className="rv-image">
                                <LazyImage
                                    src={item.imagen_url}
                                    alt={item.nombre}
                                    className="rv-img"
                                />
                            </div>
                            <div className="rv-info">
                                {item.marca && <span className="rv-brand">{item.marca}</span>}
                                <span className="rv-name">{item.nombre}</span>
                                <span className="rv-price">
                                    ${precioFinal.toLocaleString("es-CL", { minimumFractionDigits: 0 })}
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
};

export default RecentlyViewed;

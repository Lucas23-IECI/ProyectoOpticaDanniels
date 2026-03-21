import { useState, useEffect, useRef, useCallback } from "react";
import useProductoImagenes from "@hooks/productos/useProductoImagenes";
import { FaPlus, FaTrash, FaStar, FaSpinner, FaGripVertical } from "react-icons/fa";
import "@styles/imageGalleryEditor.css";

const MAX_IMAGES = 5;
const VALID_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;

const ImageGalleryEditor = ({ productoId }) => {
    const { imagenes, loading, cargar, agregar, eliminar, reordenar, setPrincipal } =
        useProductoImagenes(productoId);
    const [alert, setAlert] = useState(null);
    const [dragIdx, setDragIdx] = useState(null);
    const fileRef = useRef(null);

    useEffect(() => {
        if (productoId) cargar();
    }, [productoId, cargar]);

    const showAlert = (msg) => {
        setAlert(msg);
        setTimeout(() => setAlert(null), 2500);
    };

    const getImgSrc = (url) => {
        if (!url) return "/LogoOficial.png";
        if (url.startsWith("http") || url.startsWith("/")) return url;
        const base = import.meta.env.VITE_BASE_URL || "http://localhost:3000/api";
        const origin = new URL(base).origin;
        return `${origin}/uploads/productos/${url}`;
    };

    const handleAddClick = () => {
        if (imagenes.length >= MAX_IMAGES) {
            showAlert(`Máximo ${MAX_IMAGES} imágenes por producto`);
            return;
        }
        fileRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        const available = MAX_IMAGES - imagenes.length;
        if (files.length > available) {
            showAlert(`Solo puedes agregar ${available} imagen(es) más`);
            e.target.value = "";
            return;
        }

        for (const f of files) {
            if (!VALID_TYPES.includes(f.type)) {
                showAlert("Solo JPG, PNG o WebP");
                e.target.value = "";
                return;
            }
            if (f.size > MAX_SIZE) {
                showAlert("Cada imagen máx. 5 MB");
                e.target.value = "";
                return;
            }
        }

        try {
            await agregar(files);
        } catch {
            showAlert("Error al subir imágenes");
        }
        e.target.value = "";
    };

    const handleDelete = async (id) => {
        try {
            await eliminar(id);
        } catch {
            showAlert("Error al eliminar");
        }
    };

    const handleSetPrincipal = async (id) => {
        try {
            await setPrincipal(id);
        } catch {
            showAlert("Error al establecer principal");
        }
    };

    // ── Drag & Drop ──
    const handleDragStart = useCallback((idx) => {
        setDragIdx(idx);
    }, []);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
    }, []);

    const handleDrop = useCallback(
        async (targetIdx) => {
            if (dragIdx === null || dragIdx === targetIdx) {
                setDragIdx(null);
                return;
            }
            const newOrder = [...imagenes];
            const [moved] = newOrder.splice(dragIdx, 1);
            newOrder.splice(targetIdx, 0, moved);
            setDragIdx(null);

            try {
                await reordenar(newOrder.map((img) => img.id));
            } catch {
                showAlert("Error al reordenar");
            }
        },
        [dragIdx, imagenes, reordenar]
    );

    if (!productoId) return null;

    return (
        <div className="image-gallery-editor">
            <h3>🖼️ Galería de Imágenes ({imagenes.length}/{MAX_IMAGES})</h3>

            {alert && <div className="gallery-alert">{alert}</div>}

            {loading && (
                <div className="gallery-loading">
                    <FaSpinner className="spinner" /> Procesando...
                </div>
            )}

            <div className="gallery-grid">
                {imagenes.map((img, idx) => (
                    <div
                        key={img.id}
                        className={`gallery-item ${img.es_principal ? "is-principal" : ""} ${dragIdx === idx ? "dragging" : ""}`}
                        draggable
                        onDragStart={() => handleDragStart(idx)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(idx)}
                    >
                        <div className="gallery-grip">
                            <FaGripVertical />
                        </div>
                        <img src={getImgSrc(img.imagen_url)} alt={`Imagen ${idx + 1}`} />
                        <div className="gallery-item-actions">
                            <button
                                type="button"
                                className={`btn-principal ${img.es_principal ? "active" : ""}`}
                                onClick={() => handleSetPrincipal(img.id)}
                                title={img.es_principal ? "Imagen principal" : "Establecer como principal"}
                                disabled={loading}
                            >
                                <FaStar />
                            </button>
                            <button
                                type="button"
                                className="btn-delete-img"
                                onClick={() => handleDelete(img.id)}
                                title="Eliminar imagen"
                                disabled={loading}
                            >
                                <FaTrash />
                            </button>
                        </div>
                        {img.es_principal && <span className="principal-badge">Principal</span>}
                    </div>
                ))}

                {imagenes.length < MAX_IMAGES && (
                    <button
                        type="button"
                        className="gallery-add-btn"
                        onClick={handleAddClick}
                        disabled={loading}
                    >
                        <FaPlus />
                        <span>Agregar</span>
                    </button>
                )}
            </div>

            <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple
                onChange={handleFileChange}
                style={{ display: "none" }}
            />

            <p className="gallery-hint">
                Arrastra para reordenar · ★ para imagen principal · Máx. {MAX_IMAGES} imágenes
            </p>
        </div>
    );
};

export default ImageGalleryEditor;

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMisOrdenes } from "@services/orden.service";
import "@styles/misCompras.css";

const ESTADO_CONFIG = {
  pendiente: {
    label: "Pendiente de pago",
    color: "#f59e0b",
    icon: "⏳",
    step: 0,
  },
  pagada: {
    label: "Pagada",
    color: "#3b82f6",
    icon: "💳",
    step: 1,
  },
  en_preparacion: {
    label: "En preparación",
    color: "#8b5cf6",
    icon: "📦",
    step: 2,
  },
  enviada: {
    label: "Enviada",
    color: "#2147A2",
    icon: "🚚",
    step: 3,
  },
  entregada: {
    label: "Entregada",
    color: "#22c55e",
    icon: "✅",
    step: 4,
  },
  cancelada: {
    label: "Cancelada",
    color: "#ef4444",
    icon: "❌",
    step: -1,
  },
};

const TIMELINE_STEPS = [
  { key: "pendiente", label: "Pendiente" },
  { key: "pagada", label: "Pagada" },
  { key: "en_preparacion", label: "Preparando" },
  { key: "enviada", label: "Enviada" },
  { key: "entregada", label: "Entregada" },
];

const formatPrecio = (val) =>
  `$${Number(val || 0).toLocaleString("es-CL")}`;

const formatFecha = (fecha) =>
  new Date(fecha).toLocaleDateString("es-CL", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export default function MisCompras() {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [filtro, setFiltro] = useState("todas");

  useEffect(() => {
    const fetchOrdenes = async () => {
      try {
        const res = await getMisOrdenes();
        setOrdenes(res?.ordenes || []);
      } catch (err) {
        setError(err.response?.data?.message || "Error al cargar tus compras.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrdenes();
  }, []);

  const ordenesFiltradas = filtro === "todas"
    ? ordenes
    : ordenes.filter((o) => o.estado === filtro);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const descargarBoleta = async (ordenId) => {
    try {
      const response = await fetch(`/api/ordenes/${ordenId}/boleta`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Error al descargar");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `boleta-orden-${ordenId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("No se pudo descargar la boleta. Intenta nuevamente.");
    }
  };

  if (loading) {
    return (
      <div className="mis-compras-page">
        <div className="mis-compras-loading">
          <div className="spinner" />
          <p>Cargando tus compras...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mis-compras-page">
        <div className="mis-compras-error">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="mis-compras-page">
      <div className="mis-compras-header">
        <h1>Mis Compras</h1>
        <p className="mis-compras-subtitle">
          {ordenes.length} {ordenes.length === 1 ? "orden" : "órdenes"} en total
        </p>
      </div>

      {ordenes.length === 0 ? (
        <div className="mis-compras-empty">
          <span className="empty-icon">🛍️</span>
          <h2>Aún no tienes compras</h2>
          <p>Explora nuestro catálogo y encuentra lo que necesitas.</p>
          <Link to="/productos" className="btn-explorar">
            Ver productos
          </Link>
        </div>
      ) : (
        <>
          <div className="mis-compras-filtros">
            {["todas", "pendiente", "pagada", "en_preparacion",
              "enviada", "entregada", "cancelada",
            ].map((f) => (
              <button
                key={f}
                className={`filtro-btn ${filtro === f ? "active" : ""}`}
                onClick={() => setFiltro(f)}
              >
                {f === "todas" ? "Todas" : ESTADO_CONFIG[f]?.label || f}
              </button>
            ))}
          </div>

          <div className="ordenes-list">
            {ordenesFiltradas.length === 0 ? (
              <p className="no-resultados">
                No hay órdenes con este filtro.
              </p>
            ) : (
              ordenesFiltradas.map((orden) => {
                const config = ESTADO_CONFIG[orden.estado] || ESTADO_CONFIG.pendiente;
                const isExpanded = expandedId === orden.id;

                return (
                  <div
                    key={orden.id}
                    className={`orden-card ${isExpanded ? "expanded" : ""}`}
                  >
                    {/* Cabecera */}
                    <div
                      className="orden-card-header"
                      onClick={() => toggleExpand(orden.id)}
                    >
                      <div className="orden-card-left">
                        <span className="orden-id">
                          Orden #{orden.id}
                        </span>
                        <span className="orden-fecha">
                          {formatFecha(orden.createdAt)}
                        </span>
                      </div>

                      <div className="orden-card-center">
                        <span
                          className="estado-badge"
                          style={{
                            background: `${config.color}15`,
                            color: config.color,
                            borderColor: `${config.color}40`,
                          }}
                        >
                          {config.icon} {config.label}
                        </span>
                      </div>

                      <div className="orden-card-right">
                        <span className="orden-total">
                          {formatPrecio(orden.total)}
                        </span>
                        <span
                          className={`expand-arrow ${isExpanded ? "open" : ""}`}
                        >
                          ▾
                        </span>
                      </div>
                    </div>

                    {/* Timeline (siempre visible) */}
                    {orden.estado !== "cancelada" && (
                      <div className="orden-timeline">
                        {TIMELINE_STEPS.map((step, idx) => {
                          const currentStep = config.step;
                          const isCompleted = idx <= currentStep;
                          const isCurrent = idx === currentStep;
                          return (
                            <div
                              key={step.key}
                              className={`timeline-step ${isCompleted ? "completed" : ""} ${isCurrent ? "current" : ""}`}
                            >
                              <div className="timeline-dot" />
                              {idx < TIMELINE_STEPS.length - 1 && (
                                <div className={`timeline-line ${idx < currentStep ? "filled" : ""}`} />
                              )}
                              <span className="timeline-label">
                                {step.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Detalle expandible */}
                    {isExpanded && (
                      <div className="orden-detail">
                        {/* Productos */}
                        <div className="detail-section">
                          <h3>Productos</h3>
                          <div className="detail-productos">
                            {orden.productos?.map((op) => (
                              <div key={op.id} className="detail-producto-row">
                                <div className="detail-producto-info">
                                  {op.producto?.imagen_url && (
                                    <img
                                      src={op.producto.imagen_url}
                                      alt={op.producto?.nombre}
                                      className="detail-producto-img"
                                    />
                                  )}
                                  <div>
                                    <span className="detail-producto-nombre">
                                      {op.producto?.nombre || "Producto"}
                                    </span>
                                    {op.descuento > 0 && (
                                      <span className="detail-descuento">
                                        -{op.descuento}%
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="detail-producto-nums">
                                  <span>{op.cantidad}x {formatPrecio(op.precio)}</span>
                                  <span className="detail-subtotal">
                                    {formatPrecio(op.subtotal || op.cantidad * op.precio)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Resumen financiero */}
                        <div className="detail-section">
                          <h3>Resumen</h3>
                          <div className="detail-resumen">
                            <div className="resumen-row">
                              <span>Subtotal</span>
                              <span>{formatPrecio(orden.subtotal)}</span>
                            </div>
                            <div className="resumen-row">
                              <span>IVA (19%)</span>
                              <span>{formatPrecio(orden.iva)}</span>
                            </div>
                            <div className="resumen-row">
                              <span>Envío</span>
                              <span>
                                {Number(orden.costoEnvio) > 0
                                  ? formatPrecio(orden.costoEnvio)
                                  : "Gratis"}
                              </span>
                            </div>
                            <div className="resumen-row total">
                              <span>Total</span>
                              <span>{formatPrecio(orden.total)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Info entrega */}
                        <div className="detail-section">
                          <h3>Entrega</h3>
                          <p className="detail-entrega">
                            {orden.metodoEntrega === "retiro"
                              ? "📍 Retiro en tienda — Av. Manuel Rodríguez 426, Chiguayante"
                              : `🚚 Envío a: ${orden.direccion}`}
                          </p>
                        </div>

                        {/* Acciones */}
                        <div className="detail-actions">
                          {(orden.estadoPago === "pagada"
                            || orden.estado === "entregada") && (
                            <button
                              className="btn-boleta"
                              onClick={() => descargarBoleta(orden.id)}
                            >
                              📄 Descargar boleta
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
}

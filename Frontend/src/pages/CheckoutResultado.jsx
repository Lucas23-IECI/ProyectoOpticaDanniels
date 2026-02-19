import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getEstadoPago } from "@services/pago.service";
import "@styles/checkoutResultado.css";

const STATUS_CONFIG = {
  aprobado: {
    icon: "✅",
    title: "¡Pago exitoso!",
    desc: "Tu pago ha sido procesado correctamente.",
    color: "#22c55e",
  },
  rechazado: {
    icon: "❌",
    title: "Pago rechazado",
    desc: "Tu pago no pudo ser procesado. Puedes intentar nuevamente.",
    color: "#ef4444",
  },
  cancelado: {
    icon: "🚫",
    title: "Pago cancelado",
    desc: "Cancelaste el proceso de pago. Tu orden sigue pendiente.",
    color: "#f59e0b",
  },
  error: {
    icon: "⚠️",
    title: "Error en el pago",
    desc: "Ocurrió un problema. Contacta a soporte si persiste.",
    color: "#ef4444",
  },
  pendiente: {
    icon: "⏳",
    title: "Pago pendiente",
    desc: "Estamos verificando tu pago. Te notificaremos por email.",
    color: "#3b82f6",
  },
};

export default function CheckoutResultado() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status") || "pendiente";
  const ordenId = searchParams.get("ordenId");
  const [pagoInfo, setPagoInfo] = useState(null);
  const [loading, setLoading] = useState(!!ordenId);

  useEffect(() => {
    if (ordenId) {
      getEstadoPago(ordenId)
        .then((data) => setPagoInfo(data))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [ordenId]);

  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pendiente;

  return (
    <div className="checkout-resultado-page">
      <div className="resultado-card">
        <div
          className="resultado-icon"
          style={{ color: config.color }}
        >
          {config.icon}
        </div>

        <h1 className="resultado-title">{config.title}</h1>
        <p className="resultado-desc">{config.desc}</p>

        {ordenId && (
          <div className="resultado-orden-id">
            Orden <strong>#{ordenId}</strong>
          </div>
        )}

        {loading && (
          <div className="resultado-loading">
            <div className="spinner" />
            <span>Verificando pago...</span>
          </div>
        )}

        {pagoInfo && !loading && (
          <div className="resultado-info">
            <div className="info-row">
              <span>Estado</span>
              <span className="info-value">{pagoInfo.estadoPago}</span>
            </div>
            {pagoInfo.metodoPago && (
              <div className="info-row">
                <span>Método</span>
                <span className="info-value">
                  {pagoInfo.metodoPago === "webpay"
                    ? "WebPay Plus"
                    : "MercadoPago"}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="resultado-actions">
          <Link to="/mis-compras" className="btn-primary">
            Ver mis compras
          </Link>
          <Link to="/productos" className="btn-secondary">
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  );
}

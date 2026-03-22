import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getDisponibilidad, crearCita, getMisCitas, cancelarCita } from "@services/cita.service";
import "@styles/agendarCita.css";
import {
  FaCalendarAlt,
  FaClipboardList,
  FaClock,
  FaCheckCircle,
  FaArrowLeft,
  FaArrowRight,
  FaPhone,
  FaStickyNote,
  FaTimesCircle,
  FaEye,
  FaSpinner,
  FaChevronLeft,
  FaChevronRight,
  FaGlasses,
  FaWrench,
  FaSearchPlus,
  FaStethoscope,
  FaCommentDots,
} from "react-icons/fa";

const SERVICIOS = [
  { id: "examen_visual", nombre: "Examen Visual", desc: "Evaluación completa de tu visión", Icono: FaEye, duracion: "30 min" },
  { id: "asesoria_lentes", nombre: "Asesoría de Lentes", desc: "Encuentra los lentes perfectos para ti", Icono: FaGlasses, duracion: "30 min" },
  { id: "reparacion_marcos", nombre: "Reparación de Marcos", desc: "Reparamos tus marcos favoritos", Icono: FaWrench, duracion: "30 min" },
  { id: "adaptacion_contacto", nombre: "Adaptación de Contacto", desc: "Prueba y ajuste de lentes de contacto", Icono: FaSearchPlus, duracion: "30 min" },
  { id: "control_oftalmologico", nombre: "Control Oftalmológico", desc: "Revisión oftalmológica profesional", Icono: FaStethoscope, duracion: "30 min" },
  { id: "consulta_general", nombre: "Consulta General", desc: "Consulta sobre cualquier tema visual", Icono: FaCommentDots, duracion: "30 min" },
];

const ESTADOS_LABEL = {
  pendiente: { label: "Pendiente", clase: "estado-pendiente" },
  confirmada: { label: "Confirmada", clase: "estado-confirmada" },
  completada: { label: "Completada", clase: "estado-completada" },
  cancelada: { label: "Cancelada", clase: "estado-cancelada" },
  no_asistio: { label: "No asistió", clase: "estado-no-asistio" },
};

function getServicioNombre(id) {
  return SERVICIOS.find((s) => s.id === id)?.nombre || id;
}

export default function AgendarCita() {
  const navigate = useNavigate();
  const [paso, setPaso] = useState(1);
  const [servicio, setServicio] = useState(null);
  const [mesActual, setMesActual] = useState(new Date());
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [horaSeleccionada, setHoraSeleccionada] = useState(null);
  const [slotsDisponibles, setSlotsDisponibles] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [telefono, setTelefono] = useState("");
  const [notas, setNotas] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);
  const [error, setError] = useState("");

  // Mis citas
  const [verMisCitas, setVerMisCitas] = useState(false);
  const [misCitas, setMisCitas] = useState([]);
  const [loadingCitas, setLoadingCitas] = useState(false);

  const cargarMisCitas = useCallback(async () => {
    setLoadingCitas(true);
    const citas = await getMisCitas();
    setMisCitas(citas);
    setLoadingCitas(false);
  }, []);

  useEffect(() => {
    if (verMisCitas) cargarMisCitas();
  }, [verMisCitas, cargarMisCitas]);

  // Cargar disponibilidad al seleccionar fecha
  useEffect(() => {
    if (!fechaSeleccionada) return;
    const cargarDisponibilidad = async () => {
      setLoadingSlots(true);
      setHoraSeleccionada(null);
      const dispo = await getDisponibilidad(fechaSeleccionada);
      setSlotsDisponibles(dispo.slots || []);
      setLoadingSlots(false);
    };
    cargarDisponibilidad();
  }, [fechaSeleccionada]);

  const handleSubmit = async () => {
    setError("");
    setEnviando(true);
    try {
      await crearCita({
        tipoServicio: servicio,
        fecha: fechaSeleccionada,
        hora: horaSeleccionada,
        telefono,
        notas: notas || undefined,
      });
      setExito(true);
    } catch (err) {
      const msg = err?.response?.data?.message || "Error al agendar la cita.";
      setError(msg);
    } finally {
      setEnviando(false);
    }
  };

  const handleCancelarCita = async (citaId) => {
    if (!window.confirm("¿Estás seguro de cancelar esta cita?")) return;
    try {
      await cancelarCita(citaId);
      cargarMisCitas();
    } catch (err) {
      alert(err?.response?.data?.message || "Error al cancelar.");
    }
  };

  // Calendario
  const generarDiasMes = () => {
    const anio = mesActual.getFullYear();
    const mes = mesActual.getMonth();
    const primerDia = new Date(anio, mes, 1);
    const ultimoDia = new Date(anio, mes + 1, 0);
    const diasOffset = (primerDia.getDay() + 6) % 7; // Lunes = 0

    const dias = [];
    for (let i = 0; i < diasOffset; i++) dias.push(null);
    for (let d = 1; d <= ultimoDia.getDate(); d++) dias.push(d);
    return dias;
  };

  const esDiaValido = (dia) => {
    if (!dia) return false;
    const fecha = new Date(mesActual.getFullYear(), mesActual.getMonth(), dia);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const dow = fecha.getDay();
    return fecha >= hoy && dow !== 0 && dow !== 6;
  };

  const esHoy = (dia) => {
    if (!dia) return false;
    const hoy = new Date();
    return mesActual.getFullYear() === hoy.getFullYear()
      && mesActual.getMonth() === hoy.getMonth()
      && dia === hoy.getDate();
  };

  const formatFecha = (dia) => {
    const m = String(mesActual.getMonth() + 1).padStart(2, "0");
    const d = String(dia).padStart(2, "0");
    return `${mesActual.getFullYear()}-${m}-${d}`;
  };

  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  const puedeAvanzar = () => {
    if (paso === 1) return !!servicio;
    if (paso === 2) return !!fechaSeleccionada && !!horaSeleccionada;
    if (paso === 3) return telefono.trim().length >= 7;
    return false;
  };

  // Slots AM/PM
  const slotsAM = slotsDisponibles.filter((s) => parseInt(s.split(":")[0]) < 12);
  const slotsPM = slotsDisponibles.filter((s) => parseInt(s.split(":")[0]) >= 12);

  // Pantalla de éxito
  if (exito) {
    return (
      <div className="ac-page">
        <div className="ac-exito">
          <FaCheckCircle className="ac-exito-icono" />
          <h2>¡Cita agendada con éxito!</h2>
          <p>Te hemos reservado tu cita. Recibirás una confirmación pronto.</p>
          <div className="ac-exito-detalle">
            <p><strong>Servicio:</strong> {getServicioNombre(servicio)}</p>
            <p><strong>Fecha:</strong> {fechaSeleccionada}</p>
            <p><strong>Hora:</strong> {horaSeleccionada}</p>
          </div>
          <div className="ac-exito-acciones">
            <button className="ac-btn-primary" onClick={() => { setExito(false); setPaso(1); setServicio(null); setFechaSeleccionada(null); setHoraSeleccionada(null); setTelefono(""); setNotas(""); }}>
              Agendar otra cita
            </button>
            <button className="ac-btn-secondary" onClick={() => setVerMisCitas(true)}>
              Ver mis citas
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Vista de mis citas
  if (verMisCitas) {
    return (
      <div className="ac-page">
        <div className="ac-page-header">
          <div>
            <button className="ac-back-btn" onClick={() => setVerMisCitas(false)}>
              <FaArrowLeft /> Volver a agendar
            </button>
            <h1>Mis Citas</h1>
          </div>
        </div>
        {loadingCitas ? (
          <div className="ac-loading"><FaSpinner className="ac-spinner" /> Cargando tus citas...</div>
        ) : misCitas.length === 0 ? (
          <div className="ac-empty">
            <FaCalendarAlt className="ac-empty-icono" />
            <p>No tienes citas agendadas.</p>
            <button className="ac-btn-primary" onClick={() => setVerMisCitas(false)}>Agendar una cita</button>
          </div>
        ) : (
          <div className="ac-citas-lista">
            {misCitas.map((cita) => {
              const estadoInfo = ESTADOS_LABEL[cita.estado] || { label: cita.estado, clase: "" };
              return (
                <div key={cita.id} className="ac-cita-card">
                  <div className="ac-cita-header">
                    <span className={`ac-estado ${estadoInfo.clase}`}>{estadoInfo.label}</span>
                    <span className="ac-cita-id">#{cita.id}</span>
                  </div>
                  <div className="ac-cita-body">
                    <p><FaClipboardList /> {getServicioNombre(cita.tipoServicio)}</p>
                    <p><FaCalendarAlt /> {cita.fecha}</p>
                    <p><FaClock /> {String(cita.hora).substring(0, 5)}</p>
                    <p><FaPhone /> {cita.telefono}</p>
                    {cita.notas && <p><FaStickyNote /> {cita.notas}</p>}
                    {cita.notasAdmin && <p className="ac-nota-admin"><FaEye /> Admin: {cita.notasAdmin}</p>}
                  </div>
                  {["pendiente", "confirmada"].includes(cita.estado) && (
                    <button className="ac-btn-cancel" onClick={() => handleCancelarCita(cita.id)}>
                      <FaTimesCircle /> Cancelar cita
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="ac-page">
      <div className="ac-page-header">
        <h1><FaCalendarAlt /> Agendar Cita</h1>
        <button className="ac-btn-secondary" onClick={() => setVerMisCitas(true)}>
          <FaEye /> Mis Citas
        </button>
      </div>

      <div className="ac-layout">
        <main className="ac-main">
          {/* Stepper */}
          <div className="ac-stepper">
            {[
              { num: 1, label: "Servicio" },
              { num: 2, label: "Fecha y hora" },
              { num: 3, label: "Confirmación" },
            ].map((s) => (
              <div key={s.num} className={`ac-step ${paso === s.num ? "active" : ""} ${paso > s.num ? "completed" : ""}`}>
                <div className="ac-step-circle">{paso > s.num ? "✓" : s.num}</div>
                <span className="ac-step-label">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Mobile summary */}
          <div className="ac-mobile-summary">
            {servicio && (
              <div className="ac-mobile-summary-item">
                <FaClipboardList /> <strong>{getServicioNombre(servicio)}</strong>
              </div>
            )}
            {fechaSeleccionada && (
              <div className="ac-mobile-summary-item">
                <FaCalendarAlt /> <strong>{fechaSeleccionada}</strong>
              </div>
            )}
            {horaSeleccionada && (
              <div className="ac-mobile-summary-item">
                <FaClock /> <strong>{horaSeleccionada}</strong>
              </div>
            )}
          </div>

          {error && <div className="ac-error">{error}</div>}

          {/* Paso 1: Seleccionar servicio */}
          {paso === 1 && (
            <div className="ac-paso">
              <h2>¿Qué servicio necesitas?</h2>
              <p className="ac-paso-subtitle">Selecciona el tipo de atención que deseas</p>
              <div className="ac-servicios-grid">
                {SERVICIOS.map((s) => (
                  <button
                    key={s.id}
                    className={`ac-servicio-card ${servicio === s.id ? "selected" : ""}`}
                    onClick={() => setServicio(s.id)}
                  >
                    <div className="ac-servicio-icon-wrap">
                      <s.Icono />
                    </div>
                    <div className="ac-servicio-info">
                      <h3>{s.nombre}</h3>
                      <p>{s.desc}</p>
                      <span className="ac-servicio-duracion"><FaClock /> {s.duracion}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Paso 2: Fecha y hora */}
          {paso === 2 && (
            <div className="ac-paso">
              <h2>Elige fecha y hora</h2>
              <p className="ac-paso-subtitle">Selecciona cuándo deseas agendar tu cita</p>
              <div className="ac-fecha-hora-grid">
                <div className="ac-calendario">
                  <div className="ac-cal-header">
                    <button onClick={() => setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() - 1, 1))}>
                      <FaChevronLeft />
                    </button>
                    <span>{meses[mesActual.getMonth()]} {mesActual.getFullYear()}</span>
                    <button onClick={() => setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 1))}>
                      <FaChevronRight />
                    </button>
                  </div>
                  <div className="ac-cal-dias-header">
                    {["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"].map((d) => <span key={d}>{d}</span>)}
                  </div>
                  <div className="ac-cal-dias">
                    {generarDiasMes().map((dia, i) => (
                      <button
                        key={i}
                        className={`ac-cal-dia ${!dia ? "empty" : ""} ${!esDiaValido(dia) ? "disabled" : ""} ${fechaSeleccionada === formatFecha(dia) ? "selected" : ""} ${esHoy(dia) ? "hoy" : ""}`}
                        disabled={!esDiaValido(dia)}
                        onClick={() => dia && esDiaValido(dia) && setFechaSeleccionada(formatFecha(dia))}
                      >
                        {dia || ""}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="ac-slots">
                  <h3>Horarios disponibles</h3>
                  {!fechaSeleccionada ? (
                    <p className="ac-slots-hint">Selecciona una fecha para ver los horarios.</p>
                  ) : loadingSlots ? (
                    <div className="ac-loading"><FaSpinner className="ac-spinner" /> Cargando horarios...</div>
                  ) : slotsDisponibles.length === 0 ? (
                    <p className="ac-slots-empty">No hay horarios disponibles para esta fecha.</p>
                  ) : (
                    <div className="ac-slots-container">
                      {slotsAM.length > 0 && (
                        <>
                          <div className="ac-slots-section-label">Mañana</div>
                          <div className="ac-slots-grid">
                            {slotsAM.map((slot) => (
                              <button
                                key={slot}
                                className={`ac-slot ${horaSeleccionada === slot ? "selected" : ""}`}
                                onClick={() => setHoraSeleccionada(slot)}
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                      {slotsPM.length > 0 && (
                        <>
                          <div className="ac-slots-section-label">Tarde</div>
                          <div className="ac-slots-grid">
                            {slotsPM.map((slot) => (
                              <button
                                key={slot}
                                className={`ac-slot ${horaSeleccionada === slot ? "selected" : ""}`}
                                onClick={() => setHoraSeleccionada(slot)}
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Paso 3: Confirmación */}
          {paso === 3 && (
            <div className="ac-paso">
              <h2>Confirma tu cita</h2>
              <p className="ac-paso-subtitle">Revisa los detalles y completa tu información</p>
              <div className="ac-confirmacion-content">
                <div className="ac-confirm-summary">
                  <div className="ac-confirm-summary-item">
                    <FaClipboardList />
                    <span><strong>{getServicioNombre(servicio)}</strong></span>
                  </div>
                  <div className="ac-confirm-summary-item">
                    <FaCalendarAlt />
                    <span>{fechaSeleccionada}</span>
                  </div>
                  <div className="ac-confirm-summary-item">
                    <FaClock />
                    <span>{horaSeleccionada}</span>
                  </div>
                </div>
                <div className="ac-form-final">
                  <div className="ac-field">
                    <label><FaPhone /> Teléfono de contacto *</label>
                    <input
                      type="tel"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      placeholder="+56 9 1234 5678"
                      maxLength={20}
                    />
                  </div>
                  <div className="ac-field">
                    <label><FaStickyNote /> Notas adicionales (opcional)</label>
                    <textarea
                      value={notas}
                      onChange={(e) => setNotas(e.target.value)}
                      placeholder="¿Algo que debamos saber?"
                      maxLength={500}
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navegación */}
          <div className="ac-nav">
            {paso > 1 && (
              <button className="ac-btn-secondary" onClick={() => setPaso(paso - 1)}>
                <FaArrowLeft /> Anterior
              </button>
            )}
            <div className="ac-nav-spacer" />
            {paso < 3 ? (
              <button className="ac-btn-primary" disabled={!puedeAvanzar()} onClick={() => setPaso(paso + 1)}>
                Siguiente <FaArrowRight />
              </button>
            ) : (
              <button className="ac-btn-primary ac-btn-confirmar" disabled={!puedeAvanzar() || enviando} onClick={handleSubmit}>
                {enviando ? <><FaSpinner className="ac-spinner" /> Agendando...</> : <><FaCheckCircle /> Confirmar cita</>}
              </button>
            )}
          </div>
        </main>

        <aside className="ac-sidebar">
          <div className="ac-sidebar-card">
            <div className="ac-sidebar-title"><FaClipboardList /> Resumen de tu cita</div>
            <div className="ac-sidebar-items">
              <div className={`ac-sidebar-item ${servicio ? "filled" : ""}`}>
                <FaClipboardList />
                <div>
                  <span className="ac-sidebar-label">Servicio</span>
                  <span className={`ac-sidebar-value ${!servicio ? "empty" : ""}`}>
                    {servicio ? getServicioNombre(servicio) : "Sin seleccionar"}
                  </span>
                </div>
              </div>
              <div className={`ac-sidebar-item ${fechaSeleccionada ? "filled" : ""}`}>
                <FaCalendarAlt />
                <div>
                  <span className="ac-sidebar-label">Fecha</span>
                  <span className={`ac-sidebar-value ${!fechaSeleccionada ? "empty" : ""}`}>
                    {fechaSeleccionada || "Sin seleccionar"}
                  </span>
                </div>
              </div>
              <div className={`ac-sidebar-item ${horaSeleccionada ? "filled" : ""}`}>
                <FaClock />
                <div>
                  <span className="ac-sidebar-label">Hora</span>
                  <span className={`ac-sidebar-value ${!horaSeleccionada ? "empty" : ""}`}>
                    {horaSeleccionada || "Sin seleccionar"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

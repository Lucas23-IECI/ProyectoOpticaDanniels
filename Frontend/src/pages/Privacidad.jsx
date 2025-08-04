import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '@styles/legal.css';

const Privacidad = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const currentDate = new Date().toLocaleDateString('es-CL');

    return (
        <div className="legal-container">
            <div className="legal-header">
                <div className="container">
                    <h1>Política de Privacidad</h1>
                    <p className="legal-subtitle">
                        En Óptica Danniels valoramos y respetamos tu privacidad. 
                        Esta política explica cómo recopilamos, usamos y protegemos tu información personal.
                    </p>
                    <p className="legal-date">Última actualización: {currentDate}</p>
                </div>
            </div>

            <div className="legal-content">
                <div className="container">
                    <div className="legal-nav">
                        <h3>Índice</h3>
                        <ul>
                            <li><a href="#informacion-recopilada">1. Información que Recopilamos</a></li>
                            <li><a href="#uso-informacion">2. Uso de la Información</a></li>
                            <li><a href="#compartir-informacion">3. Compartir Información</a></li>
                            <li><a href="#proteccion-datos">4. Protección de Datos</a></li>
                            <li><a href="#cookies">5. Cookies y Tecnologías Similares</a></li>
                            <li><a href="#derechos-usuario">6. Tus Derechos</a></li>
                            <li><a href="#servicios-terceros">7. Servicios de Terceros</a></li>
                            <li><a href="#menores-edad">8. Menores de Edad</a></li>
                            <li><a href="#cambios-politica">9. Cambios a esta Política</a></li>
                            <li><a href="#contacto">10. Contacto</a></li>
                        </ul>
                    </div>

                    <div className="legal-sections">
                        <section id="informacion-recopilada" className="legal-section">
                            <h2>1. Información que Recopilamos</h2>
                            
                            <h3>1.1 Información Personal Directa</h3>
                            <p>Recopilamos información que nos proporcionas directamente cuando:</p>
                            <ul>
                                <li><strong>Te registras en nuestra plataforma:</strong> nombre completo, correo electrónico, teléfono, fecha de nacimiento</li>
                                <li><strong>Realizas una compra:</strong> dirección de entrega, información de facturación, preferencias de productos ópticos</li>
                                <li><strong>Agendas una consulta oftalmológica:</strong> datos de contacto, motivo de consulta, historial médico visual básico</li>
                                <li><strong>Contactas nuestro servicio al cliente:</strong> consultas, comentarios, reclamaciones</li>
                                <li><strong>Te suscribes a nuestro boletín:</strong> correo electrónico y preferencias de comunicación</li>
                            </ul>

                            <h3>1.2 Información de Uso y Navegación</h3>
                            <ul>
                                <li>Dirección IP y ubicación geográfica aproximada</li>
                                <li>Tipo de dispositivo, navegador y sistema operativo</li>
                                <li>Páginas visitadas, tiempo de permanencia, patrones de navegación</li>
                                <li>Productos visualizados, búsquedas realizadas, items en lista de deseos</li>
                                <li>Historial de compras y preferencias</li>
                            </ul>

                            <h3>1.3 Información de Salud Visual</h3>
                            <p>Para brindar servicios oftalmológicos adecuados, podemos recopilar:</p>
                            <ul>
                                <li>Graduación de lentes y prescripciones médicas</li>
                                <li>Historial de problemas visuales</li>
                                <li>Medicamentos relacionados con la salud ocular</li>
                                <li>Resultados de exámenes oftalmológicos realizados en nuestras instalaciones</li>
                            </ul>
                        </section>

                        <section id="uso-informacion" className="legal-section">
                            <h2>2. Uso de la Información</h2>
                            
                            <h3>2.1 Prestación de Servicios</h3>
                            <ul>
                                <li>Procesar y gestionar tus pedidos de productos ópticos</li>
                                <li>Coordinar consultas oftalmológicas y seguimientos médicos</li>
                                <li>Emitir boletas electrónicas válidas según normativa del SII</li>
                                <li>Gestionar devoluciones, cambios y garantías</li>
                                <li>Proporcionar atención al cliente personalizada</li>
                            </ul>

                            <h3>2.2 Mejora de Servicios</h3>
                            <ul>
                                <li>Personalizar recomendaciones de productos según tu historial</li>
                                <li>Optimizar la funcionalidad de nuestra plataforma web</li>
                                <li>Realizar análisis estadísticos para mejorar nuestros servicios</li>
                                <li>Desarrollar nuevos productos y servicios ópticos</li>
                            </ul>

                            <h3>2.3 Comunicaciones</h3>
                            <ul>
                                <li>Enviar confirmaciones de pedidos y actualizaciones de estado</li>
                                <li>Recordatorios de citas oftalmológicas</li>
                                <li>Promociones y ofertas especiales (con tu consentimiento)</li>
                                <li>Información sobre nuevos productos y servicios</li>
                                <li>Encuestas de satisfacción y feedback</li>
                            </ul>

                            <h3>2.4 Cumplimiento Legal</h3>
                            <ul>
                                <li>Cumplir con obligaciones fiscales y contables</li>
                                <li>Responder a requerimientos de autoridades competentes</li>
                                <li>Proteger derechos, propiedad y seguridad de usuarios y terceros</li>
                                <li>Prevenir fraudes y actividades ilegales</li>
                            </ul>
                        </section>

                        <section id="compartir-informacion" className="legal-section">
                            <h2>3. Compartir Información</h2>
                            
                            <h3>3.1 No Vendemos tu Información</h3>
                            <p>Óptica Danniels <strong>NO vende, renta o comercializa</strong> tu información personal a terceros para fines comerciales.</p>

                            <h3>3.2 Compartimos Información en los Siguientes Casos:</h3>
                            <ul>
                                <li><strong>Proveedores de servicios autorizados:</strong> empresas de logística para entregas, pasarelas de pago, servicios de hosting</li>
                                <li><strong>Profesionales de la salud:</strong> oftalmólogos y optometristas para prestación de servicios médicos</li>
                                <li><strong>Autoridades competentes:</strong> cuando sea requerido por ley o orden judicial</li>
                                <li><strong>Servicios de emergencia:</strong> en caso de situaciones que pongan en riesgo la salud o seguridad</li>
                            </ul>

                            <h3>3.3 Transferencias Empresariales</h3>
                            <p>En caso de fusión, adquisición o venta de activos, tu información podría transferirse como parte de la transacción, siempre bajo las mismas protecciones de privacidad.</p>
                        </section>

                        <section id="proteccion-datos" className="legal-section">
                            <h2>4. Protección de Datos</h2>
                            
                            <h3>4.1 Medidas de Seguridad</h3>
                            <ul>
                                <li><strong>Cifrado de datos:</strong> utilizamos cifrado SSL/TLS para proteger la transmisión de información</li>
                                <li><strong>Acceso restringido:</strong> solo personal autorizado tiene acceso a datos personales</li>
                                <li><strong>Servidores seguros:</strong> almacenamiento en servidores con protocolos de seguridad avanzados</li>
                                <li><strong>Copias de seguridad:</strong> respaldos regulares para prevenir pérdida de información</li>
                                <li><strong>Monitoreo continuo:</strong> supervisión constante para detectar accesos no autorizados</li>
                            </ul>

                            <h3>4.2 Retención de Datos</h3>
                            <ul>
                                <li>Datos de cuenta: mientras mantengas tu cuenta activa</li>
                                <li>Historial de compras: 7 años para cumplimiento fiscal (SII)</li>
                                <li>Datos médicos: según normativas de salud vigentes</li>
                                <li>Comunicaciones: 3 años para resolver posibles disputas</li>
                            </ul>

                            <h3>4.3 Eliminación Segura</h3>
                            <p>Cuando eliminamos datos, utilizamos métodos seguros que hacen imposible su recuperación.</p>
                        </section>

                        <section id="cookies" className="legal-section">
                            <h2>5. Cookies y Tecnologías Similares</h2>
                            
                            <h3>5.1 Tipos de Cookies que Utilizamos</h3>
                            <ul>
                                <li><strong>Cookies esenciales:</strong> necesarias para el funcionamiento básico del sitio</li>
                                <li><strong>Cookies de rendimiento:</strong> nos ayudan a entender cómo interactúas con nuestro sitio</li>
                                <li><strong>Cookies funcionales:</strong> permiten recordar tus preferencias y configuraciones</li>
                                <li><strong>Cookies de marketing:</strong> para mostrar contenido y ofertas relevantes (con tu consentimiento)</li>
                            </ul>

                            <h3>5.2 Gestión de Cookies</h3>
                            <p>Puedes gestionar tus preferencias de cookies en cualquier momento a través de la configuración de tu navegador o nuestro centro de preferencias.</p>
                        </section>

                        <section id="derechos-usuario" className="legal-section">
                            <h2>6. Tus Derechos</h2>
                            
                            <p>Según la Ley N° 19.628 sobre Protección de Datos de Carácter Personal de Chile, tienes los siguientes derechos:</p>
                            
                            <h3>6.1 Derecho de Acceso</h3>
                            <p>Puedes solicitar información sobre qué datos personales tenemos sobre ti y cómo los utilizamos.</p>

                            <h3>6.2 Derecho de Rectificación</h3>
                            <p>Puedes solicitar la corrección de datos inexactos o incompletos.</p>

                            <h3>6.3 Derecho de Eliminación</h3>
                            <p>Puedes solicitar la eliminación de tus datos cuando ya no sean necesarios para los fines para los que fueron recopilados.</p>

                            <h3>6.4 Derecho de Portabilidad</h3>
                            <p>Puedes solicitar una copia de tus datos en un formato estructurado y legible.</p>

                            <h3>6.5 Derecho de Oposición</h3>
                            <p>Puedes oponerte al procesamiento de tus datos para ciertos fines, como marketing directo.</p>

                            <h3>6.6 Cómo Ejercer tus Derechos</h3>
                            <p>Para ejercer cualquiera de estos derechos, contáctanos a través de:</p>
                            <ul>
                                <li>Email: privacidad@opticadanniels.com</li>
                                <li>Teléfono: +56 X XXXX XXXX</li>
                                <li>Dirección: Av. Manuel Rodríguez 426, Local 2, Chiguayante</li>
                            </ul>
                        </section>

                        <section id="servicios-terceros" className="legal-section">
                            <h2>7. Servicios de Terceros</h2>
                            
                            <h3>7.1 Pasarelas de Pago</h3>
                            <p>Utilizamos servicios de pago seguros como WebPay y MercadoPago. Estos servicios tienen sus propias políticas de privacidad y están certificados según estándares internacionales de seguridad.</p>

                            <h3>7.2 Servicios de Entrega</h3>
                            <p>Compartimos información necesaria con empresas de logística para efectuar entregas, limitándose a datos de contacto y dirección.</p>

                            <h3>7.3 Análisis Web</h3>
                            <p>Podemos utilizar herramientas de análisis para mejorar nuestros servicios. Estos datos se procesan de forma agregada y anónima.</p>

                            <h3>7.4 Redes Sociales</h3>
                            <p>Si eliges conectar tus cuentas de redes sociales, se aplicarán las políticas de privacidad de esas plataformas.</p>
                        </section>

                        <section id="menores-edad" className="legal-section">
                            <h2>8. Menores de Edad</h2>
                            
                            <p>Nuestros servicios están dirigidos a mayores de 18 años. Para menores de edad:</p>
                            <ul>
                                <li>Requerimos autorización expresa del padre, madre o tutor legal</li>
                                <li>Los datos se procesarán bajo supervisión parental</li>
                                <li>Se aplicarán protecciones adicionales según la Ley N° 21.128 (Aula Segura)</li>
                                <li>Para servicios oftalmológicos, se seguirán protocolos específicos de atención pediátrica</li>
                            </ul>
                        </section>

                        <section id="cambios-politica" className="legal-section">
                            <h2>9. Cambios a esta Política</h2>
                            
                            <p>Podemos actualizar esta política ocasionalmente. Los cambios importantes se notificarán de las siguientes maneras:</p>
                            <ul>
                                <li>Aviso prominente en nuestro sitio web</li>
                                <li>Notificación por correo electrónico a usuarios registrados</li>
                                <li>Mensaje al iniciar sesión en tu cuenta</li>
                            </ul>
                            <p>Te recomendamos revisar periódicamente esta política para mantenerte informado sobre cómo protegemos tu información.</p>
                        </section>

                        <section id="contacto" className="legal-section">
                            <h2>10. Contacto</h2>
                            
                            <p>Si tienes preguntas, inquietudes o solicitudes relacionadas con esta Política de Privacidad, no dudes en contactarnos:</p>
                            
                            <div className="contact-info-legal">
                                <div className="contact-method">
                                    <h4>Óptica Danniels</h4>
                                    <p>Responsable de Protección de Datos</p>
                                    <p>Av. Manuel Rodríguez 426, Local 2<br />
                                    Galería Paseo Madero, Chiguayante<br />
                                    Región del Bío Bío, Chile</p>
                                </div>
                                
                                <div className="contact-method">
                                    <h4>Contacto Digital</h4>
                                    <p>Email: privacidad@opticadanniels.com<br />
                                    Teléfono: +56 X XXXX XXXX<br />
                                    WhatsApp: +56 X XXXX XXXX</p>
                                </div>
                                
                                <div className="contact-method">
                                    <h4>Horarios de Atención</h4>
                                    <p>Lunes a Viernes: 9:00 - 19:00<br />
                                    Sábados: 9:00 - 14:00<br />
                                    Domingos: Cerrado</p>
                                </div>
                            </div>

                            <div className="legal-footer-note">
                                <p><strong>Compromiso con la Privacidad:</strong> En Óptica Danniels nos comprometemos a proteger tu privacidad y manejar tus datos con la máxima transparencia y seguridad. Tu confianza es fundamental para nosotros.</p>
                            </div>
                        </section>

                        <div className="legal-navigation">
                            <Link to="/terminos" className="btn btn-secondary">Ver Términos y Condiciones</Link>
                            <Link to="/" className="btn btn-primary">Volver al Inicio</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Privacidad;
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '@styles/legal.css';

const Terminos = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const currentDate = new Date().toLocaleDateString('es-CL');

    return (
        <div className="legal-container">
            <div className="legal-header">
                <div className="container">
                    <h1>Términos y Condiciones</h1>
                    <p className="legal-subtitle">
                        Estos términos y condiciones regulan el uso de nuestros servicios y la compra de productos ópticos a través de nuestra plataforma digital.
                    </p>
                    <p className="legal-date">Última actualización: {currentDate}</p>
                </div>
            </div>

            <div className="legal-content">
                <div className="container">
                    <div className="legal-nav">
                        <h3>Índice</h3>
                        <ul>
                            <li><a href="#aceptacion">1. Aceptación de Términos</a></li>
                            <li><a href="#definiciones">2. Definiciones</a></li>
                            <li><a href="#uso-plataforma">3. Uso de la Plataforma</a></li>
                            <li><a href="#registro-cuentas">4. Registro y Cuentas de Usuario</a></li>
                            <li><a href="#productos-servicios">5. Productos y Servicios</a></li>
                            <li><a href="#precios-pagos">6. Precios y Pagos</a></li>
                            <li><a href="#envios-entregas">7. Envíos y Entregas</a></li>
                            <li><a href="#devoluciones">8. Devoluciones y Cambios</a></li>
                            <li><a href="#servicios-oftalmologicos">9. Servicios Oftalmológicos</a></li>
                            <li><a href="#propiedad-intelectual">10. Propiedad Intelectual</a></li>
                            <li><a href="#limitacion-responsabilidad">11. Limitación de Responsabilidad</a></li>
                            <li><a href="#terminacion">12. Terminación del Servicio</a></li>
                            <li><a href="#ley-aplicable">13. Ley Aplicable y Jurisdicción</a></li>
                            <li><a href="#modificaciones">14. Modificaciones</a></li>
                            <li><a href="#contacto">15. Contacto</a></li>
                        </ul>
                    </div>

                    <div className="legal-sections">
                        <section id="aceptacion" className="legal-section">
                            <h2>1. Aceptación de Términos</h2>
                            
                            <p>Al acceder y utilizar el sitio web de Óptica Danniels, realizar compras en línea, agendar citas oftalmológicas o utilizar cualquiera de nuestros servicios digitales, usted acepta estar legalmente vinculado por estos Términos y Condiciones.</p>
                            
                            <p><strong>Si no está de acuerdo con alguno de estos términos, no debe utilizar nuestros servicios.</strong></p>
                            
                            <div className="important-notice">
                                <h4>⚠️ Importante</h4>
                                <p>Estos términos constituyen un acuerdo legal vinculante entre usted y Óptica Danniels. Le recomendamos leer cuidadosamente todo el documento antes de utilizar nuestros servicios.</p>
                            </div>
                        </section>

                        <section id="definiciones" className="legal-section">
                            <h2>2. Definiciones</h2>
                            
                            <ul>
                                <li><strong>"Óptica Danniels", "nosotros", "nos", "nuestro":</strong> se refiere a la empresa Óptica Danniels, con domicilio en Av. Manuel Rodríguez 426, Local 2, Chiguayante, Chile.</li>
                                <li><strong>"Usuario", "usted", "su":</strong> cualquier persona que accede o utiliza nuestros servicios.</li>
                                <li><strong>"Cliente":</strong> usuario que ha registrado una cuenta y/o realizado una compra.</li>
                                <li><strong>"Plataforma":</strong> nuestro sitio web, aplicaciones móviles y sistemas digitales.</li>
                                <li><strong>"Productos ópticos":</strong> lentes, monturas, gafas de sol, accesorios y cualquier artículo disponible en nuestro catálogo.</li>
                                <li><strong>"Servicios oftalmológicos":</strong> consultas, exámenes y atenciones médicas relacionadas con la salud visual.</li>
                                <li><strong>"Cuenta":</strong> perfil de usuario registrado en nuestra plataforma.</li>
                            </ul>
                        </section>

                        <section id="uso-plataforma" className="legal-section">
                            <h2>3. Uso de la Plataforma</h2>
                            
                            <h3>3.1 Uso Permitido</h3>
                            <p>Usted puede utilizar nuestra plataforma para:</p>
                            <ul>
                                <li>Navegar y explorar nuestro catálogo de productos ópticos</li>
                                <li>Realizar compras de productos disponibles</li>
                                <li>Agendar citas para consultas oftalmológicas</li>
                                <li>Acceder a información sobre nuestros servicios</li>
                                <li>Contactarnos para consultas o soporte</li>
                                <li>Gestionar su cuenta y preferencias</li>
                            </ul>

                            <h3>3.2 Uso Prohibido</h3>
                            <p>Está estrictamente prohibido:</p>
                            <ul>
                                <li>Utilizar la plataforma para fines ilegales o no autorizados</li>
                                <li>Intentar acceder a sistemas o datos sin autorización</li>
                                <li>Interferir con el funcionamiento normal de la plataforma</li>
                                <li>Transmitir virus, malware o código malicioso</li>
                                <li>Crear cuentas falsas o proporcionar información fraudulenta</li>
                                <li>Copiar, reproducir o distribuir contenido sin autorización</li>
                                <li>Realizar ingeniería inversa de nuestros sistemas</li>
                                <li>Usar robots, scrapers o herramientas automatizadas no autorizadas</li>
                            </ul>

                            <h3>3.3 Disponibilidad del Servicio</h3>
                            <p>Nos esforzamos por mantener nuestra plataforma disponible 24/7, pero no garantizamos disponibilidad ininterrumpida. Podemos realizar mantenimientos programados con previo aviso.</p>
                        </section>

                        <section id="registro-cuentas" className="legal-section">
                            <h2>4. Registro y Cuentas de Usuario</h2>
                            
                            <h3>4.1 Requisitos para Registro</h3>
                            <ul>
                                <li>Ser mayor de 18 años o contar con autorización parental</li>
                                <li>Proporcionar información veraz, completa y actualizada</li>
                                <li>Mantener la confidencialidad de credenciales de acceso</li>
                                <li>Aceptar estos términos y nuestra política de privacidad</li>
                            </ul>

                            <h3>4.2 Responsabilidades del Usuario</h3>
                            <ul>
                                <li>Mantener actualizada la información de su cuenta</li>
                                <li>Notificar inmediatamente cualquier uso no autorizado</li>
                                <li>Usar una contraseña segura y única</li>
                                <li>No compartir credenciales de acceso con terceros</li>
                            </ul>

                            <h3>4.3 Suspensión y Terminación de Cuentas</h3>
                            <p>Nos reservamos el derecho de suspender o terminar cuentas en caso de:</p>
                            <ul>
                                <li>Violación de estos términos</li>
                                <li>Actividad fraudulenta o sospechosa</li>
                                <li>Información falsa o inexacta</li>
                                <li>Uso abusivo de nuestros servicios</li>
                            </ul>
                        </section>

                        <section id="productos-servicios" className="legal-section">
                            <h2>5. Productos y Servicios</h2>
                            
                            <h3>5.1 Catálogo de Productos</h3>
                            <ul>
                                <li><strong>Lentes ópticos:</strong> monofocales, bifocales, multifocales, con y sin receta médica</li>
                                <li><strong>Monturas:</strong> variedad de marcas, estilos y materiales</li>
                                <li><strong>Gafas de sol:</strong> con y sin graduación, diferentes categorías de protección UV</li>
                                <li><strong>Accesorios:</strong> estuches, cadenas, productos de limpieza y mantenimiento</li>
                                <li><strong>Servicios de reparación:</strong> ajustes, cambios de cristales, soldaduras</li>
                            </ul>

                            <h3>5.2 Disponibilidad de Productos</h3>
                            <ul>
                                <li>Los productos están sujetos a disponibilidad de stock</li>
                                <li>Nos reservamos el derecho de modificar o descontinuar productos</li>
                                <li>En caso de no disponibilidad, ofreceremos alternativas similares</li>
                                <li>El stock se actualiza en tiempo real, pero puede haber demoras</li>
                            </ul>

                            <h3>5.3 Productos con Receta Médica</h3>
                            <ul>
                                <li>Requerimos prescripción médica vigente (máximo 2 años de antigüedad)</li>
                                <li>La prescripción debe ser emitida por profesional autorizado</li>
                                <li>Validamos la graduación antes de procesar el pedido</li>
                                <li>Podemos solicitar clarificaciones sobre la prescripción</li>
                            </ul>

                            <h3>5.4 Garantía de Productos</h3>
                            <ul>
                                <li><strong>Lentes:</strong> 12 meses por defectos de fabricación</li>
                                <li><strong>Monturas:</strong> 6 meses por defectos de material</li>
                                <li><strong>Reparaciones:</strong> 90 días por el servicio realizado</li>
                                <li>La garantía no cubre daños por mal uso o accidentes</li>
                            </ul>
                        </section>

                        <section id="precios-pagos" className="legal-section">
                            <h2>6. Precios y Pagos</h2>
                            
                            <h3>6.1 Precios</h3>
                            <ul>
                                <li>Todos los precios se expresan en pesos chilenos (CLP)</li>
                                <li>Los precios incluyen IVA y otros impuestos aplicables</li>
                                <li>Nos reservamos el derecho de modificar precios sin previo aviso</li>
                                <li>El precio final se confirmará al momento de la compra</li>
                            </ul>

                            <h3>6.2 Métodos de Pago</h3>
                            <ul>
                                <li><strong>Tarjetas de crédito:</strong> Visa, Mastercard, American Express</li>
                                <li><strong>Tarjetas de débito:</strong> Redcompra</li>
                                <li><strong>Transferencia bancaria:</strong> para montos superiores a $100.000</li>
                                <li><strong>WebPay:</strong> plataforma segura de Transbank</li>
                                <li><strong>Efectivo:</strong> solo en tienda física</li>
                            </ul>

                            <h3>6.3 Facturación</h3>
                            <ul>
                                <li>Emitimos boletas electrónicas según normativa del SII</li>
                                <li>Las facturas se envían automáticamente por correo electrónico</li>
                                <li>Para factura exenta o con descuentos especiales, consultar en tienda</li>
                                <li>Mantenemos registros según requerimientos legales</li>
                            </ul>

                            <h3>6.4 Políticas de Pago</h3>
                            <ul>
                                <li>El pago debe procesarse exitosamente antes del despacho</li>
                                <li>En caso de falla en el pago, la orden se cancelará automáticamente</li>
                                <li>Los reembolsos se procesan en 5-10 días hábiles</li>
                                <li>Verificamos transacciones para prevenir fraudes</li>
                            </ul>
                        </section>

                        <section id="envios-entregas" className="legal-section">
                            <h2>7. Envíos y Entregas</h2>
                            
                            <h3>7.1 Cobertura de Entrega</h3>
                            <ul>
                                <li><strong>Región del Bío Bío:</strong> entrega gratuita en compras sobre $50.000</li>
                                <li><strong>Santiago y otras regiones:</strong> costo adicional según zona</li>
                                <li><strong>Retiro en tienda:</strong> disponible sin costo en nuestro local</li>
                            </ul>

                            <h3>7.2 Tiempos de Entrega</h3>
                            <ul>
                                <li><strong>Productos en stock:</strong> 2-5 días hábiles</li>
                                <li><strong>Lentes con graduación:</strong> 7-10 días hábiles</li>
                                <li><strong>Productos especiales:</strong> 15-20 días hábiles</li>
                                <li><strong>Zonas remotas:</strong> tiempos adicionales pueden aplicar</li>
                            </ul>

                            <h3>7.3 Proceso de Entrega</h3>
                            <ul>
                                <li>Envío de confirmación con código de seguimiento</li>
                                <li>Notificación previa a la entrega</li>
                                <li>Requiere presencia del destinatario o persona autorizada</li>
                                <li>Inspección del producto al momento de recibir</li>
                            </ul>

                            <h3>7.4 Productos Frágiles</h3>
                            <ul>
                                <li>Embalaje especial para lentes y monturas</li>
                                <li>Seguro de transporte incluido</li>
                                <li>Revisión inmediata recomendada al recibir</li>
                                <li>Reporte de daños dentro de 24 horas</li>
                            </ul>
                        </section>

                        <section id="devoluciones" className="legal-section">
                            <h2>8. Devoluciones y Cambios</h2>
                            
                            <h3>8.1 Política General</h3>
                            <ul>
                                <li><strong>Plazo:</strong> 30 días desde la fecha de entrega</li>
                                <li><strong>Condición:</strong> productos sin uso, en embalaje original</li>
                                <li><strong>Proceso:</strong> solicitud a través de nuestra plataforma o tienda</li>
                                <li><strong>Reembolso:</strong> mismo método de pago original</li>
                            </ul>

                            <h3>8.2 Productos No Elegibles para Devolución</h3>
                            <ul>
                                <li>Lentes con graduación personalizada</li>
                                <li>Productos usados o dañados por el cliente</li>
                                <li>Accesorios de higiene personal (fundas de contacto)</li>
                                <li>Productos en oferta especial (según condiciones específicas)</li>
                            </ul>

                            <h3>8.3 Garantía de Graduación</h3>
                            <ul>
                                <li>Si los lentes no corresponden a la receta, cambio gratuito</li>
                                <li>Período de adaptación de 15 días para lentes multifocales</li>
                                <li>Verificación con profesional oftalmólogo si es necesario</li>
                                <li>Cobertura de diferencias en nuevos lentes si aplicable</li>
                            </ul>

                            <h3>8.4 Proceso de Devolución</h3>
                            <ol>
                                <li>Solicitud a través de cuenta de usuario o contacto directo</li>
                                <li>Evaluación de elegibilidad por nuestro equipo</li>
                                <li>Envío de etiqueta de devolución prepagada (si aplicable)</li>
                                <li>Inspección del producto recibido</li>
                                <li>Procesamiento de reembolso o cambio</li>
                            </ol>
                        </section>

                        <section id="servicios-oftalmologicos" className="legal-section">
                            <h2>9. Servicios Oftalmológicos</h2>
                            
                            <h3>9.1 Profesionales Autorizados</h3>
                            <ul>
                                <li>Todos nuestros profesionales están debidamente registrados</li>
                                <li>Cuentan con especialización en oftalmología y optometría</li>
                                <li>Mantienen actualizadas sus certificaciones profesionales</li>
                                <li>Siguen protocolos éticos y médicos establecidos</li>
                            </ul>

                            <h3>9.2 Servicios Disponibles</h3>
                            <ul>
                                <li><strong>Examen de agudeza visual:</strong> evaluación básica de la visión</li>
                                <li><strong>Refracción:</strong> determinación de graduación necesaria</li>
                                <li><strong>Evaluación de salud ocular:</strong> detección de problemas visuales</li>
                                <li><strong>Consultas de seguimiento:</strong> control posterior a tratamientos</li>
                                <li><strong>Asesoría en productos:</strong> recomendaciones personalizadas</li>
                            </ul>

                            <h3>9.3 Agendamiento de Citas</h3>
                            <ul>
                                <li>Disponible a través de nuestra plataforma web</li>
                                <li>Confirmación automática por correo electrónico</li>
                                <li>Posibilidad de reagendar hasta 24 horas antes</li>
                                <li>Recordatorios automáticos 24 horas previas</li>
                            </ul>

                            <h3>9.4 Política de Cancelaciones</h3>
                            <ul>
                                <li><strong>Gratuita:</strong> con más de 24 horas de anticipación</li>
                                <li><strong>Tarifa de cancelación:</strong> con menos de 24 horas (50% del valor)</li>
                                <li><strong>No-show:</strong> cobro del 100% del valor de la consulta</li>
                                <li><strong>Emergencias médicas:</strong> exención de cargos con justificación</li>
                            </ul>

                            <h3>9.5 Confidencialidad Médica</h3>
                            <ul>
                                <li>Cumplimiento estricto del secreto profesional</li>
                                <li>Registros médicos protegidos según ley de datos personales</li>
                                <li>Acceso limitado solo a profesionales autorizados</li>
                                <li>Consentimiento explícito para compartir información</li>
                            </ul>

                            <h3>9.6 Limitaciones y Exclusiones</h3>
                            <ul>
                                <li>No realizamos cirugías oftalmológicas</li>
                                <li>Casos complejos se derivan a especialistas</li>
                                <li>No sustituimos tratamientos médicos especializados</li>
                                <li>Recomendamos consultas médicas regulares adicionales</li>
                            </ul>
                        </section>

                        <section id="propiedad-intelectual" className="legal-section">
                            <h2>10. Propiedad Intelectual</h2>
                            
                            <h3>10.1 Derechos de Óptica Danniels</h3>
                            <ul>
                                <li>Marca "Óptica Danniels" y logotipos asociados</li>
                                <li>Diseño y contenido de la plataforma web</li>
                                <li>Textos, imágenes y materiales publicitarios</li>
                                <li>Software y aplicaciones desarrolladas</li>
                                <li>Bases de datos y contenido generado</li>
                            </ul>

                            <h3>10.2 Uso Autorizado</h3>
                            <p>Los usuarios pueden:</p>
                            <ul>
                                <li>Ver y navegar el contenido para uso personal</li>
                                <li>Imprimir páginas para referencia personal</li>
                                <li>Compartir enlaces a nuestras páginas</li>
                            </ul>

                            <h3>10.3 Uso No Autorizado</h3>
                            <p>Está prohibido:</p>
                            <ul>
                                <li>Copiar, reproducir o distribuir contenido sin autorización</li>
                                <li>Usar nuestras marcas o logotipos sin permiso</li>
                                <li>Crear obras derivadas de nuestro contenido</li>
                                <li>Usar contenido para fines comerciales no autorizados</li>
                            </ul>

                            <h3>10.4 Contenido de Terceros</h3>
                            <ul>
                                <li>Respetamos los derechos de propiedad intelectual de terceros</li>
                                <li>Imágenes de productos sujetas a derechos de fabricantes</li>
                                <li>Proceso para reportar infracciones de derechos de autor</li>
                            </ul>
                        </section>

                        <section id="limitacion-responsabilidad" className="legal-section">
                            <h2>11. Limitación de Responsabilidad</h2>
                            
                            <h3>11.1 Exclusiones Generales</h3>
                            <p>Óptica Danniels no será responsable por:</p>
                            <ul>
                                <li>Daños indirectos, incidentales o consecuenciales</li>
                                <li>Pérdida de datos, beneficios o oportunidades comerciales</li>
                                <li>Interrupciones del servicio por causas externas</li>
                                <li>Acciones de terceros (transportistas, bancos, etc.)</li>
                                <li>Fuerza mayor (desastres naturales, pandemias, etc.)</li>
                            </ul>

                            <h3>11.2 Limitación de Monto</h3>
                            <p>Nuestra responsabilidad máxima estará limitada al valor de la transacción específica que dio origen al reclamo.</p>

                            <h3>11.3 Servicios Médicos</h3>
                            <ul>
                                <li>Los diagnósticos son orientativos, no reemplazan consulta médica especializada</li>
                                <li>Recomendamos evaluaciones regulares con oftalmólogos</li>
                                <li>No nos responsabilizamos por decisiones médicas basadas únicamente en nuestras evaluaciones</li>
                            </ul>

                            <h3>11.4 Productos de Terceros</h3>
                            <ul>
                                <li>Los fabricantes son responsables de defectos de sus productos</li>
                                <li>Actuamos como intermediarios en garantías de fabricantes</li>
                                <li>Las especificaciones pueden variar según lote de fabricación</li>
                            </ul>
                        </section>

                        <section id="terminacion" className="legal-section">
                            <h2>12. Terminación del Servicio</h2>
                            
                            <h3>12.1 Terminación por el Usuario</h3>
                            <ul>
                                <li>Puede cancelar su cuenta en cualquier momento</li>
                                <li>Pedidos en proceso se completarán según términos originales</li>
                                <li>Datos se mantendrán según política de privacidad</li>
                                <li>Puntos de fidelidad se perderán al cancelar la cuenta</li>
                            </ul>

                            <h3>12.2 Terminación por Óptica Danniels</h3>
                            <p>Podemos terminar el servicio en caso de:</p>
                            <ul>
                                <li>Violación de estos términos</li>
                                <li>Actividad fraudulenta o abusiva</li>
                                <li>Falta de pago por servicios prestados</li>
                                <li>Decisión comercial de discontinuar servicios</li>
                            </ul>

                            <h3>12.3 Efectos de la Terminación</h3>
                            <ul>
                                <li>Pérdida de acceso a cuenta y servicios digitales</li>
                                <li>Obligaciones financieras pendientes permanecen vigentes</li>
                                <li>Garantías de productos adquiridos se mantienen</li>
                                <li>Datos personales se procesan según política de privacidad</li>
                            </ul>
                        </section>

                        <section id="ley-aplicable" className="legal-section">
                            <h2>13. Ley Aplicable y Jurisdicción</h2>
                            
                            <h3>13.1 Ley Aplicable</h3>
                            <p>Estos términos se rigen por las leyes de la República de Chile, incluyendo pero no limitado a:</p>
                            <ul>
                                <li>Ley N° 19.496 sobre Protección de los Derechos de los Consumidores</li>
                                <li>Ley N° 19.628 sobre Protección de Datos de Carácter Personal</li>
                                <li>Código Civil y Código de Comercio</li>
                                <li>Normativas del Servicio de Impuestos Internos (SII)</li>
                                <li>Regulaciones sanitarias aplicables</li>
                            </ul>

                            <h3>13.2 Jurisdicción</h3>
                            <ul>
                                <li>Tribunales competentes de Chiguayante, Región del Bío Bío</li>
                                <li>Para consumidores: opción de tribunal de su domicilio</li>
                                <li>Mediación preferida antes de procesos judiciales</li>
                                <li>SERNAC como instancia de resolución de conflictos</li>
                            </ul>

                            <h3>13.3 Resolución de Disputas</h3>
                            <ol>
                                <li><strong>Contacto directo:</strong> intento de resolución amistosa</li>
                                <li><strong>Mediación:</strong> a través de SERNAC u organismo neutral</li>
                                <li><strong>Arbitraje:</strong> si ambas partes están de acuerdo</li>
                                <li><strong>Proceso judicial:</strong> como última instancia</li>
                            </ol>
                        </section>

                        <section id="modificaciones" className="legal-section">
                            <h2>14. Modificaciones</h2>
                            
                            <h3>14.1 Derecho a Modificar</h3>
                            <p>Nos reservamos el derecho de modificar estos términos en cualquier momento por razones que incluyen:</p>
                            <ul>
                                <li>Cambios en la legislación aplicable</li>
                                <li>Nuevos servicios o productos</li>
                                <li>Mejoras en seguridad o funcionalidad</li>
                                <li>Adaptación a prácticas de la industria</li>
                            </ul>

                            <h3>14.2 Notificación de Cambios</h3>
                            <ul>
                                <li><strong>Cambios menores:</strong> publicación en el sitio web</li>
                                <li><strong>Cambios significativos:</strong> notificación por correo electrónico con 30 días de anticipación</li>
                                <li><strong>Cambios urgentes:</strong> notificación inmediata con explicación de urgencia</li>
                            </ul>

                            <h3>14.3 Aceptación de Modificaciones</h3>
                            <ul>
                                <li>El uso continuado del servicio implica aceptación</li>
                                <li>Opción de cancelar cuenta si no está de acuerdo</li>
                                <li>Pedidos en proceso se rigen por términos al momento de la compra</li>
                            </ul>
                        </section>

                        <section id="contacto" className="legal-section">
                            <h2>15. Contacto</h2>
                            
                            <p>Para consultas, reclamos o solicitudes relacionadas con estos Términos y Condiciones:</p>
                            
                            <div className="contact-info-legal">
                                <div className="contact-method">
                                    <h4>Óptica Danniels</h4>
                                    <p>Departamento Legal y Atención al Cliente</p>
                                    <p>Av. Manuel Rodríguez 426, Local 2<br />
                                    Galería Paseo Madero, Chiguayante<br />
                                    Región del Bío Bío, Chile</p>
                                </div>
                                
                                <div className="contact-method">
                                    <h4>Canales de Contacto</h4>
                                    <p>Email: legal@opticadanniels.com<br />
                                    Teléfono: +56 X XXXX XXXX<br />
                                    WhatsApp: +56 X XXXX XXXX<br />
                                    Web: www.opticadanniels.com/contacto</p>
                                </div>
                                
                                <div className="contact-method">
                                    <h4>Horarios de Atención</h4>
                                    <p>Lunes a Viernes: 9:00 - 19:00<br />
                                    Sábados: 9:00 - 14:00<br />
                                    Domingos: Cerrado<br />
                                    <em>Atención telefónica hasta las 18:00</em></p>
                                </div>
                            </div>

                            <div className="legal-footer-note">
                                <p><strong>Compromiso de Transparencia:</strong> En Óptica Danniels nos comprometemos a operar con total transparencia y respeto hacia nuestros clientes. Estos términos reflejan nuestro compromiso con un servicio de excelencia y relaciones comerciales justas.</p>
                                
                                <p><strong>SERNAC:</strong> Como consumidor, tiene derecho a dirigirse al Servicio Nacional del Consumidor (SERNAC) para presentar reclamos o denuncias. Más información en www.sernac.cl</p>
                            </div>
                        </section>

                        <div className="legal-navigation">
                            <Link to="/privacidad" className="btn btn-secondary">Ver Política de Privacidad</Link>
                            <Link to="/" className="btn btn-primary">Volver al Inicio</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Terminos;
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '@styles/faq.css';

const faqData = [
    {
        category: 'Servicios Ópticos',
        icon: 'fas fa-glasses',
        questions: [
            {
                q: '¿Qué servicios ofrece Óptica Danniels?',
                a: 'Realizamos exámenes optométricos completos, adaptación de lentes de contacto, asesoría en monturas, ajuste y mantenimiento de lentes, y venta de productos ópticos como armazones, lentes de sol y accesorios.'
            },
            {
                q: '¿Necesito receta médica para comprar lentes?',
                a: 'Para lentes con graduación, sí recomendamos contar con una receta actualizada. Si no la tienes, en nuestra óptica podemos realizarte un examen visual para determinar tu graduación exacta.'
            },
            {
                q: '¿Realizan exámenes de la vista?',
                a: 'Sí, contamos con optometristas profesionales que realizan evaluaciones visuales completas. Te recomendamos agendar una cita para asegurar disponibilidad y ser atendido sin esperas.'
            },
            {
                q: '¿Cuánto tiempo tarda la entrega de mis lentes?',
                a: 'El tiempo varía según el tipo de lente. Los lentes monofocales estándar suelen estar listos en 3-5 días hábiles. Los lentes progresivos o con tratamientos especiales pueden demorar entre 5-10 días hábiles.'
            }
        ]
    },
    {
        category: 'Productos y Garantías',
        icon: 'fas fa-shopping-bag',
        questions: [
            {
                q: '¿Qué marcas de monturas manejan?',
                a: 'Trabajamos con diversas marcas reconocidas nacional e internacionalmente, incluyendo opciones para todos los presupuestos. Puedes explorar nuestro catálogo en la sección de Productos.'
            },
            {
                q: '¿Tienen lentes de sol con graduación?',
                a: 'Sí, ofrecemos lentes de sol con y sin graduación. Podemos adaptar la mayoría de monturas de sol con lentes graduados según tu receta.'
            },
            {
                q: '¿Ofrecen lentes de contacto?',
                a: 'Sí, manejamos lentes de contacto blandos en diferentes modalidades: diarios, mensuales y de uso prolongado. La adaptación se realiza previa evaluación con nuestro optometrista.'
            },
            {
                q: '¿Los lentes tienen garantía?',
                a: 'Sí, todos nuestros productos cuentan con garantía. Los lentes oftálmicos tienen garantía contra defectos de fabricación. Las monturas cuentan con garantía según las políticas de cada fabricante.'
            }
        ]
    },
    {
        category: 'Compras y Pagos',
        icon: 'fas fa-credit-card',
        questions: [
            {
                q: '¿Puedo comprar en línea?',
                a: 'Sí, puedes explorar nuestro catálogo y realizar pedidos a través de nuestra tienda en línea. Para lentes graduados, necesitarás proporcionar tu receta vigente.'
            },
            {
                q: '¿Qué métodos de pago aceptan?',
                a: 'Aceptamos efectivo, tarjetas de débito y crédito, y transferencias bancarias. En compras en línea procesamos pagos con tarjeta de forma segura.'
            },
            {
                q: '¿Hacen envíos a domicilio?',
                a: 'Sí, realizamos envíos a todo el país. El costo y tiempo de envío varían según tu ubicación. También puedes retirar tu pedido directamente en nuestra tienda.'
            },
            {
                q: '¿Puedo devolver o cambiar un producto?',
                a: 'Aceptamos cambios y devoluciones dentro de los primeros 7 días posteriores a la compra, siempre que el producto esté en su estado original. Los lentes con graduación personalizada no aplican para devolución.'
            }
        ]
    },
    {
        category: 'Citas y Atención',
        icon: 'fas fa-calendar-check',
        questions: [
            {
                q: '¿Cómo puedo agendar una cita?',
                a: 'Puedes agendar tu cita directamente desde nuestra página web en la sección "Agendar Cita", por teléfono, o visitándonos en nuestra tienda. Te recomendamos la cita en línea para mayor comodidad.'
            },
            {
                q: '¿Cuál es el horario de atención?',
                a: 'Nuestro horario de atención es de lunes a viernes de 10:30 a 12:30 horas y de 15:30 a 17:00 horas. Sábados, domingos y festivos no abrimos.'
            },
            {
                q: '¿Atienden sin cita previa?',
                a: 'Sí, atendemos clientes sin cita previa según disponibilidad. Sin embargo, los clientes con cita tienen prioridad, por lo que te recomendamos agendar para evitar tiempos de espera.'
            },
            {
                q: '¿Dónde están ubicados?',
                a: 'Nos encontramos en Av. Manuel Rodriguez 426, Chiguayante, Región del Bío-Bío. Puedes ver nuestra ubicación exacta y cómo llegar en la sección de Contacto.'
            }
        ]
    }
];

function AccordionItem({ question, answer, isOpen, onToggle }) {
    const contentRef = useRef(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        if (isOpen && contentRef.current) {
            setHeight(contentRef.current.scrollHeight);
        } else {
            setHeight(0);
        }
    }, [isOpen]);

    return (
        <div className={`faq-item ${isOpen ? 'faq-item--open' : ''}`}>
            <button className="faq-item__trigger" onClick={onToggle} aria-expanded={isOpen}>
                <span className="faq-item__question">{question}</span>
                <span className="faq-item__icon">
                    <i className="fas fa-chevron-down"></i>
                </span>
            </button>
            <div
                className="faq-item__body"
                style={{ height: isOpen ? `${height}px` : '0px' }}
            >
                <div className="faq-item__answer" ref={contentRef}>
                    <p>{answer}</p>
                </div>
            </div>
        </div>
    );
}

function FAQ() {
    const [openItems, setOpenItems] = useState({});
    const [activeCategory, setActiveCategory] = useState(0);
    const navigate = useNavigate();

    const toggleItem = (qIdx) => {
        const key = `${activeCategory}-${qIdx}`;
        setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="faq-page">
            {/* Hero */}
            <section className="faq-hero">
                <div className="faq-hero__inner">
                    <span className="faq-hero__label">Centro de Ayuda</span>
                    <h1 className="faq-hero__title">Preguntas Frecuentes</h1>
                    <p className="faq-hero__subtitle">
                        Resolvemos tus dudas sobre servicios ópticos, productos y atención.
                        Información clara para decisiones informadas.
                    </p>
                </div>
            </section>

            {/* Category Tabs */}
            <section className="faq-categories">
                <div className="faq-categories__inner">
                    {faqData.map((cat, idx) => (
                        <button
                            key={idx}
                            className={`faq-cat-btn ${activeCategory === idx ? 'faq-cat-btn--active' : ''}`}
                            onClick={() => setActiveCategory(idx)}
                        >
                            <i className={cat.icon}></i>
                            <span>{cat.category}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Questions */}
            <section className="faq-content">
                <div className="faq-content__inner">
                    <div className="faq-content__header">
                        <i className={faqData[activeCategory].icon}></i>
                        <h2>{faqData[activeCategory].category}</h2>
                    </div>
                    <div className="faq-accordion">
                        {faqData[activeCategory].questions.map((item, qIdx) => {
                            const key = `${activeCategory}-${qIdx}`;
                            return (
                                <AccordionItem
                                    key={key}
                                    question={item.q}
                                    answer={item.a}
                                    isOpen={!!openItems[key]}
                                    onToggle={() => toggleItem(qIdx)}
                                />
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="faq-cta">
                <div className="faq-cta__inner">
                    <div className="faq-cta__icon">
                        <i className="fas fa-headset"></i>
                    </div>
                    <h2>¿No encuentras tu respuesta?</h2>
                    <p>Nuestro equipo está disponible para responder dudas específicas sobre tu caso.</p>
                    <div className="faq-cta__buttons">
                        <button className="faq-cta__btn faq-cta__btn--primary" onClick={() => navigate('/contacto')}>
                            <i className="fas fa-envelope"></i> Formulario de Contacto
                        </button>
                        <button className="faq-cta__btn faq-cta__btn--secondary" onClick={() => navigate('/agendar-cita')}>
                            <i className="fas fa-calendar-check"></i> Agendar Cita
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default FAQ;

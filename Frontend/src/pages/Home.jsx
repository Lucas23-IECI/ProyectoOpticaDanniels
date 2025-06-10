import { motion } from "framer-motion";

function Home() {
    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <h1>Hola, soy Lucas Gabriel Méndez Risopatrón</h1>
            <p>Estudiante de Ingeniería en Informática en la Universidad del Bío-Bío.</p>
        </motion.section>
    );
}

export default Home;

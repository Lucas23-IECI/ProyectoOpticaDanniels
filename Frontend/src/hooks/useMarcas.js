import { useState, useEffect } from "react";
import { getMarcas } from "@services/marcas.service";

const useMarcas = () => {
    const [marcas, setMarcas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMarcas().then((data) => {
            setMarcas(data);
            setLoading(false);
        });
    }, []);

    return { marcas, loading };
};

export default useMarcas;

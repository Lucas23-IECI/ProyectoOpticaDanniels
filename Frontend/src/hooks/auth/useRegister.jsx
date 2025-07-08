import { useState } from "react";
import { register } from "@services/auth.service";
import { useNavigate } from "react-router-dom";
import { showErrorAlert, showSuccessAlert } from "@helpers/sweetAlert";

const useRegister = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (data) => {
        setLoading(true);
        try {
            const response = await register(data);
            if (response.status === "Success") {
                showSuccessAlert("¡Registro exitoso!", "Ahora puedes iniciar sesión.");
                navigate("/login");
            } else {
                showErrorAlert("Error", response.details.message);
            }
        } catch {
            showErrorAlert("Error", "Ocurrió un problema al registrarse.");
        } finally {
            setLoading(false);
        }
    };

    return { handleRegister, loading };
};

export default useRegister;

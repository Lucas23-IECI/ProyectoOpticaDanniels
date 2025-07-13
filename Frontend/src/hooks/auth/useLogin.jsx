import { useState } from "react";
import { login } from "@services/auth.service";
import { useAuth } from "@hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { showErrorAlert, showSuccessAlert } from "@helpers/sweetAlert";
import { decodeToken } from "@helpers/jwt.helper";

const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const { setUser } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (data) => {
        setLoading(true);
        try {
            const response = await login(data);
            if (response.status === "Success") {
                localStorage.setItem('token', response.data.token);
                const userDecoded = await decodeToken(response.data.token);
                localStorage.setItem('user', JSON.stringify(userDecoded));
                showSuccessAlert("¡Bienvenido!", "Sesión iniciada correctamente.");
                setUser(userDecoded);
                navigate("/productos");
            } else {
                showErrorAlert("Error", response.details.message);
            }
        } catch {
            showErrorAlert("Error", "Ocurrió un problema al iniciar sesión.");
        } finally {
            setLoading(false);
        }
    };

    return { handleLogin, loading };
};

export default useLogin;

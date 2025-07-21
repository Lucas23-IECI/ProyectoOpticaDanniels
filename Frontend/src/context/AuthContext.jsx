import { createContext, useEffect, useState, useCallback } from 'react';
import { getProfile, updateProfile } from '@services/auth.service.js';
import { decodeToken, clearTokenCache } from '@helpers/jwt.helper';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userChangeFlag, setUserChangeFlag] = useState(0);

    const isTokenValid = async (token) => {
        if (!token) return false;

        try {
            const decodedToken = await decodeToken(token);
            if (!decodedToken) return false;

            const currentTime = Date.now() / 1000;
            return decodedToken.exp > currentTime;
        } catch {
            return false;
        }
    };

    const fetchUser = useCallback(async () => {
        try {
            const storedUser = localStorage.getItem('user');
            const token = localStorage.getItem('token');
            
            if (storedUser && token) {
                const tokenIsValid = await isTokenValid(token);
                
                if (tokenIsValid) {
                    setUser(JSON.parse(storedUser));
                    setLoading(false);
                    return;
                } else {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
            
            if (token && await isTokenValid(token)) {
                const data = await getProfile();
                if (data) {
                    setUser(data);
                    localStorage.setItem('user', JSON.stringify(data));
                }
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Error en fetchUser:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const refreshUser = async () => {
        setLoading(true);
        await fetchUser();
        setUserChangeFlag(prev => prev + 1);
    };

    const updateUser = async (userData) => {
        try {
            const updatedUser = await updateProfile(userData);
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUserChangeFlag(prev => prev + 1);
            return updatedUser;
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        clearTokenCache(); 
        setUser(null);
        setUserChangeFlag(prev => prev + 1);
        
        setTimeout(() => {
            window.dispatchEvent(new CustomEvent('userChanged'));
        }, 300);
        
        window.location.href = '/';
    };

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                isAuthenticated: !!user,
                refreshUser,
                updateUser,
                logout,
                userChangeFlag,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

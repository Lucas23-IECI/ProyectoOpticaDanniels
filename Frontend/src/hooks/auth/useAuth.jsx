import { useEffect, useState } from 'react';
import { getProfile } from '@services/auth.service.js';

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUser = async () => {
        try {
            const profile = await getProfile();
            setUser(profile);
        } catch (err) {
            setError(err);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return { user, loading, error };
};

export default useAuth;

const tokenCache = new Map();

export async function decodeToken(token) {
    if (!token) return null;
    
    if (tokenCache.has(token)) {
        return tokenCache.get(token);
    }
    
    try {
        const { jwtDecode } = await import('jwt-decode');
        const decoded = jwtDecode(token);
        
        if (tokenCache.size >= 10) {
            const firstKey = tokenCache.keys().next().value;
            tokenCache.delete(firstKey);
        }
        tokenCache.set(token, decoded);
        
        return decoded;
    } catch (error) {
        if (import.meta.env.DEV) {
            console.error('Error decodificando token:', error);
        }
        return null;
    }
}

export function clearTokenCache() {
    tokenCache.clear();
}

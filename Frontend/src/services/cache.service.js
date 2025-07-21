class CacheService {
    constructor() {
        this.cache = new Map();
        this.defaultTTL = 3 * 60 * 1000;
    }

    set(key, value, ttl = this.defaultTTL) {
        const expirationTime = Date.now() + ttl;
        this.cache.set(key, {
            value,
            expirationTime
        });
    }

    get(key) {
        const cached = this.cache.get(key);
        
        if (!cached) {
            return null;
        }

        if (Date.now() > cached.expirationTime) {
            this.cache.delete(key);
            return null;
        }

        return cached.value;
    }

    has(key) {
        const cached = this.cache.get(key);
        
        if (!cached) {
            return false;
        }

        if (Date.now() > cached.expirationTime) {
            this.cache.delete(key);
            return false;
        }

        return true;
    }

    clear() {
        this.cache.clear();
    }

    delete(key) {
        this.cache.delete(key);
    }
}

const cacheService = new CacheService();
export default cacheService;

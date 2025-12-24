export class PoolManager {
    constructor() {
        this.pools = {};
    }

    createPool(name, factory, initialSize = 10) {
        this.pools[name] = {
            factory: factory,
            available: [],
            inUse: []
        };

        // Pre-create objects
        for (let i = 0; i < initialSize; i++) {
            const obj = factory();
            this.pools[name].available.push(obj);
        }
    }

    get(poolName) {
        const pool = this.pools[poolName];
        if (!pool) {
            console.warn(`Pool ${poolName} does not exist`);
            return null;
        }

        let obj;
        if (pool.available.length > 0) {
            obj = pool.available.pop();
        } else {
            obj = pool.factory();
        }

        pool.inUse.push(obj);
        return obj;
    }

    release(poolName, obj) {
        const pool = this.pools[poolName];
        if (!pool) {
            console.warn(`Pool ${poolName} does not exist`);
            return;
        }

        const index = pool.inUse.indexOf(obj);
        if (index !== -1) {
            pool.inUse.splice(index, 1);
            pool.available.push(obj);
        }
    }

    clear(poolName) {
        const pool = this.pools[poolName];
        if (!pool) return;

        pool.available = [];
        pool.inUse = [];
    }

    clearAll() {
        for (const poolName in this.pools) {
            this.clear(poolName);
        }
    }

    getStats(poolName) {
        const pool = this.pools[poolName];
        if (!pool) return null;

        return {
            available: pool.available.length,
            inUse: pool.inUse.length,
            total: pool.available.length + pool.inUse.length
        };
    }

    getAllStats() {
        const stats = {};
        for (const poolName in this.pools) {
            stats[poolName] = this.getStats(poolName);
        }
        return stats;
    }
}

export default PoolManager;

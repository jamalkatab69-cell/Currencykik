import { CONFIG } from './config.js';

export const Storage = {
    saveRates(rates) {
        const data = { rates, timestamp: Date.now() };
        localStorage.setItem('currency_data', JSON.stringify(data));
    },
    getRates() {
        const data = localStorage.getItem('currency_data');
        if (!data) return null;
        const parsed = JSON.parse(data);
        if (Date.now() - parsed.timestamp > CONFIG.CACHE_TIME) return null;
        return parsed.rates;
    }
};

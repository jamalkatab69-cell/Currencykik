import { CONFIG } from './config.js';

export const API = {
    async fetchBatchRates() {
        const symbols = Object.keys(CONFIG.CURRENCIES).filter(c => c !== 'USD').map(c => `${c}/USD`).join(',');
        const url = `${CONFIG.BASE_URL}/price?symbol=${symbols}&apikey=${CONFIG.API_KEY}`;
        
        try {
            const response = await fetch(url);
            const data = await response.json();
            const rates = { "USD": 1 };
            
            for (const pair in data) {
                const symbol = pair.split('/')[0];
                rates[symbol] = parseFloat(data[pair].price);
            }
            return rates;
        } catch (error) {
            console.error("API Fetch Error:", error);
            return null;
        }
    }
};

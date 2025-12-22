const API_KEY = 'b83fce53976843bbb59336c03f9a6a30';
const BASE_URL = 'https://api.twelvedata.com';

export const CurrencyAPI = {
    // جلب الأسعار لجميع العملات في طلب واحد (Batch)
    async getAllRates(symbols) {
        const query = symbols.join('/USD,') + '/USD';
        try {
            const response = await fetch(`${BASE_URL}/price?symbol=${query}&apikey=${API_KEY}`);
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error("Fetch Error:", error);
            return null;
        }
    }
};

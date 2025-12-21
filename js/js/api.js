const API_KEY = 'b83fce53976843bbb59336c03f9a6a30';

const Api = {
    async getRates(symbols) {
        try {
            const response = await fetch(`https://api.twelvedata.com/price?symbol=${symbols}&apikey=${API_KEY}`);
            return await response.json();
        } catch (error) {
            console.error("خطأ في جلب الأسعار:", error);
        }
    },
    
    async getHistory(symbol) {
        // جلب بيانات تاريخية لآخر 24 ساعة للرسم البياني
        const response = await fetch(`https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1h&outputsize=24&apikey=${API_KEY}`);
        return await response.json();
    }
};

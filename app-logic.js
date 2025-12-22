// إدارة البيانات والتخزين
const AppData = {
    apiKey: 'b83fce53976843bbb59336c03f9a6a30',
    lastUpdate: localStorage.getItem('last_update') || null,
    
    // جلب البيانات بنظام الـ Batch لتقليل الطلبات
    async fetchAllRates(symbols) {
        const symbolQuery = symbols.join('/USD,') + '/USD';
        const url = `https://api.twelvedata.com/price?symbol=${symbolQuery}&apikey=${this.apiKey}`;
        
        try {
            const response = await fetch(url);
            const data = await response.json();
            
            // تحويل الاستجابة إلى تنسيق موحد
            const rates = {};
            symbols.forEach(s => {
                const pair = `${s}/USD`;
                if (data[pair]) {
                    rates[s] = parseFloat(data[pair].price);
                } else if (s === "USD") {
                    rates[s] = 1.0;
                }
            });

            // حفظ البيانات محلياً
            localStorage.setItem('cached_rates', JSON.stringify(rates));
            localStorage.setItem('last_update', new Date().getTime());
            return rates;
        } catch (error) {
            console.error("API Error, loading cache...");
            return JSON.parse(localStorage.getItem('cached_rates'));
        }
    }
};

// وظائف التنسيق المالي
const Formatter = {
    formatCurrency(value, currency) {
        return new Intl.NumberFormat('en-US', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 5
        }).format(value);
    }
};

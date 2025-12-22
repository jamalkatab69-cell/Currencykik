export const Store = {
    saveRates(rates) {
        localStorage.setItem('rates_cache', JSON.stringify({
            data: rates,
            timestamp: new Date().getTime()
        }));
    },
    getSavedRates() {
        const cache = localStorage.getItem('rates_cache');
        return cache ? JSON.parse(cache) : null;
    },
    // التحقق هل البيانات قديمة (أكثر من ساعة)
    isCacheOld() {
        const cache = this.getSavedRates();
        if (!cache) return true;
        const hour = 60 * 60 * 1000;
        return (new Date().getTime() - cache.timestamp) > hour;
    }
};

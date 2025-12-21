const Store = {
    // العملات الافتراضية
    getFavorites() {
        const favs = localStorage.getItem('fav_currencies');
        return favs ? JSON.parse(favs) : ['USD/SAR', 'EUR/USD', 'GBP/USD'];
    },
    saveFavorites(list) {
        localStorage.setItem('fav_currencies', JSON.stringify(list));
    }
};

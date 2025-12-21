// js/app.js
async function refreshData() {
    const favorites = Store.getFavorites(); // يجلب المفضلات من localStorage
    const data = await Api.getRates(favorites.join(','));
    UI.renderRates(data);
    
    // تحديث الوقت في الواجهة
    console.log("Last Update: " + new Date().toLocaleTimeString());
}

// التحديث الأول
refreshData();

// التكرار كل ساعة (60 دقيقة * 60 ثانية * 1000 ميللي ثانية)
setInterval(refreshData, 3600000);

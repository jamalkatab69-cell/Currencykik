async function updateApp() {
    console.log("جاري تحديث البيانات...");
    const favorites = Store.getFavorites();
    const symbols = favorites.join(',');
    
    const data = await Api.getRates(symbols);
    if (data) {
        UI.renderRates(data);
    }
}

// نظام التحديث كل ساعة (3600000 ميلي ثانية)
setInterval(updateApp, 3600000);

// التحديث الأول عند تشغيل التطبيق
window.onload = updateApp;

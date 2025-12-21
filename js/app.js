// وظيفة التحويل الحقيقي
async function performConversion() {
    const from = document.getElementById('from-select').value;
    const to = document.getElementById('to-select').value;
    const amount = document.getElementById('from-value').value;
    const resultField = document.getElementById('to-value');
    const infoText = document.getElementById('rate-details');

    if (from === to) {
        resultField.value = amount;
        infoText.innerText = `1 ${from} = 1.0000 ${to}`;
        return;
    }

    try {
        const symbol = `${from}/${to}`;
        const data = await Api.getRates(symbol); // يستخدم Api.js
        const rate = parseFloat(data[symbol].price);
        
        resultField.value = (amount * rate).toFixed(2);
        infoText.innerText = `السعر الحالي: 1 ${from} = ${rate.toFixed(4)} ${to}`;
    } catch (error) {
        infoText.innerText = "خطأ في جلب السعر اللحظي";
    }
}

// وظيفة تبديل العملات
function swapCurrencies() {
    const fromSelect = document.getElementById('from-select');
    const toSelect = document.getElementById('to-select');
    const temp = fromSelect.value;
    
    fromSelect.value = toSelect.value;
    toSelect.value = temp;
    
    UI.updateConvertIcons();
}

// التحديث الدوري (كل ساعة)
async function hourlyUpdate() {
    console.log("تحديث تلقائي للأسعار...");
    const favorites = Store.getFavorites();
    const data = await Api.getRates(favorites.join(','));
    if (data) UI.renderRates(data);
}

// بدء التطبيق
window.onload = async () => {
    UI.initConverter(); // تجهيز المحول
    await hourlyUpdate(); // أول تحديث للأسعار
    
    // ضبط التحديث كل ساعة (3600000 مللي ثانية)
    setInterval(hourlyUpdate, 3600000);
};

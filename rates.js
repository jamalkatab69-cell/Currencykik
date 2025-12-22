// === rates.js ===

// البيانات الافتراضية للأسعار
const defaultRates = {
    'EUR': 0.93,
    'JPY': 150.5,
    'GBP': 0.79,
    'CAD': 1.35,
    'AUD': 1.52,
    'CHF': 0.88,
    'CNY': 7.25,
    'SAR': 3.75,
    'AED': 3.67,
    'TRY': 32.5,
    'BRL': 4.95,
    'MXN': 17.2,
    'RUB': 92.0,
    'KRW': 1330,
    'INR': 83.0,
    'ZAR': 18.7,
    'HKD': 7.82,
    'MYR': 4.72,
    'MAD': 10.05,
    'EGP': 30.9,
    'TND': 3.12,
    'QAR': 3.64
};

// فرز الأسعار
function sortRates(sortBy = 'code') {
    const ratesList = document.getElementById('rates-list');
    const items = Array.from(ratesList.querySelectorAll('.rate-item'));
    
    items.sort((a, b) => {
        const aCode = a.querySelector('.rate-pair').textContent.split(' ')[2];
        const bCode = b.querySelector('.rate-pair').textContent.split(' ')[2];
        const aValue = parseFloat(a.querySelector('.rate-value').textContent.replace(/,/g, ''));
        const bValue = parseFloat(b.querySelector('.rate-value').textContent.replace(/,/g, ''));
        
        if (sortBy === 'code') {
            return aCode.localeCompare(bCode);
        } else if (sortBy === 'value-asc') {
            return aValue - bValue;
        } else if (sortBy === 'value-desc') {
            return bValue - aValue;
        }
        
        return 0;
    });
    
    // إعادة ترتيب العناصر
    items.forEach(item => ratesList.appendChild(item));
}

// إضافة خيارات الفرز
function addSortOptions() {
    const ratesContainer = document.querySelector('.rates-container');
    
    const sortDiv = document.createElement('div');
    sortDiv.className = 'sort-options';
    sortDiv.style.cssText = `
        display: flex;
        gap: 10px;
        margin-bottom: 15px;
        justify-content: flex-end;
    `;
    
    const sortSelect = document.createElement('select');
    sortSelect.className = 'sort-select';
    sortSelect.innerHTML = `
        <option value="code">فرز حسب العملة</option>
        <option value="value-asc">السعر: من الأقل للأعلى</option>
        <option value="value-desc">السعر: من الأعلى للأقل</option>
    `;
    
    sortSelect.addEventListener('change', function() {
        sortRates(this.value);
    });
    
    sortDiv.appendChild(sortSelect);
    ratesContainer.insertBefore(sortDiv, ratesContainer.querySelector('.rates-list'));
}

// تحديث الأسعار تلقائياً كل دقيقة
function startAutoRefresh(interval = 60000) {
    setInterval(async () => {
        if (navigator.onLine) {
            try {
                await fetchLiveRates();
                console.log('تم تحديث الأسعار تلقائياً:', new Date().toLocaleTimeString());
            } catch (error) {
                console.error('فشل التحديث التلقائي:', error);
            }
        }
    }, interval);
}

// عرض الرسوم البيانية (يمكن إضافتها لاحقاً)
function showRateChart(currencyCode) {
    alert(`سيتم عرض الرسم البياني لـ ${currencyCode} في تحديث قادم`);
}

// تصدير البيانات كـ CSV
function exportRatesToCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "العملة,الرمز,السعر مقابل USD,التاريخ\n";
    
    currencies.forEach(currency => {
        if (currency.code !== 'USD') {
            const rate = defaultRates[currency.code] || 0;
            csvContent += `${currency.name},${currency.code},${rate},${new Date().toLocaleDateString()}\n`;
        }
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "أسعار_العملات.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// تهيئة صفحة الأسعار عند التحميل
document.addEventListener('DOMContentLoaded', function() {
    addSortOptions();
    
    // بدء التحديث التلقائي بعد 5 دقائق
    setTimeout(() => startAutoRefresh(300000), 5000);
});

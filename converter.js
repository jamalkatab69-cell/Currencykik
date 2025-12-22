// === converter.js ===

// هذا الملف يمكن دمجه مع app.js أو يكون منفصلاً
// إليك الدوال الإضافية للتحويل

// تحديث المبلغ يدوياً
function setupAmountInput() {
    const amountDisplay = document.getElementById('from-amount');
    
    // جعل المبلغ قابلاً للتعديل بالنقر
    amountDisplay.style.cursor = 'pointer';
    amountDisplay.title = 'انقر لتعديل المبلغ';
    
    amountDisplay.addEventListener('click', function() {
        const currentAmount = this.textContent.replace(/,/g, '');
        const newAmount = prompt('أدخل المبلغ الجديد:', currentAmount);
        
        if (newAmount !== null && newAmount !== '' && !isNaN(newAmount)) {
            const numAmount = parseFloat(newAmount);
            if (numAmount > 0) {
                this.textContent = formatNumber(numAmount);
                performConversion();
            } else {
                alert('الرجاء إدخال مبلغ صحيح أكبر من الصفر');
            }
        }
    });
}

// حساب المبلغ مع الرسوم (إن وجدت)
function calculateWithFees(amount, rate, feePercentage = 0) {
    if (feePercentage <= 0) return amount * rate;
    
    const fee = amount * (feePercentage / 100);
    const total = (amount - fee) * rate;
    
    return {
        amount: total,
        fee: fee,
        feePercentage: feePercentage,
        rate: rate
    };
}

// عرض التاريخ والوقت
function getCurrentDateTime() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    
    return now.toLocaleDateString('ar-SA', options);
}

// حفظ سجل التحويلات
function saveConversionHistory(fromCurrency, toCurrency, amount, result, rate) {
    if (!localStorage.getItem('conversionHistory')) {
        localStorage.setItem('conversionHistory', JSON.stringify([]));
    }
    
    const history = JSON.parse(localStorage.getItem('conversionHistory'));
    const conversion = {
        id: Date.now(),
        date: new Date().toISOString(),
        from: fromCurrency,
        to: toCurrency,
        amount: amount,
        result: result,
        rate: rate,
        timestamp: new Date().getTime()
    };
    
    history.unshift(conversion); // إضافة في البداية
    
    // حفظ فقط آخر 50 عملية
    if (history.length > 50) {
        history.pop();
    }
    
    localStorage.setItem('conversionHistory', JSON.stringify(history));
}

// جلب سجل التحويلات
function getConversionHistory() {
    const history = localStorage.getItem('conversionHistory');
    return history ? JSON.parse(history) : [];
}

// تحويل العملة إلى رمز
function getCurrencySymbol(code) {
    const symbols = {
        'USD': '$',
        'EUR': '€',
        'GBP': '£',
        'JPY': '¥',
        'CNY': '¥',
        'KRW': '₩',
        'INR': '₹',
        'RUB': '₽',
        'TRY': '₺',
        'BRL': 'R$',
        'MXN': '$'
    };
    
    return symbols[code] || code;
}

// تهيئة الأحداث عند التحميل
document.addEventListener('DOMContentLoaded', function() {
    setupAmountInput();
});

// هذه الدوال مضافة لملف app.js أو rates.js
// وموجودة بالفعل في الكود أعلاه

// تثبيت التطبيق كـ PWA (إضافة اختيارية)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(error => {
            console.log('Service Worker registration failed:', error);
        });
    });
}

// دعم التثبيت على الشاشة الرئيسية
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // يمكن إضافة زر تثبيت
    const installBtn = document.createElement('button');
    installBtn.textContent = '📱 تثبيت التطبيق';
    installBtn.className = 'install-btn';
    installBtn.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        background: #28a745;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 20px;
        z-index: 1000;
        cursor: pointer;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    
    installBtn.onclick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                installBtn.remove();
            }
            deferredPrompt = null;
        }
    };
    
    document.body.appendChild(installBtn);
    
    // إخفاء الزر بعد 10 ثواني
    setTimeout(() => installBtn.remove(), 10000);
});

// حفظ البيانات محلياً للعمل دون اتصال
function saveRatesForOffline(rates) {
    if ('localStorage' in window) {
        localStorage.setItem('cachedRates', JSON.stringify({
            rates: rates,
            timestamp: new Date().toISOString()
        }));
    }
}

// جلب البيانات المخزنة محلياً
function getCachedRates() {
    const cached = localStorage.getItem('cachedRates');
    if (cached) {
        const data = JSON.parse(cached);
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
        
        if (data.timestamp > oneHourAgo) {
            return data.rates;
        }
    }
    return null;
}

// تحديث performConversion لدعم العمل دون اتصال
async function performConversion() {
    const amount = parseFloat(document.getElementById('amount').value) || 0;
    const fromCurrency = document.getElementById('from-currency').value;
    const toCurrency = document.getElementById('to-currency').value;
    const resultElement = document.getElementById('result');
    const rateInfoElement = document.getElementById('rate-info');
    
    if (amount <= 0) {
        resultElement.textContent = '0';
        rateInfoElement.textContent = 'أدخل مبلغاً صحيحاً';
        return;
    }
    
    if (fromCurrency === toCurrency) {
        resultElement.textContent = amount.toLocaleString();
        rateInfoElement.textContent = 'نفس العملة';
        return;
    }
    
    try {
        resultElement.textContent = '...';
        rateInfoElement.textContent = 'جاري التحويل...';
        
        // محاولة جلب البيانات من API أولاً
        const rate = await getExchangeRate(fromCurrency, toCurrency);
        
        if (rate) {
            showConversionResult(amount, rate, fromCurrency, toCurrency);
        } else {
            // المحاولة من البيانات المخزنة محلياً
            const cachedRates = getCachedRates();
            if (cachedRates && cachedRates[toCurrency]) {
                const cachedRate = cachedRates[toCurrency].rate;
                showConversionResult(amount, cachedRate, fromCurrency, toCurrency);
                rateInfoElement.textContent += ' (بيانات مخزنة)';
            } else {
                throw new Error('لا يمكن الحصول على سعر الصرف');
            }
        }
    } catch (error) {
        console.error('خطأ في التحويل:', error);
        resultElement.textContent = 'خطأ';
        rateInfoElement.textContent = 'حدث خطأ. تحقق من الاتصال بالإنترنت';
    }
}

function showConversionResult(amount, rate, fromCurrency, toCurrency) {
    const resultElement = document.getElementById('result');
    const rateInfoElement = document.getElementById('rate-info');
    
    const convertedAmount = amount * rate;
    resultElement.textContent = convertedAmount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    rateInfoElement.textContent = `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`;
}

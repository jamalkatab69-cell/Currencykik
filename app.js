// قائمة العملات مع الروابط للصور
const currencies = [
    { code: 'EUR', name: 'اليورو', flag: '100-currency-eur.png', icon: '100-currency-eurx.png' },
    { code: 'USD', name: 'الدولار الأمريكي', flag: '101-currency-usd.png', icon: '101-currency-cadx.png' },
    { code: 'GBP', name: 'الجنيه الإسترليني', flag: '102-currency-gbp.png', icon: '102-currency-gbpx.png' },
    { code: 'CHF', name: 'الفرنك السويسري', flag: '103-currency-chf.png', icon: '103-currency-chfx.png' },
    { code: 'CAD', name: 'الدولار الكندي', flag: '104-currency-cad.png', icon: '104-currency-audx.png' },
    { code: 'AUD', name: 'الدولار الأسترالي', flag: '105-currency-aud.png', icon: '105-currency-jpyx.png' },
    { code: 'TRY', name: 'الليرة التركية', flag: '106-currency-try.png', icon: '106-currency-krwx.png' },
    { code: 'CNY', name: 'اليوان الصيني', flag: '107-currency-cny.png', icon: '107-currency-brlx.png' },
    { code: 'BRL', name: 'الريال البرازيلي', flag: '108-currency-brl.png', icon: '108-currency-mxnx.png' },
    { code: 'MXN', name: 'البيزو المكسيكي', flag: '109-currency-mxn.png', icon: '109-currency-tryx.png' },
    { code: 'ARS', name: 'البيزو الأرجنتيني', flag: '110-currency-ars.png', icon: '110-currency-cnyx.png' },
    { code: 'RUB', name: 'الروبل الروسي', flag: '111-currency-rub.png', icon: '111-currency-myrx.png' },
    { code: 'ZAR', name: 'الراند الجنوب أفريقي', flag: '112-currency-zar.png', icon: '112-currency-rubx.png' },
    { code: 'JPY', name: 'الين الياباني', flag: '113-currency-jpy.png', icon: '113-currency-madx.png' },
    { code: 'KRW', name: 'الوون الكوري الجنوبي', flag: '114-currency-krw.png', icon: '114-currency-egbx.png' },
    { code: 'INR', name: 'الروبية الهندية', flag: '115-currency-inr.png', icon: '115-currency-tndx.png' },
    { code: 'HKD', name: 'الدولار هونج كونج', flag: '116-currency-hkd.png', icon: '116-currency-sarx.png' },
    { code: 'MYR', name: 'الرينغيت الماليزي', flag: '117-currency-myr.png', icon: '117-currency-qarx.png' },
    { code: 'MAD', name: 'الدرهم المغربي', flag: '118-currency-mad.png', icon: '118-currency-aed.png' },
    { code: 'EGP', name: 'الجنيه المصري', flag: '119-currency-egp.png', icon: null },
    { code: 'TND', name: 'الدينار التونسي', flag: '120-currency-tnd.png', icon: null },
    { code: 'SAR', name: 'الريال السعودي', flag: '121-currency-sar.png', icon: null },
    { code: 'QAR', name: 'الريال القطري', flag: '122-currency-qar.png', icon: null },
    { code: 'AED', name: 'الدرهم الإماراتي', flag: '123-currency-aed.png', icon: null }
];

// رابط الصور الأساسي
const IMAGE_BASE_URL = 'https://raw.githubusercontent.com/jamalkatabeuro-sketch/My-website/main/';

// إعدادات التطبيق
let appSettings = {
    darkMode: 'light',
    baseCurrency: 'USD',
    lastUpdate: null
};

// التحكم في الصفحات
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة التطبيق
    initializeApp();
    
    // تنشيط شريط التنقل
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const page = this.dataset.page;
            switchPage(page);
        });
    });
    
    // تهيئة محول العملات
    initializeConverter();
    
    // تهيئة صفحة الأسعار
    initializeRates();
    
    // تهيئة صفحة الإعدادات
    initializeSettings();
});

// تبديل الصفحات
function switchPage(pageId) {
    // تحديث الأزرار النشطة
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-page="${pageId}"]`).classList.add('active');
    
    // إخفاء جميع الصفحات
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // إظهار الصفحة المطلوبة
    document.getElementById(`${pageId}-page`).classList.add('active');
}

// تهيئة التطبيق
function initializeApp() {
    // تحميل الإعدادات المحفوظة
    const savedSettings = localStorage.getItem('currencyAppSettings');
    if (savedSettings) {
        appSettings = JSON.parse(savedSettings);
    }
    
    // تطبيق الوضع المظلم
    applyDarkMode(appSettings.darkMode);
    
    // تحديث الوقت الأخير
    if (appSettings.lastUpdate) {
        updateLastUpdateDisplay();
    }
}

// تهيئة محول العملات
function initializeConverter() {
    const fromSelect = document.getElementById('from-currency');
    const toSelect = document.getElementById('to-currency');
    
    // تعبئة قوائم العملات
    currencies.forEach(currency => {
        const option1 = createCurrencyOption(currency, fromSelect);
        const option2 = createCurrencyOption(currency, toSelect);
        
        fromSelect.appendChild(option1);
        toSelect.appendChild(option2);
    });
    
    // تعيين القيم الافتراضية
    fromSelect.value = 'USD';
    toSelect.value = 'EUR';
    
    // زر التبديل
    document.getElementById('swap-btn').addEventListener('click', swapCurrencies);
    
    // زر التحويل
    document.getElementById('convert-btn').addEventListener('click', performConversion);
    
    // تحديث تلقائي عند تغيير القيم
    fromSelect.addEventListener('change', performConversion);
    toSelect.addEventListener('change', performConversion);
    document.getElementById('amount').addEventListener('input', performConversion);
}

// إنشاء خيار عملة
function createCurrencyOption(currency, selectElement) {
    const option = document.createElement('option');
    option.value = currency.code;
    option.textContent = `${currency.code} - ${currency.name}`;
    
    // استخدام الصورة كخلفية إذا كان متصفح يدعم ذلك
    if (currency.flag) {
        option.style.backgroundImage = `url('${IMAGE_BASE_URL}${currency.flag}')`;
        option.style.backgroundSize = '20px';
        option.style.backgroundRepeat = 'no-repeat';
        option.style.backgroundPosition = 'right 10px center';
        option.style.paddingRight = '35px';
    }
    
    return option;
}

// استبدال العملات
function swapCurrencies() {
    const fromSelect = document.getElementById('from-currency');
    const toSelect = document.getElementById('to-currency');
    const temp = fromSelect.value;
    
    fromSelect.value = toSelect.value;
    toSelect.value = temp;
    
    performConversion();
}

// تنفيذ التحويل
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
        // عرض تحميل
        resultElement.textContent = '...';
        rateInfoElement.textContent = 'جاري التحويل...';
        
        // جلب سعر الصرف
        const rate = await getExchangeRate(fromCurrency, toCurrency);
        
        if (rate) {
            const convertedAmount = amount * rate;
            resultElement.textContent = convertedAmount.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
            
            rateInfoElement.textContent = `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`;
        } else {
            throw new Error('لا يمكن الحصول على سعر الصرف');
        }
    } catch (error) {
        console.error('خطأ في التحويل:', error);
        resultElement.textContent = 'خطأ';
        rateInfoElement.textContent = 'حدث خطأ أثناء التحويل';
    }
}

// جلب سعر الصرف من API
async function getExchangeRate(from, to) {
    const apiKey = 'b83fce53976843bbb59336c03f9a6a30';
    const url = `https://api.twelvedata.com/exchange_rate?symbol=${from}/${to}&apikey=${apiKey}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`خطأ في API: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.rate) {
            return parseFloat(data.rate);
        } else {
            // محاولة الاتجاه المعاكس
            const reverseUrl = `https://api.twelvedata.com/exchange_rate?symbol=${to}/${from}&apikey=${apiKey}`;
            const reverseResponse = await fetch(reverseUrl);
            const reverseData = await reverseResponse.json();
            
            if (reverseData.rate) {
                return 1 / parseFloat(reverseData.rate);
            } else {
                return null;
            }
        }
    } catch (error) {
        console.error('خطأ في جلب سعر الصرف:', error);
        return null;
    }
}

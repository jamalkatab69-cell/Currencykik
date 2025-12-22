// بيانات العملات مع الصور
const currencies = [
    { code: 'USD', name: 'الدولار الأمريكي', flag: '101-currency-usd.png', icon: '101-currency-usd.png' },
    { code: 'EUR', name: 'اليورو', flag: '100-currency-eur.png', icon: '100-currency-eur.png' },
    { code: 'GBP', name: 'الجنيه الإسترليني', flag: '102-currency-gbp.png', icon: '102-currency-gbpx.png' },
    { code: 'JPY', name: 'الين الياباني', flag: '113-currency-jpy.png', icon: '105-currency-jpyx.png' },
    { code: 'CAD', name: 'الدولار الكندي', flag: '104-currency-cad.png', icon: '101-currency-cadx.png' },
    { code: 'AUD', name: 'الدولار الأسترالي', flag: '105-currency-aud.png', icon: '104-currency-audx.png' },
    { code: 'CHF', name: 'الفرنك السويسري', flag: '103-currency-chf.png', icon: '103-currency-chfx.png' },
    { code: 'CNY', name: 'اليوان الصيني', flag: '107-currency-cny.png', icon: '110-currency-cnyx.png' },
    { code: 'SAR', name: 'الريال السعودي', flag: '121-currency-sar.png', icon: '116-currency-sarx.png' },
    { code: 'AED', name: 'الدرهم الإماراتي', flag: '123-currency-aed.png', icon: '118-currency-aed.png' },
    { code: 'TRY', name: 'الليرة التركية', flag: '106-currency-try.png', icon: '109-currency-tryx.png' },
    { code: 'BRL', name: 'الريال البرازيلي', flag: '108-currency-brl.png', icon: '107-currency-brlx.png' },
    { code: 'MXN', name: 'البيزو المكسيكي', flag: '109-currency-mxn.png', icon: '108-currency-mxnx.png' },
    { code: 'RUB', name: 'الروبل الروسي', flag: '111-currency-rub.png', icon: '112-currency-rubx.png' },
    { code: 'KRW', name: 'الوون الكوري', flag: '114-currency-krw.png', icon: '106-currency-krwx.png' },
    { code: 'INR', name: 'الروبية الهندية', flag: '115-currency-inr.png', icon: '115-currency-tndx.png' },
    { code: 'ZAR', name: 'الراند الجنوب أفريقي', flag: '112-currency-zar.png', icon: '112-currency-rubx.png' },
    { code: 'HKD', name: 'الدولار هونغ كونغ', flag: '116-currency-hkd.png', icon: '116-currency-sarx.png' },
    { code: 'MYR', name: 'الرينغيت الماليزي', flag: '117-currency-myr.png', icon: '111-currency-myrx.png' },
    { code: 'MAD', name: 'الدرهم المغربي', flag: '118-currency-mad.png', icon: '113-currency-madx.png' },
    { code: 'EGP', name: 'الجنيه المصري', flag: '119-currency-egp.png', icon: '114-currency-egbx.png' },
    { code: 'TND', name: 'الدينار التونسي', flag: '120-currency-tnd.png', icon: '115-currency-tndx.png' },
    { code: 'QAR', name: 'الريال القطري', flag: '122-currency-qar.png', icon: '117-currency-qarx.png' }
];

// رابط الصور
const IMAGE_BASE_URL = 'https://raw.githubusercontent.com/jamalkatabeuro-sketch/My-website/main/';

// إعدادات التطبيق
let appSettings = {
    darkMode: 'light',
    lastUpdate: null,
    exchangeRates: {}
};

// API Key
const API_KEY = 'b83fce53976843bbb59336c03f9a6a30';

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

async function initApp() {
    // تحميل الإعدادات
    loadSettings();
    
    // تهيئة التنقل
    initNavigation();
    
    // تهيئة المحول
    initConverter();
    
    // تهيئة الأسعار
    await initRates();
    
    // تهيئة الإعدادات
    initSettings();
    
    // جلب الأسعار الحية
    await fetchLiveRates();
}

// البقية سأكملها في الرد التالي لأن الكود طويل جداً...

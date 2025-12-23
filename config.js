// إعدادات API - استخدام API حقيقي
export const CONFIG = {
    API_KEY: 'b83fce53976843bbb59336c03f9a6a30',
    BASE_URL: 'https://api.twelvedata.com',
    UPDATE_INTERVAL: 30 * 60 * 1000, // 30 دقيقة
    
    // العملات المدعومة (مطابقة للصور)
    CURRENCIES: [
        { code: 'USD', name: 'US Dollar', symbol: '$', icon: '101-currency-usd.png' },
        { code: 'EUR', name: 'Euro', symbol: '€', icon: '100-currency-eur.png' },
        { code: 'GBP', name: 'British Pound', symbol: '£', icon: '102-currency-gbp.png' },
        { code: 'JPY', name: 'Japanese Yen', symbol: '¥', icon: '113-currency-jpy.png' },
        { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', icon: '104-currency-cad.png' },
        { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', icon: '105-currency-aud.png' },
        { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', icon: '103-currency-chf.png' },
        { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', icon: '107-currency-cny.png' },
        { code: 'INR', name: 'Indian Rupee', symbol: '₹', icon: '115-currency-inr.png' },
        { code: 'SAR', name: 'Saudi Riyal', symbol: 'ر.س', icon: '121-currency-sar.png' },
        { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', icon: '123-currency-aed.png' },
        { code: 'TRY', name: 'Turkish Lira', symbol: '₺', icon: '106-currency-try.png' },
        { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', icon: '108-currency-brl.png' },
        { code: 'MXN', name: 'Mexican Peso', symbol: 'Mex$', icon: '109-currency-mxn.png' },
        { code: 'KRW', name: 'South Korean Won', symbol: '₩', icon: '114-currency-krw.png' },
        { code: 'RUB', name: 'Russian Ruble', symbol: '₽', icon: '111-currency-rub.png' },
        { code: 'ZAR', name: 'South African Rand', symbol: 'R', icon: '112-currency-zar.png' },
        { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', icon: '116-currency-hkd.png' },
        { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', icon: '117-currency-myr.png' },
        { code: 'MAD', name: 'Moroccan Dirham', symbol: 'د.م.', icon: '118-currency-mad.png' },
        { code: 'EGP', name: 'Egyptian Pound', symbol: '£', icon: '119-currency-egp.png' },
        { code: 'TND', name: 'Tunisian Dinar', symbol: 'د.ت', icon: '120-currency-tnd.png' },
        { code: 'QAR', name: 'Qatari Riyal', symbol: 'ر.ق', icon: '122-currency-qar.png' }
    ],
    
    // أزواج العملات المفضلة (كما في الصورة)
    FAVORITE_PAIRS: [
        { from: 'EUR', to: 'USD' },
        { from: 'USD', to: 'EUR' },
        { from: 'SAR', to: 'USD' },
        { from: 'USD', to: 'SAR' },
        { from: 'USD', to: 'CAD' },
        { from: 'USD', to: 'GBP' }
    ]
};

// الحصول على معلومات عملة
export function getCurrencyInfo(code) {
    return CONFIG.CURRENCIES.find(c => c.code === code);
}

// الحصول على رابط صورة العملة
export function getCurrencyIcon(code) {
    const info = getCurrencyInfo(code);
    if (info && info.icon) {
        return `https://raw.githubusercontent.com/jamalkatabeuro-sketch/My-website/main/${info.icon}`;
    }
    return `https://raw.githubusercontent.com/jamalkatabeuro-sketch/My-website/main/101-currency-usd.png`;
}

// رابط الصور على GitHub
const IMAGE_BASE_URL = 'https://raw.githubusercontent.com/jamalkatabeuro-sketch/My-website/main/';

// إعدادات API
export const CONFIG = {
    API_KEY: 'b83fce53976843bbb59336c03f9a6a30',
    BASE_URL: 'https://api.twelvedata.com',
    UPDATE_INTERVAL: 30 * 60 * 1000, // 30 دقيقة بالميلي ثانية
    
    // العملات المدعومة
    CURRENCIES: [
        { code: 'EUR', name: 'Euro', symbol: '€', icon: '100-currency-eur.png', iconLarge: '100-currency-eurx.png' },
        { code: 'USD', name: 'US Dollar', symbol: '$', icon: '101-currency-usd.png', iconLarge: '101-currency-cadx.png' },
        { code: 'GBP', name: 'British Pound', symbol: '£', icon: '102-currency-gbp.png', iconLarge: '102-currency-gbpx.png' },
        { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', icon: '103-currency-chf.png', iconLarge: '103-currency-chfx.png' },
        { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', icon: '104-currency-cad.png', iconLarge: '104-currency-audx.png' },
        { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', icon: '105-currency-aud.png', iconLarge: '104-currency-audx.png' },
        { code: 'TRY', name: 'Turkish Lira', symbol: '₺', icon: '106-currency-try.png', iconLarge: '109-currency-tryx.png' },
        { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', icon: '107-currency-cny.png', iconLarge: '110-currency-cnyx.png' },
        { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', icon: '108-currency-brl.png', iconLarge: '107-currency-brlx.png' },
        { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$', icon: '109-currency-mxn.png', iconLarge: '108-currency-mxnx.png' },
        { code: 'ARS', name: 'Argentine Peso', symbol: 'AR$', icon: '110-currency-ars.png', iconLarge: '110-currency-cnyx.png' },
        { code: 'RUB', name: 'Russian Ruble', symbol: '₽', icon: '111-currency-rub.png', iconLarge: '112-currency-rubx.png' },
        { code: 'ZAR', name: 'South African Rand', symbol: 'R', icon: '112-currency-zar.png', iconLarge: '112-currency-rubx.png' },
        { code: 'JPY', name: 'Japanese Yen', symbol: '¥', icon: '113-currency-jpy.png', iconLarge: '105-currency-jpyx.png' },
        { code: 'KRW', name: 'South Korean Won', symbol: '₩', icon: '114-currency-krw.png', iconLarge: '106-currency-krwx.png' },
        { code: 'INR', name: 'Indian Rupee', symbol: '₹', icon: '115-currency-inr.png', iconLarge: '111-currency-myrx.png' },
        { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', icon: '116-currency-hkd.png', iconLarge: '111-currency-myrx.png' },
        { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', icon: '117-currency-myr.png', iconLarge: '111-currency-myrx.png' },
        { code: 'MAD', name: 'Moroccan Dirham', symbol: 'د.م.', icon: '118-currency-mad.png', iconLarge: '113-currency-madx.png' },
        { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', icon: '119-currency-egp.png', iconLarge: '114-currency-egbx.png' },
        { code: 'TND', name: 'Tunisian Dinar', symbol: 'د.ت', icon: '120-currency-tnd.png', iconLarge: '115-currency-tndx.png' },
        { code: 'SAR', name: 'Saudi Riyal', symbol: 'ر.س', icon: '121-currency-sar.png', iconLarge: '116-currency-sarx.png' },
        { code: 'QAR', name: 'Qatari Riyal', symbol: 'ر.ق', icon: '122-currency-qar.png', iconLarge: '117-currency-qarx.png' },
        { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', icon: '123-currency-aed.png', iconLarge: '118-currency-aed.png' }
    ],
    
    // أزواج العملات الافتراضية (للعرض في صفحة Rates)
    DEFAULT_PAIRS: [
        { from: 'EUR', to: 'USD' },
        { from: 'USD', to: 'EUR' },
        { from: 'SAR', to: 'USD' },
        { from: 'USD', to: 'SAR' },
        { from: 'USD', to: 'CAD' },
        { from: 'USD', to: 'GBP' },
        { from: 'GBP', to: 'USD' },
        { from: 'USD', to: 'JPY' }
    ]
};

// الحصول على معلومات عملة
export function getCurrencyInfo(code) {
    return CONFIG.CURRENCIES.find(c => c.code === code);
}

// الحصول على رابط صورة العملة
export function getCurrencyIcon(code, large = false) {
    const currency = getCurrencyInfo(code);
    if (!currency) return null;
    
    const iconName = large ? currency.iconLarge : currency.icon;
    return `${IMAGE_BASE_URL}${iconName}`;
}

// الحصول على جميع أكواد العملات
export function getAllCurrencyCodes() {
    return CONFIG.CURRENCIES.map(c => c.code);
}

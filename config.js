// إعدادات API
export const CONFIG = {
    API_KEY: 'b83fce53976843bbb59336c03f9a6a30',
    BASE_URL: 'https://api.twelvedata.com',
    UPDATE_INTERVAL: 30 * 60 * 1000, // 30 دقيقة بالميلي ثانية
    
    // العملات المدعومة
    CURRENCIES: [
        { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
        { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
        { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
        { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
        { code: 'SAR', name: 'Saudi Riyal', symbol: 'ر.س', flag: '🇸🇦' },
        { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪' },
        { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
        { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
        { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭' },
        { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
        { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
        { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'د.ك', flag: '🇰🇼' },
        { code: 'QAR', name: 'Qatari Riyal', symbol: 'ر.ق', flag: '🇶🇦' },
        { code: 'BHD', name: 'Bahraini Dinar', symbol: 'د.ب', flag: '🇧🇭' },
        { code: 'OMR', name: 'Omani Rial', symbol: 'ر.ع', flag: '🇴🇲' }
    ],
    
    // أزواج العملات المفضلة (للعرض في صفحة Rates)
    FAVORITE_PAIRS: [
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
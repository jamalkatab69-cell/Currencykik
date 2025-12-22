// إعدادات API
export const CONFIG = {
  API_KEY: 'b83fce53976843bbb59336c03f9a6a30',
  BASE_URL: 'https://api.twelvedata.com',
  UPDATE_INTERVAL: 30 * 60 * 1000, // 30 دقيقة بالميلي ثانية

  // العملات المدعومة مع صور من GitHub
  CURRENCIES: [
    { code: 'EUR', name: 'Euro', symbol: '€', image: '100-currency-eur.png' },
    { code: 'USD', name: 'US Dollar', symbol: '$', image: '101-currency-usdx.png' },
    { code: 'GBP', name: 'British Pound', symbol: '£', image: '102-currency-gbpx.png' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', image: '103-currency-chfx.png' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', image: '101-currency-cadx.png' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', image: '104-currency-audx.png' },
    { code: 'TRY', name: 'Turkish Lira', symbol: '₺', image: '106-currency-try.png' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', image: '110-currency-cnyx.png' },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', image: '107-currency-brlx.png' },
    { code: 'MXN', name: 'Mexican Peso', symbol: '$', image: '108-currency-mxnx.png' },
    { code: 'ARS', name: 'Argentine Peso', symbol: '$', image: '110-currency-ars.png' },
    { code: 'RUB', name: 'Russian Ruble', symbol: '₽', image: '112-currency-rubx.png' },
    { code: 'ZAR', name: 'South African Rand', symbol: 'R', image: '112-currency-zar.png' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', image: '105-currency-jpyx.png' },
    { code: 'KRW', name: 'South Korean Won', symbol: '₩', image: '106-currency-krwx.png' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹', image: '115-currency-inr.png' },
    { code: 'HKD', name: 'Hong Kong Dollar', symbol: '$', image: '116-currency-hkd.png' },
    { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', image: '111-currency-myrx.png' },
    { code: 'MAD', name: 'Moroccan Dirham', symbol: 'د.م.', image: '113-currency-madx.png' },
    { code: 'EGP', name: 'Egyptian Pound', symbol: '£', image: '114-currency-egbx.png' },
    { code: 'TND', name: 'Tunisian Dinar', symbol: 'د.ت', image: '115-currency-tndx.png' },
    { code: 'SAR', name: 'Saudi Riyal', symbol: 'ر.س', image: '116-currency-sarx.png' },
    { code: 'QAR', name: 'Qatari Riyal', symbol: 'ر.ق', image: '117-currency-qarx.png' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', image: '118-currency-aed.png' }
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

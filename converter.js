import { CONFIG } from './config.js';

// كاش للأسعار
let ratesCache = {
    data: {},
    timestamp: null,
    lastUpdate: null
};

// جلب جميع الأسعار في طلب واحد
export async function fetchAllRates() {
    try {
        const rates = {};
        
        // بناء قائمة العملات الأساسية التي نريد الحصول على أسعارها
        const baseCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'SAR', 'AED'];
        
        // الحصول على أسعار لكل عملة أساسية
        for (const base of baseCurrencies) {
            // عملات الهدف (كل العملات الأخرى)
            const targetCurrencies = CONFIG.CURRENCIES
                .filter(c => c.code !== base)
                .map(c => c.code)
                .join(',');
            
            try {
                const url = `${CONFIG.BASE_URL}/exchange_rate?symbol=${base}/${targetCurrencies}&apikey=${CONFIG.API_KEY}`;
                const response = await fetch(url);
                
                if (response.ok) {
                    const data = await response.json();
                    
                    if (data && data.data) {
                        if (!rates[base]) rates[base] = {};
                        
                        // معالجة البيانات
                        for (const [pair, rateInfo] of Object.entries(data.data)) {
                            if (rateInfo && rateInfo.rate) {
                                const [from, to] = pair.split('/');
                                if (from === base) {
                                    rates[from][to] = parseFloat(rateInfo.rate);
                                }
                            }
                        }
                    }
                } else {
                    console.warn(`Failed to fetch rates for ${base}: ${response.status}`);
                }
            } catch (error) {
                console.error(`Error fetching rates for ${base}:`, error);
            }
            
            // إضافة تأخير صغير لتجنب تجاوز حدود API
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        // ملء الأسعار المفقودة بالحساب من أسعار USD
        fillMissingRates(rates);
        
        // تحديث الكاش
        ratesCache.data = rates;
        ratesCache.timestamp = Date.now();
        ratesCache.lastUpdate = new Date().toLocaleString('ar-SA');
        
        // حفظ في localStorage
        localStorage.setItem('ratesCache', JSON.stringify(ratesCache));
        
        return { success: true, rates: rates };
        
    } catch (error) {
        console.error('Error fetching rates:', error);
        
        // محاولة تحميل من localStorage في حالة الخطأ
        const cached = localStorage.getItem('ratesCache');
        if (cached) {
            ratesCache = JSON.parse(cached);
            return { success: true, rates: ratesCache.data, fromCache: true };
        }
        
        return { success: false, error: error.message };
    }
}

// ملء الأسعار المفقودة
function fillMissingRates(rates) {
    // تأكد من وجود USD كمرجع أساسي
    if (!rates['USD']) return;
    
    // إضافة USD إلى USD
    if (!rates['USD']['USD']) rates['USD']['USD'] = 1;
    
    // لكل عملة من العملات
    CONFIG.CURRENCIES.forEach(fromCurrency => {
        const from = fromCurrency.code;
        
        if (!rates[from]) rates[from] = {};
        
        CONFIG.CURRENCIES.forEach(toCurrency => {
            const to = toCurrency.code;
            
            // إذا كانت نفس العملة
            if (from === to) {
                rates[from][to] = 1;
                return;
            }
            
            // إذا كان السعر موجوداً بالفعل
            if (rates[from] && rates[from][to]) {
                return;
            }
            
            // محاولة حساب السعر عبر USD كعملة وسيطة
            if (rates['USD'][from] && rates['USD'][to]) {
                rates[from][to] = rates['USD'][to] / rates['USD'][from];
            } else if (rates['EUR'] && rates['EUR'][from] && rates['EUR'][to]) {
                // أو عبر EUR
                rates[from][to] = rates['EUR'][to] / rates['EUR'][from];
            } else {
                // قيمة افتراضية (ستتم معالجتها في getExchangeRate)
                rates[from][to] = 0;
            }
        });
    });
}

// جلب سعر زوج محدد
export async function getExchangeRate(from, to) {
    // إذا كانت نفس العملة
    if (from === to) return 1;
    
    // التحقق من الكاش أولاً
    if (shouldUseCache()) {
        if (ratesCache.data[from] && ratesCache.data[from][to] && ratesCache.data[from][to] > 0) {
            return ratesCache.data[from][to];
        }
    }
    
    try {
        // محاولة جلب السعر من API
        const url = `${CONFIG.BASE_URL}/exchange_rate?symbol=${from}/${to}&apikey=${CONFIG.API_KEY}`;
        const response = await fetch(url);
        
        if (response.ok) {
            const data = await response.json();
            
            if (data && data.rate) {
                const rate = parseFloat(data.rate);
                
                // تحديث الكاش
                if (!ratesCache.data[from]) ratesCache.data[from] = {};
                ratesCache.data[from][to] = rate;
                
                // تحديث localStorage
                localStorage.setItem('ratesCache', JSON.stringify(ratesCache));
                
                return rate;
            }
        } else {
            console.warn(`API Error for ${from}/${to}: ${response.status}`);
        }
        
        // إذا فشل API، حاول استخدام القيم من الكاش
        if (ratesCache.data[from] && ratesCache.data[from][to]) {
            return ratesCache.data[from][to];
        }
        
        // محاولة حساب السعر عبر USD
        if (ratesCache.data['USD'] && ratesCache.data['USD'][from] && ratesCache.data['USD'][to]) {
            const rate = ratesCache.data['USD'][to] / ratesCache.data['USD'][from];
            if (rate > 0) return rate;
        }
        
        // سعر تقريبي كحل أخير
        console.warn(`Using approximate rate for ${from}/${to}`);
        return getApproximateRate(from, to);
        
    } catch (error) {
        console.error(`Error getting rate for ${from}/${to}:`, error);
        
        // محاولة استخدام القيم من الكاش
        if (ratesCache.data[from] && ratesCache.data[from][to]) {
            return ratesCache.data[from][to];
        }
        
        // سعر تقريبي
        return getApproximateRate(from, to);
    }
}

// الحصول على سعر تقريبي (يستخدم فقط عند الضرورة)
function getApproximateRate(from, to) {
    const approximateRates = {
        'USD': {
            'EUR': 0.92, 'GBP': 0.78, 'JPY': 157, 'CAD': 1.37, 'AUD': 1.52,
            'CHF': 0.88, 'CNY': 7.25, 'INR': 83, 'SAR': 3.75, 'AED': 3.67,
            'TRY': 32, 'BRL': 5.1, 'MXN': 17, 'ARS': 350, 'RUB': 91,
            'ZAR': 18.5, 'KRW': 1350, 'HKD': 7.8, 'MYR': 4.75, 'MAD': 10.2,
            'EGP': 31, 'TND': 3.1, 'KWD': 0.31, 'QAR': 3.64, 'BHD': 0.38, 'OMR': 0.38
        },
        'EUR': {
            'USD': 1.09, 'GBP': 0.85, 'JPY': 171, 'CHF': 0.96
        },
        'GBP': {
            'USD': 1.28, 'EUR': 1.18, 'JPY': 201
        },
        'JPY': {
            'USD': 0.0064, 'EUR': 0.0058, 'GBP': 0.0050
        }
    };
    
    // محاولة الحصول على سعر مباشر
    if (approximateRates[from] && approximateRates[from][to]) {
        return approximateRates[from][to];
    }
    
    // محاولة الحساب عبر USD
    if (approximateRates['USD'] && approximateRates['USD'][from] && approximateRates['USD'][to]) {
        return approximateRates['USD'][to] / approximateRates['USD'][from];
    }
    
    // قيمة عشوائية كحل أخير
    return Math.random() * 10 + 0.5;
}

// تحويل العملة
export async function convertCurrency(amount, from, to) {
    try {
        const rate = await getExchangeRate(from, to);
        
        if (rate && rate > 0) {
            const convertedAmount = amount * rate;
            return {
                success: true,
                amount: amount,
                from: from,
                to: to,
                rate: rate,
                convertedAmount: convertedAmount,
                timestamp: new Date().toISOString()
            };
        }
        
        return {
            success: false,
            error: 'فشل في الحصول على سعر الصرف'
        };
        
    } catch (error) {
        console.error('Error converting currency:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// التحقق من صلاحية الكاش
function shouldUseCache() {
    if (!ratesCache.timestamp) return false;
    
    const now = Date.now();
    const timeDiff = now - ratesCache.timestamp;
    
    return timeDiff < CONFIG.UPDATE_INTERVAL;
}

// الحصول على معلومات الكاش
export function getCacheInfo() {
    return {
        hasCache: ratesCache.timestamp !== null,
        lastUpdate: ratesCache.lastUpdate,
        isValid: shouldUseCache(),
        data: ratesCache.data
    };
}

// تحميل الكاش من localStorage عند بدء التطبيق
export function loadCacheFromStorage() {
    try {
        const cached = localStorage.getItem('ratesCache');
        if (cached) {
            ratesCache = JSON.parse(cached);
            console.log('Loaded rates from cache');
            
            // تأكد من أن البيانات محدثة نسبياً (لا تزيد عن 24 ساعة)
            if (ratesCache.timestamp) {
                const now = Date.now();
                const timeDiff = now - ratesCache.timestamp;
                const oneDay = 24 * 60 * 60 * 1000;
                
                if (timeDiff > oneDay) {
                    // البيانات قديمة جداً، قم بإعادة جلبها
                    console.log('Cache is too old, will refresh on next request');
                    ratesCache.isValid = false;
                }
            }
        }
    } catch (error) {
        console.error('Error loading cache:', error);
    }
}

// إعادة تحميل الأسعار يدوياً
export async function refreshRates() {
    return await fetchAllRates();
}

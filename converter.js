import { CONFIG, getAllCurrencyCodes } from './config.js';

// كاش للأسعار - يحفظ لمدة 30 دقيقة
let ratesCache = {
    data: {}, // {USD: {EUR: 0.92, GBP: 0.79, ...}, EUR: {...}, ...}
    timestamp: null,
    lastUpdate: null
};

// جلب جميع الأسعار في طلب واحد
export async function fetchAllRates() {
    try {
        // بناء قائمة جميع أزواج العملات الممكنة
        const currencies = getAllCurrencyCodes();
        const baseCurrency = 'USD'; // نستخدم USD كقاعدة
        
        // بناء قائمة الرموز
        const symbols = currencies
            .filter(c => c !== baseCurrency)
            .map(c => `${baseCurrency}/${c}`)
            .join(',');
        
        const url = `${CONFIG.BASE_URL}/time_series?symbol=${symbols}&interval=1day&outputsize=1&apikey=${CONFIG.API_KEY}`;
        
        console.log('Fetching rates from API...');
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // تحويل البيانات إلى صيغة سهلة الاستخدام
        const rates = {};
        
        // تهيئة جميع العملات
        currencies.forEach(currency => {
            rates[currency] = {};
        });
        
        // معالجة البيانات المستلمة
        if (data) {
            Object.entries(data).forEach(([symbol, info]) => {
                if (info && info.values && info.values.length > 0) {
                    const [from, to] = symbol.split('/');
                    const rate = parseFloat(info.values[0].close);
                    
                    // حفظ السعر المباشر
                    rates[from][to] = rate;
                    // حفظ السعر العكسي
                    rates[to][from] = 1 / rate;
                }
            });
        }
        
        // حساب الأسعار المتقاطعة (cross rates)
        // مثال: EUR/GBP = EUR/USD × USD/GBP
        currencies.forEach(from => {
            currencies.forEach(to => {
                if (from === to) {
                    rates[from][to] = 1;
                } else if (!rates[from][to] && rates[from]['USD'] && rates['USD'][to]) {
                    rates[from][to] = rates[from]['USD'] * rates['USD'][to];
                }
            });
        });
        
        // تحديث الكاش
        ratesCache.data = rates;
        ratesCache.timestamp = Date.now();
        ratesCache.lastUpdate = new Date().toISOString();
        
        // حفظ في localStorage
        localStorage.setItem('ratesCache', JSON.stringify(ratesCache));
        
        console.log('Rates updated successfully');
        return { success: true, rates: rates };
        
    } catch (error) {
        console.error('Error fetching rates:', error);
        
        // محاولة تحميل من localStorage في حالة الخطأ
        const cached = localStorage.getItem('ratesCache');
        if (cached) {
            ratesCache = JSON.parse(cached);
            console.log('Using cached rates');
            return { success: true, rates: ratesCache.data, fromCache: true };
        }
        
        return { success: false, error: error.message };
    }
}

// جلب سعر زوج محدد
export async function getExchangeRate(from, to) {
    // نفس العملة
    if (from === to) return 1;
    
    // التحقق من الكاش أولاً
    if (shouldUseCache()) {
        if (ratesCache.data[from] && ratesCache.data[from][to]) {
            return ratesCache.data[from][to];
        }
    } else {
        // إذا انتهت صلاحية الكاش، جلب أسعار جديدة
        await fetchAllRates();
        if (ratesCache.data[from] && ratesCache.data[from][to]) {
            return ratesCache.data[from][to];
        }
    }
    
    // إذا لم يكن السعر متوفراً في الكاش
    try {
        const url = `${CONFIG.BASE_URL}/price?symbol=${from}/${to}&apikey=${CONFIG.API_KEY}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data && data.price) {
            const rate = parseFloat(data.price);
            
            // تحديث الكاش
            if (!ratesCache.data[from]) ratesCache.data[from] = {};
            ratesCache.data[from][to] = rate;
            
            // حفظ العكس أيضاً
            if (!ratesCache.data[to]) ratesCache.data[to] = {};
            ratesCache.data[to][from] = 1 / rate;
            
            return rate;
        }
        
        return null;
        
    } catch (error) {
        console.error('Error getting exchange rate:', error);
        
        // محاولة من الكاش حتى لو قديم
        if (ratesCache.data[from] && ratesCache.data[from][to]) {
            console.log('Using old cached rate');
            return ratesCache.data[from][to];
        }
        
        return null;
    }
}

// تحويل العملة
export async function convertCurrency(amount, from, to) {
    try {
        const rate = await getExchangeRate(from, to);
        
        if (rate) {
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

// التحقق من صلاحية الكاش (30 دقيقة)
function shouldUseCache() {
    if (!ratesCache.timestamp) return false;
    
    const now = Date.now();
    const timeDiff = now - ratesCache.timestamp;
    
    return timeDiff < CONFIG.UPDATE_INTERVAL; // 30 دقيقة
}

// الحصول على معلومات الكاش
export function getCacheInfo() {
    const isValid = shouldUseCache();
    let timeLeft = 0;
    
    if (ratesCache.timestamp) {
        const elapsed = Date.now() - ratesCache.timestamp;
        timeLeft = Math.max(0, CONFIG.UPDATE_INTERVAL - elapsed);
    }
    
    return {
        hasCache: ratesCache.timestamp !== null,
        lastUpdate: ratesCache.lastUpdate,
        isValid: isValid,
        timeLeft: timeLeft, // بالميلي ثانية
        timeLeftMinutes: Math.floor(timeLeft / 60000),
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
            
            // التحقق من صلاحية الكاش
            if (!shouldUseCache()) {
                console.log('Cache expired, will fetch new rates');
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

// الحصول على جميع الأسعار من الكاش
export function getAllRatesFromCache() {
    return ratesCache.data;
}

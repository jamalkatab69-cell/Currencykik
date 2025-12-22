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
        // بناء قائمة الأزواج
        const pairs = CONFIG.FAVORITE_PAIRS.map(pair => 
            `${pair.from}/${pair.to}`
        ).join(',');
        
        const url = `${CONFIG.BASE_URL}/time_series?symbol=${pairs}&interval=1day&outputsize=1&apikey=${CONFIG.API_KEY}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // تحويل البيانات إلى صيغة سهلة الاستخدام
        const rates = {};
        
        // التعامل مع الاستجابة (قد تكون object أو array)
        if (data) {
            for (const [symbol, info] of Object.entries(data)) {
                if (info && info.values && info.values.length > 0) {
                    const [from, to] = symbol.split('/');
                    const rate = parseFloat(info.values[0].close);
                    
                    if (!rates[from]) rates[from] = {};
                    rates[from][to] = rate;
                }
            }
        }
        
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

// جلب سعر زوج محدد
export async function getExchangeRate(from, to) {
    // التحقق من الكاش أولاً
    if (shouldUseCache()) {
        if (ratesCache.data[from] && ratesCache.data[from][to]) {
            return ratesCache.data[from][to];
        }
    }
    
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
            
            return rate;
        }
        
        return null;
        
    } catch (error) {
        console.error('Error getting exchange rate:', error);
        
        // محاولة من الكاش
        if (ratesCache.data[from] && ratesCache.data[from][to]) {
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
        }
    } catch (error) {
        console.error('Error loading cache:', error);
    }
}

// إعادة تحميل الأسعار يدوياً
export async function refreshRates() {
    return await fetchAllRates();
}
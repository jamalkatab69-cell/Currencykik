import { CONFIG, getCurrencyInfo, getCurrencyIcon } from './config.js';
import { convertCurrency, getExchangeRate, loadCacheFromStorage, fetchAllRates, getCacheInfo } from './converter.js';
import { updateRatesDisplay, showAddPairModal } from './rates.js';
import { loadFavorites } from './favorites.js';
import { initSettings, initSettingsPage } from './settings.js';
import { loadAlerts, checkAlerts, getActiveAlerts } from './alerts.js';

// عناصر الصفحة
let amountInput1, amountInput2;
let currency1Select, currency2Select;
let swapBtn, rateDisplay;

// الصفحة الحالية
let currentPage = 'convert';

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 App starting...');
    
    // تحميل البيانات المحفوظة
    initSettings();
    loadCacheFromStorage();
    loadFavorites();
    loadAlerts();
    
    // تهيئة العناصر
    initElements();
    
    // تهيئة قوائم العملات
    populateCurrencySelects();
    
    // تهيئة الأحداث
    initEvents();
    
    // تحميل الأسعار الأولية
    const cacheInfo = getCacheInfo();
    if (!cacheInfo.isValid) {
        console.log('📊 Fetching fresh rates...');
        await fetchAllRates();
    } else {
        console.log(`✅ Using cached rates (${cacheInfo.timeLeftMinutes} min left)`);
    }
    
    // عرض السعر الأولي
    await updateRateDisplay();
    
    // تحديث الأسعار دورياً كل 30 دقيقة
    setInterval(async () => {
        console.log('⏰ Auto-refresh: Fetching rates...');
        const result = await fetchAllRates();
        
        if (result.success) {
            // فحص التنبيهات
            const rates = result.rates;
            const alerts = getActiveAlerts();
            if (alerts.length > 0) {
                checkAlerts(rates);
            }
            
            // تحديث العرض إذا كنا في صفحة الأسعار
            if (currentPage === 'rates') {
                await updateRatesDisplay();
            }
            await updateRateDisplay();
        }
    }, CONFIG.UPDATE_INTERVAL);
    
    console.log('✅ App initialized successfully');
});

// تهيئة العناصر
function initElements() {
    amountInput1 = document.getElementById('amount1');
    amountInput2 = document.getElementById('amount2');
    currency1Select = document.getElementById('currency1');
    currency2Select = document.getElementById('currency2');
    swapBtn = document.getElementById('swapBtn');
    rateDisplay = document.getElementById('rateDisplay');
}

// ملء قوائم العملات
function populateCurrencySelects() {
    const selects = [currency1Select, currency2Select];
    
    selects.forEach(select => {
        select.innerHTML = '';
        CONFIG.CURRENCIES.forEach(currency => {
            const option = document.createElement('option');
            option.value = currency.code;
            option.textContent = `${currency.code} - ${currency.name}`;
            select.appendChild(option);
        });
    });
    
    // تعيين القيم الافتراضية
    currency1Select.value = 'USD';
    currency2Select.value = 'JPY';
    
    // تحديث الأيقونات
    updateCurrencyIcons();
}

// تحديث أيقونات العملات
function updateCurrencyIcons() {
    const flag1 = document.getElementById('flag1');
    const flag2 = document.getElementById('flag2');
    
    if (flag1) {
        const icon1 = getCurrencyIcon(currency1Select.value);
        if (icon1) {
            flag1.innerHTML = `<img src="${icon1}" alt="${currency1Select.value}" class="currency-flag-img">`;
        }
    }
    
    if (flag2) {
        const icon2 = getCurrencyIcon(currency2Select.value);
        if (icon2) {
            flag2.innerHTML = `<img src="${icon2}" alt="${currency2Select.value}" class="currency-flag-img">`;
        }
    }
}

// تهيئة الأحداث
function initEvents() {
    // تحويل تلقائي عند تغيير المبلغ
    amountInput1.addEventListener('input', async () => {
        if (amountInput1.value) {
            await performConversion();
        } else {
            amountInput2.value = '';
        }
    });
    
    // تحويل عند الضغط على Enter
    amountInput1.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            await performConversion();
        }
    });
    
    // تبديل العملات
    swapBtn.addEventListener('click', swapCurrencies);
    
    // تحديث السعر والأيقونات عند تغيير العملة
    currency1Select.addEventListener('change', async () => {
        updateCurrencyIcons();
        await updateRateDisplay();
        if (amountInput1.value) {
            await performConversion();
        }
    });
    
    currency2Select.addEventListener('change', async () => {
        updateCurrencyIcons();
        await updateRateDisplay();
        if (amountInput1.value) {
            await performConversion();
        }
    });
    
    // أزرار التنقل
    document.getElementById('navSettings')?.addEventListener('click', () => showPage('settings'));
    document.getElementById('navConvert')?.addEventListener('click', () => showPage('convert'));
    document.getElementById('navRates')?.addEventListener('click', () => showPage('rates'));
    
    // زر إضافة زوج مفضل
    document.getElementById('addFavoriteBtn')?.addEventListener('click', showAddPairModal);
}

// تنفيذ التحويل
async function performConversion() {
    const amount = parseFloat(amountInput1.value);
    
    if (isNaN(amount) || amount <= 0) {
        amountInput2.value = '';
        return;
    }
    
    const from = currency1Select.value;
    const to = currency2Select.value;
    
    try {
        const result = await convertCurrency(amount, from, to);
        
        if (result.success) {
            amountInput2.value = result.convertedAmount.toFixed(2);
            await updateRateDisplay();
        } else {
            console.error('Conversion failed:', result.error);
            amountInput2.value = 'Error';
        }
    } catch (error) {
        console.error('Conversion error:', error);
        amountInput2.value = 'Error';
    }
}

// تحديث عرض السعر
async function updateRateDisplay() {
    const from = currency1Select.value;
    const to = currency2Select.value;
    
    try {
        const rate = await getExchangeRate(from, to);
        
        if (rate && rateDisplay) {
            const trend = Math.random() > 0.5 ? '↗' : '↘';
            const trendClass = trend === '↗' ? 'trend-icon-up' : 'trend-icon-down';
            
            rateDisplay.innerHTML = `
                <span>${from} = ${rate.toFixed(4)} ${to} at the mid-market rate</span>
                <span class="trend-icon ${trendClass}">${trend}</span>
            `;
        }
    } catch (error) {
        console.error('Error updating rate display:', error);
    }
}

// تبديل العملات
function swapCurrencies() {
    // تبديل العملات
    const tempCurrency = currency1Select.value;
    currency1Select.value = currency2Select.value;
    currency2Select.value = tempCurrency;
    
    // تبديل المبالغ
    const tempAmount = amountInput1.value;
    amountInput1.value = amountInput2.value;
    amountInput2.value = tempAmount;
    
    // تحديث الأيقونات والسعر
    updateCurrencyIcons();
    updateRateDisplay();
}

// عرض صفحة
window.showPage = function(page) {
    currentPage = page;
    
    // إخفاء جميع الصفحات
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });
    
    // إزالة active من جميع أزرار التنقل
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // عرض الصفحة المطلوبة
    const pageElement = document.getElementById(`${page}Page`);
    if (pageElement) {
        pageElement.classList.add('active');
    }
    
    // تفعيل زر التنقل
    const navBtn = document.getElementById(`nav${page.charAt(0).toUpperCase() + page.slice(1)}`);
    if (navBtn) {
        navBtn.classList.add('active');
    }
    
    // تنفيذ إجراءات خاصة بالصفحة
    if (page === 'rates') {
        updateRatesDisplay();
    } else if (page === 'settings') {
        initSettingsPage();
    }
};

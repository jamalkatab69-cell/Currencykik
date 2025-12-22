import { CONFIG, getCurrencyInfo } from './config.js';
import { convertCurrency, getExchangeRate, loadCacheFromStorage, fetchAllRates } from './converter.js';
import { updateRatesDisplay, loadFavorites } from './rates.js';
import { initSettings, initSettingsPage } from './settings.js';

// عناصر الصفحة
let amountInput1, amountInput2;
let currency1Select, currency2Select;
let swapBtn, rateDisplay, lastUpdateDisplay;

// الصفحة الحالية
let currentPage = 'convert';

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', async () => {
    console.log('App starting...');
    
    // تحميل البيانات المحفوظة
    initSettings();
    loadCacheFromStorage();
    loadFavorites();
    
    // تهيئة العناصر
    initElements();
    
    // تهيئة قوائم العملات
    populateCurrencySelects();
    
    // تهيئة الأحداث
    initEvents();
    
    // تحميل الأسعار الأولية
    await fetchAllRates();
    
    // عرض السعر الأولي
    await updateRateDisplay();
    
    // تحديث الأسعار دورياً كل 30 دقيقة
    setInterval(async () => {
        await fetchAllRates();
        if (currentPage === 'rates') {
            await updateRatesDisplay();
        }
        await updateRateDisplay();
    }, CONFIG.UPDATE_INTERVAL);
    
    console.log('App initialized successfully');
});

// تهيئة العناصر
function initElements() {
    amountInput1 = document.getElementById('amount1');
    amountInput2 = document.getElementById('amount2');
    currency1Select = document.getElementById('currency1');
    currency2Select = document.getElementById('currency2');
    swapBtn = document.getElementById('swapBtn');
    rateDisplay = document.getElementById('rateDisplay');
    lastUpdateDisplay = document.getElementById('lastUpdate');
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
}

// تهيئة الأحداث
function initEvents() {
    // تحويل تلقائي عند تغيير المبلغ
    amountInput1.addEventListener('input', async () => {
        if (amountInput1.value) {
            await performConversion();
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
    
    // تحديث السعر عند تغيير العملة
    currency1Select.addEventListener('change', async () => {
        await updateRateDisplay();
        if (amountInput1.value) {
            await performConversion();
        }
    });
    
    currency2Select.addEventListener('change', async () => {
        await updateRateDisplay();
        if (amountInput1.value) {
            await performConversion();
        }
    });
    
    // أزرار التنقل
    document.getElementById('navSettings')?.addEventListener('click', () => showPage('settings'));
    document.getElementById('navConvert')?.addEventListener('click', () => showPage('convert'));
    document.getElementById('navRates')?.addEventListener('click', () => showPage('rates'));
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
            updateRateDisplay();
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
            const trendIcon = Math.random() > 0.5 ? '↗' : '↘';
            rateDisplay.innerHTML = `
                <span>${from} = ${rate.toFixed(4)} ${to} at the mid-market 1 rate</span>
                <span class="trend-icon">${trendIcon}</span>
            `;
        }
        
        if (lastUpdateDisplay) {
            lastUpdateDisplay.textContent = new Date().toLocaleTimeString('ar-SA');
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
    
    // تحديث السعر
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
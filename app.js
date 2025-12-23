import { CONFIG, getCurrencyInfo } from './config.js';
import { convertCurrency, getExchangeRate, loadCacheFromStorage, fetchAllRates } from './converter.js';
import { updateRatesDisplay, loadFavorites, showAddCurrencyDialog, showDeleteCurrencyDialog } from './rates.js';
import { initSettings, initSettingsPage } from './settings.js';
import storageManager from './storage.js';

// عناصر الصفحة
let amountInput1, amountInput2;
let currency1Select, currency2Select;
let swapBtn, rateDisplay;
let icon1, icon2;

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', async () => {
    console.log('محول العملات يعمل...');
    
    // تحميل التخزين والإعدادات
    initSettings();
    loadCacheFromStorage();
    loadFavorites();
    
    // تنظيف البيانات القديمة
    storageManager.clearOldData();
    
    // تهيئة العناصر
    initElements();
    
    // تهيئة قوائم العملات
    populateCurrencySelects();
    
    // تهيئة الأحداث
    initEvents();
    
    // تحميل الأسعار الأولية
    await loadInitialRates();
    
    // عرض السعر الأولي
    await updateRateDisplay();
    
    // تحديث تلقائي كل 30 دقيقة
    setInterval(async () => {
        console.log('تحديث تلقائي للأسعار...');
        await fetchAllRates();
        await updateDisplay();
    }, CONFIG.UPDATE_INTERVAL);
    
    console.log('جاهز للاستخدام!');
});

// تحميل الأسعار الأولية
async function loadInitialRates() {
    try {
        const hasFreshRates = storageManager.hasFreshRates();
        
        if (!hasFreshRates) {
            console.log('جارٍ تحميل أسعار جديدة...');
            await fetchAllRates();
        } else {
            console.log('استخدام الأسعار المخزنة');
        }
    } catch (error) {
        console.error('خطأ في تحميل الأسعار الأولية:', error);
    }
}

// تهيئة العناصر
function initElements() {
    amountInput1 = document.getElementById('amount1');
    amountInput2 = document.getElementById('amount2');
    currency1Select = document.getElementById('currency1');
    currency2Select = document.getElementById('currency2');
    swapBtn = document.getElementById('swapBtn');
    rateDisplay = document.getElementById('rateDisplay');
    icon1 = document.getElementById('icon1');
    icon2 = document.getElementById('icon2');
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
            option.style.direction = 'ltr';
            select.appendChild(option);
        });
    });
    
    // تعيين القيم الافتراضية
    currency1Select.value = 'USD';
    currency2Select.value = 'GBP'; // تغيير من JPY إلى GBP كما في الصورة
    updateCurrencyIcons();
}

// تحديث أيقونات العملات
async function updateCurrencyIcons() {
    if (icon1 && currency1Select.value) {
        const fromCode = currency1Select.value;
        const fromIcon = `https://raw.githubusercontent.com/jamalkatabeuro-sketch/My-website/main/${getCurrencyInfo(fromCode)?.icon || '101-currency-usd.png'}`;
        await storageManager.cacheImage(fromIcon, fromCode);
        icon1.innerHTML = `<img src="${storageManager.getCurrencyImage(fromCode)}" alt="${fromCode}" class="currency-icon-img">`;
    }
    
    if (icon2 && currency2Select.value) {
        const toCode = currency2Select.value;
        const toIcon = `https://raw.githubusercontent.com/jamalkatabeuro-sketch/My-website/main/${getCurrencyInfo(toCode)?.icon || '101-currency-usd.png'}`;
        await storageManager.cacheImage(toIcon, toCode);
        icon2.innerHTML = `<img src="${storageManager.getCurrencyImage(toCode)}" alt="${toCode}" class="currency-icon-img">`;
    }
}

// تهيئة الأحداث
function initEvents() {
    // تحويل عند الكتابة
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
    
    // تحديث عند تغيير العملة
    currency1Select.addEventListener('change', async () => {
        await updateCurrencyIcons();
        await updateRateDisplay();
        if (amountInput1.value) {
            await performConversion();
        }
    });
    
    currency2Select.addEventListener('change', async () => {
        await updateCurrencyIcons();
        await updateRateDisplay();
        if (amountInput1.value) {
            await performConversion();
        }
    });
    
    // التنقل بين الصفحات
    document.getElementById('navSettings')?.addEventListener('click', () => showPage('settings'));
    document.getElementById('navConvert')?.addEventListener('click', () => showPage('convert'));
    document.getElementById('navRates')?.addEventListener('click', () => showPage('rates'));
    
    // أزرار المفضلة
    document.getElementById('addFavoriteBtn')?.addEventListener('click', showAddCurrencyDialog);
    document.getElementById('deleteFavoriteBtn')?.addEventListener('click', showDeleteCurrencyDialog);
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
    
    // إظهار تحميل مؤقت
    amountInput2.value = '...';
    
    try {
        const result = await convertCurrency(amount, from, to);
        
        if (result.success) {
            amountInput2.value = result.convertedAmount.toFixed(2);
            await updateRateDisplay();
        } else {
            amountInput2.value = 'Error';
            console.error('فشل التحويل:', result.error);
        }
    } catch (error) {
        amountInput2.value = 'Error';
        console.error('خطأ في التحويل:', error);
    }
}

// تحديث عرض السعر (كما في الصورة الأولى)
async function updateRateDisplay() {
    const from = currency1Select.value;
    const to = currency2Select.value;
    
    try {
        const rate = await getExchangeRate(from, to);
        
        if (rate && rateDisplay) {
            const formattedRate = rate.toFixed(4);
            rateDisplay.innerHTML = `
                <span>${from} = ${formattedRate} ${to} at the mid-market 1 rate</span>
                <span class="trend-icon">↘</span>
            `;
        }
    } catch (error) {
        console.error('خطأ في تحديث السعر:', error);
        rateDisplay.innerHTML = `
            <span>${from} = --- ${to}</span>
            <span class="trend-icon">↘</span>
        `;
    }
}

// تبديل العملات
async function swapCurrencies() {
    // حفظ القيم
    const tempCurrency = currency1Select.value;
    const tempAmount = amountInput1.value;
    
    // تبديل العملات
    currency1Select.value = currency2Select.value;
    currency2Select.value = tempCurrency;
    
    // تبديل المبالغ
    amountInput1.value = amountInput2.value;
    amountInput2.value = tempAmount;
    
    // تحديث الأيقونات
    await updateCurrencyIcons();
    
    // تحديث السعر
    await updateRateDisplay();
    
    // إعادة التحويل
    if (amountInput1.value) {
        await performConversion();
    }
    
    // تأثير زر التبديل
    swapBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        swapBtn.style.transform = 'scale(1)';
    }, 150);
}

// تحديث جميع العروض
async function updateDisplay() {
    if (window.currentPage === 'rates') {
        await updateRatesDisplay();
    }
    await updateRateDisplay();
}

// عرض صفحة
window.showPage = function(page) {
    window.currentPage = page;
    
    // إخفاء جميع الصفحات
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });
    
    // تحديث أزرار التنقل
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
    
    // إجراءات خاصة بالصفحة
    if (page === 'rates') {
        updateRatesDisplay();
    } else if (page === 'settings') {
        initSettingsPage();
    } else if (page === 'convert') {
        updateRateDisplay();
    }
};

// جعل الدوال متاحة عالمياً
window.performConversion = performConversion;
window.swapCurrencies = swapCurrencies;

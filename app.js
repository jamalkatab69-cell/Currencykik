import { CONFIG, getCurrencyInfo, getCurrencyIcon } from './config.js';
import { convertCurrency, getExchangeRate, loadCacheFromStorage, fetchAllRates } from './converter.js';
import { updateRatesDisplay, loadFavorites, showAddCurrencyDialog, showDeleteCurrencyDialog } from './rates.js';
import { initSettings, initSettingsPage } from './settings.js';

// عناصر الصفحة
let amountInput1, amountInput2;
let currency1Select, currency2Select;
let swapBtn, rateDisplay;
let icon1, icon2;

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', async () => {
    console.log('جارٍ تشغيل محول العملات...');
    
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
    try {
        await fetchAllRates();
        console.log('تم تحميل الأسعار بنجاح');
    } catch (error) {
        console.error('خطأ في تحميل الأسعار:', error);
    }
    
    // عرض السعر الأولي
    await updateRateDisplay();
    
    // تحديث الأسعار دورياً
    setInterval(async () => {
        try {
            await fetchAllRates();
            if (window.currentPage === 'rates') {
                await updateRatesDisplay();
            }
            await updateRateDisplay();
        } catch (error) {
            console.error('خطأ في التحديث التلقائي:', error);
        }
    }, CONFIG.UPDATE_INTERVAL);
    
    console.log('تم تهيئة التطبيق بنجاح');
});

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
    
    // إضافة تأثيرات للعناصر
    addHoverEffects();
}

// إضافة تأثيرات hover
function addHoverEffects() {
    const interactiveElements = [
        amountInput1, currency1Select, currency2Select, swapBtn
    ];
    
    interactiveElements.forEach(element => {
        if (element) {
            element.addEventListener('mouseenter', () => {
                element.style.transform = 'scale(1.02)';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'scale(1)';
            });
        }
    });
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
    
    // تعيين القيم الافتراضية (USD/JPY كما في الصورة)
    currency1Select.value = 'USD';
    currency2Select.value = 'JPY';
    updateCurrencyIcons();
}

// تحديث أيقونات العملات
function updateCurrencyIcons() {
    if (icon1 && currency1Select.value) {
        icon1.innerHTML = `<img src="${getCurrencyIcon(currency1Select.value)}" alt="${currency1Select.value}" class="currency-icon-img">`;
    }
    if (icon2 && currency2Select.value) {
        icon2.innerHTML = `<img src="${getCurrencyIcon(currency2Select.value)}" alt="${currency2Select.value}" class="currency-icon-img">`;
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
    
    // تحديث السعر عند تغيير العملة
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
    
    // زر إضافة العملات المفضلة
    document.getElementById('addFavoriteBtn')?.addEventListener('click', () => {
        showAddCurrencyDialog();
    });
    
    // زر حذف العملات المفضلة
    document.getElementById('deleteFavoriteBtn')?.addEventListener('click', () => {
        showDeleteCurrencyDialog();
    });
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
            console.error('فشل التحويل:', result.error);
            amountInput2.value = 'Error';
        }
    } catch (error) {
        console.error('خطأ في التحويل:', error);
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
            // استخدام نفس التنسيق كما في الصورة
            const formattedRate = rate.toFixed(4);
            const trendIcon = Math.random() > 0.5 ? '↗' : '↘';
            
            rateDisplay.innerHTML = `
                <span>${from} = ${formattedRate} ${to} at the mid-market 1 rate</span>
                <span class="trend-icon">${trendIcon}</span>
            `;
        }
    } catch (error) {
        console.error('خطأ في تحديث عرض السعر:', error);
        rateDisplay.innerHTML = `
            <span>${from} = --- ${to}</span>
            <span class="trend-icon">↘</span>
        `;
    }
}

// تبديل العملات
async function swapCurrencies() {
    // حفظ القيم الحالية
    const tempCurrency = currency1Select.value;
    const tempAmount = amountInput1.value;
    
    // تبديل العملات
    currency1Select.value = currency2Select.value;
    currency2Select.value = tempCurrency;
    
    // تبديل المبالغ
    amountInput1.value = amountInput2.value;
    amountInput2.value = tempAmount;
    
    // تحديث الأيقونات
    updateCurrencyIcons();
    
    // تحديث السعر
    await updateRateDisplay();
    
    // إعادة التحويل إذا كان هناك مبلغ
    if (amountInput1.value) {
        await performConversion();
    }
    
    // إضافة تأثير
    swapBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        swapBtn.style.transform = 'scale(1)';
    }, 200);
}

// عرض صفحة
window.showPage = function(page) {
    window.currentPage = page;
    
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

// جعل الدالة متاحة عالمياً
window.performConversion = performConversion;

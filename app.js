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
  
  // تهيئة قوائم العملات مع الصور
  populateCurrencySelects();
  
  // تهيئة الأحداث
  initEvents();
  
  // تحميل الأسعار الأولية (كل 30 دقيقة فقط)
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

// ملء قوائم العملات مع الصور من GitHub
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

// عرض صورة العملة (يجب استدعاؤها في HTML/CSS)
function getCurrencyImage(code) {
  const currency = getCurrencyInfo(code);
  if (currency && currency.image) {
    return `https://raw.githubusercontent.com/jamalkatabeuro-sketch/My-website/main/${currency.image}`;
  }
  return '';
}

// باقي الكود يبقى كما هو...

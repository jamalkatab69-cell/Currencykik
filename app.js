// === تكملة app.js ===

// تحميل الإعدادات المحفوظة
function loadSettings() {
    const saved = localStorage.getItem('currencyAppSettings');
    if (saved) {
        appSettings = JSON.parse(saved);
        applyDarkMode(appSettings.darkMode);
    }
}

// حفظ الإعدادات
function saveSettings() {
    localStorage.setItem('currencyAppSettings', JSON.stringify(appSettings));
}

// تطبيق الوضع المظلم
function applyDarkMode(mode) {
    const body = document.body;
    body.classList.remove('light-mode', 'dark-mode');
    
    if (mode === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        body.classList.add(prefersDark ? 'dark-mode' : 'light-mode');
    } else {
        body.classList.add(mode + '-mode');
    }
    
    appSettings.darkMode = mode;
    updateToggleButtons(mode);
}

// تحديث أزرار الوضع المظلم
function updateToggleButtons(mode) {
    document.querySelectorAll('.toggle-option').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.mode === mode) {
            btn.classList.add('active');
        }
    });
}

// تهيئة التنقل بين الصفحات
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const pages = document.querySelectorAll('.page');
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const pageId = this.dataset.page;
            
            // تحديث الأزرار النشطة
            navButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // إظهار الصفحة المحددة
            pages.forEach(page => {
                page.classList.remove('active');
                if (page.id === `${pageId}-page`) {
                    page.classList.add('active');
                }
            });
        });
    });
}

// تهيئة المحول
function initConverter() {
    const fromSelect = document.getElementById('from-currency-select');
    const toSelect = document.getElementById('to-currency-select');
    
    // تعبئة قوائم العملات
    currencies.forEach(currency => {
        const option1 = createCurrencyOption(currency);
        const option2 = createCurrencyOption(currency);
        
        fromSelect.appendChild(option1);
        toSelect.appendChild(option2.cloneNode(true));
    });
    
    // تعيين القيم الافتراضية
    fromSelect.value = 'USD';
    toSelect.value = 'JPY';
    updateCurrencyDisplay('from', 'USD');
    updateCurrencyDisplay('to', 'JPY');
    
    // تحديث العرض عند تغيير العملة
    fromSelect.addEventListener('change', function() {
        const code = this.value;
        updateCurrencyDisplay('from', code);
        performConversion();
    });
    
    toSelect.addEventListener('change', function() {
        const code = this.value;
        updateCurrencyDisplay('to', code);
        performConversion();
    });
    
    // زر التبديل
    document.getElementById('swap-currencies').addEventListener('click', swapCurrencies);
    
    // زر التحويل
    document.getElementById('convert-btn').addEventListener('click', performConversion);
    
    // إدخال المبلغ يدوياً
    const fromAmount = document.getElementById('from-amount');
    fromAmount.addEventListener('click', function() {
        const newAmount = prompt('أدخل المبلغ:', this.textContent.replace(/,/g, ''));
        if (newAmount && !isNaN(newAmount) && parseFloat(newAmount) > 0) {
            this.textContent = formatNumber(parseFloat(newAmount));
            performConversion();
        }
    });
}

// إنشاء خيار عملة
function createCurrencyOption(currency) {
    const option = document.createElement('option');
    option.value = currency.code;
    option.textContent = `${currency.code} - ${currency.name}`;
    
    // إضافة صورة الخلفية (للمتصفحات التي تدعمه)
    option.style.backgroundImage = `url('${IMAGE_BASE_URL}${currency.flag}')`;
    option.style.backgroundSize = '20px';
    option.style.backgroundRepeat = 'no-repeat';
    option.style.backgroundPosition = 'right 10px center';
    option.style.paddingRight = '35px';
    
    return option;
}

// تحديث عرض العملة
function updateCurrencyDisplay(type, code) {
    const currency = currencies.find(c => c.code === code);
    if (!currency) return;
    
    const flagElement = document.getElementById(`${type}-flag`);
    const codeElement = document.getElementById(`${type}-code`);
    
    flagElement.src = `${IMAGE_BASE_URL}${currency.flag}`;
    flagElement.alt = currency.name;
    codeElement.textContent = currency.code;
    
    // معالجة خطأ تحميل الصورة
    flagElement.onerror = function() {
        this.src = `https://flagcdn.com/w40/${getCountryCode(code)}.png`;
    };
}

// الحصول على رمز البلد من رمز العملة
function getCountryCode(currencyCode) {
    const countryMap = {
        'USD': 'us',
        'EUR': 'eu',
        'GBP': 'gb',
        'JPY': 'jp',
        'CAD': 'ca',
        'AUD': 'au',
        'CHF': 'ch',
        'CNY': 'cn',
        'SAR': 'sa',
        'AED': 'ae',
        'TRY': 'tr',
        'BRL': 'br',
        'MXN': 'mx',
        'RUB': 'ru',
        'KRW': 'kr',
        'INR': 'in',
        'ZAR': 'za',
        'HKD': 'hk',
        'MYR': 'my',
        'MAD': 'ma',
        'EGP': 'eg',
        'TND': 'tn',
        'QAR': 'qa'
    };
    
    return countryMap[currencyCode] || 'un';
}

// تبديل العملات
function swapCurrencies() {
    const fromSelect = document.getElementById('from-currency-select');
    const toSelect = document.getElementById('to-currency-select');
    
    const temp = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = temp;
    
    updateCurrencyDisplay('from', fromSelect.value);
    updateCurrencyDisplay('to', toSelect.value);
    performConversion();
    
    // تأثير للزر
    const swapBtn = document.getElementById('swap-currencies');
    swapBtn.style.transform = 'rotate(180deg)';
    setTimeout(() => {
        swapBtn.style.transform = 'rotate(0deg)';
    }, 300);
}

// تنفيذ التحويل
async function performConversion() {
    const fromAmount = parseFloat(document.getElementById('from-amount').textContent.replace(/,/g, '')) || 1000;
    const fromCurrency = document.getElementById('from-currency-select').value;
    const toCurrency = document.getElementById('to-currency-select').value;
    const toAmountElement = document.getElementById('to-amount');
    const rateInfoElement = document.getElementById('rate-info');
    
    // إظهار تحميل
    toAmountElement.textContent = '...';
    rateInfoElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحويل...';
    
    try {
        // جلب سعر الصرف
        const rate = await getExchangeRate(fromCurrency, toCurrency);
        
        if (rate) {
            const convertedAmount = fromAmount * rate;
            toAmountElement.textContent = formatNumber(convertedAmount, toCurrency);
            
            // تحديث معلومات السعر
            rateInfoElement.innerHTML = `
                <i class="fas fa-info-circle"></i>
                <span>1 ${fromCurrency} = ${formatNumber(rate, 4)} ${toCurrency}</span>
            `;
            
            // حفظ السعر في الذاكرة
            appSettings.exchangeRates[`${fromCurrency}_${toCurrency}`] = {
                rate: rate,
                timestamp: new Date().toISOString()
            };
            saveSettings();
        } else {
            throw new Error('لا يمكن الحصول على سعر الصرف');
        }
    } catch (error) {
        console.error('خطأ في التحويل:', error);
        toAmountElement.textContent = '0';
        rateInfoElement.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <span>حدث خطأ في التحويل</span>
        `;
    }
}

// جلب سعر الصرف من API
async function getExchangeRate(from, to) {
    // إذا كان نفس العملة
    if (from === to) return 1;
    
    // التحقق من الذاكرة المؤقتة
    const cacheKey = `${from}_${to}`;
    const cached = appSettings.exchangeRates[cacheKey];
    
    if (cached) {
        const cacheTime = new Date(cached.timestamp);
        const now = new Date();
        const hoursDiff = (now - cacheTime) / (1000 * 60 * 60);
        
        // استخدام البيانات المخزنة إذا كانت أقل من ساعة
        if (hoursDiff < 1) {
            return cached.rate;
        }
    }
    
    // جلب سعر جديد من API
    try {
        const response = await fetch(
            `https://api.twelvedata.com/exchange_rate?symbol=${from}/${to}&apikey=${API_KEY}`
        );
        
        if (!response.ok) throw new Error('خطأ في API');
        
        const data = await response.json();
        
        if (data.rate) {
            return parseFloat(data.rate);
        } else {
            // محاولة الاتجاه المعاكس
            const reverseResponse = await fetch(
                `https://api.twelvedata.com/exchange_rate?symbol=${to}/${from}&apikey=${API_KEY}`
            );
            
            if (reverseResponse.ok) {
                const reverseData = await reverseResponse.json();
                if (reverseData.rate) {
                    return 1 / parseFloat(reverseData.rate);
                }
            }
        }
    } catch (error) {
        console.error('خطأ في جلب سعر الصرف:', error);
        // استخدام بيانات افتراضية للاختبار
        return getMockRate(from, to);
    }
    
    return null;
}

// سعر افتراضي للاختبار (في حالة فشل API)
function getMockRate(from, to) {
    const mockRates = {
        'USD_EUR': 0.93,
        'USD_JPY': 150.5,
        'USD_GBP': 0.79,
        'USD_CAD': 1.35,
        'USD_AUD': 1.52,
        'EUR_USD': 1.07,
        'EUR_JPY': 161.0,
        'EUR_GBP': 0.85,
        'JPY_USD': 0.0066,
        'JPY_EUR': 0.0062,
        'GBP_USD': 1.26,
        'GBP_EUR': 1.18,
        'GBP_JPY': 190.0
    };
    
    return mockRates[`${from}_${to}`] || 1;
}

// تهيئة صفحة الأسعار
async function initRates() {
    const searchInput = document.getElementById('search-input');
    const ratesList = document.getElementById('rates-list');
    
    // البحث
    searchInput.addEventListener('input', function() {
        updateRatesDisplay(this.value.trim().toLowerCase());
    });
    
    // تحديث العرض الأولي
    await updateRatesDisplay();
}

// تحديث عرض الأسعار
async function updateRatesDisplay(searchTerm = '') {
    const ratesList = document.getElementById('rates-list');
    
    // إظهار تحميل
    ratesList.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>جاري تحميل الأسعار...</p>
        </div>
    `;
    
    try {
        // جلب الأسعار الحية
        const rates = await fetchAllRates('USD');
        
        // تصفية العملات حسب البحث
        const filteredCurrencies = currencies.filter(currency => {
            if (currency.code === 'USD') return false;
            if (!searchTerm) return true;
            
            return currency.name.includes(searchTerm) || 
                   currency.code.toLowerCase().includes(searchTerm);
        });
        
        // إنشاء قائمة الأسعار
        ratesList.innerHTML = '';
        
        if (filteredCurrencies.length === 0) {
            ratesList.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-search"></i>
                    <p>لا توجد عملات مطابقة للبحث</p>
                </div>
            `;
            return;
        }
        
        filteredCurrencies.forEach(currency => {
            const rateItem = createRateItem(currency, rates[currency.code]);
            ratesList.appendChild(rateItem);
        });
        
    } catch (error) {
        console.error('خطأ في عرض الأسعار:', error);
        ratesList.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>حدث خطأ في تحميل الأسعار</p>
                <small>${error.message}</small>
            </div>
        `;
    }
}

// جلب جميع الأسعار
async function fetchAllRates(baseCurrency = 'USD') {
    const rates = {};
    
    // العملات المطلوبة
    const targetCurrencies = currencies.filter(c => c.code !== baseCurrency);
    
    // جلب الأسعار على دفعات
    for (let i = 0; i < targetCurrencies.length; i += 3) {
        const batch = targetCurrencies.slice(i, i + 3);
        
        await Promise.all(batch.map(async (currency) => {
            try {
                const rate = await getExchangeRate(baseCurrency, currency.code);
                if (rate) {
                    rates[currency.code] = rate;
                }
            } catch (error) {
                console.error(`خطأ في جلب سعر ${currency.code}:`, error);
            }
        }));
        
        // تأخير بين الدفعات
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    return rates;
}

// إنشاء عنصر سعر
function createRateItem(currency, rate) {
    const div = document.createElement('div');
    div.className = 'rate-item';
    
    // صورة العلم
    const flagImg = document.createElement('img');
    flagImg.className = 'rate-flag';
    flagImg.src = `${IMAGE_BASE_URL}${currency.icon || currency.flag}`;
    flagImg.alt = currency.name;
    flagImg.onerror = function() {
        this.src = `https://flagcdn.com/w40/${getCountryCode(currency.code)}.png`;
    };
    
    // معلومات السعر
    const infoDiv = document.createElement('div');
    infoDiv.className = 'rate-info-content';
    
    const pairSpan = document.createElement('div');
    pairSpan.className = 'rate-pair';
    pairSpan.textContent = `USD إلى ${currency.code}`;
    
    const valueSpan = document.createElement('div');
    valueSpan.className = 'rate-value';
    valueSpan.textContent = rate ? formatNumber(rate, 4) : 'N/A';
    
    const dateSpan = document.createElement('div');
    dateSpan.className = 'rate-date';
    dateSpan.textContent = 'سعر الصرف الحالي';
    
    infoDiv.appendChild(pairSpan);
    infoDiv.appendChild(valueSpan);
    infoDiv.appendChild(dateSpan);
    
    // تجميع العناصر
    div.appendChild(flagImg);
    div.appendChild(infoDiv);
    
    // إضافة تفاعل النقر
    div.addEventListener('click', function() {
        setConverterCurrencies('USD', currency.code);
        document.querySelector('[data-page="convert"]').click();
    });
    
    return div;
}

// تعيين العملات في المحول
function setConverterCurrencies(from, to) {
    const fromSelect = document.getElementById('from-currency-select');
    const toSelect = document.getElementById('to-currency-select');
    
    fromSelect.value = from;
    toSelect.value = to;
    
    updateCurrencyDisplay('from', from);
    updateCurrencyDisplay('to', to);
    performConversion();
}

// تهيئة صفحة الإعدادات
function initSettings() {
    // أزرار الوضع المظلم
    document.querySelectorAll('.toggle-option').forEach(btn => {
        btn.addEventListener('click', function() {
            const mode = this.dataset.mode;
            applyDarkMode(mode);
            saveSettings();
        });
    });
    
    // تحديث حالة الأزرار
    updateToggleButtons(appSettings.darkMode);
    
    // زر تحديث الأسعار
    document.getElementById('refresh-rates').addEventListener('click', async function() {
        const btn = this;
        const originalText = btn.innerHTML;
        
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحديث...';
        btn.disabled = true;
        
        try {
            await fetchLiveRates();
            btn.innerHTML = '<i class="fas fa-check"></i> تم التحديث!';
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }, 2000);
        } catch (error) {
            btn.innerHTML = '<i class="fas fa-times"></i> فشل التحديث';
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }, 2000);
        }
    });
    
    // أزرار الإعدادات
    document.querySelectorAll('.setting-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const text = this.querySelector('span').textContent;
            
            if (text.includes('تقييم')) {
                alert('شكراً لك! سيتم فتح صفحة التقييم قريباً.');
            } else if (text.includes('الشروط')) {
                alert('سيتم فتح صفحة الشروط والخصوصية.');
            }
        });
    });
    
    // تحديث وقت التحديث الأخير
    updateLastUpdate();
}

// جلب الأسعار الحية
async function fetchLiveRates() {
    try {
        const rates = await fetchAllRates('USD');
        appSettings.exchangeRates = {};
        
        // حفظ الأسعار
        Object.keys(rates).forEach(toCurrency => {
            appSettings.exchangeRates[`USD_${toCurrency}`] = {
                rate: rates[toCurrency],
                timestamp: new Date().toISOString()
            };
        });
        
        appSettings.lastUpdate = new Date().toISOString();
        saveSettings();
        
        // تحديث العرض
        await updateRatesDisplay();
        updateLastUpdate();
        
        return rates;
    } catch (error) {
        console.error('خطأ في جلب الأسعار الحية:', error);
        throw error;
    }
}

// تحديث وقت التحديث الأخير
function updateLastUpdate() {
    const lastUpdateElement = document.getElementById('last-update');
    
    if (appSettings.lastUpdate) {
        const date = new Date(appSettings.lastUpdate);
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        
        lastUpdateElement.textContent = `آخر تحديث: ${date.toLocaleDateString('ar-SA', options)}`;
    } else {
        lastUpdateElement.textContent = 'لم يتم تحديث الأسعار بعد';
    }
}

// تنسيق الأرقام
function formatNumber(number, decimalPlaces = 2) {
    if (isNaN(number)) return '0';
    
    return number.toLocaleString('en-US', {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces
    });
}

// تحديث شاشة التحويل عند فتح التطبيق
window.addEventListener('load', function() {
    setTimeout(performConversion, 1000);
});

// دعم وضع عدم الاتصال
window.addEventListener('online', function() {
    fetchLiveRates();
});

window.addEventListener('offline', function() {
    document.querySelectorAll('.rate-info').forEach(el => {
        if (!el.innerHTML.includes('غير متصل')) {
            el.innerHTML = '<i class="fas fa-wifi-slash"></i> <span>وضع عدم الاتصال - استخدام البيانات المحفوظة</span>';
        }
    });
});

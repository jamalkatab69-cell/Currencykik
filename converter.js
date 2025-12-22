// تهيئة صفحة الأسعار
function initializeRates() {
    const searchInput = document.getElementById('search-currency');
    const ratesList = document.getElementById('rates-list');
    
    // البحث
    searchInput.addEventListener('input', function() {
        updateRatesDisplay(this.value.toLowerCase());
    });
    
    // تحديث قائمة الأسعار
    updateRatesDisplay();
}

// تحديث عرض الأسعار
async function updateRatesDisplay(searchTerm = '') {
    const ratesList = document.getElementById('rates-list');
    ratesList.innerHTML = '<div class="loading">جاري تحميل الأسعار...</div>';
    
    try {
        const baseCurrency = appSettings.baseCurrency || 'USD';
        const rates = await getAllExchangeRates(baseCurrency);
        
        if (rates && Object.keys(rates).length > 0) {
            displayRatesList(rates, searchTerm);
            
            // تحديث وقت التحديث
            appSettings.lastUpdate = new Date().toISOString();
            localStorage.setItem('currencyAppSettings', JSON.stringify(appSettings));
            updateLastUpdateDisplay();
        } else {
            ratesList.innerHTML = '<div class="error">لا يمكن جلب الأسعار حالياً</div>';
        }
    } catch (error) {
        console.error('خطأ في جلب الأسعار:', error);
        ratesList.innerHTML = '<div class="error">حدث خطأ في الاتصال</div>';
    }
}

// جلب جميع أسعار الصرف
async function getAllExchangeRates(baseCurrency) {
    const apiKey = 'b83fce53976843bbb59336c03f9a6a30';
    const rates = {};
    
    // جلب سعر أساسي لكل عملة
    const currencyCodes = currencies.map(c => c.code).filter(code => code !== baseCurrency);
    
    // جلب دفعات صغيرة لتجنب حدود API
    const batchSize = 5;
    for (let i = 0; i < currencyCodes.length; i += batchSize) {
        const batch = currencyCodes.slice(i, i + batchSize);
        
        await Promise.all(batch.map(async (currency) => {
            const url = `https://api.twelvedata.com/exchange_rate?symbol=${baseCurrency}/${currency}&apikey=${apiKey}`;
            
            try {
                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json();
                    if (data.rate) {
                        rates[currency] = {
                            rate: parseFloat(data.rate),
                            name: currencies.find(c => c.code === currency)?.name || currency
                        };
                    }
                }
            } catch (error) {
                console.error(`خطأ في جلب سعر ${currency}:`, error);
            }
        }));
        
        // تأخير بسيط بين الدفعات
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return rates;
}

// عرض قائمة الأسعار
function displayRatesList(rates, searchTerm = '') {
    const ratesList = document.getElementById('rates-list');
    ratesList.innerHTML = '';
    
    const filteredCurrencies = currencies.filter(currency => {
        if (currency.code === appSettings.baseCurrency) return false;
        
        if (searchTerm) {
            return currency.name.toLowerCase().includes(searchTerm) ||
                   currency.code.toLowerCase().includes(searchTerm);
        }
        return true;
    });
    
    if (filteredCurrencies.length === 0) {
        ratesList.innerHTML = '<div class="error">لا توجد عملات مطابقة للبحث</div>';
        return;
    }
    
    filteredCurrencies.forEach(currency => {
        const rateData = rates[currency.code];
        
        const rateItem = document.createElement('div');
        rateItem.className = 'rate-item';
        
        const currencyInfo = document.createElement('div');
        currencyInfo.className = 'currency-info';
        
        const iconImg = document.createElement('img');
        iconImg.className = 'currency-icon';
        iconImg.src = `${IMAGE_BASE_URL}${currency.icon || currency.flag}`;
        iconImg.alt = currency.code;
        iconImg.onerror = function() {
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiMyZDhjZmYiLz4KPHBhdGggZD0iTTIwIDEwVjMwTTMwIDIwSDEwIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+';
        };
        
        const textInfo = document.createElement('div');
        textInfo.innerHTML = `
            <div class="currency-name">${currency.name}</div>
            <div class="currency-code">${currency.code}</div>
        `;
        
        currencyInfo.appendChild(iconImg);
        currencyInfo.appendChild(textInfo);
        
        const currencyValue = document.createElement('div');
        currencyValue.className = 'currency-value';
        
        if (rateData) {
            currencyValue.textContent = rateData.rate.toFixed(4);
        } else {
            currencyValue.textContent = 'N/A';
            currencyValue.style.color = '#999';
        }
        
        rateItem.appendChild(currencyInfo);
        rateItem.appendChild(currencyValue);
        ratesList.appendChild(rateItem);
    });
}

import { CurrencyAPI } from './api.js';
import { Store } from './store.js';
import { UI } from './ui.js';

const currencyMap = {
    "USD": "101-currency-usd.png", "EUR": "100-currency-eur.png",
    "GBP": "102-currency-gbp.png", "SAR": "121-currency-sar.png",
    "JPY": "113-currency-jpy.png" // أكمل القائمة بالأسماء التي لديك
};

async function initApp() {
    const symbols = Object.keys(currencyMap);
    let ratesData;

    if (Store.isCacheOld()) {
        UI.updateStatus("Updating rates...");
        const liveData = await CurrencyAPI.getAllRates(symbols);
        if (liveData) {
            ratesData = liveData;
            Store.saveRates(liveData);
        }
    } else {
        ratesData = Store.getSavedRates().data;
        UI.updateStatus("Using cached rates");
    }

    setupEventListeners(ratesData);
}

function setupEventListeners(rates) {
    const convertBtn = document.getElementById('convert-btn');
    // هنا نضع منطق الحساب الرياضي باستخدام البيانات من 'rates'
}

document.addEventListener('DOMContentLoaded', initApp);

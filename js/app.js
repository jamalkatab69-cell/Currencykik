import { CONFIG } from './config.js';
import { API } from './api.js';
import { Storage } from './storage.js';
import { Converter } from './converter.js';
import { UIManager } from './ui-manager.js';
import { Navigation } from './navigation.js';
import { Events } from './events.js';
import { ThemeEngine } from './theme-engine.js';

let currentRates = {};

async function init() {
    ThemeEngine.init();
    Navigation.init();
    
    // 1. تعبئة القوائم المنسدلة
    const fromSelect = document.getElementById('from-currency');
    const toSelect = document.getElementById('to-currency');
    Object.keys(CONFIG.CURRENCIES).forEach(code => {
        fromSelect.add(new Option(code, code));
        toSelect.add(new Option(code, code));
    });

    fromSelect.value = "EUR";
    toSelect.value = "USD";

    // 2. جلب البيانات (من التخزين أو الـ API)
    currentRates = Storage.getRates();
    if (!currentRates) {
        currentRates = await API.fetchBatchRates();
        if (currentRates) Storage.saveRates(currentRates);
    }

    // 3. ربط الأحداث
    Events.bindAmountInput(updateLogic);
    Events.bindCurrencyChange(updateLogic);
    Events.bindSwap(() => {
        const from = fromSelect.value;
        fromSelect.value = toSelect.value;
        toSelect.value = from;
        updateLogic();
    });

    updateLogic();
    UIManager.renderRatesList(currentRates);
}

function updateLogic() {
    const amt = document.getElementById('amount').value;
    const from = document.getElementById('from-currency').value;
    const to = document.getElementById('to-currency').value;

    const result = Converter.convert(amt, currentRates[from], currentRates[to]);
    
    UIManager.renderResult(result);
    UIManager.updateFlags(from, to);
    UIManager.updateCurrencyIcons(from, to);
    UIManager.setInfo(`1 ${from} = ${(currentRates[to]/currentRates[from]).toFixed(4)} ${to}`);
}

init();

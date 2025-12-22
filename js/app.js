import { CurrencyAPI } from './api.js';
import { Store } from './store.js';
import { UI } from './ui.js';

// خريطة العملات مع أسماء الصور على GitHub
const currencyConfig = {
    "USD": "101-currency-usd.png",
    "EUR": "100-currency-eur.png",
    "GBP": "102-currency-gbp.png",
    "JPY": "113-currency-jpy.png",
    "SAR": "121-currency-sar.png",
    "CAD": "104-currency-cad.png",
    "MAD": "118-currency-mad.png",
    "EGP": "119-currency-egp.png",
    "AED": "123-currency-aed.png"
    // أضف البقية هنا بنفس النمط
};

let currentRates = {};

async function init() {
    const symbols = Object.keys(currencyConfig);
    
    // تعبئة القوائم المنسدلة
    const fromSelect = document.getElementById('from-currency');
    const toSelect = document.getElementById('to-currency');
    
    symbols.forEach(symbol => {
        fromSelect.add(new Option(symbol, symbol));
        toSelect.add(new Option(symbol, symbol));
    });

    // قيم افتراضية
    fromSelect.value = "USD";
    toSelect.value = "JPY";

    // محاولة جلب البيانات
    if (Store.isCacheOld()) {
        const data = await CurrencyAPI.getAllRates(symbols);
        if (data) {
            // تحويل استجابة TwelveData إلى تنسيق بسيط
            symbols.forEach(s => {
                const pair = `${s}/USD`;
                currentRates[s] = s === "USD" ? 1 : parseFloat(data[pair]?.price);
            });
            Store.saveRates(currentRates);
        }
    } else {
        currentRates = Store.getSavedRates().data;
    }

    setupListeners();
    updateAll();
}

function updateAll() {
    const amount = document.getElementById('amount').value;
    const from = document.getElementById('from-currency').value;
    const to = document.getElementById('to-currency').value;

    // الحساب الرياضي: تحويل من 'From' إلى USD ثم إلى 'To'
    const rate = (1 / currentRates[from]) / (1 / currentRates[to]);
    const result = amount * rate;

    UI.renderResult(result);
    UI.updateFlag('from-flag', from, currencyConfig);
    UI.updateFlag('to-flag', to, currencyConfig);
    UI.updateStatus(`1 ${from} = ${rate.toFixed(4)} ${to}`);
}

function setupListeners() {
    document.getElementById('amount').addEventListener('input', updateAll);
    document.getElementById('from-currency').addEventListener('change', updateAll);
    document.getElementById('to-currency').addEventListener('change', updateAll);
    document.getElementById('swap-currencies').addEventListener('click', () => {
        const from = document.getElementById('from-currency');
        const to = document.getElementById('to-currency');
        [from.value, to.value] = [to.value, from.value];
        updateAll();
    });
}

document.addEventListener('DOMContentLoaded', init);

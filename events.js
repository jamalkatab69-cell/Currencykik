import { UIManager } from './ui-manager.js';

export const Events = {
    bindAmountInput(callback) {
        document.getElementById('amount').addEventListener('input', callback);
    },
    bindCurrencyChange(callback) {
        document.getElementById('from-currency').addEventListener('change', callback);
        document.getElementById('to-currency').addEventListener('change', callback);
    },
    bindSwap(callback) {
        document.getElementById('swap-currencies').addEventListener('click', callback);
    }
};

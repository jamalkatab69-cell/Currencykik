import { CONFIG } from './config.js';
import { Formatters } from './formatters.js';

export const UIManager = {
    // 1. تحديث صور الأعلام في حقول الإدخال
    updateFlags(fromCode, toCode) {
        const fromImg = document.getElementById('from-flag');
        const toImg = document.getElementById('to-flag');
        
        // استخدام رابط GitHub المباشر للصور العادية
        fromImg.src = `${CONFIG.IMG_URL}${CONFIG.CURRENCIES[fromCode].flag}`;
        toImg.src = `${CONFIG.IMG_URL}${CONFIG.CURRENCIES[toCode].flag}`;
    },

    // 2. تحديث صور العملات الكبيرة (التي تنتهي بـ x.png) في الواجهة
    updateCurrencyIcons(fromCode, toCode) {
        const fromIconX = document.getElementById('from-icon-x');
        const toIconX = document.getElementById('to-icon-x');
        
        if(fromIconX) fromIconX.src = `${CONFIG.IMG_URL}${CONFIG.CURRENCIES[fromCode].icon}`;
        if(toIconX) toIconX.src = `${CONFIG.IMG_URL}${CONFIG.CURRENCIES[toCode].icon}`;
    },

    renderResult(value) {
        document.getElementById('result').value = Formatters.money(value);
    },

    // بناء قائمة الأسعار الحية مع الصور (مثل الصورة التي أرفقتها)
    renderRatesList(rates) {
        const container = document.getElementById('rates-container');
        if (!container) return;
        container.innerHTML = ''; 

        Object.keys(CONFIG.CURRENCIES).forEach(code => {
            const rate = (1 / rates[code]).toFixed(4);
            const item = document.createElement('div');
            item.className = 'rate-item';
            item.innerHTML = `
                <div class="rate-left">
                    <img src="${CONFIG.IMG_URL}${CONFIG.CURRENCIES[code].icon}" class="currency-icon-x">
                    <span>${code} / USD</span>
                </div>
                <div class="rate-right">
                    <span class="price">${rate}</span>
                </div>
            `;
            container.appendChild(item);
        });
    }
};

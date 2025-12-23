import { CONFIG, getCurrencyInfo } from './config.js';
import { getCacheInfo, fetchAllRates, getExchangeRate } from './converter.js';
import storageManager from './storage.js';

// عرض الأسعار المفضلة
export async function updateRatesDisplay() {
    const ratesContainer = document.getElementById('ratesContainer');
    
    if (!ratesContainer) return;
    
    ratesContainer.innerHTML = '<div class="loading">جاري تحميل الأسعار...</div>';
    
    try {
        // تحديث الأسعار أولاً
        await fetchAllRates();
        const cacheInfo = getCacheInfo();
        const rates = cacheInfo.data;
        
        ratesContainer.innerHTML = '';
        
        if (CONFIG.FAVORITE_PAIRS.length === 0) {
            ratesContainer.innerHTML = `
                <div class="no-favorites">
                    <div style="font-size: 48px; margin-bottom: 16px;">📊</div>
                    <div>لا توجد عملات مفضلة</div>
                    <div style="margin-top: 8px; font-size: 14px; color: var(--text-secondary);">
                        اضغط + لإضافة عملات
                    </div>
                </div>
            `;
            return;
        }
        
        // إنشاء بطاقات للأسعار المفضلة
        for (const pair of CONFIG.FAVORITE_PAIRS) {
            const rateCard = await createRateCard(pair.from, pair.to, rates);
            ratesContainer.appendChild(rateCard);
        }
        
    } catch (error) {
        console.error('خطأ في عرض الأسعار:', error);
        ratesContainer.innerHTML = '<div class="error">فشل تحميل الأسعار</div>';
    }
}

// إنشاء بطاقة سعر (كما في الصورة الثالثة)
async function createRateCard(from, to, rates) {
    const card = document.createElement('div');
    card.className = 'rate-card';
    
    // الحصول على السعر
    let rateValue = rates && rates[from] && rates[from][to] ? rates[from][to] : null;
    
    if (!rateValue) {
        rateValue = await getExchangeRate(from, to);
    }
    
    const rate = rateValue ? rateValue.toFixed(4) : 'N/A';
    
    // الحصول على صور العملات
    const fromIcon = await storageManager.cacheImage(
        `https://raw.githubusercontent.com/jamalkatabeuro-sketch/My-website/main/${getCurrencyInfo(from)?.icon || '101-currency-usd.png'}`,
        from
    );
    
    const toIcon = await storageManager.cacheImage(
        `https://raw.githubusercontent.com/jamalkatabeuro-sketch/My-website/main/${getCurrencyInfo(to)?.icon || '101-currency-usd.png'}`,
        to
    );
    
    // إنشاء شارت صغير
    const chartSVG = generateMiniChart();
    
    card.innerHTML = `
        <div class="rate-card-main">
            <div class="rate-card-icons">
                <img src="${fromIcon}" alt="${from}" class="rate-currency-icon">
                <img src="${toIcon}" alt="${to}" class="rate-currency-icon">
            </div>
            <div class="rate-card-content">
                <div class="rate-card-value">
                    <span class="rate-from">${from}</span>
                    <span class="rate-equals"> = </span>
                    <span class="rate-amount">${rate}</span>
                    <span class="rate-to"> ${to}</span>
                </div>
            </div>
        </div>
        <div class="rate-card-chart">
            ${chartSVG}
        </div>
        <button class="remove-favorite-btn" data-from="${from}" data-to="${to}" title="إزالة من المفضلة">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2"/>
            </svg>
        </button>
    `;
    
    // إضافة حدث النقر للانتقال لصفحة التحويل
    card.onclick = (e) => {
        if (e.target.closest('.remove-favorite-btn')) return;
        
        const currency1Select = document.getElementById('currency1');
        const currency2Select = document.getElementById('currency2');
        
        if (currency1Select && currency2Select) {
            currency1Select.value = from;
            currency2Select.value = to;
            
            // تحديث الأيقونات في صفحة التحويل
            updateConvertPageIcons(from, to);
            
            // تحديث المبلغ إذا كان موجوداً
            const amount1 = document.getElementById('amount1');
            if (amount1 && amount1.value) {
                setTimeout(() => {
                    amount1.dispatchEvent(new Event('input'));
                }, 100);
            }
            
            // الانتقال لصفحة التحويل
            showPage('convert');
        }
    };
    
    // إضافة حدث الحذف
    const removeBtn = card.querySelector('.remove-favorite-btn');
    removeBtn.onclick = (e) => {
        e.stopPropagation();
        toggleFavorite(from, to);
    };
    
    return card;
}

// تحديث الأيقونات في صفحة التحويل
function updateConvertPageIcons(from, to) {
    const icon1 = document.getElementById('icon1');
    const icon2 = document.getElementById('icon2');
    
    if (icon1) {
        icon1.innerHTML = `<img src="${storageManager.getCurrencyImage(from)}" alt="${from}" class="currency-icon-img">`;
    }
    
    if (icon2) {
        icon2.innerHTML = `<img src="${storageManager.getCurrencyImage(to)}" alt="${to}" class="currency-icon-img">`;
    }
}

// توليد شارت صغير
function generateMiniChart() {
    // إنشاء خطوط عشوائية للشارت
    const points = [];
    let y = 25;
    
    for (let i = 0; i < 8; i++) {
        const x = i * 8;
        y += (Math.random() - 0.5) * 15;
        y = Math.max(5, Math.min(45, y));
        points.push(`${x},${y}`);
    }
    
    const color = Math.random() > 0.5 ? '#34c759' : '#ff3b30';
    
    return `
        <svg width="64" height="30" viewBox="0 0 64 30" style="display: block;">
            <polyline points="${points.join(' ')}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
            <circle cx="56" cy="${points[points.length-1].split(',')[1]}" r="2" fill="${color}"/>
        </svg>
    `;
}

// إضافة/إزالة من المفضلة
export function toggleFavorite(from, to) {
    const index = CONFIG.FAVORITE_PAIRS.findIndex(
        pair => pair.from === from && pair.to === to
    );
    
    if (index === -1) {
        CONFIG.FAVORITE_PAIRS.push({ from, to });
    } else {
        CONFIG.FAVORITE_PAIRS.splice(index, 1);
    }
    
    // حفظ في localStorage
    localStorage.setItem('favoritePairs', JSON.stringify(CONFIG.FAVORITE_PAIRS));
    
    // تحديث العرض
    updateRatesDisplay();
}

// تحميل المفضلات المحفوظة
export function loadFavorites() {
    try {
        const saved = localStorage.getItem('favoritePairs');
        if (saved) {
            const pairs = JSON.parse(saved);
            CONFIG.FAVORITE_PAIRS.length = 0;
            CONFIG.FAVORITE_PAIRS.push(...pairs);
        }
    } catch (error) {
        console.error('خطأ في تحميل المفضلة:', error);
    }
}

// عرض نافذة إضافة عملات
export function showAddCurrencyDialog() {
    const dialog = document.createElement('div');
    dialog.className = 'dialog-overlay';
    
    const currenciesHTML = CONFIG.CURRENCIES.map(currency => `
        <option value="${currency.code}">${currency.code} - ${currency.name}</option>
    `).join('');
    
    dialog.innerHTML = `
        <div class="dialog-content">
            <div class="dialog-header">
                <h3>إضافة عملة جديدة</h3>
                <button class="close-dialog">&times;</button>
            </div>
            <div class="dialog-body">
                <div class="currency-selection">
                    <div class="selection-group">
                        <div class="selection-label">من عملة:</div>
                        <div class="selection-input">
                            <select id="addFromCurrency" class="currency-select-dialog">
                                ${currenciesHTML}
                            </select>
                            <img src="${storageManager.getCurrencyImage(CONFIG.CURRENCIES[0].code)}" 
                                 alt="From" class="dialog-currency-icon" id="dialogIconFrom">
                        </div>
                    </div>
                    <div class="selection-group">
                        <div class="selection-label">إلى عملة:</div>
                        <div class="selection-input">
                            <select id="addToCurrency" class="currency-select-dialog">
                                ${currenciesHTML}
                            </select>
                            <img src="${storageManager.getCurrencyImage(CONFIG.CURRENCIES[1].code)}" 
                                 alt="To" class="dialog-currency-icon" id="dialogIconTo">
                        </div>
                    </div>
                </div>
                <div class="dialog-actions">
                    <button class="dialog-btn cancel-btn">إلغاء</button>
                    <button class="dialog-btn add-btn-dialog">إضافة</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(dialog);
    
    // تحديث الأيقونات
    const fromSelect = dialog.querySelector('#addFromCurrency');
    const toSelect = dialog.querySelector('#addToCurrency');
    const iconFrom = dialog.querySelector('#dialogIconFrom');
    const iconTo = dialog.querySelector('#dialogIconTo');
    
    fromSelect.addEventListener('change', async () => {
        const code = fromSelect.value;
        const iconUrl = `https://raw.githubusercontent.com/jamalkatabeuro-sketch/My-website/main/${getCurrencyInfo(code)?.icon || '101-currency-usd.png'}`;
        await storageManager.cacheImage(iconUrl, code);
        iconFrom.src = storageManager.getCurrencyImage(code);
    });
    
    toSelect.addEventListener('change', async () => {
        const code = toSelect.value;
        const iconUrl = `https://raw.githubusercontent.com/jamalkatabeuro-sketch/My-website/main/${getCurrencyInfo(code)?.icon || '101-currency-usd.png'}`;
        await storageManager.cacheImage(iconUrl, code);
        iconTo.src = storageManager.getCurrencyImage(code);
    });
    
    // إغلاق النافذة
    const closeDialog = () => {
        document.body.removeChild(dialog);
        document.removeEventListener('keydown', escapeHandler);
    };
    
    const closeBtn = dialog.querySelector('.close-dialog');
    const cancelBtn = dialog.querySelector('.cancel-btn');
    
    closeBtn.onclick = closeDialog;
    cancelBtn.onclick = closeDialog;
    
    dialog.onclick = (e) => {
        if (e.target === dialog) closeDialog();
    };
    
    // إضافة العملة
    const addBtn = dialog.querySelector('.add-btn-dialog');
    addBtn.onclick = () => {
        const from = fromSelect.value;
        const to = toSelect.value;
        
        if (from && to && from !== to) {
            const exists = CONFIG.FAVORITE_PAIRS.some(
                pair => pair.from === from && pair.to === to
            );
            
            if (!exists) {
                toggleFavorite(from, to);
                closeDialog();
            } else {
                alert('هذه العملة موجودة بالفعل في المفضلة!');
            }
        } else {
            alert('الرجاء اختيار عملتين مختلفتين');
        }
    };
    
    // حدث Escape
    const escapeHandler = (e) => {
        if (e.key === 'Escape') closeDialog();
    };
    document.addEventListener('keydown', escapeHandler);
}

// عرض نافذة حذف عملات
export function showDeleteCurrencyDialog() {
    if (CONFIG.FAVORITE_PAIRS.length === 0) {
        alert('لا توجد عملات مفضلة للحذف');
        return;
    }
    
    const dialog = document.createElement('div');
    dialog.className = 'dialog-overlay';
    
    dialog.innerHTML = `
        <div class="dialog-content">
            <div class="dialog-header">
                <h3>إدارة المفضلة</h3>
                <button class="close-dialog">&times;</button>
            </div>
            <div class="dialog-body">
                <div style="color: var(--text-secondary); margin-bottom: 20px; font-size: 14px;">
                    اضغط على أيقونة X لحذف عملة معينة
                </div>
                <div class="dialog-actions">
                    <button class="dialog-btn cancel-btn">إغلاق</button>
                    <button class="dialog-btn delete-all-btn">حذف الكل</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(dialog);
    
    const closeDialog = () => {
        document.body.removeChild(dialog);
        document.removeEventListener('keydown', escapeHandler);
    };
    
    const closeBtn = dialog.querySelector('.close-dialog');
    const cancelBtn = dialog.querySelector('.cancel-btn');
    
    closeBtn.onclick = closeDialog;
    cancelBtn.onclick = closeDialog;
    
    dialog.onclick = (e) => {
        if (e.target === dialog) closeDialog();
    };
    
    // حذف الكل
    const deleteAllBtn = dialog.querySelector('.delete-all-btn');
    deleteAllBtn.onclick = () => {
        if (confirm('هل تريد حذف جميع العملات المفضلة؟')) {
            CONFIG.FAVORITE_PAIRS.length = 0;
            localStorage.setItem('favoritePairs', JSON.stringify(CONFIG.FAVORITE_PAIRS));
            updateRatesDisplay();
            closeDialog();
        }
    };
    
    // حدث Escape
    const escapeHandler = (e) => {
        if (e.key === 'Escape') closeDialog();
    };
    document.addEventListener('keydown', escapeHandler);
}

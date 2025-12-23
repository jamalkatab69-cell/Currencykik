import { CONFIG, getCurrencyInfo, getCurrencyIcon } from './config.js';
import { getCacheInfo, fetchAllRates } from './converter.js';

// عرض الأسعار المفضلة
export async function updateRatesDisplay() {
    const ratesContainer = document.getElementById('ratesContainer');
    const refreshBtn = document.getElementById('refreshRatesBtn');
    
    if (!ratesContainer) return;
    
    // عرض مؤشر التحميل
    ratesContainer.innerHTML = '<div class="loading">جاري تحميل الأسعار...</div>';
    
    try {
        const cacheInfo = getCacheInfo();
        let rates = cacheInfo.data;
        
        // إذا لم يكن هناك كاش أو انتهت صلاحيته، جلب أسعار جديدة
        if (!cacheInfo.hasCache || !cacheInfo.isValid) {
            const result = await fetchAllRates();
            if (result.success) {
                rates = result.rates;
            }
        }
        
        // عرض الأسعار
        ratesContainer.innerHTML = '';
        
        if (CONFIG.FAVORITE_PAIRS.length === 0) {
            ratesContainer.innerHTML = '<div class="no-favorites">لا توجد عملات مفضلة. اضغط + لإضافة عملات.</div>';
            return;
        }
        
        // قسم المفضلات
        const favoritesSection = document.createElement('div');
        favoritesSection.className = 'rates-section';
        favoritesSection.innerHTML = '<h3 class="section-title">Favourites</h3>';
        
        CONFIG.FAVORITE_PAIRS.forEach(pair => {
            const rateCard = createRateCard(pair.from, pair.to, rates);
            favoritesSection.appendChild(rateCard);
        });
        
        ratesContainer.appendChild(favoritesSection);
        
        // إضافة حدث لزر التحديث
        if (refreshBtn) {
            refreshBtn.onclick = async () => {
                refreshBtn.disabled = true;
                refreshBtn.textContent = 'جاري التحديث...';
                await updateRatesDisplay();
                refreshBtn.disabled = false;
                refreshBtn.textContent = 'تحديث';
            };
        }
        
    } catch (error) {
        console.error('Error updating rates display:', error);
        ratesContainer.innerHTML = '<div class="error">فشل تحميل الأسعار</div>';
    }
}

// إنشاء بطاقة سعر
function createRateCard(from, to, rates) {
    const card = document.createElement('div');
    card.className = 'rate-card';
    
    const fromInfo = getCurrencyInfo(from);
    const toInfo = getCurrencyInfo(to);
    
    // الحصول على السعر
    let rate = 'N/A';
    let rateValue = null;
    
    if (rates && rates[from] && rates[from][to]) {
        rateValue = rates[from][to];
        rate = rateValue.toFixed(4);
    }
    
    // حساب الاتجاه (صعود/هبوط) - مبسط
    const trend = Math.random() > 0.5 ? 'up' : 'down';
    const trendIcon = trend === 'up' ? '↗' : '↘';
    const trendClass = trend === 'up' ? 'trend-up' : 'trend-down';
    
    card.innerHTML = `
        <div class="rate-card-header">
            <div class="currency-pair">
                <span class="currency-icon-small">
                    <img src="${getCurrencyIcon(from)}" alt="${from}">
                </span>
                <span class="currency-icon-small">
                    <img src="${getCurrencyIcon(to)}" alt="${to}">
                </span>
            </div>
            <div class="rate-trend ${trendClass}">
                <svg width="60" height="30" class="mini-chart">
                    ${generateMiniChart(trend)}
                </svg>
            </div>
        </div>
        <div class="rate-card-body">
            <div class="currency-code">${from} / ${to}</div>
            <div class="rate-value">1 ${from} = ${rate} ${to}</div>
        </div>
        <div class="rate-card-actions">
            <button class="remove-favorite-btn" data-from="${from}" data-to="${to}" title="إزالة من المفضلة">×</button>
        </div>
    `;
    
    // إضافة حدث النقر للانتقال لصفحة التحويل
    card.onclick = (e) => {
        // منع النقر إذا كان على زر الحذف
        if (e.target.closest('.remove-favorite-btn')) return;
        
        // تعيين العملات في صفحة التحويل
        const currency1Select = document.getElementById('currency1');
        const currency2Select = document.getElementById('currency2');
        
        if (currency1Select && currency2Select) {
            currency1Select.value = from;
            currency2Select.value = to;
            
            // تحديث الأيقونات
            const icon1 = document.getElementById('icon1');
            const icon2 = document.getElementById('icon2');
            if (icon1) icon1.innerHTML = `<img src="${getCurrencyIcon(from)}" alt="${from}" class="currency-icon-img">`;
            if (icon2) icon2.innerHTML = `<img src="${getCurrencyIcon(to)}" alt="${to}" class="currency-icon-img">`;
            
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

// توليد رسم بياني صغير
function generateMiniChart(trend) {
    // نقاط عشوائية للرسم البياني
    const points = [];
    let y = 15;
    
    for (let i = 0; i < 10; i++) {
        const x = i * 6;
        y += (Math.random() - 0.5) * 5 * (trend === 'up' ? -1 : 1);
        y = Math.max(5, Math.min(25, y));
        points.push(`${x},${y}`);
    }
    
    const color = trend === 'up' ? '#4ade80' : '#f87171';
    
    return `<polyline points="${points.join(' ')}" fill="none" stroke="${color}" stroke-width="2"/>`;
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
        console.error('Error loading favorites:', error);
    }
}

// عرض نافذة إضافة عملات
export function showAddCurrencyDialog() {
    const dialog = document.createElement('div');
    dialog.className = 'dialog-overlay';
    dialog.innerHTML = `
        <div class="dialog-content">
            <div class="dialog-header">
                <h3>إضافة عملات مفضلة</h3>
                <button class="close-dialog">&times;</button>
            </div>
            <div class="dialog-body">
                <div class="currency-selection">
                    <div class="selection-group">
                        <label>من:</label>
                        <select id="addFromCurrency" class="currency-select-dialog">
                            ${CONFIG.CURRENCIES.map(currency => 
                                `<option value="${currency.code}">${currency.code} - ${currency.name}</option>`
                            ).join('')}
                        </select>
                        <img src="${getCurrencyIcon(CONFIG.CURRENCIES[0].code)}" alt="From" class="dialog-currency-icon" id="dialogIconFrom">
                    </div>
                    <div class="selection-group">
                        <label>إلى:</label>
                        <select id="addToCurrency" class="currency-select-dialog">
                            ${CONFIG.CURRENCIES.map(currency => 
                                `<option value="${currency.code}">${currency.code} - ${currency.name}</option>`
                            ).join('')}
                        </select>
                        <img src="${getCurrencyIcon(CONFIG.CURRENCIES[1].code)}" alt="To" class="dialog-currency-icon" id="dialogIconTo">
                    </div>
                </div>
                <div class="dialog-actions">
                    <button class="dialog-btn cancel-btn">إلغاء</button>
                    <button class="dialog-btn add-btn">إضافة</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(dialog);
    
    // تحديث الأيقونات عند تغيير العملات
    const fromSelect = dialog.querySelector('#addFromCurrency');
    const toSelect = dialog.querySelector('#addToCurrency');
    const iconFrom = dialog.querySelector('#dialogIconFrom');
    const iconTo = dialog.querySelector('#dialogIconTo');
    
    fromSelect.addEventListener('change', () => {
        iconFrom.src = getCurrencyIcon(fromSelect.value);
    });
    
    toSelect.addEventListener('change', () => {
        iconTo.src = getCurrencyIcon(toSelect.value);
    });
    
    // إغلاق النافذة
    const closeBtn = dialog.querySelector('.close-dialog');
    const cancelBtn = dialog.querySelector('.cancel-btn');
    const addBtn = dialog.querySelector('.add-btn');
    
    const closeDialog = () => {
        document.body.removeChild(dialog);
    };
    
    closeBtn.onclick = closeDialog;
    cancelBtn.onclick = closeDialog;
    
    // إضافة العملة
    addBtn.onclick = () => {
        const from = fromSelect.value;
        const to = toSelect.value;
        
        if (from && to && from !== to) {
            // التحقق من عدم وجود الزوج مسبقاً
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
                <h3>حذف عملات مفضلة</h3>
                <button class="close-dialog">&times;</button>
            </div>
            <div class="dialog-body">
                <div class="delete-list">
                    ${CONFIG.FAVORITE_PAIRS.map((pair, index) => `
                        <div class="delete-item">
                            <span>
                                <img src="${getCurrencyIcon(pair.from)}" alt="${pair.from}" class="small-icon">
                                ${pair.from} → ${pair.to}
                                <img src="${getCurrencyIcon(pair.to)}" alt="${pair.to}" class="small-icon">
                            </span>
                            <button class="delete-item-btn" data-index="${index}">حذف</button>
                        </div>
                    `).join('')}
                </div>
                <div class="dialog-actions">
                    <button class="dialog-btn cancel-btn">إغلاق</button>
                    <button class="dialog-btn delete-all-btn">حذف الكل</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(dialog);
    
    // إغلاق النافذة
    const closeBtn = dialog.querySelector('.close-dialog');
    const cancelBtn = dialog.querySelector('.cancel-btn');
    const deleteAllBtn = dialog.querySelector('.delete-all-btn');
    
    const closeDialog = () => {
        document.body.removeChild(dialog);
    };
    
    closeBtn.onclick = closeDialog;
    cancelBtn.onclick = closeDialog;
    
    // حذف عنصر واحد
    const deleteButtons = dialog.querySelectorAll('.delete-item-btn');
    deleteButtons.forEach(btn => {
        btn.onclick = () => {
            const index = parseInt(btn.dataset.index);
            CONFIG.FAVORITE_PAIRS.splice(index, 1);
            localStorage.setItem('favoritePairs', JSON.stringify(CONFIG.FAVORITE_PAIRS));
            updateRatesDisplay();
            closeDialog();
        };
    });
    
    // حذف الكل
    deleteAllBtn.onclick = () => {
        if (confirm('هل أنت متأكد من حذف جميع العملات المفضلة؟')) {
            CONFIG.FAVORITE_PAIRS.length = 0;
            localStorage.setItem('favoritePairs', JSON.stringify(CONFIG.FAVORITE_PAIRS));
            updateRatesDisplay();
            closeDialog();
        }
    };
}

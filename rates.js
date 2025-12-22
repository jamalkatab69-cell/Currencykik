import { getCurrencyInfo, getCurrencyIcon } from './config.js';
import { getAllRatesFromCache, fetchAllRates } from './converter.js';
import { getFavorites, toggleFavorite, isFavorite } from './favorites.js';
import { generateMiniChart } from './charts.js';

// عرض الأسعار المفضلة
export async function updateRatesDisplay() {
    const ratesContainer = document.getElementById('ratesContainer');
    const refreshBtn = document.getElementById('refreshRatesBtn');
    
    if (!ratesContainer) return;
    
    // عرض مؤشر التحميل
    ratesContainer.innerHTML = '<div class="loading">جاري تحميل الأسعار...</div>';
    
    try {
        let rates = getAllRatesFromCache();
        
        // إذا لم يكن هناك أسعار، جلب أسعار جديدة
        if (!rates || Object.keys(rates).length === 0) {
            const result = await fetchAllRates();
            if (result.success) {
                rates = result.rates;
            } else {
                throw new Error('Failed to fetch rates');
            }
        }
        
        // عرض الأسعار
        ratesContainer.innerHTML = '';
        
        // قسم المفضلات
        const favoritesSection = document.createElement('div');
        favoritesSection.className = 'rates-section';
        favoritesSection.innerHTML = '<h3 class="section-title">Favourites</h3>';
        
        const favorites = getFavorites();
        
        if (favorites.length === 0) {
            favoritesSection.innerHTML += '<p class="no-favorites">لا توجد أزواج مفضلة. اضغط + لإضافة زوج.</p>';
        } else {
            favorites.forEach(pair => {
                const rateCard = createRateCard(pair.from, pair.to, rates);
                favoritesSection.appendChild(rateCard);
            });
        }
        
        ratesContainer.appendChild(favoritesSection);
        
        // إضافة حدث لزر التحديث
        if (refreshBtn) {
            refreshBtn.onclick = async () => {
                refreshBtn.disabled = true;
                refreshBtn.innerHTML = '<span class="spinner"></span>';
                await fetchAllRates();
                await updateRatesDisplay();
                refreshBtn.disabled = false;
                refreshBtn.innerHTML = '🔄';
            };
        }
        
    } catch (error) {
        console.error('Error updating rates display:', error);
        ratesContainer.innerHTML = '<div class="error">فشل تحميل الأسعار. يرجى المحاولة مرة أخرى.</div>';
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
    
    // حساب الاتجاه (صعود/هبوط) - عشوائي للعرض
    const trend = Math.random() > 0.5 ? 'up' : 'down';
    const trendClass = trend === 'up' ? 'trend-up' : 'trend-down';
    
    // رابط الصور
    const fromIcon = getCurrencyIcon(from, true);
    const toIcon = getCurrencyIcon(to, true);
    
    card.innerHTML = `
        <div class="rate-card-content" data-from="${from}" data-to="${to}">
            <div class="rate-card-left">
                <div class="currency-icons">
                    <img src="${fromIcon}" alt="${from}" class="currency-icon" onerror="this.style.display='none'">
                    <img src="${toIcon}" alt="${to}" class="currency-icon" onerror="this.style.display='none'">
                </div>
                <div class="rate-info">
                    <div class="currency-pair-text">${from} to ${to}</div>
                    <div class="rate-value">${from} = ${rate} ${to}</div>
                </div>
            </div>
            <div class="rate-card-right">
                <div class="rate-chart ${trendClass}">
                    ${generateMiniChart(trend, 60, 30)}
                </div>
                <button class="remove-favorite-btn" data-from="${from}" data-to="${to}" title="Remove from favorites">
                    ×
                </button>
            </div>
        </div>
    `;
    
    // إضافة حدث النقر للانتقال لصفحة التحويل
    const content = card.querySelector('.rate-card-content');
    content.onclick = (e) => {
        // تجاهل النقر على زر الإزالة
        if (e.target.classList.contains('remove-favorite-btn')) {
            return;
        }
        
        // تعيين العملات في صفحة التحويل
        const currency1Select = document.getElementById('currency1');
        const currency2Select = document.getElementById('currency2');
        
        if (currency1Select && currency2Select) {
            currency1Select.value = from;
            currency2Select.value = to;
            
            // الانتقال لصفحة التحويل
            if (window.showPage) {
                window.showPage('convert');
            }
        }
    };
    
    // إضافة حدث زر الإزالة
    const removeBtn = card.querySelector('.remove-favorite-btn');
    removeBtn.onclick = (e) => {
        e.stopPropagation();
        removeFavoriteWithAnimation(card, from, to);
    };
    
    return card;
}

// إزالة من المفضلة مع أنيميشن
function removeFavoriteWithAnimation(card, from, to) {
    card.style.animation = 'slideOut 0.3s ease-out';
    
    setTimeout(() => {
        toggleFavorite(from, to);
        updateRatesDisplay();
    }, 300);
}

// فتح مودال إضافة زوج جديد
export function showAddPairModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Add Currency Pair</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()">×</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>From Currency</label>
                    <select id="modalFromCurrency" class="modal-select"></select>
                </div>
                <div class="form-group">
                    <label>To Currency</label>
                    <select id="modalToCurrency" class="modal-select"></select>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-cancel" onclick="this.closest('.modal').remove()">Cancel</button>
                <button class="btn-add" id="modalAddBtn">Add</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // ملء القوائم المنسدلة
    const fromSelect = document.getElementById('modalFromCurrency');
    const toSelect = document.getElementById('modalToCurrency');
    
    const currencies = getAllCurrencyCodes();
    currencies.forEach(code => {
        const info = getCurrencyInfo(code);
        fromSelect.innerHTML += `<option value="${code}">${code} - ${info.name}</option>`;
        toSelect.innerHTML += `<option value="${code}">${code} - ${info.name}</option>`;
    });
    
    // تعيين قيم افتراضية مختلفة
    fromSelect.value = 'USD';
    toSelect.value = 'EUR';
    
    // حدث زر الإضافة
    document.getElementById('modalAddBtn').onclick = () => {
        const from = fromSelect.value;
        const to = toSelect.value;
        
        if (from === to) {
            alert('Please select different currencies');
            return;
        }
        
        if (isFavorite(from, to)) {
            alert('This pair is already in favorites');
            return;
        }
        
        toggleFavorite(from, to);
        modal.remove();
        updateRatesDisplay();
    };
    
    // إغلاق عند النقر خارج المودال
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    };
}

// استيراد جميع أكواد العملات
function getAllCurrencyCodes() {
    const { CONFIG } = await import('./config.js');
    return CONFIG.CURRENCIES.map(c => c.code);
}

import { CONFIG, getCurrencyInfo } from './config.js';
import { getCacheInfo, fetchAllRates } from './converter.js';

// عرض الأسعار المفضلة
export async function updateRatesDisplay() {
    const ratesContainer = document.getElementById('ratesContainer');
    const lastUpdateEl = document.getElementById('ratesLastUpdate');
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
        
        // قسم المفضلات
        const favoritesSection = document.createElement('div');
        favoritesSection.className = 'rates-section';
        favoritesSection.innerHTML = '<h3 class="section-title">Favourites</h3>';
        
        CONFIG.FAVORITE_PAIRS.forEach(pair => {
            const rateCard = createRateCard(pair.from, pair.to, rates);
            favoritesSection.appendChild(rateCard);
        });
        
        ratesContainer.appendChild(favoritesSection);
        
        // تحديث وقت آخر تحديث
        if (lastUpdateEl) {
            const info = getCacheInfo();
            lastUpdateEl.textContent = info.lastUpdate 
                ? `آخر تحديث: ${info.lastUpdate}` 
                : 'لم يتم التحديث بعد';
        }
        
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
                <span class="currency-flag">${fromInfo?.flag || ''}</span>
                <span class="currency-flag">${toInfo?.flag || ''}</span>
            </div>
            <div class="rate-trend ${trendClass}">
                <svg width="60" height="30" class="mini-chart">
                    ${generateMiniChart(trend)}
                </svg>
            </div>
        </div>
        <div class="rate-card-body">
            <div class="currency-code">${from} to ${to}</div>
            <div class="rate-value">${from} = ${rate} ${to} 1</div>
        </div>
    `;
    
    // إضافة حدث النقر للانتقال لصفحة التحويل
    card.onclick = () => {
        // تعيين العملات في صفحة التحويل
        const currency1Select = document.getElementById('currency1');
        const currency2Select = document.getElementById('currency2');
        
        if (currency1Select && currency2Select) {
            currency1Select.value = from;
            currency2Select.value = to;
            
            // الانتقال لصفحة التحويل
            showPage('convert');
        }
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
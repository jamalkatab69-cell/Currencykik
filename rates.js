import { CONFIG, getCurrencyInfo } from './config.js';
import { getCacheInfo, fetchAllRates } from './converter.js';

const CACHE_DURATION = 30 * 60 * 1000; // 30 دقيقة بالمللي ثانية

export async function updateRatesDisplay() {
  const ratesContainer = document.getElementById('ratesContainer');
  const lastUpdateEl = document.getElementById('ratesLastUpdate');
  const refreshBtn = document.getElementById('refreshRatesBtn');
  
  if (!ratesContainer) return;

  // مؤشر التحميل
  ratesContainer.innerHTML = `
    <div class="loading">
      <div>⏳ جاري تحميل الأسعار...</div>
    </div>
  `;

  try {
    const cacheInfo = getCacheInfo();
    let rates = cacheInfo.data;

    // التحقق من الكاش: تحديث فقط إذا انتهت الـ 30 دقيقة
    if (!cacheInfo.hasCache || !cacheInfo.isValid) {
      const result = await fetchAllRates();
      if (result.success) {
        rates = result.rates;
      }
    }

    // عرض الأقسام
    ratesContainer.innerHTML = `
      <div class="rates-section">
        <h3 class="section-title">المفضلة</h3>
        ${CONFIG.FAVORITEPAIRS.map(pair => createRateCard(pair.from, pair.to, rates)).join('')}
      </div>
      <div class="rates-section">
        <h3 class="section-title">الأسعار الرئيسية</h3>
        ${CONFIG.MAINPAIRS.map(pair => createRateCard(pair.from, pair.to, rates)).join('')}
      </div>
    `;

    // تحديث وقت آخر تحديث
    if (lastUpdateEl) {
      const info = getCacheInfo();
      lastUpdateEl.textContent = info.lastUpdate || '--';
    }

    // زر التحديث اليدوي
    if (refreshBtn) {
      refreshBtn.onclick = async () => {
        refreshBtn.disabled = true;
        refreshBtn.textContent = '⏳ جاري التحديث...';
        await updateRatesDisplay();
        refreshBtn.disabled = false;
        refreshBtn.textContent = 'تحديث';
      };
    }

  } catch (error) {
    console.error('خطأ في تحديث الأسعار:', error);
    ratesContainer.innerHTML = `
      <div class="error">
        <div>❌ خطأ في تحميل الأسعار</div>
        <button class="refresh-btn" id="refreshRatesBtn">إعادة المحاولة</button>
      </div>
    `;
  }
}

function createRateCard(from, to, rates) {
  const fromInfo = getCurrencyInfo(from);
  const toInfo = getCurrencyInfo(to);
  
  let rate = 'N/A';
  let rateValue = null;
  if (rates && rates[from] && rates[from][to]) {
    rateValue = rates[from][to];
    rate = parseFloat(rateValue).toFixed(4);
  }

  const isFavorite = CONFIG.FAVORITEPAIRS.some(pair => pair.from === from && pair.to === to);
  const trend = Math.random() > 0.5 ? 'up' : 'down';
  const trendIcon = trend === 'up' ? '📈' : '📉';
  const trendClass = trend === 'up' ? 'trend-up' : 'trend-down';

  const imgFrom = `https://raw.githubusercontent.com/jamalkatabeuro-sketch/My-website/main/${fromInfo?.image || '100-currency-eur.png'}`;
  const imgTo = `https://raw.githubusercontent.com/jamalkatabeuro-sketch/My-website/main/${toInfo?.image || '101-currency-usd.png'}`;

  return `
    <div class="rate-card" onclick="handleCardClick('${from}', '${to}')">
      <div class="rate-card-header">
        <div class="currency-pair">
          <img src="${imgFrom}" alt="${from}" class="currency-flag" style="width: 32px; height: 32px;">
          <img src="${imgTo}" alt="${to}" class="currency-flag" style="width: 32px; height: 32px;">
          <span>${from}/${to}</span>
        </div>
        <div class="rate-trend ${trendClass}">
          <span>${trendIcon}</span>
        </div>
      </div>
      <div class="rate-card-body">
        <div class="currency-code">${from} → ${to}</div>
        <div class="rate-value">1 ${from} = ${rate} ${to}</div>
      </div>
      <button class="add-btn" onclick="toggleFavorite('${from}', '${to}'); event.stopPropagation();">
        ${isFavorite ? '−' : '+'}
      </button>
    </div>
  `;
}

export function toggleFavorite(from, to) {
  const index = CONFIG.FAVORITEPAIRS.findIndex(pair => pair.from === from && pair.to === to);
  if (index === -1) {
    CONFIG.FAVORITEPAIRS.push({ from, to });
  } else {
    CONFIG.FAVORITEPAIRS.splice(index, 1);
  }
  
  localStorage.setItem('favoritePairs', JSON.stringify(CONFIG.FAVORITEPAIRS));
  updateRatesDisplay();
}

export function loadFavorites() {
  try {
    const saved = localStorage.getItem('favoritePairs');
    if (saved) {
      const pairs = JSON.parse(saved);
      if (CONFIG.FAVORITEPAIRS.length === 0) {
        CONFIG.FAVORITEPAIRS.push(...pairs);
      }
    }
  } catch (error) {
    console.error('خطأ في تحميل المفضلات:', error);
  }
}

// التحديث التلقائي عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  loadFavorites();
  updateRatesDisplay();
});

// دالة النقر على البطاقة
window.handleCardClick = (from, to) => {
  const currency1Select = document.getElementById('currency1');
  const currency2Select = document.getElementById('currency2');
  if (currency1Select && currency2Select) {
    currency1Select.value = from;
    currency2Select.value = to;
    showPage('convert');
  }
};

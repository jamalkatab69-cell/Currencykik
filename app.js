// app.js
import { CONFIG } from "./config.js";
import { CURRENCIES, ICONS_CONVERTER, ICONS_RATES } from "./constants.js";
import { fetchRatesBatch, fetchRate } from "./api.js";
import { formatRate, formatAmount, trendSymbol, getCurrencyIcon } from "./utils.js";

// عناصر الواجهة
const screens = {
  rates: document.getElementById("screen-rates"),
  convert: document.getElementById("screen-convert"),
  settings: document.getElementById("screen-settings"),
};
const navButtons = document.querySelectorAll(".bottom-nav .nav-btn");

const lastUpdateEl = document.getElementById("last-update");
const ratesListEl = document.getElementById("rates-list");
const ratesErrorEl = document.getElementById("rates-error");
const btnRefresh = document.getElementById("btn-refresh");

const amountInput = document.getElementById("amount-input");
const fromSelect = document.getElementById("from-select");
const toSelect = document.getElementById("to-select");
const fromIcon = document.getElementById("from-icon");
const toIcon = document.getElementById("to-icon");
const btnSwap = document.getElementById("btn-swap");
const btnConvert = document.getElementById("btn-convert");
const convertResultEl = document.getElementById("convert-result");
const convertErrorEl = document.getElementById("convert-error");
const convertHintEl = document.getElementById("convert-hint");

const themeButtons = document.querySelectorAll(".segment");

// حالة
let lastRates = {};
let prevRates = {};
let lastFetchTs = null;

// تنقل
navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    navButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    Object.values(screens).forEach(s => s.classList.remove("active"));
    screens[btn.dataset.target].classList.add("active");
  });
});

// ثيم
(function initTheme() {
  const saved = localStorage.getItem("themeMode") || "auto";
  applyTheme(saved);
  themeButtons.forEach(b => {
    b.classList.toggle("active", b.dataset.theme === saved);
    b.addEventListener("click", () => {
      themeButtons.forEach(x => x.classList.remove("active"));
      b.classList.add("active");
      applyTheme(b.dataset.theme);
      localStorage.setItem("themeMode", b.dataset.theme);
    });
  });
})();
function applyTheme(mode) {
  document.body.classList.remove("light");
  if (mode === "off") document.body.classList.add("light");
  if (mode === "auto") {
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    if (prefersLight) document.body.classList.add("light");
  }
}

// إعداد قوائم العملات
function populateCurrencySelects() {
  const opts = CURRENCIES.map(c => `<option value="${c}">${c}</option>`).join("");
  fromSelect.innerHTML = opts;
  toSelect.innerHTML = opts;
  fromSelect.value = "USD";
  toSelect.value = "JPY";
  updateCurrencyIcons();
}
function updateCurrencyIcons() {
  fromIcon.src = getCurrencyIcon(fromSelect.value, ICONS_CONVERTER, CONFIG.ICON_BASE);
  toIcon.src = getCurrencyIcon(toSelect.value, ICONS_CONVERTER, CONFIG.ICON_BASE);
}
fromSelect.addEventListener("change", updateCurrencyIcons);
toSelect.addEventListener("change", updateCurrencyIcons);
btnSwap.addEventListener("click", () => {
  const tmp = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = tmp;
  updateCurrencyIcons();
});

// بناء الأزواج المرئية (مثل الواجهة التي أرسلتها)
function buildRateSymbols() {
  return [
    "EUR/USD","USD/EUR",
    "SAR/USD","USD/SAR",
    "USD/CAD","USD/GBP",
    "USD/CHF","USD/AUD",
    "USD/JPY","USD/KRW",
    "USD/BRL","USD/MXN",
    "USD/TRY","USD/CNY",
    "USD/MYR","USD/RUB",
    "USD/MAD","USD/EGP",
    "USD/TND","USD/QAR",
    "USD/AED"
  ];
}

// جلب الأسعار دفعة واحدة
async function fetchRatesNow() {
  try {
    ratesErrorEl.classList.add("hidden");
    const symbols = buildRateSymbols();
    const data = await fetchRatesBatch(symbols);

    prevRates = { ...lastRates };
    lastRates = {};
    symbols.forEach(sym => {
      const item = data[sym];
      if (item && item.rate) {
        lastRates[sym] = parseFloat(item.rate);
      }
    });

    lastFetchTs = new Date();
    updateLastUpdateText();
    renderRates();
  } catch (e) {
    ratesErrorEl.textContent = "حدث خطأ أثناء جلب الأسعار. تأكد من المفتاح والاتصال.";
    ratesErrorEl.classList.remove("hidden");
  }
}
btnRefresh.addEventListener("click", fetchRatesNow);

function updateLastUpdateText() {
  if (!lastFetchTs) {
    lastUpdateEl.textContent = "جارِ التحديث...";
    return;
  }
  const hh = String(lastFetchTs.getHours()).padStart(2, "0");
  const mm = String(lastFetchTs.getMinutes()).padStart(2, "0");
  lastUpdateEl.textContent = `آخر تحديث: ${hh}:${mm}`;
}

// عرض البطاقات
function renderRates() {
  ratesListEl.innerHTML = "";
  const entries = Object.entries(lastRates);
  if (entries.length === 0) {
    ratesListEl.innerHTML = `<div class="subtext">لا توجد بيانات متاحة حالياً.</div>`;
    return;
  }
  entries.forEach(([sym, rate]) => {
    const [base, quote] = sym.split("/");
    const iconName =
      ICONS_RATES[quote] || ICONS_RATES[base] ||
      ICONS_CONVERTER[quote] || ICONS_CONVERTER[base];
    const iconUrl = CONFIG.ICON_BASE + iconName;

    const prev = prevRates[sym];
    let trend = "";
    if (typeof prev === "number") {
      trend = rate > prev ? "up" : rate < prev ? "down" : "";
    }

    const card = document.createElement("div");
    card.className = "rate-card";
    card.innerHTML = `
      <div class="rate-left">
        <img src="${iconUrl}" alt="${quote}" class="rate-icon" loading="lazy" />
        <div>
          <div class="rate-title">${base} → ${quote}</div>
          <div class="rate-sub">سعر السوق المتوسط</div>
        </div>
      </div>
      <div class="rate-value">${formatRate(rate)}</div>
      <div class="rate-trend ${trend}">${trendSymbol(trend)}</div>
    `;
    ratesListEl.appendChild(card);
  });
}

// التحويل
async function convertNow() {
  convertErrorEl.classList.add("hidden");
  convertResultEl.textContent = "";
  const amount = parseFloat(amountInput.value || "0");
  const from = fromSelect.value;
  const to = toSelect.value;

  if (!amount || amount <= 0) {
    convertErrorEl.textContent = "الرجاء إدخال مبلغ صحيح.";
    convertErrorEl.classList.remove("hidden");
    return;
  }
  if (from === to) {
    convertErrorEl.textContent = "اختر عملتين مختلفتين.";
    convertErrorEl.classList.remove("hidden");
    return;
  }

  try {
    const rate = await fetchRate(from, to);
    const result = amount * rate;
    convertResultEl.textContent = `${formatAmount(amount)} ${from} = ${formatAmount(result)} ${to}`;
    convertHintEl.textContent = `1 ${from} = ${formatRate(rate)} ${to} (Mid-market)`;
  } catch (e) {
    convertErrorEl.textContent = "تعذر إجراء التحويل الآن.";
    convertErrorEl.classList.remove("hidden");
  }
}
btnConvert.addEventListener("click", convertNow);

// بدء التشغيل
populateCurrencySelects();
fetchRatesNow();
setInterval(fetchRatesNow, CONFIG.REFRESH_MS);

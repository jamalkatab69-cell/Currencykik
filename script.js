/* إعدادات عامة */
const API_KEY = "YOUR_TWELVEDATA_API_KEY"; // ضع مفتاحك هنا
const REFRESH_MS = 20 * 60 * 1000; // 20 دقيقة
const ICON_BASE = "https://raw.githubusercontent.com/jamalkatabeuro-sketch/My-website/main/";

/* قائمة العملات المدعومة */
const CURRENCIES = [
  "EUR","USD","GBP","CHF","CAD","AUD","TRY","CNY","BRL","MXN","ARS","RUB","ZAR",
  "JPY","KRW","INR","HKD","MYR","MAD","EGP","TND","SAR","QAR","AED"
];

/* خرائط الأيقونات: شاشة التحويل (بدون x) وشاشة الأسعار (x) */
const ICONS_CONVERTER = {
  EUR: "100-currency-eur.png",
  USD: "101-currency-usd.png",
  GBP: "102-currency-gbp.png",
  CHF: "103-currency-chf.png",
  CAD: "104-currency-cad.png",
  AUD: "105-currency-aud.png",
  TRY: "106-currency-try.png",
  CNY: "107-currency-cny.png",
  BRL: "108-currency-brl.png",
  MXN: "109-currency-mxn.png",
  ARS: "110-currency-ars.png",
  RUB: "111-currency-rub.png",
  ZAR: "112-currency-zar.png",
  JPY: "113-currency-jpy.png",
  KRW: "114-currency-krw.png",
  INR: "115-currency-inr.png",
  HKD: "116-currency-hkd.png",
  MYR: "117-currency-myr.png",
  MAD: "118-currency-mad.png",
  EGP: "119-currency-egp.png",
  TND: "120-currency-tnd.png",
  SAR: "121-currency-sar.png",
  QAR: "122-currency-qar.png",
  AED: "123-currency-aed.png",
};
const ICONS_RATES = {
  EUR: "100-currency-eurx.png",
  CAD: "101-currency-cadx.png",
  GBP: "102-currency-gbpx.png",
  CHF: "103-currency-chfx.png",
  AUD: "104-currency-audx.png",
  JPY: "105-currency-jpyx.png",
  KRW: "106-currency-krwx.png",
  BRL: "107-currency-brlx.png",
  MXN: "108-currency-mxnx.png",
  TRY: "109-currency-tryx.png",
  CNY: "110-currency-cnyx.png",
  MYR: "111-currency-myrx.png",
  RUB: "112-currency-rubx.png",
  MAD: "113-currency-madx.png",
  EGB: "114-currency-egbx.png", // ملاحظة: قد تكون EGP، تأكد من اسم ملفك
  TND: "115-currency-tndx.png",
  SAR: "116-currency-sarx.png",
  QAR: "117-currency-qarx.png",
  AED: "118-currency-aed.png" // حسب قائمتك لا يوجد aedx، نستخدم هذا
};

/* عناصر الواجهة */
const screens = {
  rates: document.getElementById("screen-rates"),
  convert: document.getElementById("screen-convert"),
  settings: document.getElementById("screen-settings"),
};
const navButtons = document.querySelectorAll(".bottom-nav .nav-btn");
const lastUpdateEl = document.getElementById("last-update");
const ratesListEl = document.getElementById("rates-list");
const ratesErrorEl = document.getElementById("rates-error");

const amountInput = document.getElementById("amount-input");
const fromSelect = document.getElementById("from-select");
const toSelect = document.getElementById("to-select");
const fromIcon = document.getElementById("from-icon");
const toIcon = document.getElementById("to-icon");
const convertResultEl = document.getElementById("convert-result");
const convertErrorEl = document.getElementById("convert-error");
const convertHintEl = document.getElementById("convert-hint");

const btnRefresh = document.getElementById("btn-refresh");
const btnSwap = document.getElementById("btn-swap");
const btnConvert = document.getElementById("btn-convert");

const themeButtons = document.querySelectorAll(".segment");

/* حالة التطبيق */
let lastRates = {};      // آخر أسعار
let prevRates = {};      // أسعار سابقة للمقارنة
let lastFetchTs = null;  // توقيت آخر جلب

/* التنقل بين الشاشات */
navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    navButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const target = btn.dataset.target;
    Object.values(screens).forEach(s => s.classList.remove("active"));
    screens[target].classList.add("active");
  });
});

/* ثيم: on/off/auto مع حفظ في localStorage */
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
  if (mode === "on") {
    // داكن (الافتراضي)
  } else if (mode === "off") {
    document.body.classList.add("light");
  } else if (mode === "auto") {
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    if (prefersLight) document.body.classList.add("light");
  }
}

/* تعبئة قوائم العملات وإظهار الأيقونات */
function populateCurrencySelects() {
  const opts = CURRENCIES.map(c => `<option value="${c}">${c}</option>`).join("");
  fromSelect.innerHTML = opts;
  toSelect.innerHTML = opts;
  fromSelect.value = "USD";
  toSelect.value = "JPY";
  updateCurrencyIcons();
}
function updateCurrencyIcons() {
  const from = fromSelect.value;
  const to = toSelect.value;
  fromIcon.src = ICON_BASE + (ICONS_CONVERTER[from] || ICONS_CONVERTER["USD"]);
  toIcon.src = ICON_BASE + (ICONS_CONVERTER[to] || ICONS_CONVERTER["USD"]);
}
fromSelect.addEventListener("change", updateCurrencyIcons);
toSelect.addEventListener("change", updateCurrencyIcons);
btnSwap.addEventListener("click", () => {
  const tmp = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = tmp;
  updateCurrencyIcons();
});

/* بناء قائمة الأزواج لتحديث شاشة الأسعار دفعة واحدة */
function buildRateSymbols() {
  // أمثلة مثل الواجهة: EUR/USD, USD/EUR, SAR/USD, USD/SAR, USD/CAD, USD/GBP
  const basePairs = [
    "EUR/USD","USD/EUR","USD/CAD","USD/GBP","USD/CHF","USD/AUD",
    "USD/JPY","USD/KRW","USD/BRL","USD/MXN","USD/TRY","USD/CNY",
    "USD/MYR","USD/RUB","USD/MAD","USD/EGP","USD/TND","USD/SAR",
    "USD/QAR","USD/AED"
  ];
  return basePairs;
}

/* جلب الأسعار من Twelvedata في طلب واحد */
async function fetchRatesBatch() {
  try {
    ratesErrorEl.classList.add("hidden");
    const symbols = buildRateSymbols();
    const url = `https://api.twelvedata.com/exchange_rate?symbol=${encodeURIComponent(symbols.join(","))}&apikey=${API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("فشل الاتصال بالخادم");
    const data = await res.json();

    // حفظ السابق للمقارنة
    prevRates = { ...lastRates };

    // قراءة النتائج
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
  } catch (err) {
    ratesErrorEl.textContent = "حدث خطأ أثناء جلب الأسعار. حاول مجددًا.";
    ratesErrorEl.classList.remove("hidden");
  }
}

function updateLastUpdateText() {
  if (!lastFetchTs) {
    lastUpdateEl.textContent = "جارِ التحديث...";
    return;
  }
  const hh = String(lastFetchTs.getHours()).padStart(2, "0");
  const mm = String(lastFetchTs.getMinutes()).padStart(2, "0");
  lastUpdateEl.textContent = `آخر تحديث: ${hh}:${mm}`;
}

/* عرض الأسعار كبطاقات */
function renderRates() {
  ratesListEl.innerHTML = "";
  const entries = Object.entries(lastRates);
  if (entries.length === 0) {
    ratesListEl.innerHTML = `<div class="subtext">لا توجد بيانات متاحة حاليًا.</div>`;
    return;
  }

  entries.forEach(([sym, rate]) => {
    const [base, quote] = sym.split("/");
    const iconName = ICONS_RATES[quote] || ICONS_RATES[base] || ICONS_CONVERTER[base];
    const iconUrl = ICON_BASE + iconName;

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
function formatRate(n) {
  // تنسيق معدل: رقم معقول
  if (n >= 100) return n.toFixed(0);
  if (n >= 10) return n.toFixed(3);
  if (n >= 1) return n.toFixed(4);
  return n.toFixed(6);
}
function trendSymbol(t) {
  if (t === "up") return "▲";
  if (t === "down") return "▼";
  return "—";
}

/* تحويل العملات: يجلب معدل زوج واحد ويحسب */
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
    const symbol = `${from}/${to}`;
    const url = `https://api.twelvedata.com/exchange_rate?symbol=${encodeURIComponent(symbol)}&apikey=${API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("فشل الاتصال بالخادم");
    const data = await res.json();
    const rate = parseFloat(data?.rate);
    if (!rate || isNaN(rate)) throw new Error("معدل تحويل غير متاح");

    const result = amount * rate;
    convertResultEl.textContent = `${formatAmount(amount)} ${from} = ${formatAmount(result)} ${to}`;
    convertHintEl.textContent = `تم باستخدام سعر السوق المتوسط: 1 ${from} = ${formatRate(rate)} ${to}`;
  } catch (err) {
    convertErrorEl.textContent = "تعذر إجراء التحويل الآن. تأكد من الاتصال وأعد المحاولة.";
    convertErrorEl.classList.remove("hidden");
  }
}
function formatAmount(n) {
  if (n >= 1000000) return (n/1000000).toFixed(2) + "M";
  if (n >= 1000) return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
  return n.toFixed(2);
}

/* أحداث */
btnRefresh.addEventListener("click", fetchRatesBatch);
btnConvert.addEventListener("click", convertNow);

/* مبدئيًا */
populateCurrencySelects();
fetchRatesBatch();
setInterval(fetchRatesBatch, REFRESH_MS);

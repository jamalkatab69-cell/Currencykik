// app.js
import { CONFIG } from "./config.js";
import { fetchRates, convertCurrency } from "./api.js";

// عناصر الواجهة
const ratesListEl = document.getElementById("rates-list");
const amountInput = document.getElementById("amount-input");
const fromSelect = document.getElementById("from-select");
const toSelect = document.getElementById("to-select");
const resultEl = document.getElementById("convert-result");

// أزواج العملات المراد عرضها
const symbols = ["EUR/USD","USD/EUR","USD/JPY","USD/GBP","USD/CAD"];

async function updateRates() {
  try {
    const data = await fetchRates(symbols);
    ratesListEl.innerHTML = "";
    symbols.forEach(sym => {
      const rate = data[sym].rate;
      const [base, quote] = sym.split("/");
      const iconUrl = CONFIG.ICON_BASE + `${base === "USD" ? "101-currency-usd.png" : "100-currency-eur.png"}`;
      const div = document.createElement("div");
      div.className = "rate-item";
      div.innerHTML = `
        <img src="${iconUrl}" class="icon">
        <span>${sym}: ${rate}</span>
      `;
      ratesListEl.appendChild(div);
    });
  } catch (err) {
    ratesListEl.innerHTML = `<p class="error">خطأ في جلب الأسعار</p>`;
  }
}

async function handleConvert() {
  const amount = parseFloat(amountInput.value);
  const from = fromSelect.value;
  const to = toSelect.value;
  try {
    const result = await convertCurrency(from, to, amount);
    resultEl.textContent = `${amount} ${from} = ${result.toFixed(2)} ${to}`;
  } catch (err) {
    resultEl.textContent = "خطأ في التحويل";
  }
}

// تحديث دوري
updateRates();
setInterval(updateRates, CONFIG.REFRESH_MS);

// زر التحويل
document.getElementById("btn-convert").addEventListener("click", handleConvert);

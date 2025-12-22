// api.js
import { CONFIG } from "./config.js";

export async function fetchRates(symbols) {
  const url = `https://api.twelvedata.com/exchange_rate?symbol=${encodeURIComponent(symbols.join(","))}&apikey=${CONFIG.API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("فشل الاتصال بالخادم");
  return await res.json();
}

export async function convertCurrency(from, to, amount) {
  const url = `https://api.twelvedata.com/exchange_rate?symbol=${from}/${to}&apikey=${CONFIG.API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("فشل الاتصال بالخادم");
  const data = await res.json();
  const rate = parseFloat(data?.rate);
  if (!rate || isNaN(rate)) throw new Error("معدل غير متاح");
  return amount * rate;
}

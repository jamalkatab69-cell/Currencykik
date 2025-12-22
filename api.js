// api.js
import { CONFIG } from "./config.js";

// جلب أسعار متعددة دفعة واحدة
export async function fetchRatesBatch(symbols) {
  const url = `https://api.twelvedata.com/exchange_rate?symbol=${encodeURIComponent(symbols.join(","))}&apikey=${CONFIG.API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("فشل الاتصال بالخادم");
  const data = await res.json();
  return data;
}

// تحويل عملة واحدة
export async function fetchRate(from, to) {
  const url = `https://api.twelvedata.com/exchange_rate?symbol=${encodeURIComponent(`${from}/${to}`)}&apikey=${CONFIG.API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("فشل الاتصال بالخادم");
  const data = await res.json();
  const rate = parseFloat(data?.rate);
  if (!rate || isNaN(rate)) throw new Error("معدل غير متاح");
  return rate;
}

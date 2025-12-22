// utils.js
export function formatRate(n) {
  if (n >= 100) return n.toFixed(0);
  if (n >= 10) return n.toFixed(3);
  if (n >= 1) return n.toFixed(4);
  return n.toFixed(6);
}

export function formatAmount(n) {
  if (n >= 1000000) return (n/1000000).toFixed(2) + "M";
  if (n >= 1000) return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
  return n.toFixed(2);
}

export function trendSymbol(trend) {
  if (trend === "up") return "▲";
  if (trend === "down") return "▼";
  return "—";
}

export function getCurrencyIcon(code, map, baseUrl) {
  const file = map[code];
  return file ? (baseUrl + file) : (baseUrl + "101-currency-usd.png");
}

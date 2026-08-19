export async function getExchangeRates() {
  try {
    const res = await fetch(`https://open.er-api.com/v6/latest/USD?t=${Date.now()}`);
    const data = await res.json();
    if (data && data.rates) {
      const tryRate = data.rates.TRY || 34.2;
      const eurRate = data.rates.EUR || 0.92;
      return {
        USD: tryRate,
        EUR: tryRate / eurRate,
        TRY: 1
      };
    }
  } catch (err) {
    console.warn("Kur API hatası:", err);
  }

  return {
    USD: 34.2,
    EUR: 37.4,
    TRY: 1
  };
}

export function convertToTRY(amount, currency = "TRY", rates = { USD: 34.2, EUR: 37.4, TRY: 1 }) {
  const num = Number(amount) || 0;
  const rate = rates[currency] || 1;
  return num * rate;
}
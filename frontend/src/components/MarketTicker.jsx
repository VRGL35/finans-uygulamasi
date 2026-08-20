import { useState, useEffect } from "react";
import { translations } from "../utils/translations";

export default function MarketTicker({ lang = "tr", baseRates }) {
  const t = translations[lang] || translations.tr;
  const [rates, setRates] = useState(baseRates || { USD: 34.25, EUR: 37.42 });
  const [trend, setTrend] = useState({ USD: "up", EUR: "up" });
  const [flashing, setFlashing] = useState(false);

  useEffect(() => {
    if (baseRates) setRates(baseRates);
  }, [baseRates]);

  useEffect(() => {
    let flashTimer;
    const interval = setInterval(() => {
      const dUSD = Math.random() * 0.04 - 0.018;
      const dEUR = Math.random() * 0.04 - 0.018;

      setTrend({ USD: dUSD >= 0 ? "up" : "down", EUR: dEUR >= 0 ? "up" : "down" });
      setFlashing(true);
      clearTimeout(flashTimer);
      flashTimer = setTimeout(() => setFlashing(false), 500);

      setRates((prev) => ({
        USD: Math.max(1, Number((prev.USD + dUSD).toFixed(3))),
        EUR: Math.max(1, Number((prev.EUR + dEUR).toFixed(3))),
        TRY: 1
      }));
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(flashTimer);
    };
  }, []);

  return (
    <div className={`market-ticker${flashing ? " flashing" : ""}`}>
      <span className="market-label">{t.liveMarket}:</span>
      <span className={`rate ${trend.USD === "up" ? "up" : "down"}`}>
        1 $ = {rates.USD.toFixed(2)} ₺ {trend.USD === "up" ? "▲" : "▼"}
      </span>
      <span className={`rate ${trend.EUR === "up" ? "up" : "down"}`}>
        1 € = {rates.EUR.toFixed(2)} ₺ {trend.EUR === "up" ? "▲" : "▼"}
      </span>
    </div>
  );
}
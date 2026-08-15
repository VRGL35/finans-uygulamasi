import { useState } from "react";

export default function AylikEkstre({ transactions, currentUser }) {
  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState(currentMonthStr);
  const [showModal, setShowModal] = useState(false);

  const monthTransactions = transactions.filter((t) => {
    if (!t.date) return false;
    return t.date.startsWith(selectedMonth);
  });

  const totalIncome = monthTransactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const totalExpense = monthTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const netBalance = totalIncome - totalExpense;

  // CSV / Excel olarak dışa aktarma fonksiyonu
  const exportToCSV = () => {
    if (monthTransactions.length === 0) {
      alert("Dışa aktarılacak işlem bulunamadı.");
      return;
    }

    const headers = ["ID", "Tarih", "Baslik", "Tur", "Kategori", "Tutar (TL)"];
    const rows = monthTransactions.map((t) => [
      t.id,
      t.date,
      `"${t.title.replace(/"/g, '""')}"`,
      t.type === "income" ? "Gelir" : "Gider",
      t.category,
      t.amount
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(";"), ...rows.map((e) => e.join(";"))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ekstre_${currentUser}_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "10px",
          border: "1px dashed #38bdf8",
          backgroundColor: "rgba(56, 189, 248, 0.1)",
          color: "#38bdf8",
          fontWeight: "600",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px"
        }}
      >
        📄 Aylık Ekstre ve Rapor Al
      </button>

      {/* Ekstre Modal Penceresi */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "16px"
          }}
        >
          <div
            id="print-area"
            style={{
              backgroundColor: "#1e293b",
              borderRadius: "16px",
              padding: "24px",
              maxWidth: "600px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
              color: "#f8fafc"
            }}
          >
            {/* Üst Başlık */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div>
                <h3 style={{ margin: 0, color: "#38bdf8", fontSize: "18px" }}>Hesap Ekstresi</h3>
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>Kullanıcı: @{currentUser}</span>
              </div>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                style={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #334155",
                  color: "#f8fafc",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  fontSize: "13px"
                }}
              />
            </div>

            {/* Ay Özeti Kartları */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "16px" }}>
              <div style={{ backgroundColor: "#0f172a", padding: "12px", borderRadius: "8px", textAlign: "center" }}>
                <span style={{ fontSize: "11px", color: "#94a3b8" }}>Toplam Gelir</span>
                <p style={{ margin: "4px 0 0 0", color: "#22c55e", fontWeight: "bold" }}>
                  +{totalIncome.toLocaleString("tr-TR")} TL
                </p>
              </div>
              <div style={{ backgroundColor: "#0f172a", padding: "12px", borderRadius: "8px", textAlign: "center" }}>
                <span style={{ fontSize: "11px", color: "#94a3b8" }}>Toplam Gider</span>
                <p style={{ margin: "4px 0 0 0", color: "#ef4444", fontWeight: "bold" }}>
                  -{totalExpense.toLocaleString("tr-TR")} TL
                </p>
              </div>
              <div style={{ backgroundColor: "#0f172a", padding: "12px", borderRadius: "8px", textAlign: "center" }}>
                <span style={{ fontSize: "11px", color: "#94a3b8" }}>Net Durum</span>
                <p
                  style={{
                    margin: "4px 0 0 0",
                    fontWeight: "bold",
                    color: netBalance >= 0 ? "#38bdf8" : "#f87171"
                  }}
                >
                  {netBalance.toLocaleString("tr-TR")} TL
                </p>
              </div>
            </div>

            {/* Tablo Dökümü */}
            <h4 style={{ fontSize: "14px", color: "#cbd5e1", marginBottom: "8px" }}>
              İşlem Detayları ({monthTransactions.length})
            </h4>

            {monthTransactions.length === 0 ? (
              <p style={{ color: "#64748b", textAlign: "center", padding: "20px" }}>Bu aya ait işlem kaydı bulunamadı.</p>
            ) : (
              <div style={{ overflowX: "auto", marginBottom: "20px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #334155", color: "#94a3b8" }}>
                      <th style={{ padding: "8px" }}>Tarih</th>
                      <th style={{ padding: "8px" }}>Başlık</th>
                      <th style={{ padding: "8px" }}>Kategori</th>
                      <th style={{ padding: "8px", textAlign: "right" }}>Tutar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthTransactions.map((tx) => (
                      <tr key={tx.id} style={{ borderBottom: "1px solid #1e293b" }}>
                        <td style={{ padding: "8px", color: "#94a3b8" }}>{tx.date}</td>
                        <td style={{ padding: "8px" }}>{tx.title}</td>
                        <td style={{ padding: "8px", textTransform: "capitalize", color: "#cbd5e1" }}>{tx.category}</td>
                        <td
                          style={{
                            padding: "8px",
                            textAlign: "right",
                            fontWeight: "bold",
                            color: tx.type === "income" ? "#22c55e" : "#ef4444"
                          }}
                        >
                          {tx.type === "income" ? "+" : "-"}
                          {Number(tx.amount).toLocaleString("tr-TR")} TL
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Alt İşlem Butonları */}
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={exportToCSV}
                style={{
                  backgroundColor: "#0284c7",
                  color: "#ffffff",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  cursor: "pointer",
                  fontWeight: "600"
                }}
              >
                📊 CSV / Excel İndir
              </button>
              <button
                type="button"
                onClick={handlePrint}
                style={{
                  backgroundColor: "#059669",
                  color: "#ffffff",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  cursor: "pointer",
                  fontWeight: "600"
                }}
              >
                🖨️ PDF / Yazdır
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{
                  backgroundColor: "#475569",
                  color: "#ffffff",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  cursor: "pointer"
                }}
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
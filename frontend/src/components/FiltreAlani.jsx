export default function FiltreAlani({
  searchTerm,
  setSearchTerm,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  selectedCategory,
  setSelectedCategory,
  onClearFilters,
  categories
}) {
  const dateInputStyle = {
    flex: 1,
    padding: "8px 10px",
    borderRadius: "8px",
    border: "1px solid #334155",
    backgroundColor: "#0f172a",
    color: "#ffffff",
    fontSize: "13px",
    boxSizing: "border-box"
  };

  const hasActiveFilter = startDate || endDate || searchTerm || selectedCategory !== "all";

  return (
    <div style={{ backgroundColor: "#1e293b", padding: "16px", borderRadius: "12px", marginBottom: "20px" }}>
      {/* Metin Arama */}
      <input
        type="text"
        placeholder="İşlem ara..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #334155",
          backgroundColor: "#0f172a",
          color: "#ffffff",
          boxSizing: "border-box",
          marginBottom: "12px"
        }}
      />

      {/* Tarih Aralığı */}
      <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "12px" }}>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={dateInputStyle}
          title="Başlangıç Tarihi"
        />
        <span style={{ color: "#64748b", fontSize: "13px" }}>-</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={dateInputStyle}
          title="Bitiş Tarihi"
        />
        {hasActiveFilter && (
          <button
            type="button"
            onClick={onClearFilters}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#334155",
              color: "#94a3b8",
              fontSize: "12px",
              cursor: "pointer",
              whiteSpace: "nowrap"
            }}
            title="Filtreleri Temizle"
          >
            Temizle
          </button>
        )}
      </div>

      {/* Kategori Seçimi */}
      <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "2px" }}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            style={{
              padding: "6px 12px",
              borderRadius: "20px",
              border: "none",
              fontSize: "12px",
              cursor: "pointer",
              backgroundColor: selectedCategory === cat.id ? "#3b82f6" : "#0f172a",
              color: selectedCategory === cat.id ? "#ffffff" : "#94a3b8",
              whiteSpace: "nowrap"
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
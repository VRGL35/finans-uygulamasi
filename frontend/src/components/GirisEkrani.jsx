import { useState } from "react";
import { getUsers, registerUser } from "../services/api";
import TarihGostergesi from "./TarihGostergesi";

export default function GirisEkrani({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const cleanUser = username.trim();
    const cleanPass = password.trim();

    if (!cleanUser || !cleanPass) {
      setError("Lütfen kullanıcı adı ve şifre girin.");
      return;
    }

    try {
      const users = await getUsers();
      const existingUser = users.find(
        (u) => u.username.toLowerCase() === cleanUser.toLowerCase()
      );

      if (isLogin) {
        if (!existingUser) {
          setError("Bu kullanıcı adı ile kayıtlı hesap bulunamadı.");
          return;
        }
        if (existingUser.password !== cleanPass) {
          setError("Hatalı şifre girdiniz!");
          return;
        }
        onLogin(existingUser.username);
      } else {
        if (existingUser) {
          setError("Bu kullanıcı adı zaten alınmış.");
          return;
        }
        await registerUser(cleanUser, cleanPass);
        setSuccess("Hesap başarıyla oluşturuldu! Giriş yapılıyor...");
        setTimeout(() => {
          onLogin(cleanUser);
        }, 1000);
      }
    } catch (err) {
      setError("Sunucuya bağlanırken bir hata oluştu.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "75vh",
        padding: "20px",
        gap: "20px"
      }}
    >
      {/* Canlı Tarih ve Saat Göstergesi */}
      <TarihGostergesi />

      <div
        style={{
          backgroundColor: "#1e293b",
          padding: "36px 32px",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "380px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
          border: "1px solid #334155"
        }}
      >
        {/* Giriş / Kayıt Sekmesi */}
        <div
          style={{
            display: "flex",
            backgroundColor: "#0f172a",
            padding: "4px",
            borderRadius: "12px",
            marginBottom: "24px"
          }}
        >
          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              setError("");
              setSuccess("");
            }}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: isLogin ? "#0284c7" : "transparent",
              color: isLogin ? "#ffffff" : "#94a3b8",
              fontWeight: "600",
              fontSize: "14px",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            Giriş Yap
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLogin(false);
              setError("");
              setSuccess("");
            }}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: !isLogin ? "#0284c7" : "transparent",
              color: !isLogin ? "#ffffff" : "#94a3b8",
              fontWeight: "600",
              fontSize: "14px",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            Kayıt Ol
          </button>
        </div>

        {/* Hata & Başarı Bildirimleri */}
        {error && (
          <div
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.15)",
              color: "#f87171",
              border: "1px solid #ef4444",
              padding: "10px 12px",
              borderRadius: "8px",
              marginBottom: "16px",
              fontSize: "13px",
              textAlign: "center"
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              backgroundColor: "rgba(34, 197, 94, 0.15)",
              color: "#4ade80",
              border: "1px solid #22c55e",
              padding: "10px 12px",
              borderRadius: "8px",
              marginBottom: "16px",
              fontSize: "13px",
              textAlign: "center"
            }}
          >
            {success}
          </div>
        )}

        {/* Form Alanı */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "18px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "500",
                color: "#cbd5e1",
                marginBottom: "8px"
              }}
            >
              Kullanıcı Adı
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Kullanıcı adınızı girin"
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "10px",
                border: "1px solid #334155",
                backgroundColor: "#0f172a",
                color: "#f8fafc",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "500",
                color: "#cbd5e1",
                marginBottom: "8px"
              }}
            >
              Şifre
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "10px",
                border: "1px solid #334155",
                backgroundColor: "#0f172a",
                color: "#f8fafc",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box"
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#0284c7",
              color: "#ffffff",
              border: "none",
              borderRadius: "10px",
              fontWeight: "600",
              fontSize: "15px",
              cursor: "pointer",
              boxShadow: "0 4px 6px -1px rgba(2, 132, 199, 0.4)"
            }}
          >
            {isLogin ? "Giriş Yap" : "Hesap Oluştur"}
          </button>
        </form>
      </div>
    </div>
  );
}
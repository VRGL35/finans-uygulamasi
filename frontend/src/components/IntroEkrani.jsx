import { useEffect } from "react";
import { motion } from "framer-motion";

export default function IntroEkrani({ username, mode, onFinish }) {
  const isLogin = mode === "login";

  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      transition={{ duration: 0.5 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "var(--bg-scene)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden"
      }}
    >
      <div style={{ position: "absolute", width: "40vw", height: "40vw", background: "var(--accent)", filter: "blur(120px)", opacity: 0.05, borderRadius: "50%" }} />

      <div style={{ position: "relative", width: "120px", height: "120px", marginBottom: "40px" }}>
        
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
          style={{
            position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
            borderRadius: "50%", border: "2px dashed var(--accent)", opacity: 0.4
          }}
        />
        
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          style={{
            position: "absolute", top: "15%", left: "15%", width: "70%", height: "70%",
            borderRadius: "50%", border: "3px solid var(--primary-btn)", borderTopColor: "transparent", borderBottomColor: "transparent",
            boxShadow: "0 0 15px var(--accent-glow)"
          }}
        />
        
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          style={{
            position: "absolute", top: "35%", left: "35%", width: "30%", height: "30%",
            backgroundColor: "var(--accent)", borderRadius: "50%",
            boxShadow: "0 0 30px var(--accent)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{ textAlign: "center" }}
      >
        <h1 style={{ 
          color: "var(--text-main)", fontSize: "22px", fontWeight: "800", 
          margin: "0 0 12px 0", letterSpacing: "4px", textTransform: "uppercase" 
        }}>
          {isLogin ? "KİMLİK DOĞRULANDI" : "SİSTEM KAPATILIYOR"}
        </h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{ 
            color: "var(--accent)", fontSize: "14px", fontWeight: "600", 
            margin: 0, letterSpacing: "2px" 
          }}
        >
          {isLogin ? `TEKRAR HOŞ GELDİN, @${username.toUpperCase()}` : "GÜVENLİ ÇIKIŞ YAPILDI"}
        </motion.p>
      </motion.div>

      <div style={{ marginTop: "40px", width: "200px", height: "2px", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "2px", overflow: "hidden" }}>
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
          style={{ height: "100%", backgroundColor: "var(--accent)", boxShadow: "0 0 10px var(--accent)" }}
        />
      </div>

    </motion.div>
  );
}
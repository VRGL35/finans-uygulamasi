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
      className="intro-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      transition={{ duration: 0.5 }}
      role="alert"
      aria-live="polite"
      aria-label={isLogin ? "Giriş yapılıyor" : "Çıkış yapılıyor"}
    >
      <div className="intro-glow-bg" aria-hidden="true" />

      <div className="intro-spinner-container" aria-hidden="true">
        <motion.div
          className="intro-spinner-outer"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
        />

        <motion.div
          className="intro-spinner-middle"
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
        />

        <motion.div
          className="intro-spinner-core"
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        className="intro-text-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h1 className="intro-title">
          {isLogin ? "KİMLİK DOĞRULANDI" : "SİSTEM KAPATILIYOR"}
        </h1>

        <motion.p
          className="intro-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {isLogin
            ? `TEKRAR HOŞ GELDİN, @${username.toUpperCase()}`
            : "GÜVENLİ ÇIKIŞ YAPILDI"}
        </motion.p>
      </motion.div>

      <div
        className="intro-progress-bar"
        role="progressbar"
        aria-valuenow={100}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={isLogin ? "Giriş ilerlemesi" : "Çıkış ilerlemesi"}
      >
        <motion.div
          className="intro-progress-fill"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}
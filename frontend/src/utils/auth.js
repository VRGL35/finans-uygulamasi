const REGISTRY_KEY = "app_users_registry";

const readRegistry = () => {
  try {
    return JSON.parse(localStorage.getItem(REGISTRY_KEY) || "{}") || {};
  } catch (e) {
    return {};
  }
};

const writeRegistry = (reg) => {
  localStorage.setItem(REGISTRY_KEY, JSON.stringify(reg));
};

// Demo seviyesi hash (cyrb53) — gerçek güvenlik için backend şart
const hashPassword = (str, seed = 7) => {
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
};

export const registerUser = ({ username, password, email = "" }) => {
  const name = username.trim();
  const reg = readRegistry();
  if (reg[name]) return { ok: false, error: "userTaken" };

  reg[name] = {
    pass: hashPassword(password),
    email: email.trim(),
    createdAt: Date.now()
  };
  writeRegistry(reg);
  return { ok: true };
};

export const loginUser = ({ username, password }) => {
  const name = username.trim();
  const reg = readRegistry();

  if (!reg[name]) return { ok: false, error: "noAccount" };
  if (reg[name].pass !== hashPassword(password)) return { ok: false, error: "wrongPassword" };

  return { ok: true };
};

export const userExists = (username) => Boolean(readRegistry()[username.trim()]);


export const maskEmail = (email = "") => {
  const [user, domain] = email.split("@");
  if (!domain) return "";
  return `${user.slice(0, 1)}***@${domain}`;
};

export const requestPasswordReset = (username) => {
  const name = username.trim();
  const reg = readRegistry();

  if (!reg[name]) return { ok: false, error: "noAccount" };
  if (!reg[name].email) return { ok: false, error: "noEmail" };

  return { ok: true, email: reg[name].email };
};

export const resetPassword = ({ username, email, newPassword }) => {
  const name = username.trim();
  const reg = readRegistry();

  if (!reg[name]) return { ok: false, error: "noAccount" };
  if ((reg[name].email || "").toLowerCase() !== email.trim().toLowerCase()) {
    return { ok: false, error: "emailMismatch" };
  }

  reg[name].pass = hashPassword(newPassword);
  writeRegistry(reg);
  return { ok: true };
};
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
    email,
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
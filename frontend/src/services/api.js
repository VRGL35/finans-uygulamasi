const BASE_URL = "http://localhost:5000";

export async function getTransactions(username) {
  const res = await fetch(`${BASE_URL}/transactions?username=${username}`);
  if (!res.ok) throw new Error("Veriler alınamadı.");
  return res.json();
}

export async function addTransaction(transaction) {
  const res = await fetch(`${BASE_URL}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(transaction)
  });
  if (!res.ok) throw new Error("Ekleme başarısız.");
  return res.json();
}

export async function deleteTransaction(id) {
  const res = await fetch(`${BASE_URL}/transactions/${id}`, {
    method: "DELETE"
  });
  if (!res.ok) throw new Error("Silme başarısız.");
  return res.json();
}

export async function updateTransaction(id, updatedTransaction) {
  const res = await fetch(`${BASE_URL}/transactions/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedTransaction)
  });
  if (!res.ok) throw new Error("Güncelleme başarısız.");
  return res.json();
}

export async function clearUserTransactions(username) {
  const userTransactions = await getTransactions(username);
  await Promise.all(
    userTransactions.map((tx) =>
      fetch(`${BASE_URL}/transactions/${tx.id}`, { method: "DELETE" })
    )
  );
  return { success: true };
}

export async function getUsers() {
  const res = await fetch(`${BASE_URL}/users`);
  if (!res.ok) throw new Error("Kullanıcılar alınamadı");
  return res.json();
}

export async function registerUser(username, password) {
  const res = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, created_at: new Date().toISOString() })
  });
  if (!res.ok) throw new Error("Kullanıcı kaydedilemedi");
  return res.json();
}
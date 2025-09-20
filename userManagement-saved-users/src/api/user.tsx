// src/api/users.ts
// Update the API base to point to the backend folder under XAMPP htdocs
const API = "http://localhost/userManagement-main/backend/users.php";

export async function fetchUsers(q = "") {
  const url = q ? `${API}?q=${encodeURIComponent(q)}` : API;
  const res = await fetch(url);
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error((data && data.error) || "Failed to fetch users");
  return data;
}

export async function fetchUser(id: string) {
  const res = await fetch(`${API}?id=${id}`);
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

export async function createUser(data: { username: string; email: string; status: string }) {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const resp = await res.json().catch(() => null);
  if (!res.ok) throw new Error((resp && resp.error) || "Failed to create user");
  return resp;
}

export async function updateUser(id: string, data: { username: string; email: string; status: string }) {
  const res = await fetch(`${API}?id=${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const resp = await res.json().catch(() => null);
  if (!res.ok) throw new Error((resp && resp.error) || "Failed to update user");
  return resp;
}

export async function deleteUser(id: string) {
  const res = await fetch(`${API}?id=${id}`, {
    method: "DELETE",
  });
  const resp = await res.json().catch(() => null);
  if (!res.ok) throw new Error((resp && resp.error) || "Failed to delete user");
  return resp;
}

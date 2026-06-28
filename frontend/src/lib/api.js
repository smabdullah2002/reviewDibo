const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

function getToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Request failed");
  return data;
}

export async function login(email, password) {
  const res = await fetch(`${BASE_URL}/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ username: email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Login failed");
  return data;
}

export function register(name, email, password) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export function getMe() {
  return request("/auth/me");
}

export function getProducts() {
  return request("/products");
}

export function getProductDetail(id) {
  return request(`/products/${id}`);
}

export function createReview(productId, rating, comment) {
  return request("/reviews", {
    method: "POST",
    body: JSON.stringify({ product_id: productId, rating, comment }),
  });
}

export function updateReview(id, rating, comment) {
  return request(`/reviews/${id}`, {
    method: "PUT",
    body: JSON.stringify({ rating, comment }),
  });
}

export function deleteReview(id) {
  return request(`/reviews/${id}`, { method: "DELETE" });
}

export function createProduct(title, description, imageUrl) {
  return request("/products", {
    method: "POST",
    body: JSON.stringify({ title, description, image_url: imageUrl }),
  });
}

export function deleteProduct(id) {
  return request(`/products/${id}`, { method: "DELETE" });
}

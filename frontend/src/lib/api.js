// Smart API URL configuration for different environments
const getApiBaseUrl = () => {
  // In browser, use the public URL
  if (typeof window !== "undefined") {
    return import.meta.env.PUBLIC_API_URL || "http://localhost:3067";
  }
  // In server-side (Astro), use the public URL
  return import.meta.env.PUBLIC_API_URL || "http://localhost:3067";
};

export const API_BASE = getApiBaseUrl();

export async function fetchPokemon() {
  const response = await fetch(`${API_BASE}/api/pokemon`);
  return response.json();
}

export async function getUserPokedex(userId) {
  const response = await fetch(`${API_BASE}/api/users/${userId}/pokedex`);
  return response.json();
}

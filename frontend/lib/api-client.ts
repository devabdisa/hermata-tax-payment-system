/**
 * API Client for calling the Express backend.
 *
 * Requests are proxied through Next.js (see next.config.ts) to avoid cross-origin
 * cookie issues with better-auth's HttpOnly session cookies.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  const headers = new Headers(options.headers);

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include", // Essential for forwarding session cookies through the proxy
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "An error occurred while fetching data");
  }

  return data;
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: "GET" }),
  
  post: <T>(endpoint: string, body: any, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  
  patch: <T>(endpoint: string, body: any, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  put: <T>(endpoint: string, body: any, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  
  delete: <T>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: "DELETE" }),
};

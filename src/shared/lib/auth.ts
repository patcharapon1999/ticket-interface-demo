"use client"

export const ACCESS_TOKEN_KEY = "accessToken"

export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false
  return !!localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function setToken(token: string) {
  if (typeof window === "undefined") return
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
  window.dispatchEvent(new StorageEvent("storage", { key: ACCESS_TOKEN_KEY }))
}

export function clearToken() {
  if (typeof window === "undefined") return
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  window.dispatchEvent(new StorageEvent("storage", { key: ACCESS_TOKEN_KEY }))
}

export async function logout() {
  clearToken()
}

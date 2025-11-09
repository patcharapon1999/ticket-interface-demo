"use client"

import axios, { AxiosError, AxiosHeaders } from "axios"
import { getToken } from "./auth"

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

const api = axios.create({
  baseURL,
  withCredentials: false,
})

api.interceptors.request.use((config) => {
  const token = getToken()
  const headers =
    config.headers instanceof AxiosHeaders
      ? config.headers
      : new AxiosHeaders(config.headers)

  if (token) headers.set("Authorization", `Bearer ${token}`)
  headers.set("Content-Type", "application/json")

  config.headers = headers
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    const status = err.response?.status
    if (status === 401 && typeof window !== "undefined") {
      try {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("me")
        window.dispatchEvent(
          new StorageEvent("storage", { key: "accessToken" })
        )
      } catch {}
    }
    return Promise.reject(err)
  }
)

export default api

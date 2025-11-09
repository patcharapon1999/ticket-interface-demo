"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import api from "@/shared/lib/api"

type Role = "USER" | "ADMIN"

function decodeJwt<T = unknown>(token: string): T | null {
  try {
    const [, payload] = token.split(".")
    if (!payload) return null
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    return JSON.parse(decodeURIComponent(escape(json)))
  } catch {
    return null
  }
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bootChecked, setBootChecked] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(() => {
      const token = localStorage.getItem("accessToken") || ""
      if (token) {
        const payload = decodeJwt<{ exp?: number }>(token)
        const now = Math.floor(Date.now() / 1000)
        if (!payload?.exp || payload.exp <= now) {
          localStorage.removeItem("accessToken")
          localStorage.removeItem("me")
        } else {
          try {
            const me = JSON.parse(localStorage.getItem("me") || "null")
            if (me?.role === "ADMIN") router.replace("/admin")
            else if (me?.role === "USER") router.replace("/user")
          } catch {}
        }
      }
      if (mounted) setBootChecked(true)
    })()
    return () => {
      mounted = false
    }
  }, [router])

  const onSubmit = async () => {
    await toast.promise(
      (async () => {
        const r = await api.post("/auth/login", { email, password })
        const data = r.data as {
          accessToken: string
          user: { id: string; email: string; role: Role }
        }

        localStorage.setItem("accessToken", data.accessToken || "")
        localStorage.setItem("me", JSON.stringify(data.user || {}))

        const role = data.user?.role || "USER"
        router.replace(role === "ADMIN" ? "/admin" : "/user")
      })(),
      {
        loading: "Signing in",
        success: "Welcome",
        error: "Invalid credentials",
      }
    )
  }

  if (!bootChecked) {
    return <div className="min-h-screen" />
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold">Login</h1>
        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
        />
        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        <button
          onClick={onSubmit}
          className="w-full px-4 py-2 bg-black text-white rounded"
        >
          Sign in
        </button>
        <button
          onClick={() => router.push("/register")}
          className="w-full px-4 py-2 border rounded"
        >
          Register
        </button>
      </div>
    </div>
  )
}

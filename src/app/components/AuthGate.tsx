"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

type Role = "USER" | "ADMIN"

export default function AuthGate({
  requireAuth = true,
  allowRoles,
  children,
}: {
  requireAuth?: boolean
  allowRoles?: Role[]
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [ready, setReady] = useState(false)
  const redirected = useRef(false)

  function readAuth() {
    try {
      const token = localStorage.getItem("accessToken")
      const me = JSON.parse(localStorage.getItem("me") || "null") as {
        role?: Role
      } | null
      return { token, role: me?.role as Role | undefined }
    } catch {
      return { token: null, role: undefined }
    }
  }

  function redirectOnce(to: string) {
    if (redirected.current) return
    redirected.current = true
    router.replace(to)
  }

  useEffect(() => {
    const { token, role } = readAuth()

    if (requireAuth) {
      if (!token) {
        redirectOnce("/login")
        return
      }
      if (allowRoles && allowRoles.length > 0) {
        if (!role || !allowRoles.includes(role)) {
          if (pathname?.startsWith("/admin")) {
            redirectOnce("/user")
            return
          } else {
            redirectOnce("/admin")
            return
          }
        }
      }
    }

    setReady(true)

    const onStorage = (e: StorageEvent) => {
      if (e.key === "accessToken") {
        const { token: tk } = readAuth()
        if (!tk) {
          redirectOnce("/login")
        }
      }
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!ready) return null
  return <>{children}</>
}

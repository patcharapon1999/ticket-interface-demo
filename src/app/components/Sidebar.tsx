"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { isLoggedIn, logout } from "@/shared/lib/auth"
import { toast } from "sonner"

type SidebarVariant = "admin" | "user"

type NavItem = {
  href: string
  label: string
  match: (path: string) => boolean
}

function cx(...cls: (string | false)[]) {
  return cls.filter(Boolean).join(" ")
}

function SidebarList({
  items,
  activePath,
  variant,
  meRole,
  onNavigate,
}: {
  items: NavItem[]
  activePath: string
  variant: SidebarVariant
  meRole?: "USER" | "ADMIN"
  onNavigate?: () => void
}) {
  const router = useRouter()

  function renderItem(it: NavItem) {
    const active = it.match(activePath || "")

    if (variant === "user" && it.href === "/admin") {
      return (
        <button
          key={it.href}
          onClick={() => {
            if (meRole === "ADMIN") {
              router.push("/admin")
              onNavigate?.()
            } else {
              toast.error("You do not have permission to access Admin")
            }
          }}
          className={cx(
            "w-full text-left block rounded-lg px-4 py-2.5 text-sm",
            active
              ? "bg-gray-900 text-white"
              : "hover:bg-gray-100 text-gray-700"
          )}
        >
          {it.label}
        </button>
      )
    }

    return (
      <Link
        key={it.href}
        href={it.href}
        onClick={onNavigate}
        className={cx(
          "block rounded-lg px-4 py-2.5 text-sm",
          active ? "bg-gray-900 text-white" : "hover:bg-gray-100 text-gray-700"
        )}
      >
        {it.label}
      </Link>
    )
  }

  return (
    <nav className="p-2 space-y-1">{items.map((it) => renderItem(it))}</nav>
  )
}

function SidebarInner({
  variant,
  activePath,
  meRole,
  onLogout,
  onNavigate,
  showHeader = true,
}: {
  variant: SidebarVariant
  activePath: string
  meRole?: "USER" | "ADMIN"
  onLogout: () => void
  onNavigate?: () => void
  showHeader?: boolean
}) {
  const adminNav: NavItem[] = useMemo(
    () => [
      { href: "/admin", label: "Home", match: (p) => p === "/admin" },
      {
        href: "/admin/history",
        label: "History",
        match: (p) => p.startsWith("/admin/history"),
      },
      { href: "/user", label: "Switch to User", match: (p) => p === "/user" },
    ],
    []
  )

  const userNav: NavItem[] = useMemo(
    () => [
      {
        href: "/admin",
        label: "Switch to Admin",
        match: (p) => p === "/admin",
      },
    ],
    []
  )

  const items = variant === "admin" ? adminNav : userNav

  return (
    <div className="h-full w-full flex flex-col">
      {showHeader && (
        <div className="p-4 border-b">
          <div className="text-xl font-semibold">
            {variant === "admin" ? "Admin" : "User"}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <SidebarList
          items={items}
          activePath={activePath}
          variant={variant}
          meRole={meRole}
          onNavigate={onNavigate}
        />
      </div>

      <div className="p-4 border-t">
        <button
          onClick={onLogout}
          className="w-full rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default function Sidebar({ variant }: { variant: SidebarVariant }) {
  const pathname = usePathname()
  const router = useRouter()
  const [loggedIn, setLoggedIn] = useState(false)
  const [me, setMe] = useState<{
    id?: string
    email?: string
    role?: "USER" | "ADMIN"
  } | null>(null)

  const [open, setOpen] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoggedIn(isLoggedIn())
    try {
      const m = JSON.parse(localStorage.getItem("me") || "null")
      setMe(m)
    } catch {
      setMe(null)
    }
    const onStorage = (e: StorageEvent) => {
      if (e.key === "accessToken") setLoggedIn(isLoggedIn())
      if (e.key === "me") {
        try {
          setMe(JSON.parse(localStorage.getItem("me") || "null"))
        } catch {
          setMe(null)
        }
      }
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false)
  }, [pathname])

  async function handleLogout() {
    await logout()
    setLoggedIn(false)
    setMe(null)
    router.replace("/login")
  }

  return (
    <>
      <aside className="hidden md:flex md:w-64 md:shrink-0 md:h-screen border-r bg-white">
        <SidebarInner
          variant={variant}
          activePath={pathname || ""}
          meRole={me?.role}
          onLogout={handleLogout}
        />
      </aside>

      <button
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="fixed md:hidden bottom-4 left-4 z-40 rounded-full border bg-white/90 backdrop-blur px-4 py-2 text-sm shadow"
      >
        ☰ Menu
      </button>

      <div
        className={cx(
          "md:hidden fixed inset-0 z-50",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        <div
          onClick={() => setOpen(false)}
          className={cx(
            "absolute inset-0 transition-opacity",
            open ? "bg-black/40 opacity-100" : "opacity-0"
          )}
        />
        <div
          className={cx(
            "absolute left-0 top-0 h-full w-72 max-w-[85vw] bg-white shadow-xl border-r transform transition-transform",
            open ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <div className="text-lg font-semibold">
              {variant === "admin" ? "Admin" : "User"}
            </div>
            <button
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-1 hover:bg-gray-100"
            >
              ✕
            </button>
          </div>

          <SidebarInner
            variant={variant}
            activePath={pathname || ""}
            meRole={me?.role}
            onLogout={() => {
              setOpen(false)
              handleLogout()
            }}
            onNavigate={() => setOpen(false)}
            showHeader={false}
          />
        </div>
      </div>
    </>
  )
}

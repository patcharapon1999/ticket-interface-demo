"use client"
import { createContext, useContext, useState, useCallback } from "react"

type Toast = { id: string; title: string; type?: "success" | "error" | "info" }
const ToastCtx = createContext<{ push: (t: Omit<Toast, "id">) => void } | null>(
  null
)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [list, setList] = useState<Toast[]>([])
  const push = useCallback((t: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2)
    setList((s) => [...s, { id, ...t }])
    setTimeout(() => setList((s) => s.filter((x) => x.id !== id)), 2500)
  }, [])
  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div className="fixed right-3 top-3 z-50 space-y-2">
        {list.map((t) => (
          <div
            key={t.id}
            className={`rounded-lg px-3 py-2 text-sm shadow bg-white border
            ${
              t.type === "success"
                ? "border-green-500"
                : t.type === "error"
                ? "border-red-500"
                : "border-gray-300"
            }`}
          >
            {t.title}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}
export const useToast = () => {
  const ctx = useContext(ToastCtx)
  if (!ctx) throw new Error("useToast outside provider")
  return ctx
}

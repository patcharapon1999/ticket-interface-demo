"use client"
import { useEffect } from "react"

export default function ConfirmModal({
  open,
  title = "Are you sure?",
  desc,
  onConfirm,
  onCancel,
}: {
  open: boolean
  title?: string
  desc?: string
  onConfirm: () => void
  onCancel: () => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel()
    }
    if (open) window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onCancel])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-4 shadow">
        <h3 className="text-base font-semibold">{title}</h3>
        {desc && <p className="mt-1 text-sm text-gray-600">{desc}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-lg border px-3 py-1.5 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg border bg-black px-3 py-1.5 text-sm text-white"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

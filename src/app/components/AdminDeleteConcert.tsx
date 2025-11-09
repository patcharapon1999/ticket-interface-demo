"use client"

import { toast } from "sonner"
import api from "@/shared/lib/api"

export default function AdminDeleteConcert({
  id,
  onDeleted,
}: {
  id: string
  onDeleted?: () => void
}) {
  const confirmDelete = async () => {
    const ok = window.confirm("Delete this concert?")
    if (!ok) return
    await toast.promise(api.delete(`/concerts/${id}`), {
      loading: "Deleting",
      success: "Deleted",
      error: "Delete failed",
    })
    onDeleted?.()
  }

  return (
    <button
      onClick={confirmDelete}
      className="px-3 py-1.5 border rounded text-red-600 hover:bg-red-50"
    >
      Delete
    </button>
  )
}

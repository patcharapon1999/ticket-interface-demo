"use client"
import { toast } from "sonner"
import api from "@/shared/lib/api"

export default function ReserveCancelButton({
  concertId,
  initialReserved,
  afterChange,
}: {
  concertId: string
  initialReserved: boolean
  afterChange?: () => void
}) {
  const reserve = async () => {
    await toast.promise(api.post(`/concerts/${concertId}/reserve`, {}), {
      loading: "Reserving",
      success: "Reserved",
      error: "Reserve failed",
    })
    afterChange?.()
  }

  const cancel = async () => {
    await toast.promise(api.post(`/concerts/${concertId}/cancel`, {}), {
      loading: "Cancelling",
      success: "Cancelled",
      error: "Cancel failed",
    })
    afterChange?.()
  }

  return initialReserved ? (
    <button
      onClick={cancel}
      className="px-3 py-1.5 rounded border text-red-600"
    >
      Cancel
    </button>
  ) : (
    <button
      onClick={reserve}
      className="px-3 py-1.5 rounded bg-black text-white"
    >
      Reserve
    </button>
  )
}

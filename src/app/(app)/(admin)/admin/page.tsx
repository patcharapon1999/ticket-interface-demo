"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import api from "@/shared/lib/api"
import AdminDeleteConcert from "@/app/components/AdminDeleteConcert"
import AdminCreateConcert from "@/app/components/AdminCreateConcert"

type Concert = { id: string; name: string; description?: string; seats: number }

export default function AdminHomePage() {
  const [tab, setTab] = useState<"overview" | "create">("overview")
  const [concerts, setConcerts] = useState<Concert[]>([])
  const [reservationsByConcert, setReservationsByConcert] = useState<
    Record<string, number>
  >({})
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { data: list } = await api.get<Concert[]>("/concerts/all", {
        params: { _: Date.now() },
      })
      setConcerts(list)

      const results = await Promise.all(
        list.map((c) =>
          api
            .get(`/concerts/${c.id}/reservations`, {
              params: { _: Date.now() },
            })
            .then((r) => ({
              id: c.id,
              count: Array.isArray(r.data) ? r.data.length : 0,
            }))
            .catch(() => ({ id: c.id, count: 0 }))
        )
      )
      const counts: Record<string, number> = {}
      for (const { id, count } of results) counts[id] = count
      setReservationsByConcert(counts)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const afterCreate = useCallback(() => {
    setTab("overview")
    load()
  }, [load])

  const afterDelete = useCallback((id: string) => {
    setConcerts((prev) => prev.filter((c) => c.id !== id))
    setReservationsByConcert((prev) => {
      const { [id]: _, ...rest } = prev
      return rest
    })
  }, [])

  const totalSeats = useMemo(
    () => concerts.reduce((s, c) => s + c.seats, 0),
    [concerts]
  )
  const totalReserved = useMemo(
    () => Object.values(reservationsByConcert).reduce((s, n) => s + n, 0),
    [reservationsByConcert]
  )
  const totalCancelled = 0

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <div className="p-4 rounded border bg-white">
          <div className="text-xs uppercase tracking-wide text-neutral-500">
            Total seats
          </div>
          <div className="mt-1 text-2xl font-semibold">{totalSeats}</div>
        </div>
        <div className="p-4 rounded border bg-white">
          <div className="text-xs uppercase tracking-wide text-neutral-500">
            Reserved
          </div>
          <div className="mt-1 text-2xl font-semibold">{totalReserved}</div>
        </div>
        <div className="p-4 rounded border bg-white">
          <div className="text-xs uppercase tracking-wide text-neutral-500">
            Cancel
          </div>
          <div className="mt-1 text-2xl font-semibold">{totalCancelled}</div>
        </div>
      </div>

      <div className="border-b">
        <div className="flex gap-2">
          <button
            onClick={() => setTab("overview")}
            className={`px-3 py-2 -mb-px ${
              tab === "overview"
                ? "border-b-2 border-black font-medium"
                : "text-neutral-600"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setTab("create")}
            className={`px-3 py-2 -mb-px ${
              tab === "create"
                ? "border-b-2 border-black font-medium"
                : "text-neutral-600"
            }`}
          >
            Create
          </button>
        </div>
      </div>

      {tab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
          {loading && concerts.length === 0 ? (
            <div className="text-sm text-neutral-500">Loading...</div>
          ) : concerts.length === 0 ? (
            <div className="text-sm text-neutral-500">No concerts</div>
          ) : (
            concerts.map((c) => (
              <div key={c.id} className="border rounded p-4 space-y-2 bg-white">
                <div className="text-lg font-semibold wrap-break-word">
                  {c.name}
                </div>
                {c.description && (
                  <div className="text-sm text-neutral-600 wrap-break-word">
                    {c.description}
                  </div>
                )}
                <div className="text-sm">Seats: {c.seats}</div>
                <div className="text-sm">
                  Reserved: {reservationsByConcert[c.id] ?? 0}
                </div>
                <div className="pt-2">
                  <AdminDeleteConcert
                    id={c.id}
                    onDeleted={() => afterDelete(c.id)}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "create" && <AdminCreateConcert onCreated={afterCreate} />}
    </div>
  )
}

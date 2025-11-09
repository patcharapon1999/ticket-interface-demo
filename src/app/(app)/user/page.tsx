"use client"
import { useEffect, useState } from "react"
import api from "@/shared/lib/api"
import ReserveCancelButton from "@/app/components/ReserveCancelButton"

type Concert = { id: string; name: string; description?: string; seats: number }

export default function UserPage() {
  const [concerts, setConcerts] = useState<Concert[]>([])
  const [reservedIds, setReservedIds] = useState<Record<string, boolean>>({})

  const load = async () => {
    const { data: list } = await api.get<Concert[]>("/concerts/all", {
      params: { _: Date.now() },
    })
    setConcerts(list)
    const map: Record<string, boolean> = {}
    const me =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("me") || "{}")
        : {}
    for (const c of list) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: rs } = await api.get<any[]>(
        `/concerts/${c.id}/reservations`,
        { params: { _: Date.now() } }
      )
      map[c.id] = Array.isArray(rs) ? rs.some((x) => x.userId === me.id) : false
    }
    setReservedIds(map)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load()
  }, [])

  return (
    <div className="p-4 space-y-4">
      <div className="text-lg font-semibold">Concerts</div>
      <div className="grid grid-cols-1 gap-4">
        {concerts.map((c) => (
          <div key={c.id} className="border rounded p-4 space-y-2">
            <div className="text-lg font-semibold">{c.name}</div>
            <div className="text-sm text-neutral-600">{c.description}</div>
            <div className="flex items-center justify-between pt-2">
              <div className="text-sm">Seats: {c.seats}</div>
              <ReserveCancelButton
                concertId={c.id}
                initialReserved={!!reservedIds[c.id]}
                afterChange={load}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

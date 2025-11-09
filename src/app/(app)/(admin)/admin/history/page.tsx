"use client"
import { useEffect, useState } from "react"
import api from "@/shared/lib/api"

type Concert = { id: string; name: string }
type Reservation = {
  id: string
  userId: string
  concertId: string
  createdAt: string
}

export default function AdminHistoryPage() {
  const [rows, setRows] = useState<
    Array<{ reservation: Reservation; concert: Concert | null }>
  >([])

  const load = async () => {
    const { data: concerts } = await api.get<Concert[]>("/concerts/all", {
      params: { _: Date.now() },
    })
    const rowsTmp: Array<{
      reservation: Reservation
      concert: Concert | null
    }> = []
    for (const c of concerts) {
      const { data: rs } = await api.get<Reservation[]>(
        `/concerts/${c.id}/reservations`,
        { params: { _: Date.now() } }
      )
      for (const r of rs) rowsTmp.push({ reservation: r, concert: c })
    }
    rowsTmp.sort(
      (a, b) =>
        new Date(b.reservation.createdAt).getTime() -
        new Date(a.reservation.createdAt).getTime()
    )
    setRows(rowsTmp)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load()
  }, [])

  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold">Reservation History</div>
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-neutral-50">
            <tr>
              <th className="text-left p-2 border-b">Time</th>
              <th className="text-left p-2 border-b">Concert</th>
              <th className="text-left p-2 border-b">User</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.reservation.id} className="border-b">
                <td className="p-2">
                  {new Date(row.reservation.createdAt).toLocaleString()}
                </td>
                <td className="p-2">{row.concert?.name}</td>
                <td className="p-2">{row.reservation.userId}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td className="p-4 text-center" colSpan={3}>
                  No reservations
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import api from "@/shared/lib/api"
import { toast } from "sonner"

export default function AdminCreateConcert({
  onCreated,
}: {
  onCreated?: () => void
}) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [seats, setSeats] = useState<number | "">("")
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    try {
      await api.post("/concerts", {
        name: name.trim(),
        description: description.trim(),
        seats: typeof seats === "string" ? Number(seats || 0) : seats,
      })
      toast.success("Created concert")
      setName("")
      setDescription("")
      setSeats("")
      onCreated?.()
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create concert"
      toast.error(Array.isArray(msg) ? msg.join(", ") : msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full border px-3 py-2 text-sm rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 w-full border px-3 py-2 text-sm rounded"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Seats</label>
        <input
          type="number"
          min={0}
          value={seats}
          onChange={(e) =>
            setSeats(e.target.value === "" ? "" : Number(e.target.value))
          }
          className="mt-1 w-full border px-3 py-2 text-sm rounded"
          required
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center rounded bg-black px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 hover:opacity-90"
      >
        {submitting ? "Creating..." : "Create"}
      </button>
    </form>
  )
}

"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import api from "@/shared/lib/api"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const onSubmit = async () => {
    await toast.promise(api.post("/users/register", { email, password }), {
      loading: "Registering",
      success: "Account created",
      error: "Register failed",
    })
    router.replace("/login")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold">Register</h1>
        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={onSubmit}
          className="w-full px-4 py-2 bg-black text-white rounded"
        >
          Create account
        </button>
        <button
          onClick={() => router.push("/login")}
          className="w-full px-4 py-2 border rounded"
        >
          Back to login
        </button>
      </div>
    </div>
  )
}

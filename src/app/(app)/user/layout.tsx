"use client"

import AuthGate from "@/app/components/AuthGate"
import Sidebar from "@/app/components/Sidebar"

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGate requireAuth allowRoles={["USER", "ADMIN"]}>
      <div className="min-h-screen flex">
        <Sidebar variant="user" />
        <main className="flex-1 h-screen overflow-auto p-4">{children}</main>
      </div>
    </AuthGate>
  )
}

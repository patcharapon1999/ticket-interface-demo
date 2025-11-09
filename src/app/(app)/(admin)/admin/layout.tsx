"use client"

import AuthGate from "@/app/components/AuthGate"
import Sidebar from "@/app/components/Sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGate requireAuth allowRoles={["ADMIN"]}>
      <div className="min-h-screen flex">
        <Sidebar variant="admin" />
        <main className="flex-1 h-screen overflow-auto p-4">{children}</main>
      </div>
    </AuthGate>
  )
}

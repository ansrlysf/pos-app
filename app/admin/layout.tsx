"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { useOfflineStore } from "@/lib/offline-store"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { SyncStatus } from "@/components/sync-status"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { currentUser, isAuthenticated, login } = useAppStore()
  const { setOnlineStatus } = useOfflineStore()
  const router = useRouter()

  useEffect(() => {
    // Auto-login as admin for demo purposes
    if (!isAuthenticated) {
      const demoAdmin = {
        id: "admin1",
        name: "Demo Admin",
        email: "admin@demo.com",
        role: "admin" as const,
        createdAt: new Date(),
      }
      login(demoAdmin)
    }

    // Check if user is admin
    if (isAuthenticated && currentUser?.role !== "admin") {
      router.push("/cashier")
      return
    }

    // Set up online/offline listeners
    const handleOnline = () => setOnlineStatus(true)
    const handleOffline = () => setOnlineStatus(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [isAuthenticated, currentUser, router, login, setOnlineStatus])

  if (!isAuthenticated || currentUser?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading admin panel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col">
          <div className="flex flex-col flex-grow pt-5 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            <AdminSidebar />
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <AdminHeader />

          {/* Sync Status Bar */}
          <div className="bg-white dark:bg-gray-800 border-b px-6 py-2">
            <SyncStatus />
          </div>

          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">{children}</div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

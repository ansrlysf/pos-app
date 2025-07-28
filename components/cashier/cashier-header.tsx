"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Clock, Settings, LogOut, Play, Square, ShoppingCart, TrendingUp } from "lucide-react"
import { StartShiftDialog } from "./start-shift-dialog"
import { ShiftClosingDialog } from "./shift-closing-dialog"
import { useToast } from "@/hooks/use-toast"

export function CashierHeader() {
  const { currentUser, currentShift, hasPermission, logout, transactions } = useAppStore()

  const [startShiftOpen, setStartShiftOpen] = useState(false)
  const [closeShiftOpen, setCloseShiftOpen] = useState(false)
  const { toast } = useToast()

  const getShiftDuration = () => {
    if (!currentShift) return "00:00:00"

    // Handle both Date objects and string dates from persistence
    const startTime =
      typeof currentShift.startTime === "string" ? new Date(currentShift.startTime) : currentShift.startTime

    const now = new Date()
    const diff = now.getTime() - startTime.getTime()

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  const handleStartShift = () => {
    if (!hasPermission("manage_shift")) {
      toast({
        title: "Akses ditolak",
        message: "Anda tidak memiliki izin untuk mengelola shift",
        variant: "destructive",
      })
      return
    }
    setStartShiftOpen(true)
  }

  const handleCloseShift = () => {
    if (!hasPermission("manage_shift")) {
      toast({
        title: "Akses ditolak",
        message: "Anda tidak memiliki izin untuk mengelola shift",
        variant: "destructive",
      })
      return
    }
    setCloseShiftOpen(true)
  }

  const todayTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.createdAt)
    const today = new Date()
    return transactionDate.toDateString() === today.toDateString()
  })

  const todaySales = todayTransactions.reduce((sum, t) => sum + t.finalTotal, 0)

  return (
    <>
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left Section - User Info */}
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {currentUser?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-lg">{currentUser?.name || "Kasir"}</h2>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {currentUser?.cashierRole || currentUser?.role}
                </Badge>
                {currentShift && (
                  <Badge variant="default" className="text-xs bg-green-600">
                    Shift Aktif
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Center Section - Shift Info */}
          <div className="flex items-center gap-6">
            {currentShift ? (
              <>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Durasi Shift</div>
                  <div className="font-mono text-lg font-bold text-primary">
                    <Clock className="inline h-4 w-4 mr-1" />
                    {getShiftDuration()}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Transaksi Hari Ini</div>
                  <div className="font-bold text-lg">
                    <ShoppingCart className="inline h-4 w-4 mr-1" />
                    {todayTransactions.length}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Penjualan Hari Ini</div>
                  <div className="font-bold text-lg text-green-600">
                    <TrendingUp className="inline h-4 w-4 mr-1" />
                    Rp {todaySales.toLocaleString("id-ID")}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-2">
                <div className="text-muted-foreground">Shift belum dimulai</div>
              </div>
            )}
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-2">
            {hasPermission("manage_shift") && (
              <>
                {!currentShift ? (
                  <Button onClick={handleStartShift} className="bg-green-600 hover:bg-green-700">
                    <Play className="h-4 w-4 mr-2" />
                    Mulai Shift
                  </Button>
                ) : (
                  <Button onClick={handleCloseShift} variant="destructive">
                    <Square className="h-4 w-4 mr-2" />
                    Tutup Shift
                  </Button>
                )}
              </>
            )}

            {hasPermission("access_settings") && (
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            )}

            <Button variant="outline" size="icon" onClick={logout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <StartShiftDialog open={startShiftOpen} onOpenChange={setStartShiftOpen} />

      <ShiftClosingDialog open={closeShiftOpen} onOpenChange={setCloseShiftOpen} />
    </>
  )
}

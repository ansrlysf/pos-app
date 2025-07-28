"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Clock, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface StartShiftDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StartShiftDialog({ open, onOpenChange }: StartShiftDialogProps) {
  const { currentUser, startShift, shifts } = useAppStore()
  const [startingCash, setStartingCash] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Get last shift ending cash as suggestion
  const lastShift = shifts
    .filter((s) => s.cashierId === currentUser?.id)
    .sort((a, b) => {
      const dateA = typeof a.endTime === "string" ? new Date(a.endTime) : a.endTime
      const dateB = typeof b.endTime === "string" ? new Date(b.endTime) : b.endTime
      return (dateB?.getTime() || 0) - (dateA?.getTime() || 0)
    })[0]

  const suggestedAmount = lastShift?.actualCash || 100000

  const handleSubmit = async () => {
    const amount = Number.parseFloat(startingCash)

    if (!startingCash || amount < 0) {
      toast({
        title: "Error",
        description: "Masukkan jumlah kas awal yang valid",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      startShift(amount)

      toast({
        title: "Shift dimulai",
        description: `Shift berhasil dimulai dengan kas awal Rp ${amount.toLocaleString("id-ID")}`,
      })

      onOpenChange(false)
      setStartingCash("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memulai shift",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUseSuggested = () => {
    setStartingCash(suggestedAmount.toString())
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Mulai Shift Baru
          </DialogTitle>
          <DialogDescription>Masukkan jumlah kas awal untuk memulai shift</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Cashier Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">{currentUser?.name}</div>
                  <Badge variant="outline" className="text-xs">
                    {currentUser?.cashierRole || currentUser?.role}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Last Shift Info */}
          {lastShift && (
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">Shift Terakhir</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>
                    Tanggal:{" "}
                    {typeof lastShift.endTime === "string"
                      ? new Date(lastShift.endTime).toLocaleDateString("id-ID")
                      : lastShift.endTime?.toLocaleDateString("id-ID")}
                  </div>
                  <div>Kas Akhir: Rp {(lastShift.actualCash || 0).toLocaleString("id-ID")}</div>
                </div>
                <Button variant="outline" size="sm" onClick={handleUseSuggested} className="mt-2 w-full bg-transparent">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Gunakan Kas Akhir Shift Terakhir
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Starting Cash Input */}
          <div className="space-y-2">
            <Label htmlFor="starting-cash">Kas Awal *</Label>
            <Input
              id="starting-cash"
              type="number"
              value={startingCash}
              onChange={(e) => setStartingCash(e.target.value)}
              placeholder="Masukkan jumlah kas awal"
              min="0"
              step="1000"
            />
            <div className="text-xs text-muted-foreground">Masukkan jumlah uang tunai yang tersedia di laci kas</div>
          </div>

          {/* Quick Amount Buttons */}
          <div className="space-y-2">
            <Label className="text-sm">Jumlah Cepat</Label>
            <div className="grid grid-cols-3 gap-2">
              {[50000, 100000, 200000].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setStartingCash(amount.toString())}
                  className="text-xs"
                >
                  {amount.toLocaleString("id-ID")}
                </Button>
              ))}
            </div>
          </div>

          {startingCash && (
            <Card className="bg-muted/50">
              <CardContent className="p-3">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Kas Awal</div>
                  <div className="text-xl font-bold text-primary">
                    Rp {Number.parseFloat(startingCash).toLocaleString("id-ID")}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!startingCash || isSubmitting}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? "Memulai..." : "Mulai Shift"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

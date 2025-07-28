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
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, DollarSign, CreditCard, Smartphone, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ShiftClosingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ShiftClosingDialog({ open, onOpenChange }: ShiftClosingDialogProps) {
  const { currentShift, endShift } = useAppStore()
  const [endingCash, setEndingCash] = useState("")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  if (!currentShift) return null

  // Handle both Date objects and string dates from persistence
  const startTime =
    typeof currentShift.startTime === "string" ? new Date(currentShift.startTime) : currentShift.startTime

  const now = new Date()
  const shiftDuration = now.getTime() - startTime.getTime()
  const hours = Math.floor(shiftDuration / (1000 * 60 * 60))
  const minutes = Math.floor((shiftDuration % (1000 * 60 * 60)) / (1000 * 60))

  const expectedCash = currentShift.expectedCash
  const actualCash = Number.parseFloat(endingCash) || 0
  const cashDifference = actualCash - expectedCash

  const handleSubmit = async () => {
    if (!endingCash) {
      toast({
        title: "Error",
        description: "Masukkan jumlah kas akhir",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      endShift(actualCash, notes)

      toast({
        title: "Shift ditutup",
        description: `Shift berhasil ditutup dengan selisih kas Rp ${Math.abs(cashDifference).toLocaleString("id-ID")}`,
      })

      onOpenChange(false)
      setEndingCash("")
      setNotes("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menutup shift",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Tutup Shift
          </DialogTitle>
          <DialogDescription>Tutup shift dan lakukan penghitungan kas akhir</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Shift Summary */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Ringkasan Shift</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{currentShift.totalTransactions}</div>
                  <div className="text-sm text-muted-foreground">Transaksi</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    Rp {currentShift.totalSales.toLocaleString("id-ID")}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Penjualan</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {hours}j {minutes}m
                  </div>
                  <div className="text-sm text-muted-foreground">Durasi</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    Rp {currentShift.totalDiscount.toLocaleString("id-ID")}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Diskon</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods Breakdown */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Rincian Pembayaran</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span>Tunai</span>
                  </div>
                  <span className="font-medium">Rp {currentShift.cashSales.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-blue-600" />
                    <span>Kartu</span>
                  </div>
                  <span className="font-medium">Rp {currentShift.cardSales.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-purple-600" />
                    <span>Digital</span>
                  </div>
                  <span className="font-medium">Rp {currentShift.digitalSales.toLocaleString("id-ID")}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cash Reconciliation */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Rekonsiliasi Kas</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Kas Awal</Label>
                    <div className="text-lg font-medium">Rp {currentShift.startingCash.toLocaleString("id-ID")}</div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Kas yang Diharapkan</Label>
                    <div className="text-lg font-medium">Rp {expectedCash.toLocaleString("id-ID")}</div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="ending-cash">Kas Aktual *</Label>
                  <Input
                    id="ending-cash"
                    type="number"
                    value={endingCash}
                    onChange={(e) => setEndingCash(e.target.value)}
                    placeholder="Masukkan jumlah kas aktual"
                    className="mt-1"
                  />
                </div>

                {endingCash && (
                  <div className="p-3 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Selisih Kas:</span>
                      <div className="flex items-center gap-2">
                        {cashDifference === 0 ? (
                          <Badge variant="default" className="bg-green-600">
                            Sesuai
                          </Badge>
                        ) : cashDifference > 0 ? (
                          <>
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            <Badge variant="default" className="bg-green-600">
                              +Rp {cashDifference.toLocaleString("id-ID")}
                            </Badge>
                          </>
                        ) : (
                          <>
                            <TrendingDown className="h-4 w-4 text-red-600" />
                            <Badge variant="destructive">-Rp {Math.abs(cashDifference).toLocaleString("id-ID")}</Badge>
                          </>
                        )}
                      </div>
                    </div>

                    {Math.abs(cashDifference) > 10000 && (
                      <div className="flex items-center gap-2 mt-2 text-amber-600">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm">Selisih kas cukup besar, pastikan perhitungan sudah benar</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Additional Statistics */}
          {(currentShift.voidedTransactions > 0 || currentShift.refundedAmount > 0) && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Statistik Tambahan</h3>
                <div className="grid grid-cols-2 gap-4">
                  {currentShift.voidedTransactions > 0 && (
                    <div>
                      <div className="text-lg font-bold text-red-600">{currentShift.voidedTransactions}</div>
                      <div className="text-sm text-muted-foreground">Transaksi Dibatalkan</div>
                    </div>
                  )}
                  {currentShift.refundedAmount > 0 && (
                    <div>
                      <div className="text-lg font-bold text-orange-600">
                        Rp {currentShift.refundedAmount.toLocaleString("id-ID")}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Refund</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Catatan (Opsional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tambahkan catatan untuk shift ini..."
              className="mt-1"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={!endingCash || isSubmitting} className="bg-red-600 hover:bg-red-700">
            {isSubmitting ? "Menutup..." : "Tutup Shift"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

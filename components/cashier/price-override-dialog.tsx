"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { DollarSign, AlertTriangle, CheckCircle } from "lucide-react"

interface PriceOverrideDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productId: string
  currentPrice: number
  onConfirm: (newPrice: number, reason: string) => void
}

export function PriceOverrideDialog({
  open,
  onOpenChange,
  productId,
  currentPrice,
  onConfirm,
}: PriceOverrideDialogProps) {
  const { hasPermission, cashierSettings } = useAppStore()
  const [newPrice, setNewPrice] = useState<number>(currentPrice)
  const [reason, setReason] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const canOverridePrice = hasPermission("override_price")
  const maxOverridePercent = cashierSettings.maxPriceOverridePercent
  const requireReason = cashierSettings.requireOverrideReason

  const priceChange = newPrice - currentPrice
  const priceChangePercent = (priceChange / currentPrice) * 100
  const isWithinLimit = Math.abs(priceChangePercent) <= maxOverridePercent

  const handleConfirm = async () => {
    if (!canOverridePrice) {
      toast({
        title: "Akses ditolak",
        description: "Anda tidak memiliki izin untuk mengubah harga",
        variant: "destructive",
      })
      return
    }

    if (!isWithinLimit) {
      toast({
        title: "Perubahan harga terlalu besar",
        description: `Maksimal perubahan harga adalah ${maxOverridePercent}%`,
        variant: "destructive",
      })
      return
    }

    if (requireReason && !reason.trim()) {
      toast({
        title: "Alasan diperlukan",
        description: "Silakan masukkan alasan perubahan harga",
        variant: "destructive",
      })
      return
    }

    if (newPrice <= 0) {
      toast({
        title: "Harga tidak valid",
        description: "Harga harus lebih dari 0",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    // Simulate processing
    setTimeout(() => {
      onConfirm(newPrice, reason.trim())

      toast({
        title: "Harga berhasil diubah",
        description: `Harga diubah dari Rp ${currentPrice.toLocaleString("id-ID")} menjadi Rp ${newPrice.toLocaleString("id-ID")}`,
      })

      setIsProcessing(false)
      onOpenChange(false)
      setNewPrice(currentPrice)
      setReason("")
    }, 1000)
  }

  const handleCancel = () => {
    onOpenChange(false)
    setNewPrice(currentPrice)
    setReason("")
  }

  if (!canOverridePrice) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Akses Ditolak
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <p className="text-muted-foreground">Anda tidak memiliki izin untuk mengubah harga produk.</p>
          </div>
          <Button onClick={() => onOpenChange(false)} className="w-full">
            Tutup
          </Button>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Ubah Harga Produk
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Price Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi Harga</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Harga Saat Ini:</span>
                <span className="font-medium">Rp {currentPrice.toLocaleString("id-ID")}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Batas Perubahan:</span>
                <span className="font-medium">±{maxOverridePercent}%</span>
              </div>
            </CardContent>
          </Card>

          {/* New Price Input */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPrice">Harga Baru (Rp)</Label>
              <Input
                id="newPrice"
                type="number"
                min="1"
                value={newPrice}
                onChange={(e) => setNewPrice(Number(e.target.value))}
                className="text-lg font-medium"
              />
            </div>

            {/* Price Change Indicator */}
            {newPrice !== currentPrice && (
              <div className="p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Perubahan Harga:</span>
                  <div className="flex items-center gap-2">
                    {isWithinLimit ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                    <span
                      className={`font-bold ${
                        priceChange > 0 ? "text-green-600" : priceChange < 0 ? "text-red-600" : "text-gray-600"
                      }`}
                    >
                      {priceChange >= 0 ? "+" : ""}Rp {priceChange.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Persentase:</span>
                  <span className={`font-medium ${isWithinLimit ? "text-green-600" : "text-red-600"}`}>
                    {priceChangePercent >= 0 ? "+" : ""}
                    {priceChangePercent.toFixed(1)}%
                  </span>
                </div>

                {!isWithinLimit && (
                  <Badge variant="destructive" className="mt-2">
                    Melebihi batas yang diizinkan
                  </Badge>
                )}
              </div>
            )}

            {/* Reason Input */}
            {requireReason && (
              <div className="space-y-2">
                <Label htmlFor="reason">
                  Alasan Perubahan Harga <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Masukkan alasan perubahan harga..."
                  rows={3}
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={handleCancel} disabled={isProcessing}>
              Batal
            </Button>
            <Button
              className="flex-1"
              onClick={handleConfirm}
              disabled={
                isProcessing ||
                newPrice <= 0 ||
                newPrice === currentPrice ||
                !isWithinLimit ||
                (requireReason && !reason.trim())
              }
            >
              {isProcessing ? "Memproses..." : "Ubah Harga"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

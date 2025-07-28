"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { useAppStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { Package, Plus, Minus, RotateCcw } from "lucide-react"

interface StockAdjustmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: any
}

export function StockAdjustmentDialog({ open, onOpenChange, product }: StockAdjustmentDialogProps) {
  const { updateProduct } = useAppStore()
  const [adjustmentType, setAdjustmentType] = useState<"add" | "subtract" | "set">("add")
  const [quantity, setQuantity] = useState<number>(0)
  const [reason, setReason] = useState("")
  const [note, setNote] = useState("")
  const { toast } = useToast()

  if (!product) return null

  const handleAdjustment = () => {
    if (quantity <= 0 && adjustmentType !== "set") {
      toast({
        title: "Quantity tidak valid",
        description: "Masukkan quantity yang valid",
        variant: "destructive",
      })
      return
    }

    let newStock = product.stock
    switch (adjustmentType) {
      case "add":
        newStock = product.stock + quantity
        break
      case "subtract":
        newStock = Math.max(0, product.stock - quantity)
        break
      case "set":
        newStock = quantity
        break
    }

    updateProduct(product.id, { stock: newStock })

    toast({
      title: "Stock berhasil disesuaikan",
      description: `Stock ${product.name} diubah dari ${product.stock} menjadi ${newStock}`,
    })

    // Reset form
    setQuantity(0)
    setReason("")
    setNote("")
    onOpenChange(false)
  }

  const getNewStock = () => {
    switch (adjustmentType) {
      case "add":
        return product.stock + quantity
      case "subtract":
        return Math.max(0, product.stock - quantity)
      case "set":
        return quantity
      default:
        return product.stock
    }
  }

  const reasonOptions = [
    "Restock dari supplier",
    "Penjualan tidak tercatat",
    "Barang rusak/expired",
    "Stock opname",
    "Retur dari customer",
    "Kehilangan/pencurian",
    "Koreksi sistem",
    "Lainnya",
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Stock Adjustment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Product Info */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="font-semibold">{product.name}</h3>
                <div className="flex justify-between text-sm">
                  <span>Stock Saat Ini:</span>
                  <span className="font-bold">{product.stock} unit</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Kategori:</span>
                  <span>{product.category}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Adjustment Type */}
          <div className="space-y-2">
            <Label>Jenis Adjustment</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={adjustmentType === "add" ? "default" : "outline"}
                size="sm"
                onClick={() => setAdjustmentType("add")}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Tambah
              </Button>
              <Button
                variant={adjustmentType === "subtract" ? "default" : "outline"}
                size="sm"
                onClick={() => setAdjustmentType("subtract")}
                className="flex items-center gap-1"
              >
                <Minus className="h-4 w-4" />
                Kurang
              </Button>
              <Button
                variant={adjustmentType === "set" ? "default" : "outline"}
                size="sm"
                onClick={() => setAdjustmentType("set")}
                className="flex items-center gap-1"
              >
                <RotateCcw className="h-4 w-4" />
                Set
              </Button>
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label>{adjustmentType === "set" ? "Stock Baru" : "Quantity"}</Label>
            <Input
              type="number"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              placeholder="0"
            />
          </div>

          {/* Preview */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-2">
                <h4 className="font-medium">Preview Perubahan</h4>
                <div className="flex justify-between text-sm">
                  <span>Stock Lama:</span>
                  <span>{product.stock} unit</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Stock Baru:</span>
                  <span className="font-bold text-primary">{getNewStock()} unit</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Perubahan:</span>
                  <span className={getNewStock() - product.stock >= 0 ? "text-green-600" : "text-red-600"}>
                    {getNewStock() - product.stock >= 0 ? "+" : ""}
                    {getNewStock() - product.stock} unit
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reason */}
          <div className="space-y-2">
            <Label>Alasan *</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih alasan adjustment" />
              </SelectTrigger>
              <SelectContent>
                {reasonOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Note */}
          <div className="space-y-2">
            <Label>Catatan</Label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Catatan tambahan (opsional)"
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 bg-transparent">
              Batal
            </Button>
            <Button onClick={handleAdjustment} className="flex-1" disabled={!reason}>
              Terapkan Adjustment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

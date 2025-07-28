"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { useAppStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { Zap, Calculator, ShoppingCart } from "lucide-react"

interface QuickSaleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function QuickSaleDialog({ open, onOpenChange }: QuickSaleDialogProps) {
  const { processTransaction, currentUser } = useAppStore()
  const [itemName, setItemName] = useState("")
  const [price, setPrice] = useState<number>(0)
  const [quantity, setQuantity] = useState<number>(1)
  const [category, setCategory] = useState("Miscellaneous")
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "digital">("cash")
  const [cashReceived, setCashReceived] = useState<number>(0)
  const { toast } = useToast()

  const subtotal = price * quantity
  const tax = subtotal * 0.1
  const total = subtotal + tax
  const change = cashReceived - total

  const handleQuickSale = () => {
    if (!itemName || price <= 0) {
      toast({
        title: "Data tidak lengkap",
        description: "Nama item dan harga harus diisi",
        variant: "destructive",
      })
      return
    }

    if (paymentMethod === "cash" && cashReceived < total) {
      toast({
        title: "Uang tidak cukup",
        description: "Jumlah uang yang diterima kurang dari total",
        variant: "destructive",
      })
      return
    }

    // Create quick sale item
    const quickItem = {
      product: {
        id: `quick-${Date.now()}`,
        name: itemName,
        category,
        price,
        cost: price * 0.7, // Assume 30% margin
        stock: 999,
        barcode: `QUICK-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      quantity,
      subtotal,
    }

    const transaction = {
      items: [quickItem],
      total: subtotal,
      discount: 0,
      tax,
      finalTotal: total,
      paymentMethod,
      cashReceived: paymentMethod === "cash" ? cashReceived : undefined,
      change: paymentMethod === "cash" ? change : undefined,
      cashierId: currentUser?.id || "",
      note: "Quick Sale",
    }

    processTransaction(transaction)

    toast({
      title: "Quick Sale berhasil!",
      description: `${itemName} telah terjual`,
    })

    // Reset form
    setItemName("")
    setPrice(0)
    setQuantity(1)
    setCashReceived(0)
    onOpenChange(false)
  }

  const quickAmounts = [
    Math.ceil(total / 1000) * 1000,
    Math.ceil(total / 5000) * 5000,
    Math.ceil(total / 10000) * 10000,
    Math.ceil(total / 50000) * 50000,
  ].filter((amount, index, arr) => arr.indexOf(amount) === index && amount > total)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Sale
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Item Details */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold">Detail Item</h3>

              <div className="space-y-2">
                <Label>Nama Item *</Label>
                <Input
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="Contoh: Jasa Service, Produk Custom"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Harga *</Label>
                  <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input type="number" min="1" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Kategori</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Miscellaneous">Miscellaneous</SelectItem>
                    <SelectItem value="Service">Service</SelectItem>
                    <SelectItem value="Custom">Custom Product</SelectItem>
                    <SelectItem value="Gift Card">Gift Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Calculation */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Kalkulasi
              </h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal ({quantity}x):</span>
                  <span>Rp {subtotal.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pajak (10%):</span>
                  <span>Rp {tax.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>Rp {total.toLocaleString("id-ID")}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold">Pembayaran</h3>

              <div className="space-y-2">
                <Label>Metode Pembayaran</Label>
                <Select value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Tunai</SelectItem>
                    <SelectItem value="card">Kartu</SelectItem>
                    <SelectItem value="digital">Digital</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {paymentMethod === "cash" && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Uang Diterima</Label>
                    <Input
                      type="number"
                      value={cashReceived}
                      onChange={(e) => setCashReceived(Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>

                  {quickAmounts.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm">Nominal Cepat</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {quickAmounts.slice(0, 4).map((amount) => (
                          <Button
                            key={amount}
                            variant="outline"
                            size="sm"
                            onClick={() => setCashReceived(amount)}
                            className="text-sm bg-transparent"
                          >
                            Rp {amount.toLocaleString("id-ID")}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {cashReceived > 0 && (
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Kembalian:</span>
                        <span className={`font-bold text-lg ${change >= 0 ? "text-green-600" : "text-red-600"}`}>
                          Rp {Math.max(0, change).toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 bg-transparent">
              Batal
            </Button>
            <Button
              onClick={handleQuickSale}
              className="flex-1"
              disabled={!itemName || price <= 0 || (paymentMethod === "cash" && cashReceived < total)}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Proses Sale
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

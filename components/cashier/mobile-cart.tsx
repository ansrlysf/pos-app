"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Minus, Plus, Trash2, ShoppingCart, X, User, Gift, Percent, Users, Clock, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { PaymentDialog } from "./payment-dialog"
import { CustomerInfo } from "./customer-info"
import { SplitBillDialog } from "./split-bill-dialog"
import { HoldTransactionDialog } from "./hold-transaction-dialog"
import { QuickSaleDialog } from "./quick-sale-dialog"

interface MobileCartProps {
  onClose?: () => void
}

interface Customer {
  id: string
  name: string
  phone: string
  email?: string
  address?: string
  memberType: "regular" | "silver" | "gold" | "platinum"
  points: number
  totalSpent: number
}

export function MobileCart({ onClose }: MobileCartProps) {
  const { cart, updateCartItem, removeFromCart, clearCart } = useAppStore()
  const [discount, setDiscount] = useState(0)
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [customerDialogOpen, setCustomerDialogOpen] = useState(false)
  const [splitBillDialogOpen, setSplitBillDialogOpen] = useState(false)
  const [holdTransactionDialogOpen, setHoldTransactionDialogOpen] = useState(false)
  const [quickSaleDialogOpen, setQuickSaleDialogOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [usePoints, setUsePoints] = useState(false)
  const [note, setNote] = useState("")
  const { toast } = useToast()

  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0)
  const tax = subtotal * 0.1 // 10% tax
  const discountAmount = subtotal * (discount / 100)
  const pointsDiscount = usePoints && selectedCustomer ? Math.min(selectedCustomer.points * 100, subtotal * 0.1) : 0
  const total = subtotal + tax - discountAmount - pointsDiscount

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId)
    } else {
      updateCartItem(productId, newQuantity)
    }
  }

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Keranjang kosong",
        description: "Tambahkan produk terlebih dahulu",
        variant: "destructive",
      })
      return
    }
    setPaymentDialogOpen(true)
  }

  const applyQuickDiscount = (percentage: number) => {
    setDiscount(percentage)
    toast({
      title: "Diskon diterapkan",
      description: `Diskon ${percentage}% telah diterapkan`,
    })
  }

  const handleSplitBill = () => {
    if (cart.length === 0) {
      toast({
        title: "Keranjang kosong",
        description: "Tidak ada transaksi untuk di-split",
        variant: "destructive",
      })
      return
    }
    setSplitBillDialogOpen(true)
  }

  return (
    <>
      <div className="h-full flex flex-col">
        {/* Header - Mobile */}
        <div className="flex items-center justify-between p-4 border-b md:hidden">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Keranjang Belanja</h2>
          </div>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Desktop Header */}
        <CardHeader className="pb-4 hidden md:block">
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Keranjang Belanja
          </CardTitle>
        </CardHeader>

        <div className="flex-1 flex flex-col p-4 md:px-6">
          {/* Quick Actions */}
          <div className="mb-4 grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" onClick={() => setQuickSaleDialogOpen(true)} className="bg-transparent">
              <Zap className="h-4 w-4 mr-1" />
              Quick Sale
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setHoldTransactionDialogOpen(true)}
              className="bg-transparent"
            >
              <Clock className="h-4 w-4 mr-1" />
              Hold/Resume
            </Button>
          </div>

          {/* Customer Info */}
          <div className="mb-4">
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent"
              onClick={() => setCustomerDialogOpen(true)}
            >
              <User className="h-4 w-4 mr-2" />
              {selectedCustomer ? (
                <div className="flex items-center justify-between w-full">
                  <span>{selectedCustomer.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {selectedCustomer.points} poin
                  </Badge>
                </div>
              ) : (
                "Pilih Customer (Opsional)"
              )}
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-hidden">
            {cart.length === 0 ? (
              <div className="text-center text-muted-foreground py-12">
                <ShoppingCart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Keranjang masih kosong</p>
                <p className="text-sm">Tambahkan produk untuk mulai transaksi</p>
              </div>
            ) : (
              <ScrollArea className="h-full">
                <div className="space-y-3">
                  {cart.map((item) => (
                    <Card key={item.product.id} className="p-3">
                      <div className="space-y-3">
                        {/* Product Info */}
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm leading-tight">{item.product.name}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Rp {item.product.price.toLocaleString("id-ID")}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive shrink-0 ml-2"
                            onClick={() => removeFromCart(item.product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-9 w-9 bg-transparent"
                              onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>

                            <span className="w-12 text-center font-medium text-lg">{item.quantity}</span>

                            <Button
                              variant="outline"
                              size="icon"
                              className="h-9 w-9 bg-transparent"
                              onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="text-right">
                            <div className="font-bold text-lg">Rp {item.subtotal.toLocaleString("id-ID")}</div>
                            <Badge variant="secondary" className="text-xs">
                              Stok: {item.product.stock}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>

          {/* Discount & Summary */}
          {cart.length > 0 && (
            <div className="space-y-4 mt-4 pt-4 border-t">
              {/* Quick Discount Buttons */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Diskon Cepat</Label>
                <div className="flex gap-2">
                  {[5, 10, 15, 20].map((percentage) => (
                    <Button
                      key={percentage}
                      variant={discount === percentage ? "default" : "outline"}
                      size="sm"
                      onClick={() => applyQuickDiscount(percentage)}
                      className="flex-1"
                    >
                      <Percent className="h-3 w-3 mr-1" />
                      {percentage}%
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom Discount Input */}
              <div className="space-y-2">
                <Label htmlFor="discount" className="text-sm font-medium">
                  Diskon Custom (%)
                </Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  max="100"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  placeholder="0"
                  className="h-12 text-lg"
                />
              </div>

              {/* Points Usage */}
              {selectedCustomer && selectedCustomer.points > 0 && (
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Gift className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">Gunakan {selectedCustomer.points} poin</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-green-600">-Rp {pointsDiscount.toLocaleString("id-ID")}</span>
                    <Button
                      variant={usePoints ? "default" : "outline"}
                      size="sm"
                      onClick={() => setUsePoints(!usePoints)}
                    >
                      {usePoints ? "Batalkan" : "Gunakan"}
                    </Button>
                  </div>
                </div>
              )}

              {/* Note */}
              <div className="space-y-2">
                <Label htmlFor="note" className="text-sm font-medium">
                  Catatan (Opsional)
                </Label>
                <Input
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Catatan untuk transaksi ini..."
                  className="h-10"
                />
              </div>

              {/* Summary */}
              <div className="space-y-3 bg-muted/50 p-4 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>Rp {subtotal.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Pajak (10%):</span>
                  <span>Rp {tax.toLocaleString("id-ID")}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Diskon ({discount}%):</span>
                    <span>-Rp {discountAmount.toLocaleString("id-ID")}</span>
                  </div>
                )}
                {pointsDiscount > 0 && (
                  <div className="flex justify-between text-sm text-yellow-600">
                    <span>Diskon Poin:</span>
                    <span>-Rp {pointsDiscount.toLocaleString("id-ID")}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-xl">
                  <span>Total:</span>
                  <span>Rp {total.toLocaleString("id-ID")}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button className="w-full h-14 text-lg font-semibold" size="lg" onClick={handleCheckout}>
                  Bayar Sekarang
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="h-12 bg-transparent"
                    onClick={handleSplitBill}
                    disabled={cart.length === 0}
                  >
                    <Users className="h-4 w-4 mr-1" />
                    Split Bill
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 bg-transparent"
                    onClick={clearCart}
                    disabled={cart.length === 0}
                  >
                    Kosongkan
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <PaymentDialog
          open={paymentDialogOpen}
          onOpenChange={(open) => {
            setPaymentDialogOpen(open)
            if (!open && onClose) {
              onClose()
            }
          }}
          total={total}
          discount={discountAmount + pointsDiscount}
          tax={tax}
          customer={selectedCustomer}
          note={note}
          pointsUsed={usePoints ? selectedCustomer?.points || 0 : 0}
        />
      </div>

      <CustomerInfo
        open={customerDialogOpen}
        onOpenChange={setCustomerDialogOpen}
        onCustomerSelect={setSelectedCustomer}
        selectedCustomer={selectedCustomer}
      />

      <SplitBillDialog
        open={splitBillDialogOpen}
        onOpenChange={setSplitBillDialogOpen}
        total={total}
        onSplitComplete={(splits) => {
          toast({
            title: "Split bill berhasil",
            description: `Bill dibagi menjadi ${splits.length} bagian`,
          })
        }}
      />

      <HoldTransactionDialog open={holdTransactionDialogOpen} onOpenChange={setHoldTransactionDialogOpen} />

      <QuickSaleDialog open={quickSaleDialogOpen} onOpenChange={setQuickSaleDialogOpen} />
    </>
  )
}

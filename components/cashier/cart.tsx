"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAppStore } from "@/lib/store"
import { PriceOverrideDialog } from "./price-override-dialog"
import { Minus, Plus, Trash2, Percent, DollarSign, Edit } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CartProps {
  className?: string
}

export function Cart({ className }: CartProps) {
  const { cart, updateCartItem, removeFromCart, clearCart, hasPermission, cashierSettings } = useAppStore()
  const [overrideDialogOpen, setOverrideDialogOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState("")
  const { toast } = useToast()

  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0)
  const totalDiscount = cart.reduce((sum, item) => sum + (item.discount?.amount || 0), 0)
  const total = cart.reduce((sum, item) => sum + item.finalPrice, 0)
  const tax = total * 0.1 // 10% tax
  const finalTotal = total + tax

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    const item = cart.find((item) => item.product.id === productId)
    if (item) {
      updateCartItem(productId, newQuantity, item.discount, item.priceOverride)
    }
  }

  const handleDiscount = (productId: string, type: "percentage" | "amount", value: number) => {
    if (!hasPermission("apply_item_discount")) {
      toast({
        title: "Akses ditolak",
        message: "Anda tidak memiliki izin untuk memberikan diskon",
        variant: "destructive",
      })
      return
    }

    const item = cart.find((item) => item.product.id === productId)
    if (!item) return

    let discountAmount = 0
    if (type === "percentage") {
      if (value > cashierSettings.maxDiscountPercent) {
        toast({
          title: "Diskon melebihi batas",
          description: `Diskon maksimal ${cashierSettings.maxDiscountPercent}%`,
          variant: "destructive",
        })
        return
      }
      discountAmount = (item.subtotal * value) / 100
    } else {
      if (value > cashierSettings.maxDiscountAmount) {
        toast({
          title: "Diskon melebihi batas",
          description: `Diskon maksimal Rp ${cashierSettings.maxDiscountAmount.toLocaleString("id-ID")}`,
          variant: "destructive",
        })
        return
      }
      discountAmount = value
    }

    const discount = {
      type,
      value,
      amount: discountAmount,
    }

    updateCartItem(productId, item.quantity, discount, item.priceOverride)
  }

  const handlePriceOverride = (productId: string, newPrice: number, reason: string) => {
    const item = cart.find((item) => item.product.id === productId)
    if (!item) return

    const priceOverride = {
      originalPrice: item.product.price,
      newPrice,
      reason,
    }

    updateCartItem(productId, item.quantity, item.discount, priceOverride)
    toast({
      title: "Harga berhasil diubah",
      description: `Harga ${item.product.name} diubah menjadi Rp ${newPrice.toLocaleString("id-ID")}`,
    })
  }

  const openPriceOverride = (productId: string) => {
    if (!hasPermission("override_price")) {
      toast({
        title: "Akses ditolak",
        message: "Anda tidak memiliki izin untuk mengubah harga",
        variant: "destructive",
      })
      return
    }
    setSelectedProductId(productId)
    setOverrideDialogOpen(true)
  }

  if (cart.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Keranjang</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>Keranjang kosong</p>
            <p className="text-sm">Tambahkan produk untuk memulai transaksi</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className={className}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Keranjang ({cart.length})</CardTitle>
          <Button variant="ghost" size="sm" onClick={clearCart}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {cart.map((item) => (
              <div key={item.product.id} className="space-y-2 p-3 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.product.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      {item.priceOverride ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs line-through text-muted-foreground">
                            Rp {item.priceOverride.originalPrice.toLocaleString("id-ID")}
                          </span>
                          <span className="text-sm font-medium text-blue-600">
                            Rp {item.priceOverride.newPrice.toLocaleString("id-ID")}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            Override
                          </Badge>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Rp {item.product.price.toLocaleString("id-ID")}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.product.id, Number.parseInt(e.target.value) || 1)}
                      className="w-16 text-center"
                      min="1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">Rp {item.finalPrice.toLocaleString("id-ID")}</div>
                    {item.discount && (
                      <div className="text-xs text-red-600">
                        -
                        {item.discount.type === "percentage"
                          ? `${item.discount.value}%`
                          : `Rp ${item.discount.amount.toLocaleString("id-ID")}`}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  {hasPermission("apply_item_discount") && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDiscount(item.product.id, "percentage", 10)}
                        className="text-xs"
                      >
                        <Percent className="h-3 w-3 mr-1" />
                        10%
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDiscount(item.product.id, "amount", 5000)}
                        className="text-xs"
                      >
                        <DollarSign className="h-3 w-3 mr-1" />
                        5K
                      </Button>
                    </>
                  )}
                  {hasPermission("override_price") && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openPriceOverride(item.product.id)}
                      className="text-xs"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Harga
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>Rp {subtotal.toLocaleString("id-ID")}</span>
            </div>
            {totalDiscount > 0 && (
              <div className="flex justify-between text-sm text-red-600">
                <span>Diskon:</span>
                <span>-Rp {totalDiscount.toLocaleString("id-ID")}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span>Pajak (10%):</span>
              <span>Rp {tax.toLocaleString("id-ID")}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>Rp {finalTotal.toLocaleString("id-ID")}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <PriceOverrideDialog
        open={overrideDialogOpen}
        onOpenChange={setOverrideDialogOpen}
        productId={selectedProductId}
        currentPrice={cart.find((item) => item.product.id === selectedProductId)?.product.price || 0}
        onOverride={handlePriceOverride}
      />
    </>
  )
}

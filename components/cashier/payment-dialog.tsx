"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { CreditCard, Banknote, Smartphone, Printer, User, Gift } from "lucide-react"

interface Customer {
  id: string
  name: string
  phone: string
  email?: string
  memberType: "regular" | "silver" | "gold" | "platinum"
  points: number
  totalSpent: number
}

interface PaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  total: number
  discount: number
  tax: number
  customer?: Customer | null
  note?: string
  pointsUsed?: number
}

export function PaymentDialog({
  open,
  onOpenChange,
  total,
  discount,
  tax,
  customer,
  note,
  pointsUsed = 0,
}: PaymentDialogProps) {
  const { cart, processTransaction, currentUser } = useAppStore()
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "digital">("cash")
  const [cashReceived, setCashReceived] = useState<number>(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const change = cashReceived - total

  const handlePayment = async () => {
    if (paymentMethod === "cash" && cashReceived < total) {
      toast({
        title: "Uang tidak cukup",
        description: "Jumlah uang yang diterima kurang dari total",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      const transaction = {
        items: cart,
        total: cart.reduce((sum, item) => sum + item.subtotal, 0),
        discount,
        tax,
        finalTotal: total,
        paymentMethod,
        cashReceived: paymentMethod === "cash" ? cashReceived : undefined,
        change: paymentMethod === "cash" ? change : undefined,
        cashierId: currentUser?.id || "",
        customerId: customer?.id,
        customerName: customer?.name,
        note,
        pointsUsed,
      }

      processTransaction(transaction)

      toast({
        title: "Pembayaran berhasil!",
        description: customer ? `Transaksi untuk ${customer.name} telah diproses` : "Transaksi telah diproses",
      })

      // Add points to customer (simulation)
      if (customer) {
        const earnedPoints = Math.floor(total / 10000) // 1 point per 10k spent
        toast({
          title: "Poin diperoleh!",
          description: `${customer.name} mendapat ${earnedPoints} poin`,
        })
      }

      // Print receipt (simulation)
      setTimeout(() => {
        toast({
          title: "Struk dicetak",
          description: "Struk telah dicetak",
        })
      }, 1000)

      setIsProcessing(false)
      onOpenChange(false)
      setCashReceived(0)
    }, 2000)
  }

  const paymentMethods = [
    { value: "cash", label: "Tunai", icon: Banknote },
    { value: "card", label: "Kartu", icon: CreditCard },
    { value: "digital", label: "Digital", icon: Smartphone },
  ]

  // Quick amount buttons for cash
  const quickAmounts = [
    Math.ceil(total / 1000) * 1000, // Round up to nearest thousand
    Math.ceil(total / 5000) * 5000, // Round up to nearest 5k
    Math.ceil(total / 10000) * 10000, // Round up to nearest 10k
    Math.ceil(total / 50000) * 50000, // Round up to nearest 50k
  ].filter((amount, index, arr) => arr.indexOf(amount) === index && amount > total)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl">Pembayaran</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="p-6 space-y-6">
            {/* Customer Info */}
            {customer && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">Customer</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{customer.name}</p>
                    <p className="text-sm text-muted-foreground">{customer.phone}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="mb-1">
                      {customer.memberType}
                    </Badge>
                    {pointsUsed > 0 && (
                      <div className="flex items-center gap-1 text-sm text-yellow-600">
                        <Gift className="h-3 w-3" />-{pointsUsed} poin
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Payment Summary */}
            <div className="bg-muted p-4 rounded-lg space-y-3">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>Rp {(total - tax + discount).toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Pajak:</span>
                <span>Rp {tax.toLocaleString("id-ID")}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Total Diskon:</span>
                  <span>-Rp {discount.toLocaleString("id-ID")}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>Rp {total.toLocaleString("id-ID")}</span>
              </div>
            </div>

            {/* Note */}
            {note && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-800 mb-1">Catatan:</p>
                <p className="text-sm text-blue-700">{note}</p>
              </div>
            )}

            {/* Payment Method */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Metode Pembayaran</Label>
              <Select value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => {
                    const Icon = method.icon
                    return (
                      <SelectItem key={method.value} value={method.value}>
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5" />
                          <span className="text-base">{method.label}</span>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Cash Payment */}
            {paymentMethod === "cash" && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label htmlFor="cash" className="text-base font-medium">
                    Uang Diterima
                  </Label>
                  <Input
                    id="cash"
                    type="number"
                    value={cashReceived}
                    onChange={(e) => setCashReceived(Number(e.target.value))}
                    placeholder="0"
                    className="h-12 text-lg"
                  />
                </div>

                {/* Quick Amount Buttons */}
                {quickAmounts.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Nominal Cepat</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {quickAmounts.slice(0, 4).map((amount) => (
                        <Button
                          key={amount}
                          variant="outline"
                          size="sm"
                          onClick={() => setCashReceived(amount)}
                          className="h-10 text-sm bg-transparent"
                        >
                          Rp {amount.toLocaleString("id-ID")}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Change Display */}
                {cashReceived > 0 && (
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-base">Kembalian:</span>
                      <span className={`font-bold text-xl ${change >= 0 ? "text-green-600" : "text-red-600"}`}>
                        Rp {Math.max(0, change).toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Action Buttons */}
        <div className="p-6 pt-0 space-y-3">
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 h-12 bg-transparent"
              onClick={() => onOpenChange(false)}
              disabled={isProcessing}
            >
              Batal
            </Button>
            <Button
              className="flex-1 h-12 text-base font-semibold"
              onClick={handlePayment}
              disabled={isProcessing || (paymentMethod === "cash" && cashReceived < total)}
            >
              {isProcessing ? "Memproses..." : "Bayar"}
            </Button>
          </div>

          {/* Print Receipt */}
          <Button variant="outline" className="w-full h-12 bg-transparent" disabled>
            <Printer className="h-4 w-4 mr-2" />
            Cetak Struk
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAppStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { Clock, Pause, Play, Trash2, User } from "lucide-react"

interface HoldTransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface HeldTransaction {
  id: string
  customerName: string
  items: any[]
  total: number
  note: string
  heldAt: Date
  heldBy: string
}

export function HoldTransactionDialog({ open, onOpenChange }: HoldTransactionDialogProps) {
  const { cart, currentUser, clearCart, addToCart } = useAppStore()
  const [heldTransactions, setHeldTransactions] = useState<HeldTransaction[]>([])
  const [customerName, setCustomerName] = useState("")
  const [note, setNote] = useState("")
  const { toast } = useToast()

  const holdCurrentTransaction = () => {
    if (cart.length === 0) {
      toast({
        title: "Keranjang kosong",
        description: "Tidak ada transaksi untuk di-hold",
        variant: "destructive",
      })
      return
    }

    const heldTransaction: HeldTransaction = {
      id: Date.now().toString(),
      customerName: customerName || "Guest",
      items: [...cart],
      total: cart.reduce((sum, item) => sum + item.subtotal, 0),
      note,
      heldAt: new Date(),
      heldBy: currentUser?.name || "Unknown",
    }

    setHeldTransactions([...heldTransactions, heldTransaction])
    clearCart()
    setCustomerName("")
    setNote("")

    toast({
      title: "Transaksi di-hold",
      description: `Transaksi untuk ${heldTransaction.customerName} telah disimpan`,
    })
  }

  const resumeTransaction = (transaction: HeldTransaction) => {
    // Clear current cart and load held transaction
    clearCart()
    transaction.items.forEach((item) => {
      addToCart(item.product, item.quantity)
    })

    // Remove from held transactions
    setHeldTransactions(heldTransactions.filter((t) => t.id !== transaction.id))

    onOpenChange(false)
    toast({
      title: "Transaksi dilanjutkan",
      description: `Transaksi ${transaction.customerName} telah dimuat`,
    })
  }

  const deleteHeldTransaction = (id: string) => {
    setHeldTransactions(heldTransactions.filter((t) => t.id !== id))
    toast({
      title: "Transaksi dihapus",
      description: "Transaksi yang di-hold telah dihapus",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Hold Transaction
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Hold Current Transaction */}
          {cart.length > 0 && (
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-semibold">Hold Transaksi Saat Ini</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Nama Customer</Label>
                    <Input
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Nama customer (opsional)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Catatan</Label>
                    <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Catatan (opsional)" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{cart.length} items</p>
                    <p className="font-bold">
                      Rp {cart.reduce((sum, item) => sum + item.subtotal, 0).toLocaleString("id-ID")}
                    </p>
                  </div>
                  <Button onClick={holdCurrentTransaction}>
                    <Pause className="h-4 w-4 mr-2" />
                    Hold Transaksi
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Held Transactions List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Transaksi yang Di-hold ({heldTransactions.length})</h3>
            </div>

            {heldTransactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Tidak ada transaksi yang di-hold</p>
              </div>
            ) : (
              <ScrollArea className="max-h-96">
                <div className="space-y-3">
                  {heldTransactions.map((transaction) => (
                    <Card key={transaction.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <span className="font-medium">{transaction.customerName}</span>
                              <Badge variant="secondary">{transaction.items.length} items</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Di-hold: {transaction.heldAt.toLocaleString("id-ID")}
                            </p>
                            <p className="text-sm text-muted-foreground">Oleh: {transaction.heldBy}</p>
                            {transaction.note && <p className="text-sm text-blue-600">Note: {transaction.note}</p>}
                          </div>
                          <div className="text-right space-y-2">
                            <p className="font-bold text-lg">Rp {transaction.total.toLocaleString("id-ID")}</p>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => resumeTransaction(transaction)}
                                className="bg-transparent"
                              >
                                <Play className="h-4 w-4 mr-1" />
                                Resume
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteHeldTransaction(transaction.id)}
                                className="text-destructive hover:text-destructive bg-transparent"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Transaction Items Preview */}
                        <div className="mt-3 pt-3 border-t">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            {transaction.items.slice(0, 4).map((item, index) => (
                              <div key={index} className="flex justify-between">
                                <span className="truncate">{item.product.name}</span>
                                <span>x{item.quantity}</span>
                              </div>
                            ))}
                            {transaction.items.length > 4 && (
                              <div className="col-span-2 text-center text-muted-foreground">
                                +{transaction.items.length - 4} items lainnya
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

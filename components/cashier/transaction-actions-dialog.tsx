"use client"

import { useState } from "react"
import { useAppStore, type Transaction } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
  Receipt,
  XCircle,
  RotateCcw,
  Printer,
  AlertTriangle,
  DollarSign,
  Calendar,
  User,
  CreditCard,
} from "lucide-react"

interface TransactionActionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction: Transaction | null
}

export function TransactionActionsDialog({ open, onOpenChange, transaction }: TransactionActionsDialogProps) {
  const { hasPermission, voidTransaction, processRefund } = useAppStore()
  const [action, setAction] = useState<"void" | "refund" | "reprint" | null>(null)
  const [reason, setReason] = useState("")
  const [refundAmount, setRefundAmount] = useState<number>(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const canVoid = hasPermission("void_transaction")
  const canRefund = hasPermission("process_refund")
  const canReprint = hasPermission("reprint_receipt")

  if (!transaction) return null

  const isVoidable = transaction.status === "completed"
  const isRefundable = transaction.status === "completed"

  const handleVoid = async () => {
    if (!canVoid || !reason.trim()) return

    setIsProcessing(true)

    setTimeout(() => {
      voidTransaction(transaction.id, reason.trim())

      toast({
        title: "Transaksi dibatalkan",
        description: `Transaksi ${transaction.id} berhasil dibatalkan`,
        variant: "destructive",
      })

      setIsProcessing(false)
      onOpenChange(false)
      resetForm()
    }, 1500)
  }

  const handleRefund = async () => {
    if (!canRefund || !reason.trim() || refundAmount <= 0) return

    if (refundAmount > transaction.finalTotal) {
      toast({
        title: "Jumlah refund tidak valid",
        description: "Jumlah refund tidak boleh melebihi total transaksi",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    setTimeout(() => {
      processRefund(transaction.id, refundAmount, reason.trim())

      toast({
        title: "Refund berhasil",
        description: `Refund Rp ${refundAmount.toLocaleString("id-ID")} untuk transaksi ${transaction.id}`,
      })

      setIsProcessing(false)
      onOpenChange(false)
      resetForm()
    }, 1500)
  }

  const handleReprint = async () => {
    if (!canReprint) return

    setIsProcessing(true)

    setTimeout(() => {
      toast({
        title: "Struk dicetak ulang",
        description: `Struk untuk transaksi ${transaction.id} berhasil dicetak`,
      })

      setIsProcessing(false)
      onOpenChange(false)
    }, 1000)
  }

  const resetForm = () => {
    setAction(null)
    setReason("")
    setRefundAmount(0)
  }

  const handleCancel = () => {
    onOpenChange(false)
    resetForm()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-700">Selesai</Badge>
      case "voided":
        return <Badge variant="destructive">Dibatalkan</Badge>
      case "refunded":
        return <Badge className="bg-orange-100 text-orange-700">Refund</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "cash":
        return <DollarSign className="h-4 w-4 text-green-600" />
      case "card":
        return <CreditCard className="h-4 w-4 text-blue-600" />
      case "digital":
        return <CreditCard className="h-4 w-4 text-purple-600" />
      default:
        return <DollarSign className="h-4 w-4" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Aksi Transaksi - {transaction.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Transaction Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detail Transaksi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">ID Transaksi</Label>
                  <p className="font-medium">{transaction.id}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Status</Label>
                  <div>{getStatusBadge(transaction.status)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Tanggal</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{new Date(transaction.createdAt).toLocaleString("id-ID")}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Kasir</Label>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{transaction.cashierId}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Metode Pembayaran</Label>
                  <div className="flex items-center gap-2">
                    {getPaymentMethodIcon(transaction.paymentMethod)}
                    <span className="font-medium capitalize">{transaction.paymentMethod}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Total</Label>
                  <span className="font-bold text-lg">Rp {transaction.finalTotal.toLocaleString("id-ID")}</span>
                </div>
              </div>

              {transaction.customerName && (
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Customer</Label>
                  <p className="font-medium">{transaction.customerName}</p>
                </div>
              )}

              {transaction.note && (
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Catatan</Label>
                  <p className="text-sm bg-muted p-2 rounded">{transaction.note}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Selection */}
          {!action && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pilih Aksi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {canReprint && (
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 h-12 bg-transparent"
                    onClick={() => setAction("reprint")}
                  >
                    <Printer className="h-5 w-5 text-blue-600" />
                    <div className="text-left">
                      <div className="font-medium">Cetak Ulang Struk</div>
                      <div className="text-sm text-muted-foreground">Cetak ulang struk transaksi</div>
                    </div>
                  </Button>
                )}

                {canVoid && isVoidable && (
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 h-12 bg-transparent"
                    onClick={() => setAction("void")}
                  >
                    <XCircle className="h-5 w-5 text-red-600" />
                    <div className="text-left">
                      <div className="font-medium">Batalkan Transaksi</div>
                      <div className="text-sm text-muted-foreground">Batalkan seluruh transaksi</div>
                    </div>
                  </Button>
                )}

                {canRefund && isRefundable && (
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 h-12 bg-transparent"
                    onClick={() => {
                      setAction("refund")
                      setRefundAmount(transaction.finalTotal)
                    }}
                  >
                    <RotateCcw className="h-5 w-5 text-orange-600" />
                    <div className="text-left">
                      <div className="font-medium">Refund</div>
                      <div className="text-sm text-muted-foreground">Kembalikan sebagian atau seluruh pembayaran</div>
                    </div>
                  </Button>
                )}

                {!canVoid && !canRefund && !canReprint && (
                  <div className="text-center py-4">
                    <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Tidak ada aksi yang tersedia</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Reprint Action */}
          {action === "reprint" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Printer className="h-5 w-5" />
                  Cetak Ulang Struk
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Struk untuk transaksi {transaction.id} akan dicetak ulang.</p>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setAction(null)}>
                    Kembali
                  </Button>
                  <Button className="flex-1" onClick={handleReprint} disabled={isProcessing}>
                    {isProcessing ? "Mencetak..." : "Cetak Struk"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Void Action */}
          {action === "void" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-red-600">
                  <XCircle className="h-5 w-5" />
                  Batalkan Transaksi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-800 mb-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-medium">Peringatan</span>
                  </div>
                  <p className="text-sm text-red-700">
                    Tindakan ini akan membatalkan seluruh transaksi dan tidak dapat dibatalkan.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="voidReason">
                    Alasan Pembatalan <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="voidReason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Masukkan alasan pembatalan transaksi..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setAction(null)}>
                    Kembali
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={handleVoid}
                    disabled={isProcessing || !reason.trim()}
                  >
                    {isProcessing ? "Membatalkan..." : "Batalkan Transaksi"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Refund Action */}
          {action === "refund" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-orange-600">
                  <RotateCcw className="h-5 w-5" />
                  Refund Transaksi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Total Transaksi</Label>
                    <p className="font-medium">Rp {transaction.finalTotal.toLocaleString("id-ID")}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Maksimal Refund</Label>
                    <p className="font-medium">Rp {transaction.finalTotal.toLocaleString("id-ID")}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="refundAmount">Jumlah Refund (Rp)</Label>
                  <Input
                    id="refundAmount"
                    type="number"
                    min="1"
                    max={transaction.finalTotal}
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(Number(e.target.value))}
                    className="text-lg font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="refundReason">
                    Alasan Refund <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="refundReason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Masukkan alasan refund..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setAction(null)}>
                    Kembali
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleRefund}
                    disabled={
                      isProcessing || !reason.trim() || refundAmount <= 0 || refundAmount > transaction.finalTotal
                    }
                  >
                    {isProcessing ? "Memproses..." : `Refund Rp ${refundAmount.toLocaleString("id-ID")}`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Close Button */}
          {!action && (
            <Button variant="outline" className="w-full bg-transparent" onClick={handleCancel}>
              Tutup
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

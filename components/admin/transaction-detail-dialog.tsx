"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Receipt, Printer, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TransactionDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction?: any
}

export function TransactionDetailDialog({ open, onOpenChange, transaction }: TransactionDetailDialogProps) {
  const { toast } = useToast()

  if (!transaction) return null

  const handlePrintReceipt = () => {
    toast({
      title: "Struk dicetak",
      description: "Struk transaksi telah dicetak",
    })
  }

  const handleDownloadReceipt = () => {
    toast({
      title: "Struk diunduh",
      description: "File struk telah diunduh",
    })
  }

  const getPaymentLabel = (method: string) => {
    switch (method) {
      case "cash":
        return "Tunai"
      case "card":
        return "Kartu"
      case "digital":
        return "Digital"
      default:
        return method
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Detail Transaksi #{transaction.id}
          </DialogTitle>
          <DialogDescription>Informasi lengkap transaksi penjualan</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Transaction Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Informasi Transaksi</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID Transaksi:</span>
                  <span className="font-mono">#{transaction.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tanggal:</span>
                  <span>{new Date(transaction.createdAt).toLocaleDateString("id-ID")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Waktu:</span>
                  <span>{new Date(transaction.createdAt).toLocaleTimeString("id-ID")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Kasir:</span>
                  <span>{transaction.cashierId}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Informasi Pembayaran</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Metode:</span>
                  <Badge variant="secondary">{getPaymentLabel(transaction.paymentMethod)}</Badge>
                </div>
                {transaction.paymentMethod === "cash" && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Uang Diterima:</span>
                      <span>Rp {transaction.cashReceived?.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Kembalian:</span>
                      <span>Rp {transaction.change?.toLocaleString("id-ID")}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Items */}
          <div className="space-y-4">
            <h4 className="font-medium">Item Pembelian</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produk</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead className="text-right">Harga</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transaction.items.map((item: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{item.product.name}</div>
                        <div className="text-xs text-muted-foreground">{item.product.category}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{item.quantity}</TableCell>
                    <TableCell className="text-right">Rp {item.product.price.toLocaleString("id-ID")}</TableCell>
                    <TableCell className="text-right font-medium">Rp {item.subtotal.toLocaleString("id-ID")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Separator />

          {/* Summary */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>Rp {transaction.total.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Pajak:</span>
              <span>Rp {transaction.tax.toLocaleString("id-ID")}</span>
            </div>
            {transaction.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Diskon:</span>
                <span>-Rp {transaction.discount.toLocaleString("id-ID")}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>Rp {transaction.finalTotal.toLocaleString("id-ID")}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrintReceipt} className="flex-1 bg-transparent">
              <Printer className="h-4 w-4 mr-2" />
              Cetak Struk
            </Button>
            <Button variant="outline" onClick={handleDownloadReceipt} className="flex-1 bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Unduh PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

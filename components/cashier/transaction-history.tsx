"use client"

import { useState, useMemo } from "react"
import { useAppStore, type Transaction } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TransactionActionsDialog } from "./transaction-actions-dialog"
import {
  Search,
  Filter,
  Calendar,
  DollarSign,
  CreditCard,
  Smartphone,
  Receipt,
  MoreHorizontal,
  RefreshCw,
} from "lucide-react"

export function TransactionHistory() {
  const { transactions, hasPermission } = useAppStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [paymentFilter, setPaymentFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [actionsDialogOpen, setActionsDialogOpen] = useState(false)

  const canViewHistory = hasPermission("view_transaction_history")

  const filteredTransactions = useMemo(() => {
    if (!canViewHistory) return []

    return transactions
      .filter((transaction) => {
        // Search filter
        const matchesSearch =
          transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.cashierId.toLowerCase().includes(searchTerm.toLowerCase())

        // Status filter
        const matchesStatus = statusFilter === "all" || transaction.status === statusFilter

        // Payment method filter
        const matchesPayment = paymentFilter === "all" || transaction.paymentMethod === paymentFilter

        // Date filter
        let matchesDate = true
        if (dateFilter !== "all") {
          const transactionDate = new Date(transaction.createdAt)
          const today = new Date()

          switch (dateFilter) {
            case "today":
              matchesDate = transactionDate.toDateString() === today.toDateString()
              break
            case "week":
              const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
              matchesDate = transactionDate >= weekAgo
              break
            case "month":
              const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
              matchesDate = transactionDate >= monthAgo
              break
          }
        }

        return matchesSearch && matchesStatus && matchesPayment && matchesDate
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [transactions, searchTerm, statusFilter, paymentFilter, dateFilter, canViewHistory])

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

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case "cash":
        return <DollarSign className="h-4 w-4 text-green-600" />
      case "card":
        return <CreditCard className="h-4 w-4 text-blue-600" />
      case "digital":
        return <Smartphone className="h-4 w-4 text-purple-600" />
      default:
        return <DollarSign className="h-4 w-4" />
    }
  }

  const handleTransactionAction = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setActionsDialogOpen(true)
  }

  if (!canViewHistory) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Akses Ditolak</h3>
            <p className="text-muted-foreground">Anda tidak memiliki izin untuk melihat riwayat transaksi.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter & Pencarian
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Cari Transaksi</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Cari berdasarkan ID, customer, atau kasir..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="completed">Selesai</SelectItem>
                  <SelectItem value="voided">Dibatalkan</SelectItem>
                  <SelectItem value="refunded">Refund</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Pembayaran</Label>
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua Metode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Metode</SelectItem>
                  <SelectItem value="cash">Tunai</SelectItem>
                  <SelectItem value="card">Kartu</SelectItem>
                  <SelectItem value="digital">Digital</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Periode</Label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua Waktu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Waktu</SelectItem>
                  <SelectItem value="today">Hari Ini</SelectItem>
                  <SelectItem value="week">7 Hari Terakhir</SelectItem>
                  <SelectItem value="month">30 Hari Terakhir</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-sm text-muted-foreground">
              Menampilkan {filteredTransactions.length} dari {transactions.length} transaksi
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm("")
                setStatusFilter("all")
                setPaymentFilter("all")
                setDateFilter("all")
              }}
              className="gap-2 bg-transparent"
            >
              <RefreshCw className="h-4 w-4" />
              Reset Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transaction List */}
      <div className="space-y-4">
        {filteredTransactions.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Tidak Ada Transaksi</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== "all" || paymentFilter !== "all" || dateFilter !== "all"
                    ? "Tidak ada transaksi yang sesuai dengan filter."
                    : "Belum ada transaksi yang tercatat."}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredTransactions.map((transaction) => (
            <Card key={transaction.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-2">
                    {/* Header Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-medium">{transaction.id}</span>
                        {getStatusBadge(transaction.status)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {new Date(transaction.createdAt).toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>

                    {/* Details Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getPaymentIcon(transaction.paymentMethod)}
                          <span className="text-sm capitalize">{transaction.paymentMethod}</span>
                        </div>
                        {transaction.customerName && (
                          <span className="text-sm text-muted-foreground">Customer: {transaction.customerName}</span>
                        )}
                        <span className="text-sm text-muted-foreground">Kasir: {transaction.cashierId}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-lg">Rp {transaction.finalTotal.toLocaleString("id-ID")}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTransactionAction(transaction)}
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Items Summary */}
                    <div className="text-sm text-muted-foreground">
                      {transaction.items.length} item{transaction.items.length > 1 ? "s" : ""}
                      {transaction.discount > 0 && (
                        <span className="ml-2">• Diskon: Rp {transaction.discount.toLocaleString("id-ID")}</span>
                      )}
                      {transaction.note && <span className="ml-2">• {transaction.note}</span>}
                    </div>

                    {/* Void/Refund Info */}
                    {transaction.status === "voided" && transaction.voidReason && (
                      <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                        Dibatalkan: {transaction.voidReason}
                      </div>
                    )}
                    {transaction.status === "refunded" && transaction.refundReason && (
                      <div className="text-sm text-orange-600 bg-orange-50 p-2 rounded">
                        Refund Rp {transaction.refundAmount?.toLocaleString("id-ID")}: {transaction.refundReason}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Transaction Actions Dialog */}
      <TransactionActionsDialog
        open={actionsDialogOpen}
        onOpenChange={setActionsDialogOpen}
        transaction={selectedTransaction}
      />
    </div>
  )
}

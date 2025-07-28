"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TransactionDetailDialog } from "@/components/admin/transaction-detail-dialog"
import { Search, Eye, Download, Receipt, CreditCard, Banknote, Smartphone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function TransactionsPage() {
  const { transactions } = useAppStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPayment, setSelectedPayment] = useState("all")
  const [selectedDate, setSelectedDate] = useState("all")
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)
  const { toast } = useToast()

  const paymentMethods = ["all", "cash", "card", "digital"]
  const dateRanges = ["all", "today", "week", "month"]

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPayment = selectedPayment === "all" || transaction.paymentMethod === selectedPayment

    let matchesDate = true
    if (selectedDate !== "all") {
      const transactionDate = new Date(transaction.createdAt)
      const today = new Date()

      switch (selectedDate) {
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

    return matchesSearch && matchesPayment && matchesDate
  })

  const handleViewDetail = (transaction: any) => {
    setSelectedTransaction(transaction)
    setDetailDialogOpen(true)
  }

  const handleExportTransactions = () => {
    const csvContent = [
      ["ID", "Tanggal", "Total", "Pembayaran", "Items", "Kasir"],
      ...filteredTransactions.map((t) => [
        t.id,
        new Date(t.createdAt).toLocaleDateString("id-ID"),
        t.finalTotal,
        t.paymentMethod,
        t.items.length,
        t.cashierId,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `transaksi-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Export berhasil",
      description: "Data transaksi telah diexport ke CSV",
    })
  }

  const totalRevenue = filteredTransactions.reduce((sum, t) => sum + t.finalTotal, 0)
  const totalTransactions = filteredTransactions.length
  const averageTransaction = totalRevenue / totalTransactions || 0

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case "cash":
        return <Banknote className="h-4 w-4" />
      case "card":
        return <CreditCard className="h-4 w-4" />
      case "digital":
        return <Smartphone className="h-4 w-4" />
      default:
        return <Receipt className="h-4 w-4" />
    }
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">History Transaksi</h2>
          <p className="text-muted-foreground">Riwayat semua transaksi penjualan</p>
        </div>
        <Button onClick={handleExportTransactions}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transaksi</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
            <p className="text-xs text-muted-foreground">Dari filter yang dipilih</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
            <Receipt className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">Rp {totalRevenue.toLocaleString("id-ID")}</div>
            <p className="text-xs text-muted-foreground">Dari filter yang dipilih</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata Transaksi</CardTitle>
            <Receipt className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">Rp {averageTransaction.toLocaleString("id-ID")}</div>
            <p className="text-xs text-muted-foreground">Per transaksi</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter & Pencarian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari ID transaksi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedPayment} onValueChange={setSelectedPayment}>
              <SelectTrigger>
                <SelectValue placeholder="Metode Pembayaran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Pembayaran</SelectItem>
                <SelectItem value="cash">Tunai</SelectItem>
                <SelectItem value="card">Kartu</SelectItem>
                <SelectItem value="digital">Digital</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger>
                <SelectValue placeholder="Periode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Waktu</SelectItem>
                <SelectItem value="today">Hari Ini</SelectItem>
                <SelectItem value="week">7 Hari Terakhir</SelectItem>
                <SelectItem value="month">30 Hari Terakhir</SelectItem>
              </SelectContent>
            </Select>
            <Input type="date" />
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Transaksi ({filteredTransactions.length})</CardTitle>
          <CardDescription>
            Menampilkan {filteredTransactions.length} dari {transactions.length} transaksi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Transaksi</TableHead>
                <TableHead>Tanggal & Waktu</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Pembayaran</TableHead>
                <TableHead>Kasir</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-mono text-sm">#{transaction.id}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">
                        {new Date(transaction.createdAt).toLocaleDateString("id-ID")}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(transaction.createdAt).toLocaleTimeString("id-ID")}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{transaction.items.length} item(s)</Badge>
                  </TableCell>
                  <TableCell className="font-medium">Rp {transaction.finalTotal.toLocaleString("id-ID")}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getPaymentIcon(transaction.paymentMethod)}
                      <span className="text-sm">{getPaymentLabel(transaction.paymentMethod)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{transaction.cashierId}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleViewDetail(transaction)}>
                      <Eye className="h-4 w-4 mr-1" />
                      Detail
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Transaction Detail Dialog */}
      <TransactionDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        transaction={selectedTransaction}
      />
    </div>
  )
}

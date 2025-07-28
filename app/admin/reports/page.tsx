"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SalesReportChart } from "@/components/admin/sales-report-chart"
import { ProductSalesChart } from "@/components/admin/product-sales-chart"
import { RevenueChart } from "@/components/admin/revenue-chart"
import { Download, TrendingUp, DollarSign, Package, ShoppingCart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ReportsPage() {
  const { transactions, products } = useAppStore()
  const [dateRange, setDateRange] = useState("7")
  const [reportType, setReportType] = useState("sales")
  const { toast } = useToast()

  // Calculate metrics
  const totalRevenue = transactions.reduce((sum, t) => sum + t.finalTotal, 0)
  const totalTransactions = transactions.length
  const averageTransaction = totalRevenue / totalTransactions || 0
  const totalProfit = transactions.reduce((sum, t) => {
    return (
      sum +
      t.items.reduce((itemSum, item) => {
        return itemSum + (item.product.price - item.product.cost) * item.quantity
      }, 0)
    )
  }, 0)

  const handleExportReport = () => {
    const reportData = transactions.map((t) => ({
      id: t.id,
      date: new Date(t.createdAt).toLocaleDateString("id-ID"),
      items: t.items.length,
      total: t.finalTotal,
      payment: t.paymentMethod,
      cashier: t.cashierId,
    }))

    const csvContent = [
      ["ID Transaksi", "Tanggal", "Jumlah Item", "Total", "Pembayaran", "Kasir"],
      ...reportData.map((r) => [r.id, r.date, r.items, r.total, r.payment, r.cashier]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `laporan-${reportType}-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Export berhasil",
      description: "Laporan telah diexport ke CSV",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Laporan & Analytics</h2>
          <p className="text-muted-foreground">Analisis performa bisnis dan tren penjualan</p>
        </div>
        <Button onClick={handleExportReport}>
          <Download className="h-4 w-4 mr-2" />
          Export Laporan
        </Button>
      </div>

      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Laporan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Periode</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Hari Ini</SelectItem>
                  <SelectItem value="7">7 Hari Terakhir</SelectItem>
                  <SelectItem value="30">30 Hari Terakhir</SelectItem>
                  <SelectItem value="90">3 Bulan Terakhir</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Jenis Laporan</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Penjualan</SelectItem>
                  <SelectItem value="products">Produk</SelectItem>
                  <SelectItem value="revenue">Pendapatan</SelectItem>
                  <SelectItem value="profit">Profit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Dari Tanggal</Label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <Label>Sampai Tanggal</Label>
              <Input type="date" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Rp {totalRevenue.toLocaleString("id-ID")}</div>
            <p className="text-xs text-muted-foreground">+12% dari periode sebelumnya</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transaksi</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalTransactions}</div>
            <p className="text-xs text-muted-foreground">+8% dari periode sebelumnya</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata Transaksi</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">Rp {averageTransaction.toLocaleString("id-ID")}</div>
            <p className="text-xs text-muted-foreground">+5% dari periode sebelumnya</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
            <Package className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">Rp {totalProfit.toLocaleString("id-ID")}</div>
            <p className="text-xs text-muted-foreground">+15% dari periode sebelumnya</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">Penjualan</TabsTrigger>
          <TabsTrigger value="products">Produk</TabsTrigger>
          <TabsTrigger value="revenue">Pendapatan</TabsTrigger>
          <TabsTrigger value="comparison">Perbandingan</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Tren Penjualan Harian</CardTitle>
                <CardDescription>Grafik penjualan 7 hari terakhir</CardDescription>
              </CardHeader>
              <CardContent>
                <SalesReportChart />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Penjualan per Jam</CardTitle>
                <CardDescription>Distribusi penjualan berdasarkan jam</CardDescription>
              </CardHeader>
              <CardContent>
                <RevenueChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performa Produk</CardTitle>
              <CardDescription>Analisis penjualan per produk</CardDescription>
            </CardHeader>
            <CardContent>
              <ProductSalesChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Pendapatan Bulanan</CardTitle>
                <CardDescription>Tren pendapatan 6 bulan terakhir</CardDescription>
              </CardHeader>
              <CardContent>
                <RevenueChart />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Profit Margin</CardTitle>
                <CardDescription>Analisis keuntungan per kategori</CardDescription>
              </CardHeader>
              <CardContent>
                <ProductSalesChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Perbandingan Periode</CardTitle>
              <CardDescription>Bandingkan performa antar periode</CardDescription>
            </CardHeader>
            <CardContent>
              <SalesReportChart />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

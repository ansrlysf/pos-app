"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StockAdjustmentDialog } from "@/components/admin/stock-adjustment-dialog"
import { StockAlertDialog } from "@/components/admin/stock-alert-dialog"
import { BulkUpdateDialog } from "@/components/admin/bulk-update-dialog"
import { Package, AlertTriangle, TrendingUp, TrendingDown, Plus, Download, Upload, Settings } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function InventoryPage() {
  const { products, updateProduct } = useAppStore()
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [stockAdjustmentOpen, setStockAdjustmentOpen] = useState(false)
  const [stockAlertOpen, setStockAlertOpen] = useState(false)
  const [bulkUpdateOpen, setBulkUpdateOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const { toast } = useToast()

  const lowStockProducts = products.filter((p) => p.stock < 10)
  const outOfStockProducts = products.filter((p) => p.stock === 0)
  const overstockProducts = products.filter((p) => p.stock > 100)

  const filteredProducts = products.filter((product) => {
    switch (filterStatus) {
      case "low":
        return product.stock < 10 && product.stock > 0
      case "out":
        return product.stock === 0
      case "overstock":
        return product.stock > 100
      default:
        return true
    }
  })

  const handleStockAdjustment = (product: any) => {
    setSelectedProduct(product)
    setStockAdjustmentOpen(true)
  }

  const handleBulkUpdate = () => {
    if (selectedProducts.length === 0) {
      toast({
        title: "Tidak ada produk dipilih",
        description: "Pilih produk terlebih dahulu",
        variant: "destructive",
      })
      return
    }
    setBulkUpdateOpen(true)
  }

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }

  const selectAllProducts = () => {
    setSelectedProducts(filteredProducts.map((p) => p.id))
  }

  const clearSelection = () => {
    setSelectedProducts([])
  }

  const exportInventory = () => {
    const csvContent = [
      ["ID", "Nama", "Kategori", "Stok", "Harga Beli", "Harga Jual", "Nilai Stok", "Status"],
      ...filteredProducts.map((p) => [
        p.id,
        p.name,
        p.category,
        p.stock,
        p.cost,
        p.price,
        p.stock * p.cost,
        p.stock === 0 ? "Out of Stock" : p.stock < 10 ? "Low Stock" : "In Stock",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "inventory-report.csv"
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Export berhasil",
      description: "Laporan inventory telah diexport",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Inventory Management</h2>
          <p className="text-muted-foreground">Kelola stok dan inventory produk</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setStockAlertOpen(true)} className="bg-transparent">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Stock Alerts
          </Button>
          <Button variant="outline" onClick={exportInventory} className="bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">Semua produk</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stok Rendah</CardTitle>
            <TrendingDown className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{lowStockProducts.length}</div>
            <p className="text-xs text-muted-foreground">Kurang dari 10 unit</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stok Habis</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{outOfStockProducts.length}</div>
            <p className="text-xs text-muted-foreground">Perlu restock</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overstock</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{overstockProducts.length}</div>
            <p className="text-xs text-muted-foreground">Lebih dari 100 unit</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="movements">Stock Movements</TabsTrigger>
          <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          {/* Filters and Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Filter & Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex gap-4">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Status</SelectItem>
                      <SelectItem value="low">Stok Rendah</SelectItem>
                      <SelectItem value="out">Stok Habis</SelectItem>
                      <SelectItem value="overstock">Overstock</SelectItem>
                    </SelectContent>
                  </Select>

                  {selectedProducts.length > 0 && (
                    <div className="flex gap-2">
                      <Badge variant="secondary">{selectedProducts.length} dipilih</Badge>
                      <Button variant="outline" size="sm" onClick={handleBulkUpdate} className="bg-transparent">
                        <Settings className="h-4 w-4 mr-1" />
                        Bulk Update
                      </Button>
                      <Button variant="outline" size="sm" onClick={clearSelection} className="bg-transparent">
                        Clear
                      </Button>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={selectAllProducts} size="sm" className="bg-transparent">
                    Select All
                  </Button>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    <Upload className="h-4 w-4 mr-1" />
                    Import
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Table */}
          <Card>
            <CardHeader>
              <CardTitle>Daftar Inventory ({filteredProducts.length})</CardTitle>
              <CardDescription>Kelola stok dan harga produk</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={selectedProducts.length === filteredProducts.length}
                        onChange={
                          selectedProducts.length === filteredProducts.length ? clearSelection : selectAllProducts
                        }
                      />
                    </TableHead>
                    <TableHead>Produk</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Stok</TableHead>
                    <TableHead>Harga Beli</TableHead>
                    <TableHead>Harga Jual</TableHead>
                    <TableHead>Nilai Stok</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => toggleProductSelection(product.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">{product.barcode}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{product.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={product.stock === 0 ? "destructive" : product.stock < 10 ? "secondary" : "default"}
                        >
                          {product.stock}
                        </Badge>
                      </TableCell>
                      <TableCell>Rp {product.cost.toLocaleString("id-ID")}</TableCell>
                      <TableCell>Rp {product.price.toLocaleString("id-ID")}</TableCell>
                      <TableCell>Rp {(product.stock * product.cost).toLocaleString("id-ID")}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            product.stock === 0
                              ? "destructive"
                              : product.stock < 10
                                ? "secondary"
                                : product.stock > 100
                                  ? "default"
                                  : "default"
                          }
                        >
                          {product.stock === 0
                            ? "Out of Stock"
                            : product.stock < 10
                              ? "Low Stock"
                              : product.stock > 100
                                ? "Overstock"
                                : "In Stock"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStockAdjustment(product)}
                          className="bg-transparent"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Adjust
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stock Movements</CardTitle>
              <CardDescription>Riwayat pergerakan stok produk</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Fitur stock movements akan segera hadir</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecasting" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Demand Forecasting</CardTitle>
              <CardDescription>Prediksi kebutuhan stok berdasarkan data penjualan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Fitur forecasting akan segera hadir</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Supplier Management</CardTitle>
              <CardDescription>Kelola supplier dan purchase orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Fitur supplier management akan segera hadir</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <StockAdjustmentDialog
        open={stockAdjustmentOpen}
        onOpenChange={setStockAdjustmentOpen}
        product={selectedProduct}
      />

      <StockAlertDialog open={stockAlertOpen} onOpenChange={setStockAlertOpen} />

      <BulkUpdateDialog
        open={bulkUpdateOpen}
        onOpenChange={setBulkUpdateOpen}
        selectedProducts={selectedProducts}
        onComplete={() => {
          setSelectedProducts([])
          setBulkUpdateOpen(false)
        }}
      />
    </div>
  )
}

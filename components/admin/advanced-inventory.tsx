"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Plus,
  Minus,
  Settings,
  Search,
  BarChart3,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface StockMovement {
  id: string
  productId: string
  productName: string
  type: "in" | "out" | "adjustment" | "transfer"
  quantity: number
  reason: string
  userId: string
  userName: string
  timestamp: Date
  branchId?: string
  branchName?: string
}

interface InventoryAlert {
  id: string
  type: "low_stock" | "out_of_stock" | "overstock" | "expiring"
  productId: string
  productName: string
  currentStock: number
  threshold?: number
  severity: "low" | "medium" | "high" | "critical"
  message: string
  createdAt: Date
  resolved: boolean
  resolvedAt?: Date
  resolvedBy?: string
}

export function AdvancedInventory() {
  const { products, updateProduct, currentUser, branches } = useAppStore()
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBranch, setSelectedBranch] = useState("all")
  const [adjustmentDialogOpen, setAdjustmentDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [adjustmentQuantity, setAdjustmentQuantity] = useState("")
  const [adjustmentReason, setAdjustmentReason] = useState("")
  const { toast } = useToast()

  // Mock data for stock movements
  const [stockMovements] = useState<StockMovement[]>([
    {
      id: "1",
      productId: "1",
      productName: "Coca Cola 330ml",
      type: "in",
      quantity: 50,
      reason: "Restocking from supplier",
      userId: "admin1",
      userName: "Admin User",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      branchId: "branch1",
      branchName: "Cabang Utama",
    },
    {
      id: "2",
      productId: "2",
      productName: "Indomie Goreng",
      type: "out",
      quantity: 25,
      reason: "Sales transaction",
      userId: "cashier1",
      userName: "Kasir 1",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      branchId: "branch1",
      branchName: "Cabang Utama",
    },
    {
      id: "3",
      productId: "1",
      productName: "Coca Cola 330ml",
      type: "adjustment",
      quantity: -5,
      reason: "Damaged products",
      userId: "admin1",
      userName: "Admin User",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      branchId: "branch1",
      branchName: "Cabang Utama",
    },
  ])

  // Mock data for inventory alerts
  const [inventoryAlerts, setInventoryAlerts] = useState<InventoryAlert[]>([
    {
      id: "1",
      type: "low_stock",
      productId: "2",
      productName: "Indomie Goreng",
      currentStock: 8,
      threshold: 10,
      severity: "medium",
      message: "Stock rendah, segera lakukan restocking",
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      resolved: false,
    },
    {
      id: "2",
      type: "out_of_stock",
      productId: "4",
      productName: "Teh Pucuk",
      currentStock: 0,
      severity: "critical",
      message: "Produk habis, tidak dapat dijual",
      createdAt: new Date(Date.now() - 30 * 60 * 60 * 1000),
      resolved: false,
    },
    {
      id: "3",
      type: "overstock",
      productId: "1",
      productName: "Coca Cola 330ml",
      currentStock: 150,
      threshold: 100,
      severity: "low",
      message: "Stock berlebih, pertimbangkan promosi",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      resolved: true,
      resolvedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      resolvedBy: "Admin User",
    },
  ])

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.barcode.includes(searchTerm)

    let matchesStatus = true
    switch (filterStatus) {
      case "low":
        matchesStatus = product.stock < 10 && product.stock > 0
        break
      case "out":
        matchesStatus = product.stock === 0
        break
      case "overstock":
        matchesStatus = product.stock > 100
        break
    }

    return matchesSearch && matchesStatus
  })

  const handleStockAdjustment = () => {
    if (!selectedProduct || !adjustmentQuantity || !adjustmentReason) return

    const quantity = Number.parseInt(adjustmentQuantity)
    const newStock = selectedProduct.stock + quantity

    if (newStock < 0) {
      toast({
        title: "Error",
        description: "Stock tidak boleh negatif",
        variant: "destructive",
      })
      return
    }

    updateProduct(selectedProduct.id, { stock: newStock })

    // Add to stock movements (in real app, this would be handled by backend)
    const newMovement: StockMovement = {
      id: Date.now().toString(),
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      type: "adjustment",
      quantity,
      reason: adjustmentReason,
      userId: currentUser?.id || "unknown",
      userName: currentUser?.name || "Unknown User",
      timestamp: new Date(),
      branchId: "branch1",
      branchName: "Cabang Utama",
    }

    toast({
      title: "Stock berhasil disesuaikan",
      description: `Stock ${selectedProduct.name} ${quantity > 0 ? "ditambah" : "dikurangi"} ${Math.abs(quantity)} unit`,
    })

    setAdjustmentDialogOpen(false)
    setAdjustmentQuantity("")
    setAdjustmentReason("")
    setSelectedProduct(null)
  }

  const resolveAlert = (alertId: string) => {
    setInventoryAlerts((alerts) =>
      alerts.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              resolved: true,
              resolvedAt: new Date(),
              resolvedBy: currentUser?.name || "Unknown User",
            }
          : alert,
      ),
    )

    toast({
      title: "Alert resolved",
      description: "Inventory alert has been marked as resolved",
    })
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "low_stock":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "out_of_stock":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "overstock":
        return <TrendingUp className="h-4 w-4 text-blue-500" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="movements">Movements</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Overview Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{products.length}</div>
                <p className="text-xs text-muted-foreground">Across all branches</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                <TrendingDown className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-500">
                  {products.filter((p) => p.stock < 10 && p.stock > 0).length}
                </div>
                <p className="text-xs text-muted-foreground">Need restocking</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                <XCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">{products.filter((p) => p.stock === 0).length}</div>
                <p className="text-xs text-muted-foreground">Urgent attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                <BarChart3 className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">
                  Rp {products.reduce((sum, p) => sum + p.cost * p.stock, 0).toLocaleString("id-ID")}
                </div>
                <p className="text-xs text-muted-foreground">Inventory value</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Movements */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Stock Movements</CardTitle>
              <CardDescription>Latest inventory changes across all branches</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stockMovements.slice(0, 5).map((movement) => (
                  <div key={movement.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          movement.type === "in"
                            ? "bg-green-100 text-green-600"
                            : movement.type === "out"
                              ? "bg-red-100 text-red-600"
                              : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {movement.type === "in" ? (
                          <Plus className="h-4 w-4" />
                        ) : movement.type === "out" ? (
                          <Minus className="h-4 w-4" />
                        ) : (
                          <Settings className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{movement.productName}</div>
                        <div className="text-sm text-muted-foreground">
                          {movement.reason} • {movement.branchName}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${movement.quantity > 0 ? "text-green-600" : "text-red-600"}`}>
                        {movement.quantity > 0 ? "+" : ""}
                        {movement.quantity}
                      </div>
                      <div className="text-sm text-muted-foreground">{movement.timestamp.toLocaleTimeString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="low">Low Stock</SelectItem>
                    <SelectItem value="out">Out of Stock</SelectItem>
                    <SelectItem value="overstock">Overstock</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Branches</SelectItem>
                    <SelectItem value="branch1">Cabang Utama</SelectItem>
                    <SelectItem value="branch2">Cabang Mall</SelectItem>
                    <SelectItem value="branch3">Cabang Plaza</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Cost Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
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
                      <TableCell>Rp {(product.cost * product.stock).toLocaleString("id-ID")}</TableCell>
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
                          onClick={() => {
                            setSelectedProduct(product)
                            setAdjustmentDialogOpen(true)
                          }}
                          className="bg-transparent"
                        >
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

        <TabsContent value="movements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stock Movement History</CardTitle>
              <CardDescription>Complete history of all inventory changes</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Branch</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockMovements.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{movement.timestamp.toLocaleDateString()}</div>
                          <div className="text-sm text-muted-foreground">{movement.timestamp.toLocaleTimeString()}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{movement.productName}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            movement.type === "in" ? "default" : movement.type === "out" ? "secondary" : "outline"
                          }
                        >
                          {movement.type === "in" ? "Stock In" : movement.type === "out" ? "Stock Out" : "Adjustment"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={movement.quantity > 0 ? "text-green-600" : "text-red-600"}>
                          {movement.quantity > 0 ? "+" : ""}
                          {movement.quantity}
                        </span>
                      </TableCell>
                      <TableCell>{movement.reason}</TableCell>
                      <TableCell>{movement.userName}</TableCell>
                      <TableCell>{movement.branchName}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Alerts</CardTitle>
              <CardDescription>System alerts for inventory management</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inventoryAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 border rounded-lg ${getSeverityColor(alert.severity)} ${
                      alert.resolved ? "opacity-60" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getAlertIcon(alert.type)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{alert.productName}</h4>
                            <Badge variant="outline" className="text-xs">
                              {alert.severity.toUpperCase()}
                            </Badge>
                            {alert.resolved && (
                              <Badge variant="default" className="text-xs bg-green-600">
                                Resolved
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm mb-2">{alert.message}</p>
                          <div className="text-xs text-muted-foreground">
                            Current stock: {alert.currentStock}
                            {alert.threshold && ` • Threshold: ${alert.threshold}`}
                            <br />
                            Created: {alert.createdAt.toLocaleString()}
                            {alert.resolved && alert.resolvedAt && (
                              <>
                                <br />
                                Resolved: {alert.resolvedAt.toLocaleString()} by {alert.resolvedBy}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      {!alert.resolved && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => resolveAlert(alert.id)}
                          className="bg-transparent"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Stock Adjustment Dialog */}
      <Dialog open={adjustmentDialogOpen} onOpenChange={setAdjustmentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Stock Adjustment</DialogTitle>
            <DialogDescription>Adjust stock for {selectedProduct?.name}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Current Stock</Label>
              <div className="text-2xl font-bold">{selectedProduct?.stock || 0}</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Adjustment Quantity</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="Enter positive or negative number"
                value={adjustmentQuantity}
                onChange={(e) => setAdjustmentQuantity(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">Use positive numbers to add stock, negative to reduce</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                placeholder="Explain the reason for this adjustment"
                value={adjustmentReason}
                onChange={(e) => setAdjustmentReason(e.target.value)}
              />
            </div>

            {adjustmentQuantity && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm">
                  <strong>New Stock:</strong>{" "}
                  {(selectedProduct?.stock || 0) + Number.parseInt(adjustmentQuantity || "0")}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setAdjustmentDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleStockAdjustment}>Apply Adjustment</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

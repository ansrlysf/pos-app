"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAppStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { AlertTriangle, Package, Settings, Bell, TrendingUp } from "lucide-react"

interface StockAlertDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StockAlertDialog({ open, onOpenChange }: StockAlertDialogProps) {
  const { products } = useAppStore()
  const [lowStockThreshold, setLowStockThreshold] = useState(10)
  const [overstockThreshold, setOverstockThreshold] = useState(100)
  const { toast } = useToast()

  const lowStockProducts = products.filter((p) => p.stock <= lowStockThreshold && p.stock > 0)
  const outOfStockProducts = products.filter((p) => p.stock === 0)
  const overstockProducts = products.filter((p) => p.stock >= overstockThreshold)

  const saveSettings = () => {
    // Save threshold settings (in real app, this would be saved to backend)
    localStorage.setItem(
      "stockAlertSettings",
      JSON.stringify({
        lowStockThreshold,
        overstockThreshold,
      }),
    )

    toast({
      title: "Pengaturan disimpan",
      description: "Pengaturan stock alert telah disimpan",
    })
  }

  const generatePurchaseOrder = (products: any[]) => {
    const csvContent = [
      ["Produk", "Kategori", "Stock Saat Ini", "Rekomendasi Order", "Supplier"],
      ...products.map((p) => [
        p.name,
        p.category,
        p.stock,
        Math.max(50 - p.stock, 0), // Recommend to restock to 50 units
        "Default Supplier",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "purchase-order.csv"
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Purchase Order dibuat",
      description: "File PO telah didownload",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Stock Alerts & Monitoring
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Settings */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <h3 className="font-semibold">Pengaturan Alert</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Batas Stok Rendah</Label>
                  <Input
                    type="number"
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Batas Overstock</Label>
                  <Input
                    type="number"
                    value={overstockThreshold}
                    onChange={(e) => setOverstockThreshold(Number(e.target.value))}
                    min="1"
                  />
                </div>
              </div>

              <Button onClick={saveSettings} size="sm">
                Simpan Pengaturan
              </Button>
            </CardContent>
          </Card>

          {/* Alert Summary */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{outOfStockProducts.length}</div>
                <div className="text-sm text-muted-foreground">Stok Habis</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{lowStockProducts.length}</div>
                <div className="text-sm text-muted-foreground">Stok Rendah</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{overstockProducts.length}</div>
                <div className="text-sm text-muted-foreground">Overstock</div>
              </CardContent>
            </Card>
          </div>

          {/* Alert Lists */}
          <div className="space-y-4">
            {/* Out of Stock */}
            {outOfStockProducts.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-red-600 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Stok Habis ({outOfStockProducts.length})
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generatePurchaseOrder(outOfStockProducts)}
                      className="bg-transparent"
                    >
                      Generate PO
                    </Button>
                  </div>
                  <ScrollArea className="max-h-32">
                    <div className="space-y-2">
                      {outOfStockProducts.map((product) => (
                        <div key={product.id} className="flex items-center justify-between p-2 border rounded">
                          <div>
                            <div className="font-medium text-sm">{product.name}</div>
                            <div className="text-xs text-muted-foreground">{product.category}</div>
                          </div>
                          <Badge variant="destructive">0 unit</Badge>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}

            {/* Low Stock */}
            {lowStockProducts.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-orange-600 flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Stok Rendah ({lowStockProducts.length})
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generatePurchaseOrder(lowStockProducts)}
                      className="bg-transparent"
                    >
                      Generate PO
                    </Button>
                  </div>
                  <ScrollArea className="max-h-32">
                    <div className="space-y-2">
                      {lowStockProducts.map((product) => (
                        <div key={product.id} className="flex items-center justify-between p-2 border rounded">
                          <div>
                            <div className="font-medium text-sm">{product.name}</div>
                            <div className="text-xs text-muted-foreground">{product.category}</div>
                          </div>
                          <Badge variant="secondary">{product.stock} unit</Badge>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}

            {/* Overstock */}
            {overstockProducts.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-blue-600 flex items-center gap-2 mb-3">
                    <TrendingUp className="h-4 w-4" />
                    Overstock ({overstockProducts.length})
                  </h3>
                  <ScrollArea className="max-h-32">
                    <div className="space-y-2">
                      {overstockProducts.map((product) => (
                        <div key={product.id} className="flex items-center justify-between p-2 border rounded">
                          <div>
                            <div className="font-medium text-sm">{product.name}</div>
                            <div className="text-xs text-muted-foreground">{product.category}</div>
                          </div>
                          <Badge variant="default">{product.stock} unit</Badge>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </div>

          {/* No Alerts */}
          {outOfStockProducts.length === 0 && lowStockProducts.length === 0 && overstockProducts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Tidak ada alert stock saat ini</p>
              <p className="text-sm">Semua produk dalam kondisi stock normal</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

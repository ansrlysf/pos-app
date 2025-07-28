"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { useAppStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { Settings, Package, DollarSign } from "lucide-react"

interface BulkUpdateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedProducts: string[]
  onComplete: () => void
}

export function BulkUpdateDialog({ open, onOpenChange, selectedProducts, onComplete }: BulkUpdateDialogProps) {
  const { products, updateProduct } = useAppStore()
  const [updateType, setUpdateType] = useState<"price" | "cost" | "stock" | "category">("price")
  const [updateMethod, setUpdateMethod] = useState<"set" | "increase" | "decrease">("set")
  const [value, setValue] = useState<number>(0)
  const [newCategory, setNewCategory] = useState("")
  const { toast } = useToast()

  const selectedProductsData = products.filter((p) => selectedProducts.includes(p.id))

  const handleBulkUpdate = () => {
    if (updateType === "category" && !newCategory) {
      toast({
        title: "Kategori tidak boleh kosong",
        description: "Pilih kategori baru",
        variant: "destructive",
      })
      return
    }

    if (updateType !== "category" && value <= 0) {
      toast({
        title: "Nilai tidak valid",
        description: "Masukkan nilai yang valid",
        variant: "destructive",
      })
      return
    }

    selectedProducts.forEach((productId) => {
      const product = products.find((p) => p.id === productId)
      if (!product) return

      const updateData: any = {}

      switch (updateType) {
        case "price":
          switch (updateMethod) {
            case "set":
              updateData.price = value
              break
            case "increase":
              updateData.price = product.price + value
              break
            case "decrease":
              updateData.price = Math.max(0, product.price - value)
              break
          }
          break
        case "cost":
          switch (updateMethod) {
            case "set":
              updateData.cost = value
              break
            case "increase":
              updateData.cost = product.cost + value
              break
            case "decrease":
              updateData.cost = Math.max(0, product.cost - value)
              break
          }
          break
        case "stock":
          switch (updateMethod) {
            case "set":
              updateData.stock = value
              break
            case "increase":
              updateData.stock = product.stock + value
              break
            case "decrease":
              updateData.stock = Math.max(0, product.stock - value)
              break
          }
          break
        case "category":
          updateData.category = newCategory
          break
      }

      updateProduct(productId, updateData)
    })

    toast({
      title: "Bulk update berhasil",
      description: `${selectedProducts.length} produk telah diupdate`,
    })

    onComplete()
  }

  const getPreviewValue = (product: any) => {
    switch (updateType) {
      case "price":
        switch (updateMethod) {
          case "set":
            return `Rp ${value.toLocaleString("id-ID")}`
          case "increase":
            return `Rp ${(product.price + value).toLocaleString("id-ID")}`
          case "decrease":
            return `Rp ${Math.max(0, product.price - value).toLocaleString("id-ID")}`
        }
        break
      case "cost":
        switch (updateMethod) {
          case "set":
            return `Rp ${value.toLocaleString("id-ID")}`
          case "increase":
            return `Rp ${(product.cost + value).toLocaleString("id-ID")}`
          case "decrease":
            return `Rp ${Math.max(0, product.cost - value).toLocaleString("id-ID")}`
        }
        break
      case "stock":
        switch (updateMethod) {
          case "set":
            return `${value} unit`
          case "increase":
            return `${product.stock + value} unit`
          case "decrease":
            return `${Math.max(0, product.stock - value)} unit`
        }
        break
      case "category":
        return newCategory
    }
    return ""
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Bulk Update - {selectedProducts.length} Produk
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Update Configuration */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold">Konfigurasi Update</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Jenis Update</Label>
                  <Select value={updateType} onValueChange={(value: any) => setUpdateType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Harga Jual
                        </div>
                      </SelectItem>
                      <SelectItem value="cost">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Harga Beli
                        </div>
                      </SelectItem>
                      <SelectItem value="stock">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          Stock
                        </div>
                      </SelectItem>
                      <SelectItem value="category">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          Kategori
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {updateType !== "category" && (
                  <div className="space-y-2">
                    <Label>Metode Update</Label>
                    <Select value={updateMethod} onValueChange={(value: any) => setUpdateMethod(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="set">Set Nilai Baru</SelectItem>
                        <SelectItem value="increase">Tambah</SelectItem>
                        <SelectItem value="decrease">Kurang</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {updateType === "category" ? (
                <div className="space-y-2">
                  <Label>Kategori Baru</Label>
                  <Select value={newCategory} onValueChange={setNewCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Food">Food</SelectItem>
                      <SelectItem value="Beverages">Beverages</SelectItem>
                      <SelectItem value="Snacks">Snacks</SelectItem>
                      <SelectItem value="Personal Care">Personal Care</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>
                    {updateMethod === "set"
                      ? `Nilai Baru ${updateType === "price" || updateType === "cost" ? "(Rp)" : "(Unit)"}`
                      : `Nilai ${updateMethod === "increase" ? "Penambahan" : "Pengurangan"} ${updateType === "price" || updateType === "cost" ? "(Rp)" : "(Unit)"}`}
                  </Label>
                  <Input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    placeholder="0"
                    min="0"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Preview Perubahan</h3>
              <div className="space-y-2 max-h-64 overflow-auto">
                {selectedProductsData.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{product.name}</div>
                      <div className="text-xs text-muted-foreground">{product.category}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        {updateType === "price" && `Lama: Rp ${product.price.toLocaleString("id-ID")}`}
                        {updateType === "cost" && `Lama: Rp ${product.cost.toLocaleString("id-ID")}`}
                        {updateType === "stock" && `Lama: ${product.stock} unit`}
                        {updateType === "category" && `Lama: ${product.category}`}
                      </div>
                      <div className="font-medium text-primary">Baru: {getPreviewValue(product)}</div>
                    </div>
                  </div>
                ))}
                {selectedProductsData.length > 5 && (
                  <div className="text-center text-sm text-muted-foreground">
                    +{selectedProductsData.length - 5} produk lainnya
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 bg-transparent">
              Batal
            </Button>
            <Button
              onClick={handleBulkUpdate}
              className="flex-1"
              disabled={updateType === "category" ? !newCategory : value <= 0}
            >
              Update {selectedProducts.length} Produk
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

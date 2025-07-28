"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Package, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ProductGrid() {
  const { products, addToCart, hasPermission } = useAppStore()
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const { toast } = useToast()

  const categories = ["all", ...new Set(products.map((p) => p.category))]
  const filteredProducts =
    selectedCategory === "all" ? products : products.filter((p) => p.category === selectedCategory)

  const handleAddToCart = (product: any) => {
    // Check permission first
    // if (!hasPermission("process_transaction")) {
    //   toast({
   //      title: "❌ Akses ditolak",
    //     description: "Anda tidak memiliki izin untuk memproses transaksi",
    //     variant: "destructive",
    //     duration: 3000,
    //   })
    //   return
   //  }

    if (product.stock > 0) {
      addToCart(product, 1)
      toast({
        title: "✅ Berhasil ditambahkan",
        description: `${product.name} ditambahkan ke keranjang`,
        duration: 2000,
      })
    } else {
      toast({
        title: "❌ Stok habis",
        description: `${product.name} tidak tersedia`,
        variant: "destructive",
        duration: 2000,
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Category Filter - Enhanced with smooth animations */}
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-3 pb-2">
          {categories.map((category, index) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={`shrink-0 transition-all duration-300 hover:scale-105 animate-in slide-in-from-left-4 ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-primary to-primary/80 shadow-lg"
                  : "hover:bg-muted/80 backdrop-blur-sm"
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {category === "all" ? (
                <div className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Semua
                </div>
              ) : (
                category
              )}
            </Button>
          ))}
        </div>
      </ScrollArea>

      {/* Product Grid - Enhanced with staggered animations */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {filteredProducts.map((product, index) => (
          <Card
            key={product.id}
            className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 animate-in zoom-in-50 ${
              hoveredProduct === product.id ? "ring-2 ring-primary/50" : ""
            }`}
            style={{ animationDelay: `${index * 50}ms` }}
            onClick={() => handleAddToCart(product)}
            onMouseEnter={() => setHoveredProduct(product.id)}
            onMouseLeave={() => setHoveredProduct(null)}
          >
            <CardContent className="p-4">
              {/* Product Image with gradient overlay */}
              <div className="aspect-square bg-gradient-to-br from-muted via-muted/50 to-muted/20 rounded-xl flex items-center justify-center mb-4 relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                <Package className="h-10 w-10 text-muted-foreground/60 group-hover:text-primary transition-colors duration-300" />

                {/* Animated gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Stock Badge with enhanced styling */}
                <Badge
                  variant={product.stock > 10 ? "default" : product.stock > 0 ? "secondary" : "destructive"}
                  className={`absolute -top-1 -right-1 text-xs px-2 py-1 shadow-lg transition-all duration-300 ${
                    product.stock > 10
                      ? "bg-gradient-to-r from-green-500 to-green-600"
                      : product.stock > 0
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                        : "bg-gradient-to-r from-red-500 to-red-600"
                  }`}
                >
                  {product.stock}
                </Badge>
              </div>

              <div className="space-y-3">
                {/* Product Name with better typography */}
                <h3 className="font-semibold text-sm line-clamp-2 leading-tight min-h-[2.5rem] group-hover:text-primary transition-colors duration-300">
                  {product.name}
                </h3>

                {/* Price with enhanced styling */}
                <div className="text-primary font-bold text-lg bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Rp {product.price.toLocaleString("id-ID")}
                </div>

                {/* Add Button with enhanced animations */}
                <Button
                  size="sm"
                  className={`w-full h-10 text-sm transition-all duration-300 ${
                    product.stock === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transform hover:scale-105"
                  }`}
                  disabled={product.stock === 0 || !hasPermission("process_transaction")}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleAddToCart(product)
                  }}
                >
                  <Plus className="h-4 w-4 mr-1 transition-transform duration-300 group-hover:rotate-90" />
                  {product.stock === 0 ? "Habis" : !hasPermission("process_transaction") ? "No Access" : "Tambah"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State with enhanced styling */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-16 animate-in fade-in-50 duration-500">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-muted to-muted/50 rounded-full flex items-center justify-center">
            <Package className="h-12 w-12 text-muted-foreground/50" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Tidak ada produk</h3>
          <p className="text-muted-foreground">Coba ubah kategori atau tambah produk baru</p>
        </div>
      )}
    </div>
  )
}

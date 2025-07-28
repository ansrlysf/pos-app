"use client"

import { useAppStore } from "@/lib/store"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"

export function TopProducts() {
  const { transactions, products } = useAppStore()

  // Calculate product sales
  const productSales = new Map<string, number>()

  transactions.forEach((transaction) => {
    transaction.items.forEach((item) => {
      const currentSales = productSales.get(item.product.id) || 0
      productSales.set(item.product.id, currentSales + item.quantity)
    })
  })

  // Get top 5 products
  const topProducts = Array.from(productSales.entries())
    .map(([productId, quantity]) => ({
      product: products.find((p) => p.id === productId),
      quantity,
    }))
    .filter((item) => item.product)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5)

  const maxQuantity = topProducts[0]?.quantity || 1

  if (topProducts.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <p>Belum ada data penjualan</p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-4">
        {topProducts.map((item, index) => (
          <div key={item.product?.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">{item.product?.name}</p>
                <p className="text-xs text-muted-foreground">{item.quantity} terjual</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">#{index + 1}</p>
              </div>
            </div>
            <Progress value={(item.quantity / maxQuantity) * 100} className="h-2" />
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

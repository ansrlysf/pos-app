"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAppStore } from "@/lib/store"
import { TrendingUp, Package, DollarSign } from "lucide-react"
import { useMemo } from "react"

export function ProductPerformance() {
  const { products = [], transactions = [] } = useAppStore()

  // Calculate product performance metrics
  const productMetrics = useMemo(() => {
    const productSales = transactions.reduce(
      (acc, transaction) => {
        transaction.items.forEach((item) => {
          const productId = item.product.id
          if (!acc[productId]) {
            acc[productId] = {
              product: item.product,
              totalQuantity: 0,
              totalRevenue: 0,
              totalProfit: 0,
              transactionCount: 0,
            }
          }
          acc[productId].totalQuantity += item.quantity
          acc[productId].totalRevenue += item.subtotal
          acc[productId].totalProfit += (item.product.price - item.product.cost) * item.quantity
          acc[productId].transactionCount += 1
        })
        return acc
      },
      {} as Record<string, any>,
    )

    // Convert to array and sort by revenue
    const performanceData = Object.values(productSales)
      .sort((a: any, b: any) => b.totalRevenue - a.totalRevenue)
      .slice(0, 10) // Top 10 products

    return performanceData
  }, [products, transactions])

  // Calculate overall metrics
  const overallMetrics = useMemo(() => {
    const totalProducts = products.length
    const activeProducts = productMetrics.length
    const totalRevenue = productMetrics.reduce((sum: number, item: any) => sum + item.totalRevenue, 0)
    const totalProfit = productMetrics.reduce((sum: number, item: any) => sum + item.totalProfit, 0)
    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0

    return {
      totalProducts,
      activeProducts,
      totalRevenue,
      totalProfit,
      profitMargin: Math.round(profitMargin * 10) / 10,
    }
  }, [products, productMetrics])

  return (
    <div className="space-y-6">
      {/* Product Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-in slide-in-from-bottom-4">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-full bg-blue-50">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <Badge variant="outline">Total</Badge>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold">{overallMetrics.totalProducts}</div>
              <p className="text-sm text-muted-foreground">Total Products</p>
            </div>
          </CardContent>
        </Card>

        <Card
          className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-in slide-in-from-bottom-4"
          style={{ animationDelay: "100ms" }}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-full bg-green-50">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <Badge variant="default">Active</Badge>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold">{overallMetrics.activeProducts}</div>
              <p className="text-sm text-muted-foreground">Selling Products</p>
            </div>
          </CardContent>
        </Card>

        <Card
          className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-in slide-in-from-bottom-4"
          style={{ animationDelay: "200ms" }}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-full bg-purple-50">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-green-600">+18%</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold">Rp {overallMetrics.totalRevenue.toLocaleString("id-ID")}</div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
            </div>
          </CardContent>
        </Card>

        <Card
          className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-in slide-in-from-bottom-4"
          style={{ animationDelay: "300ms" }}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-full bg-orange-50">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-green-600">+12%</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold">{overallMetrics.profitMargin}%</div>
              <p className="text-sm text-muted-foreground">Profit Margin</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Products */}
      <Card className="transition-all duration-300 hover:shadow-md">
        <CardHeader>
          <CardTitle>Top Performing Products</CardTitle>
          <CardDescription>Best selling products by revenue and quantity</CardDescription>
        </CardHeader>
        <CardContent>
          {productMetrics.length > 0 ? (
            <div className="space-y-4">
              {productMetrics.map((item: any, index: number) => {
                const maxRevenue = Math.max(...productMetrics.map((p: any) => p.totalRevenue))
                const revenuePercentage = (item.totalRevenue / maxRevenue) * 100
                const profitMargin = item.totalRevenue > 0 ? (item.totalProfit / item.totalRevenue) * 100 : 0

                return (
                  <div
                    key={item.product.id}
                    className="p-4 border rounded-lg transition-all duration-300 hover:shadow-sm animate-in slide-in-from-left-4"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-sm">
                          #{index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold">{item.product.name}</h4>
                          <p className="text-sm text-muted-foreground">{item.product.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">Rp {item.totalRevenue.toLocaleString("id-ID")}</div>
                        <div className="text-sm text-muted-foreground">{item.totalQuantity} sold</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Revenue Performance</span>
                          <span>{Math.round(revenuePercentage)}%</span>
                        </div>
                        <Progress value={revenuePercentage} className="h-2" />
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-semibold text-blue-600">{item.transactionCount}</div>
                          <div className="text-muted-foreground">Orders</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-green-600">{Math.round(profitMargin)}%</div>
                          <div className="text-muted-foreground">Margin</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-purple-600">
                            Rp {Math.round(item.totalRevenue / item.totalQuantity).toLocaleString("id-ID")}
                          </div>
                          <div className="text-muted-foreground">Avg Price</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              <div className="text-center">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No sales data available</p>
                <p className="text-sm">Complete some transactions to see product performance</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Product Categories Performance */}
      <Card className="transition-all duration-300 hover:shadow-md">
        <CardHeader>
          <CardTitle>Category Performance</CardTitle>
          <CardDescription>Revenue breakdown by product category</CardDescription>
        </CardHeader>
        <CardContent>
          {productMetrics.length > 0 ? (
            <div className="space-y-4">
              {products
                .reduce((acc: any[], product) => {
                  const existingCategory = acc.find((cat) => cat.name === product.category)
                  const productSales = productMetrics.find((p: any) => p.product.id === product.id)
                  const revenue = productSales?.totalRevenue || 0
                  const quantity = productSales?.totalQuantity || 0

                  if (existingCategory) {
                    existingCategory.revenue += revenue
                    existingCategory.quantity += quantity
                    existingCategory.products += 1
                  } else {
                    acc.push({
                      name: product.category,
                      revenue,
                      quantity,
                      products: 1,
                    })
                  }
                  return acc
                }, [])
                .sort((a, b) => b.revenue - a.revenue)
                .map((category, index) => {
                  const maxRevenue = Math.max(
                    ...products
                      .reduce((acc: any[], product) => {
                        const existingCategory = acc.find((cat) => cat.name === product.category)
                        const productSales = productMetrics.find((p: any) => p.product.id === product.id)
                        const revenue = productSales?.totalRevenue || 0

                        if (existingCategory) {
                          existingCategory.revenue += revenue
                        } else {
                          acc.push({ name: product.category, revenue })
                        }
                        return acc
                      }, [])
                      .map((cat) => cat.revenue),
                  )
                  const percentage = maxRevenue > 0 ? (category.revenue / maxRevenue) * 100 : 0

                  return (
                    <div
                      key={category.name}
                      className="p-4 border rounded-lg transition-all duration-300 hover:shadow-sm animate-in slide-in-from-right-4"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{category.name}</Badge>
                          <span className="text-sm text-muted-foreground">{category.products} products</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">Rp {category.revenue.toLocaleString("id-ID")}</div>
                          <div className="text-sm text-muted-foreground">{category.quantity} sold</div>
                        </div>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  )
                })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-muted-foreground">
              <div className="text-center">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No category data available</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

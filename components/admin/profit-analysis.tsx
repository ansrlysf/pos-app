"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { useAppStore } from "@/lib/store"
import { TrendingUp, TrendingDown, DollarSign, Percent } from "lucide-react"
import { useMemo } from "react"

export function ProfitAnalysis() {
  const { transactions = [], products = [] } = useAppStore()

  // Calculate profit metrics
  const profitMetrics = useMemo(() => {
    const totalRevenue = transactions.reduce((sum, t) => sum + t.finalTotal, 0)
    const totalCost = transactions.reduce((sum, t) => {
      return (
        sum +
        t.items.reduce((itemSum, item) => {
          return itemSum + item.product.cost * item.quantity
        }, 0)
      )
    }, 0)
    const totalProfit = totalRevenue - totalCost
    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0

    // Calculate profit by category
    const categoryProfit = products.reduce(
      (acc, product) => {
        const productTransactions = transactions.flatMap((t) =>
          t.items.filter((item) => item.product.id === product.id),
        )
        const revenue = productTransactions.reduce((sum, item) => sum + item.subtotal, 0)
        const cost = productTransactions.reduce((sum, item) => sum + item.product.cost * item.quantity, 0)
        const profit = revenue - cost

        if (!acc[product.category]) {
          acc[product.category] = { revenue: 0, cost: 0, profit: 0 }
        }
        acc[product.category].revenue += revenue
        acc[product.category].cost += cost
        acc[product.category].profit += profit

        return acc
      },
      {} as Record<string, any>,
    )

    const categoryData = Object.entries(categoryProfit).map(([category, data]) => ({
      category,
      revenue: data.revenue,
      cost: data.cost,
      profit: data.profit,
      margin: data.revenue > 0 ? (data.profit / data.revenue) * 100 : 0,
    }))

    return {
      totalRevenue,
      totalCost,
      totalProfit,
      profitMargin,
      categoryData,
    }
  }, [transactions, products])

  // Profit distribution data for pie chart
  const profitDistribution = useMemo(() => {
    return profitMetrics.categoryData.map((item, index) => ({
      name: item.category,
      value: Math.max(item.profit, 0), // Only positive profits
      color: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"][index % 6],
    }))
  }, [profitMetrics.categoryData])

  return (
    <div className="space-y-6">
      {/* Profit Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-in slide-in-from-bottom-4">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-full bg-green-50">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-green-600">+15%</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold">Rp {profitMetrics.totalProfit.toLocaleString("id-ID")}</div>
              <p className="text-sm text-muted-foreground">Total Profit</p>
            </div>
          </CardContent>
        </Card>

        <Card
          className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-in slide-in-from-bottom-4"
          style={{ animationDelay: "100ms" }}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-full bg-blue-50">
                <Percent className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-green-600">+2.5%</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold">{Math.round(profitMetrics.profitMargin * 10) / 10}%</div>
              <p className="text-sm text-muted-foreground">Profit Margin</p>
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
              <Badge variant="outline">Revenue</Badge>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold">Rp {profitMetrics.totalRevenue.toLocaleString("id-ID")}</div>
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
              <div className="p-3 rounded-full bg-red-50">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
              <Badge variant="destructive">Cost</Badge>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold">Rp {profitMetrics.totalCost.toLocaleString("id-ID")}</div>
              <p className="text-sm text-muted-foreground">Total Cost</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profit Analysis Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardHeader>
            <CardTitle>Profit by Category</CardTitle>
            <CardDescription>Revenue vs Cost analysis by product category</CardDescription>
          </CardHeader>
          <CardContent>
            {profitMetrics.categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={profitMetrics.categoryData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="category" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      `Rp ${value.toLocaleString("id-ID")}`,
                      name === "revenue" ? "Revenue" : name === "cost" ? "Cost" : "Profit",
                    ]}
                    labelStyle={{ color: "#374151" }}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[2, 2, 0, 0]} animationDuration={1000} />
                  <Bar dataKey="cost" fill="#ef4444" radius={[2, 2, 0, 0]} animationDuration={1000} />
                  <Bar dataKey="profit" fill="#10b981" radius={[2, 2, 0, 0]} animationDuration={1000} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                <div className="text-center">
                  <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No profit data available</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-md">
          <CardHeader>
            <CardTitle>Profit Distribution</CardTitle>
            <CardDescription>Profit contribution by category</CardDescription>
          </CardHeader>
          <CardContent>
            {profitDistribution.length > 0 && profitDistribution.some((item) => item.value > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={profitDistribution.filter((item) => item.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                    animationDuration={1000}
                  >
                    {profitDistribution
                      .filter((item) => item.value > 0)
                      .map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`Rp ${value.toLocaleString("id-ID")}`, "Profit"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                <div className="text-center">
                  <Percent className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No profit distribution data</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Profit Analysis */}
      <Card className="transition-all duration-300 hover:shadow-md">
        <CardHeader>
          <CardTitle>Category Profit Analysis</CardTitle>
          <CardDescription>Detailed breakdown of profit margins by category</CardDescription>
        </CardHeader>
        <CardContent>
          {profitMetrics.categoryData.length > 0 ? (
            <div className="space-y-4">
              {profitMetrics.categoryData.map((category, index) => {
                const maxProfit = Math.max(...profitMetrics.categoryData.map((c) => Math.max(c.profit, 0)))
                const profitPercentage = maxProfit > 0 ? (Math.max(category.profit, 0) / maxProfit) * 100 : 0

                return (
                  <div
                    key={category.category}
                    className="p-4 border rounded-lg transition-all duration-300 hover:shadow-sm animate-in slide-in-from-left-4"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge variant={category.profit > 0 ? "default" : "destructive"}>{category.category}</Badge>
                        <div className="flex items-center gap-1">
                          {category.profit > 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                          <span
                            className={`text-sm font-medium ${category.profit > 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            {Math.round(category.margin * 10) / 10}% margin
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold ${category.profit > 0 ? "text-green-600" : "text-red-600"}`}>
                          Rp {Math.abs(category.profit).toLocaleString("id-ID")}
                        </div>
                        <div className="text-sm text-muted-foreground">{category.profit > 0 ? "Profit" : "Loss"}</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Profit Performance</span>
                          <span>{Math.round(profitPercentage)}%</span>
                        </div>
                        <Progress value={profitPercentage} className="h-2" />
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-semibold text-blue-600">
                            Rp {category.revenue.toLocaleString("id-ID")}
                          </div>
                          <div className="text-muted-foreground">Revenue</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-red-600">Rp {category.cost.toLocaleString("id-ID")}</div>
                          <div className="text-muted-foreground">Cost</div>
                        </div>
                        <div className="text-center">
                          <div className={`font-semibold ${category.profit > 0 ? "text-green-600" : "text-red-600"}`}>
                            Rp {Math.abs(category.profit).toLocaleString("id-ID")}
                          </div>
                          <div className="text-muted-foreground">{category.profit > 0 ? "Profit" : "Loss"}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-muted-foreground">
              <div className="text-center">
                <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No category profit data available</p>
                <p className="text-sm">Complete transactions to see profit analysis</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

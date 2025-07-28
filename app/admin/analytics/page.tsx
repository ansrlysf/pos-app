"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"
import { AdvancedSalesChart } from "@/components/admin/advanced-sales-chart"
import { CustomerAnalytics } from "@/components/admin/customer-analytics"
import { ProductPerformance } from "@/components/admin/product-performance"
import { ProfitAnalysis } from "@/components/admin/profit-analysis"
import { TrendingUp, TrendingDown, ShoppingCart, DollarSign, Target, Download, Filter } from "lucide-react"

export default function AnalyticsPage() {
  const { transactions, products } = useAppStore()
  const [dateRange, setDateRange] = useState("30")
  const [compareWith, setCompareWith] = useState("previous")

  // Calculate metrics
  const totalRevenue = transactions.reduce((sum, t) => sum + t.finalTotal, 0)
  const totalTransactions = transactions.length
  const averageOrderValue = totalRevenue / totalTransactions || 0
  const totalProfit = transactions.reduce((sum, t) => {
    return (
      sum +
      t.items.reduce((itemSum, item) => {
        return itemSum + (item.product.price - item.product.cost) * item.quantity
      }, 0)
    )
  }, 0)

  const metrics = [
    {
      title: "Total Revenue",
      value: `Rp ${totalRevenue.toLocaleString("id-ID")}`,
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Orders",
      value: totalTransactions.toString(),
      change: "+8.2%",
      trend: "up",
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Average Order Value",
      value: `Rp ${averageOrderValue.toLocaleString("id-ID")}`,
      change: "+5.1%",
      trend: "up",
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Total Profit",
      value: `Rp ${totalProfit.toLocaleString("id-ID")}`,
      change: "+15.3%",
      trend: "up",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Advanced Analytics</h2>
          <p className="text-muted-foreground">Deep insights into your business performance</p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="bg-transparent">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" className="bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          const TrendIcon = metric.trend === "up" ? TrendingUp : TrendingDown
          return (
            <Card
              key={metric.title}
              className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-full ${metric.bgColor}`}>
                    <Icon className={`h-6 w-6 ${metric.color}`} />
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <TrendIcon className={`h-4 w-4 ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`} />
                    <span className={metric.trend === "up" ? "text-green-600" : "text-red-600"}>{metric.change}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <p className="text-sm text-muted-foreground">{metric.title}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="transition-all duration-200">
            Overview
          </TabsTrigger>
          <TabsTrigger value="sales" className="transition-all duration-200">
            Sales
          </TabsTrigger>
          <TabsTrigger value="customers" className="transition-all duration-200">
            Customers
          </TabsTrigger>
          <TabsTrigger value="products" className="transition-all duration-200">
            Products
          </TabsTrigger>
          <TabsTrigger value="profit" className="transition-all duration-200">
            Profit
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 animate-in fade-in-50 duration-300">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="transition-all duration-300 hover:shadow-md">
              <CardHeader>
                <CardTitle>Sales Trend</CardTitle>
                <CardDescription>Revenue over time with forecasting</CardDescription>
              </CardHeader>
              <CardContent>
                <AdvancedSalesChart />
              </CardContent>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-md">
              <CardHeader>
                <CardTitle>Top Performing Products</CardTitle>
                <CardDescription>Best sellers by revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <ProductPerformance />
              </CardContent>
            </Card>
          </div>

          <Card className="transition-all duration-300 hover:shadow-md">
            <CardHeader>
              <CardTitle>Business Health Score</CardTitle>
              <CardDescription>Overall performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">92</div>
                  <div className="text-sm text-muted-foreground">Sales Score</div>
                  <Badge variant="default" className="mt-1">
                    Excellent
                  </Badge>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">87</div>
                  <div className="text-sm text-muted-foreground">Customer Score</div>
                  <Badge variant="default" className="mt-1">
                    Good
                  </Badge>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">94</div>
                  <div className="text-sm text-muted-foreground">Inventory Score</div>
                  <Badge variant="default" className="mt-1">
                    Excellent
                  </Badge>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">89</div>
                  <div className="text-sm text-muted-foreground">Profit Score</div>
                  <Badge variant="default" className="mt-1">
                    Good
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="space-y-6 animate-in fade-in-50 duration-300">
          <AdvancedSalesChart />
        </TabsContent>

        <TabsContent value="customers" className="space-y-6 animate-in fade-in-50 duration-300">
          <CustomerAnalytics />
        </TabsContent>

        <TabsContent value="products" className="space-y-6 animate-in fade-in-50 duration-300">
          <ProductPerformance />
        </TabsContent>

        <TabsContent value="profit" className="space-y-6 animate-in fade-in-50 duration-300">
          <ProfitAnalysis />
        </TabsContent>
      </Tabs>
    </div>
  )
}

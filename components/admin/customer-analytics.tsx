"use client"

import { useMemo } from "react"
import { useAppStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { Users, TrendingUp, Award, Clock } from "lucide-react"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function CustomerAnalytics() {
  const { customers = [] } = useAppStore()

  const analytics = useMemo(() => {
    if (!customers || customers.length === 0) {
      return {
        totalCustomers: 0,
        segmentData: [],
        retentionRate: 0,
        avgSpending: 0,
        topCustomers: [],
        behaviorData: [],
      }
    }

    // Segment distribution
    const segments = customers.reduce(
      (acc, customer) => {
        acc[customer.segment] = (acc[customer.segment] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const segmentData = Object.entries(segments).map(([segment, count]) => ({
      name: segment === "new" ? "Baru" : segment === "regular" ? "Reguler" : segment === "vip" ? "VIP" : "Tidak Aktif",
      value: count,
      percentage: (count / customers.length) * 100,
    }))

    // Calculate retention rate (customers who visited in last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const activeCustomers = customers.filter((c) => new Date(c.lastVisit) > thirtyDaysAgo)
    const retentionRate = customers.length > 0 ? (activeCustomers.length / customers.length) * 100 : 0

    // Average spending
    const avgSpending =
      customers.length > 0 ? customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length : 0

    // Top customers by spending
    const topCustomers = [...customers].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5)

    // Customer behavior data
    const behaviorData = [
      {
        name: "Kunjungan Rata-rata",
        value: customers.length > 0 ? customers.reduce((sum, c) => sum + c.visitCount, 0) / customers.length : 0,
      },
      {
        name: "Poin Rata-rata",
        value: customers.length > 0 ? customers.reduce((sum, c) => sum + c.loyaltyPoints, 0) / customers.length : 0,
      },
      { name: "Pengeluaran Rata-rata", value: avgSpending / 1000 }, // in thousands
    ]

    return {
      totalCustomers: customers.length,
      segmentData,
      retentionRate,
      avgSpending,
      topCustomers,
      behaviorData,
    }
  }, [customers])

  if (!customers || customers.length === 0) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="animate-in fade-in-50 duration-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pelanggan</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Belum ada data pelanggan</p>
          </CardContent>
        </Card>

        <Card className="animate-in fade-in-50 duration-500 delay-100">
          <CardContent className="p-6">
            <div className="text-center text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Belum ada data analitik pelanggan</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="animate-in fade-in-50 duration-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pelanggan</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">Pelanggan terdaftar</p>
          </CardContent>
        </Card>

        <Card className="animate-in fade-in-50 duration-500 delay-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tingkat Retensi</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.retentionRate.toFixed(1)}%</div>
            <Progress value={analytics.retentionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="animate-in fade-in-50 duration-500 delay-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata Pengeluaran</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rp {analytics.avgSpending.toLocaleString("id-ID", { maximumFractionDigits: 0 })}
            </div>
            <p className="text-xs text-muted-foreground">Per pelanggan</p>
          </CardContent>
        </Card>

        <Card className="animate-in fade-in-50 duration-500 delay-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pelanggan Aktif</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customers.filter((c) => new Date(c.lastVisit) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
            </div>
            <p className="text-xs text-muted-foreground">30 hari terakhir</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Customer Segmentation */}
        <Card className="animate-in fade-in-50 duration-500 delay-400">
          <CardHeader>
            <CardTitle>Segmentasi Pelanggan</CardTitle>
            <CardDescription>Distribusi pelanggan berdasarkan segmen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.segmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} (${percentage.toFixed(1)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analytics.segmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Customer Behavior */}
        <Card className="animate-in fade-in-50 duration-500 delay-500">
          <CardHeader>
            <CardTitle>Perilaku Pelanggan</CardTitle>
            <CardDescription>Analisis perilaku rata-rata pelanggan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.behaviorData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Customers */}
      <Card className="animate-in fade-in-50 duration-500 delay-600">
        <CardHeader>
          <CardTitle>Pelanggan Teratas</CardTitle>
          <CardDescription>5 pelanggan dengan pengeluaran tertinggi</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.topCustomers.map((customer, index) => (
              <div key={customer.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium">{customer.name}</p>
                    <p className="text-sm text-muted-foreground">{customer.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">Rp {customer.totalSpent.toLocaleString("id-ID")}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {customer.visitCount} kunjungan
                    </Badge>
                    <Badge variant={customer.segment === "vip" ? "default" : "secondary"} className="text-xs">
                      {customer.segment === "new"
                        ? "Baru"
                        : customer.segment === "regular"
                          ? "Reguler"
                          : customer.segment === "vip"
                            ? "VIP"
                            : "Tidak Aktif"}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

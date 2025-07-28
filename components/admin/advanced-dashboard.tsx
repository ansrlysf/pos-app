"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { useOfflineStore } from "@/lib/offline-store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Wifi,
  WifiOff,
  Activity,
  PieChartIcon as RechartsPieChart,
  PhoneIcon as Cell,
  MapPin,
  BarChartIcon as Bar,
  BarChart3,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Pie,
  BarChart,
} from "recharts";

interface SystemAlert {
  id: string;
  type: "info" | "warning" | "error" | "success";
  title: string;
  message: string;
  timestamp: Date;
  resolved: boolean;
  severity: "low" | "medium" | "high" | "critical";
  branchId?: string;
  branchName?: string;
}

export function AdvancedDashboard() {
  const {
    transactions,
    products,
    customers,
    currentShift,
    currentUser,
    branches = [],
  } = useAppStore();

  const { isOnline, pendingActions, lastSyncTime, syncInProgress } =
    useOfflineStore();

  const [selectedTimeRange, setSelectedTimeRange] = useState("today");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([
    {
      id: "1",
      type: "warning",
      title: "Low Stock Alert",
      message: "5 products are running low on stock",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      resolved: false,
      severity: "medium",
      branchId: "branch1",
      branchName: "Cabang Utama",
    },
    {
      id: "2",
      type: "info",
      title: "Shift Started",
      message: "New shift started by Kasir 1",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      resolved: true,
      severity: "low",
      branchId: "branch1",
      branchName: "Cabang Utama",
    },
    {
      id: "3",
      type: "error",
      title: "Payment Gateway Error",
      message: "Card payment processing temporarily unavailable",
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      resolved: false,
      severity: "high",
      branchId: "branch2",
      branchName: "Cabang Mall",
    },
  ]);

  // Calculate metrics
  const todayTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.createdAt);
    const today = new Date();
    return transactionDate.toDateString() === today.toDateString();
  });

  const todayRevenue = todayTransactions.reduce(
    (sum, t) => sum + t.finalTotal,
    0
  );
  const averageOrderValue = todayRevenue / todayTransactions.length || 0;
  const lowStockProducts = products.filter((p) => p.stock < 10);

  // Mock data for charts
  const salesData = [
    { time: "09:00", sales: 12000, transactions: 8 },
    { time: "10:00", sales: 18000, transactions: 12 },
    { time: "11:00", sales: 25000, transactions: 16 },
    { time: "12:00", sales: 35000, transactions: 22 },
    { time: "13:00", sales: 42000, transactions: 28 },
    { time: "14:00", sales: 38000, transactions: 24 },
    { time: "15:00", sales: 45000, transactions: 30 },
    { time: "16:00", sales: 52000, transactions: 34 },
  ];

  const paymentMethodData = [
    { name: "Cash", value: 45, color: "#10b981" },
    { name: "Card", value: 35, color: "#3b82f6" },
    { name: "Digital", value: 20, color: "#8b5cf6" },
  ];

  const branchPerformance = [
    { branch: "Cabang Utama", sales: 125000, transactions: 89 },
    { branch: "Cabang Mall", sales: 98000, transactions: 67 },
    { branch: "Cabang Plaza", sales: 87000, transactions: 54 },
  ];

  const getShiftDuration = () => {
    if (!currentShift) return "00:00:00";

    const startTime =
      typeof currentShift.startTime === "string"
        ? new Date(currentShift.startTime)
        : currentShift.startTime;

    const now = new Date();
    const diff = now.getTime() - startTime.getTime();

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const resolveAlert = (alertId: string) => {
    setSystemAlerts((alerts) =>
      alerts.map((alert) =>
        alert.id === alertId ? { ...alert, resolved: true } : alert
      )
    );
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "border-red-500 bg-red-50";
      case "high":
        return "border-orange-500 bg-orange-50";
      case "medium":
        return "border-yellow-500 bg-yellow-50";
      default:
        return "border-blue-500 bg-blue-50";
    }
  };

  return (
    <div className="space-y-6">
      {/* System Status Bar */}
      <Card className="border-l-4 border-l-primary">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {isOnline ? (
                  <Wifi className="h-5 w-5 text-green-500" />
                ) : (
                  <WifiOff className="h-5 w-5 text-red-500" />
                )}
                <span className="font-medium">
                  {isOnline ? "Online" : "Offline"}
                </span>
              </div>

              {currentShift && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Shift: {getShiftDuration()}</span>
                </div>
              )}

              {pendingActions.length > 0 && (
                <Badge variant="secondary">
                  {pendingActions.length} pending sync
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {lastSyncTime && (
                <span>Last sync: {lastSyncTime.toLocaleTimeString()}</span>
              )}
              {syncInProgress && (
                <div className="flex items-center gap-1">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
                  <span>Syncing...</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              Rp {todayRevenue.toLocaleString("id-ID")}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span>+12.5% from yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {todayTransactions.length}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span>+8.2% from yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              Rp {averageOrderValue.toLocaleString("id-ID")}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span>+5.1% from yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Low Stock Items
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {lowStockProducts.length}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>Need attention</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="analytics" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="branches">Branches</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Sales Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Sales Trend</CardTitle>
                <CardDescription>
                  Hourly sales performance today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [
                        `Rp ${value.toLocaleString("id-ID")}`,
                        "Sales",
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#3b82f6"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>
                  Distribution of payment methods today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={paymentMethodData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {paymentMethodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    {/* <Tooltip /> */}
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Transaction Volume */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction Volume</CardTitle>
              <CardDescription>Number of transactions per hour</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="transactions" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branches" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Branch Performance</CardTitle>
              <CardDescription>
                Sales performance across all branches today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {branchPerformance.map((branch, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <MapPin className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{branch.branch}</div>
                        <div className="text-sm text-muted-foreground">
                          {branch.transactions} transactions
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">
                        Rp {branch.sales.toLocaleString("id-ID")}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Avg: Rp{" "}
                        {(branch.sales / branch.transactions).toLocaleString(
                          "id-ID"
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Branch Status */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Cabang Utama</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Online</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Last sync: 2 minutes ago
                  </div>
                  <div className="text-xs">Active cashiers: 3</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Cabang Mall</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">Syncing</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Last sync: 15 minutes ago
                  </div>
                  <div className="text-xs">Active cashiers: 2</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Cabang Plaza</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Online</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Last sync: 1 minute ago
                  </div>
                  <div className="text-xs">Active cashiers: 2</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>
                Recent system notifications and alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 border rounded-lg ${getSeverityColor(
                      alert.severity
                    )} ${alert.resolved ? "opacity-60" : ""}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getAlertIcon(alert.type)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{alert.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              {alert.severity.toUpperCase()}
                            </Badge>
                            {alert.resolved && (
                              <Badge
                                variant="default"
                                className="text-xs bg-green-600"
                              >
                                Resolved
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm mb-2">{alert.message}</p>
                          <div className="text-xs text-muted-foreground">
                            {alert.branchName} •{" "}
                            {alert.timestamp.toLocaleString()}
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

        <TabsContent value="system" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* System Performance */}
            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
                <CardDescription>Real-time system metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>CPU Usage</span>
                    <span>23%</span>
                  </div>
                  <Progress value={23} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Memory Usage</span>
                    <span>67%</span>
                  </div>
                  <Progress value={67} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Storage Usage</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Network Latency</span>
                    <span>12ms</span>
                  </div>
                  <Progress value={12} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Database Status */}
            <Card>
              <CardHeader>
                <CardTitle>Database Status</CardTitle>
                <CardDescription>
                  Database health and performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Connection Status</span>
                  <Badge variant="default" className="bg-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Connected
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Query Response Time</span>
                  <span className="text-sm font-medium">8ms</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Active Connections</span>
                  <span className="text-sm font-medium">12/100</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Last Backup</span>
                  <span className="text-sm font-medium">2 hours ago</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Database Size</span>
                  <span className="text-sm font-medium">2.3 GB</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Sessions */}
          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>
                Currently active user sessions across all branches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <div className="font-medium">Admin User</div>
                      <div className="text-sm text-muted-foreground">
                        Cabang Utama • Admin Panel
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Active for 2h 15m
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <div className="font-medium">Kasir 1</div>
                      <div className="text-sm text-muted-foreground">
                        Cabang Utama • POS Terminal
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Active for 45m
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <div className="font-medium">Kasir 2</div>
                      <div className="text-sm text-muted-foreground">
                        Cabang Mall • POS Terminal
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Active for 1h 30m
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

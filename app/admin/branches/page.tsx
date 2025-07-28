"use client"

import { useState } from "react"
import { useMultiBranchStore } from "@/lib/multi-branch-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BranchDialog } from "@/components/admin/branch-dialog"
import { TransferDialog } from "@/components/admin/transfer-dialog"
import { MapPin, Plus, Settings, ArrowRightLeft, Clock, CheckCircle, XCircle, Truck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function BranchesPage() {
  const { branches, transfers, updateBranch, deleteBranch, approveTransfer, completeTransfer, cancelTransfer } =
    useMultiBranchStore()

  const [branchDialogOpen, setBranchDialogOpen] = useState(false)
  const [transferDialogOpen, setTransferDialogOpen] = useState(false)
  const [editingBranch, setEditingBranch] = useState<any>(null)
  const [selectedTransfer, setSelectedTransfer] = useState<any>(null)
  const { toast } = useToast()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTransferStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "in_transit":
        return <Truck className="h-4 w-4 text-blue-500" />
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  const handleTransferAction = (transferId: string, action: string) => {
    switch (action) {
      case "approve":
        approveTransfer(transferId, "admin")
        toast({
          title: "Transfer approved",
          description: "The transfer request has been approved",
        })
        break
      case "complete":
        completeTransfer(transferId, "admin")
        toast({
          title: "Transfer completed",
          description: "The transfer has been marked as completed",
        })
        break
      case "cancel":
        cancelTransfer(transferId, "Cancelled by admin")
        toast({
          title: "Transfer cancelled",
          description: "The transfer request has been cancelled",
        })
        break
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Branch Management</h2>
          <p className="text-muted-foreground">Manage multiple store locations and inter-branch operations</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setTransferDialogOpen(true)} variant="outline" className="bg-transparent">
            <ArrowRightLeft className="h-4 w-4 mr-2" />
            New Transfer
          </Button>
          <Button onClick={() => setBranchDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Branch
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Branches</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{branches.length}</div>
            <p className="text-xs text-muted-foreground">
              {branches.filter((b) => b.status === "active").length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Transfers</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              {transfers.filter((t) => t.status === "pending").length}
            </div>
            <p className="text-xs text-muted-foreground">Need approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <Truck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {transfers.filter((t) => t.status === "in_transit").length}
            </div>
            <p className="text-xs text-muted-foreground">Being transferred</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {
                transfers.filter(
                  (t) =>
                    t.status === "completed" &&
                    t.completedAt &&
                    new Date(t.completedAt).toDateString() === new Date().toDateString(),
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">Transfers completed</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="branches" className="space-y-4">
        <TabsList>
          <TabsTrigger value="branches">Branches</TabsTrigger>
          <TabsTrigger value="transfers">Transfers</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="branches" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Branch Locations</CardTitle>
              <CardDescription>Manage all your store locations</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Branch Name</TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {branches.map((branch) => (
                    <TableRow key={branch.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{branch.name}</div>
                            <div className="text-sm text-muted-foreground">ID: {branch.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{branch.managerName}</div>
                          <div className="text-sm text-muted-foreground">{branch.managerId}</div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate">{branch.address}</div>
                        <div className="text-sm text-muted-foreground">{branch.phone}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(branch.status)}>{branch.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{branch.phone}</div>
                          <div className="text-muted-foreground">{branch.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingBranch(branch)
                              setBranchDialogOpen(true)
                            }}
                            className="bg-transparent"
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transfers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inter-Branch Transfers</CardTitle>
              <CardDescription>Manage inventory transfers between branches</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transfer ID</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>From → To</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transfers.map((transfer) => (
                    <TableRow key={transfer.id}>
                      <TableCell className="font-mono text-sm">#{transfer.id.slice(-6)}</TableCell>
                      <TableCell>
                        <div className="font-medium">{transfer.productName}</div>
                        <div className="text-sm text-muted-foreground">ID: {transfer.productId}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{transfer.fromBranchName}</span>
                          <ArrowRightLeft className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{transfer.toBranchName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{transfer.quantity} units</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTransferStatusIcon(transfer.status)}
                          <span className="text-sm capitalize">{transfer.status.replace("_", " ")}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{transfer.requestedAt.toLocaleDateString()}</div>
                        <div className="text-xs text-muted-foreground">by {transfer.requestedBy}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {transfer.status === "pending" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleTransferAction(transfer.id, "approve")}
                                className="bg-transparent"
                              >
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleTransferAction(transfer.id, "cancel")}
                                className="bg-transparent text-red-600 hover:text-red-700"
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                          {transfer.status === "in_transit" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleTransferAction(transfer.id, "complete")}
                              className="bg-transparent"
                            >
                              Complete
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Branch Performance</CardTitle>
                <CardDescription>Sales performance by branch this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {branches.map((branch, index) => {
                    const mockSales = [500000, 400000, 350000][index] || 300000
                    const mockTransactions = [180, 156, 120][index] || 100

                    return (
                      <div key={branch.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-full">
                            <MapPin className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{branch.name}</div>
                            <div className="text-sm text-muted-foreground">{mockTransactions} transactions</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">Rp {mockSales.toLocaleString("id-ID")}</div>
                          <div className="text-sm text-muted-foreground">
                            Avg: Rp {(mockSales / mockTransactions).toLocaleString("id-ID")}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Transfer Statistics</CardTitle>
                <CardDescription>Inter-branch transfer activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {transfers.filter((t) => t.status === "completed").length}
                      </div>
                      <div className="text-sm text-green-600">Completed</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">
                        {transfers.filter((t) => t.status === "pending").length}
                      </div>
                      <div className="text-sm text-yellow-600">Pending</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Most Active Routes</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Utama → Mall</span>
                        <span className="font-medium">3 transfers</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Utama → Plaza</span>
                        <span className="font-medium">2 transfers</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Mall → Plaza</span>
                        <span className="font-medium">1 transfer</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <BranchDialog
        open={branchDialogOpen}
        onOpenChange={(open) => {
          setBranchDialogOpen(open)
          if (!open) setEditingBranch(null)
        }}
        branch={editingBranch}
      />

      <TransferDialog open={transferDialogOpen} onOpenChange={setTransferDialogOpen} />
    </div>
  )
}

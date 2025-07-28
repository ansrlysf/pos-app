"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAppStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { Users, Plus, Minus, Trash2, Calculator } from "lucide-react"

interface SplitBillDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  total: number
  onSplitComplete: (splits: SplitBill[]) => void
}

interface SplitBill {
  id: string
  customerName: string
  items: any[]
  amount: number
  percentage: number
}

export function SplitBillDialog({ open, onOpenChange, total, onSplitComplete }: SplitBillDialogProps) {
  const { cart } = useAppStore()
  const [splits, setSplits] = useState<SplitBill[]>([
    { id: "1", customerName: "Customer 1", items: [], amount: 0, percentage: 0 },
    { id: "2", customerName: "Customer 2", items: [], amount: 0, percentage: 0 },
  ])
  const [splitMethod, setSplitMethod] = useState<"equal" | "custom" | "items">("equal")
  const { toast } = useToast()

  const addSplit = () => {
    const newSplit: SplitBill = {
      id: Date.now().toString(),
      customerName: `Customer ${splits.length + 1}`,
      items: [],
      amount: 0,
      percentage: 0,
    }
    setSplits([...splits, newSplit])
  }

  const removeSplit = (id: string) => {
    if (splits.length > 2) {
      setSplits(splits.filter((s) => s.id !== id))
    }
  }

  const updateSplitName = (id: string, name: string) => {
    setSplits(splits.map((s) => (s.id === id ? { ...s, customerName: name } : s)))
  }

  const updateSplitAmount = (id: string, amount: number) => {
    setSplits(splits.map((s) => (s.id === id ? { ...s, amount, percentage: (amount / total) * 100 } : s)))
  }

  const splitEqually = () => {
    const amountPerPerson = total / splits.length
    const percentagePerPerson = 100 / splits.length
    setSplits(
      splits.map((s) => ({
        ...s,
        amount: amountPerPerson,
        percentage: percentagePerPerson,
      })),
    )
  }

  const splitByPercentage = (id: string, percentage: number) => {
    const amount = (total * percentage) / 100
    setSplits(splits.map((s) => (s.id === id ? { ...s, percentage, amount } : s)))
  }

  const totalSplitAmount = splits.reduce((sum, split) => sum + split.amount, 0)
  const remainingAmount = total - totalSplitAmount

  const handleComplete = () => {
    if (Math.abs(remainingAmount) > 0.01) {
      toast({
        title: "Split tidak seimbang",
        description: `Masih ada sisa ${remainingAmount.toLocaleString("id-ID")} yang belum dibagi`,
        variant: "destructive",
      })
      return
    }

    onSplitComplete(splits)
    onOpenChange(false)
    toast({
      title: "Split bill berhasil",
      description: `Bill dibagi menjadi ${splits.length} bagian`,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Split Bill - Rp {total.toLocaleString("id-ID")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Split Method */}
          <div className="flex gap-2">
            <Button
              variant={splitMethod === "equal" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSplitMethod("equal")
                splitEqually()
              }}
            >
              Bagi Rata
            </Button>
            <Button
              variant={splitMethod === "custom" ? "default" : "outline"}
              size="sm"
              onClick={() => setSplitMethod("custom")}
            >
              Custom Amount
            </Button>
            <Button
              variant={splitMethod === "items" ? "default" : "outline"}
              size="sm"
              onClick={() => setSplitMethod("items")}
            >
              Per Item
            </Button>
          </div>

          <ScrollArea className="max-h-96">
            <div className="space-y-4">
              {splits.map((split, index) => (
                <Card key={split.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Input
                          value={split.customerName}
                          onChange={(e) => updateSplitName(split.id, e.target.value)}
                          className="font-medium"
                        />
                        <Badge variant="secondary">{split.percentage.toFixed(1)}%</Badge>
                      </div>
                      {splits.length > 2 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSplit(split.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Jumlah (Rp)</Label>
                        <Input
                          type="number"
                          value={split.amount}
                          onChange={(e) => updateSplitAmount(split.id, Number(e.target.value))}
                          disabled={splitMethod === "equal"}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Persentase (%)</Label>
                        <Input
                          type="number"
                          value={split.percentage.toFixed(1)}
                          onChange={(e) => splitByPercentage(split.id, Number(e.target.value))}
                          disabled={splitMethod === "equal"}
                        />
                      </div>
                    </div>

                    {splitMethod === "items" && (
                      <div className="space-y-2">
                        <Label>Items</Label>
                        <div className="border rounded-lg p-3 max-h-32 overflow-auto">
                          {cart.map((item) => (
                            <div key={item.product.id} className="flex items-center justify-between py-1">
                              <span className="text-sm">{item.product.name}</span>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="icon" className="h-6 w-6 bg-transparent">
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="text-sm w-8 text-center">0</span>
                                <Button variant="outline" size="icon" className="h-6 w-6 bg-transparent">
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>

          {/* Add Split Button */}
          <Button variant="outline" onClick={addSplit} className="w-full bg-transparent">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Split
          </Button>

          {/* Summary */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Bill:</span>
                  <span className="font-bold">Rp {total.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Split:</span>
                  <span className="font-bold">Rp {totalSplitAmount.toLocaleString("id-ID")}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span>Sisa:</span>
                  <span className={`font-bold ${remainingAmount === 0 ? "text-green-600" : "text-red-600"}`}>
                    Rp {remainingAmount.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 bg-transparent">
              Batal
            </Button>
            <Button onClick={handleComplete} className="flex-1" disabled={Math.abs(remainingAmount) > 0.01}>
              <Calculator className="h-4 w-4 mr-2" />
              Terapkan Split
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

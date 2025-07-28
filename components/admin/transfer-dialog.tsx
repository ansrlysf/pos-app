"use client"

import type React from "react"

import { useState } from "react"
import { useMultiBranchStore } from "@/lib/multi-branch-store"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface TransferDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TransferDialog({ open, onOpenChange }: TransferDialogProps) {
  const { branches, requestTransfer } = useMultiBranchStore()
  const { products } = useAppStore()
  const [formData, setFormData] = useState({
    fromBranchId: "",
    toBranchId: "",
    productId: "",
    quantity: "",
    notes: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const fromBranch = branches.find((b) => b.id === formData.fromBranchId)
      const toBranch = branches.find((b) => b.id === formData.toBranchId)
      const product = products.find((p) => p.id === formData.productId)

      if (!fromBranch || !toBranch || !product) {
        throw new Error("Invalid selection")
      }

      requestTransfer({
        fromBranchId: formData.fromBranchId,
        fromBranchName: fromBranch.name,
        toBranchId: formData.toBranchId,
        toBranchName: toBranch.name,
        productId: formData.productId,
        productName: product.name,
        quantity: Number.parseInt(formData.quantity),
        requestedBy: "admin",
        notes: formData.notes,
      })

      toast({
        title: "Transfer requested",
        description: `Transfer of ${formData.quantity} ${product.name} from ${fromBranch.name} to ${toBranch.name} has been requested`,
      })

      setFormData({
        fromBranchId: "",
        toBranchId: "",
        productId: "",
        quantity: "",
        notes: "",
      })
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create transfer request",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>New Inter-Branch Transfer</DialogTitle>
          <DialogDescription>Request a transfer of products between branches</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fromBranch">From Branch *</Label>
              <Select
                value={formData.fromBranchId}
                onValueChange={(value) => setFormData({ ...formData, fromBranchId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select source branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches
                    .filter((b) => b.status === "active")
                    .map((branch) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="toBranch">To Branch *</Label>
              <Select
                value={formData.toBranchId}
                onValueChange={(value) => setFormData({ ...formData, toBranchId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select destination branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches
                    .filter((b) => b.status === "active" && b.id !== formData.fromBranchId)
                    .map((branch) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="product">Product *</Label>
            <Select
              value={formData.productId}
              onValueChange={(value) => setFormData({ ...formData, productId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select product to transfer" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} (Stock: {product.stock})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity *</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes for this transfer"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Request Transfer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

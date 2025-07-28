"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useMultiBranchStore } from "@/lib/multi-branch-store"
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

interface BranchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  branch?: any
}

export function BranchDialog({ open, onOpenChange, branch }: BranchDialogProps) {
  const { addBranch, updateBranch } = useMultiBranchStore()
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    managerId: "",
    managerName: "",
    status: "active",
    timezone: "Asia/Jakarta",
    currency: "IDR",
    taxRate: 10,
    settings: {
      allowNegativeStock: false,
      autoBackup: true,
      printReceipts: true,
      loyaltyProgram: true,
    },
    openingHours: {
      monday: { open: "08:00", close: "22:00", closed: false },
      tuesday: { open: "08:00", close: "22:00", closed: false },
      wednesday: { open: "08:00", close: "22:00", closed: false },
      thursday: { open: "08:00", close: "22:00", closed: false },
      friday: { open: "08:00", close: "22:00", closed: false },
      saturday: { open: "08:00", close: "23:00", closed: false },
      sunday: { open: "09:00", close: "21:00", closed: false },
    },
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (branch) {
      setFormData({
        name: branch.name,
        address: branch.address,
        phone: branch.phone,
        email: branch.email,
        managerId: branch.managerId,
        managerName: branch.managerName,
        status: branch.status,
        timezone: branch.timezone,
        currency: branch.currency,
        taxRate: branch.taxRate,
        settings: branch.settings,
        openingHours: branch.openingHours,
      })
    } else {
      setFormData({
        name: "",
        address: "",
        phone: "",
        email: "",
        managerId: "",
        managerName: "",
        status: "active",
        timezone: "Asia/Jakarta",
        currency: "IDR",
        taxRate: 10,
        settings: {
          allowNegativeStock: false,
          autoBackup: true,
          printReceipts: true,
          loyaltyProgram: true,
        },
        openingHours: {
          monday: { open: "08:00", close: "22:00", closed: false },
          tuesday: { open: "08:00", close: "22:00", closed: false },
          wednesday: { open: "08:00", close: "22:00", closed: false },
          thursday: { open: "08:00", close: "22:00", closed: false },
          friday: { open: "08:00", close: "22:00", closed: false },
          saturday: { open: "08:00", close: "23:00", closed: false },
          sunday: { open: "09:00", close: "21:00", closed: false },
        },
      })
    }
  }, [branch, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (branch) {
        updateBranch(branch.id, formData)
        toast({
          title: "Branch updated",
          description: `${formData.name} has been updated successfully`,
        })
      } else {
        addBranch(formData)
        toast({
          title: "Branch added",
          description: `${formData.name} has been added successfully`,
        })
      }
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save branch",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateOpeningHours = (day: string, field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: {
          ...prev.openingHours[day],
          [field]: value,
        },
      },
    }))
  }

  const days = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{branch ? "Edit Branch" : "Add New Branch"}</DialogTitle>
          <DialogDescription>
            {branch ? "Update branch information and settings" : "Create a new branch location"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="hours">Hours</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="manager">Manager</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Branch Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={formData.timezone}
                    onValueChange={(value) => setFormData({ ...formData, timezone: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Jakarta">Asia/Jakarta (WIB)</SelectItem>
                      <SelectItem value="Asia/Makassar">Asia/Makassar (WITA)</SelectItem>
                      <SelectItem value="Asia/Jayapura">Asia/Jayapura (WIT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => setFormData({ ...formData, currency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IDR">Indonesian Rupiah (IDR)</SelectItem>
                      <SelectItem value="USD">US Dollar (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    value={formData.taxRate}
                    onChange={(e) => setFormData({ ...formData, taxRate: Number(e.target.value) })}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="hours" className="space-y-4">
              <div className="space-y-4">
                {days.map((day) => (
                  <div key={day.key} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-20 font-medium">{day.label}</div>
                      <Switch
                        checked={!formData.openingHours[day.key].closed}
                        onCheckedChange={(checked) => updateOpeningHours(day.key, "closed", !checked)}
                      />
                    </div>
                    {!formData.openingHours[day.key].closed && (
                      <div className="flex items-center gap-2">
                        <Input
                          type="time"
                          value={formData.openingHours[day.key].open}
                          onChange={(e) => updateOpeningHours(day.key, "open", e.target.value)}
                          className="w-32"
                        />
                        <span>to</span>
                        <Input
                          type="time"
                          value={formData.openingHours[day.key].close}
                          onChange={(e) => updateOpeningHours(day.key, "close", e.target.value)}
                          className="w-32"
                        />
                      </div>
                    )}
                    {formData.openingHours[day.key].closed && <div className="text-muted-foreground">Closed</div>}
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Negative Stock</Label>
                    <p className="text-sm text-muted-foreground">Allow sales when stock is zero</p>
                  </div>
                  <Switch
                    checked={formData.settings.allowNegativeStock}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        settings: { ...prev.settings, allowNegativeStock: checked },
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Backup</Label>
                    <p className="text-sm text-muted-foreground">Automatically backup data daily</p>
                  </div>
                  <Switch
                    checked={formData.settings.autoBackup}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        settings: { ...prev.settings, autoBackup: checked },
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Print Receipts</Label>
                    <p className="text-sm text-muted-foreground">Automatically print receipts after transactions</p>
                  </div>
                  <Switch
                    checked={formData.settings.printReceipts}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        settings: { ...prev.settings, printReceipts: checked },
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Loyalty Program</Label>
                    <p className="text-sm text-muted-foreground">Enable customer loyalty program</p>
                  </div>
                  <Switch
                    checked={formData.settings.loyaltyProgram}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        settings: { ...prev.settings, loyaltyProgram: checked },
                      }))
                    }
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="manager" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="managerId">Manager ID *</Label>
                  <Input
                    id="managerId"
                    value={formData.managerId}
                    onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="managerName">Manager Name *</Label>
                  <Input
                    id="managerName"
                    value={formData.managerName}
                    onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                    required
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : branch ? "Update Branch" : "Add Branch"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

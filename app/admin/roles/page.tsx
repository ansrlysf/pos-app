"use client"

import { useState } from "react"
import { CASHIER_ROLES, type CashierRole, type Permission } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import {
  Users,
  Shield,
  Plus,
  Edit,
  Trash2,
  Eye,
  Settings,
  ShoppingCart,
  DollarSign,
  Receipt,
  UserCheck,
  Database,
  BarChart3,
  CreditCard,
  FileText,
  Star,
  Search,
  Lock,
} from "lucide-react"

const PERMISSION_GROUPS = {
  Transaksi: [
    "process_transaction",
    "apply_item_discount",
    "apply_global_discount",
    "void_transaction",
    "process_refund",
    "override_price",
  ],
  Customer: ["access_customer_data", "manage_customers", "access_loyalty", "customer_credit"],
  Sistem: ["view_transaction_history", "reprint_receipt", "manage_shift", "access_settings", "cash_drawer_operations"],
  "Laporan & Data": ["view_reports", "manage_inventory", "backup_restore", "audit_logs"],
  "Fitur Tambahan": ["transaction_notes", "product_favorites", "advanced_search"],
}

const PERMISSION_LABELS: Record<Permission, string> = {
  process_transaction: "Proses Transaksi",
  apply_item_discount: "Diskon Per Item",
  apply_global_discount: "Diskon Global",
  void_transaction: "Batalkan Transaksi",
  process_refund: "Proses Refund",
  override_price: "Ubah Harga",
  access_customer_data: "Akses Data Customer",
  manage_customers: "Kelola Customer",
  view_transaction_history: "Lihat Riwayat Transaksi",
  reprint_receipt: "Cetak Ulang Struk",
  manage_shift: "Kelola Shift",
  access_settings: "Akses Pengaturan",
  view_reports: "Lihat Laporan",
  manage_inventory: "Kelola Inventori",
  access_loyalty: "Program Loyalitas",
  cash_drawer_operations: "Operasi Laci Kas",
  backup_restore: "Backup & Restore",
  audit_logs: "Log Audit",
  transaction_notes: "Catatan Transaksi",
  product_favorites: "Produk Favorit",
  customer_credit: "Kredit Customer",
  advanced_search: "Pencarian Lanjutan",
}

const PERMISSION_ICONS: Record<Permission, any> = {
  process_transaction: ShoppingCart,
  apply_item_discount: DollarSign,
  apply_global_discount: DollarSign,
  void_transaction: Receipt,
  process_refund: Receipt,
  override_price: DollarSign,
  access_customer_data: UserCheck,
  manage_customers: Users,
  view_transaction_history: FileText,
  reprint_receipt: Receipt,
  manage_shift: Settings,
  access_settings: Settings,
  view_reports: BarChart3,
  manage_inventory: Database,
  access_loyalty: CreditCard,
  cash_drawer_operations: Lock,
  backup_restore: Database,
  audit_logs: FileText,
  transaction_notes: FileText,
  product_favorites: Star,
  customer_credit: CreditCard,
  advanced_search: Search,
}

export default function RolesPage() {
  const { toast } = useToast()
  const [selectedRole, setSelectedRole] = useState<CashierRole | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<CashierRole>>({})

  const handleCreateRole = () => {
    setSelectedRole(null)
    setFormData({
      name: "",
      description: "",
      permissions: [],
      color: "blue",
    })
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  const handleEditRole = (role: CashierRole) => {
    setSelectedRole(role)
    setFormData(role)
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  const handleViewRole = (role: CashierRole) => {
    setSelectedRole(role)
    setFormData(role)
    setIsEditing(false)
    setIsDialogOpen(true)
  }

  const handleSaveRole = () => {
    if (!formData.name || !formData.description) {
      toast({
        title: "Data tidak lengkap",
        description: "Nama dan deskripsi role harus diisi",
        variant: "destructive",
      })
      return
    }

    toast({
      title: selectedRole ? "Role diperbarui" : "Role dibuat",
      description: `Role "${formData.name}" berhasil ${selectedRole ? "diperbarui" : "dibuat"}`,
    })

    setIsDialogOpen(false)
    setSelectedRole(null)
    setFormData({})
  }

  const handleDeleteRole = (role: CashierRole) => {
    toast({
      title: "Role dihapus",
      description: `Role "${role.name}" berhasil dihapus`,
      variant: "destructive",
    })
  }

  const togglePermission = (permission: Permission) => {
    const currentPermissions = formData.permissions || []
    const hasPermission = currentPermissions.includes(permission)

    setFormData({
      ...formData,
      permissions: hasPermission
        ? currentPermissions.filter((p) => p !== permission)
        : [...currentPermissions, permission],
    })
  }

  const getRoleColor = (color: string) => {
    const colors = {
      blue: "bg-blue-100 text-blue-700 border-blue-200",
      green: "bg-green-100 text-green-700 border-green-200",
      purple: "bg-purple-100 text-purple-700 border-purple-200",
      red: "bg-red-100 text-red-700 border-red-200",
      orange: "bg-orange-100 text-orange-700 border-orange-200",
      gray: "bg-gray-100 text-gray-700 border-gray-200",
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manajemen Role</h1>
          <p className="text-muted-foreground">Kelola role dan izin akses untuk kasir</p>
        </div>
        <Button onClick={handleCreateRole} className="gap-2">
          <Plus className="h-4 w-4" />
          Buat Role Baru
        </Button>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CASHIER_ROLES.map((role) => (
          <Card key={role.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getRoleColor(role.color)}`}>
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{role.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Permissions Count */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Izin Akses:</span>
                <Badge variant="secondary">{role.permissions.length} izin</Badge>
              </div>

              {/* Top Permissions */}
              <div className="space-y-2">
                <span className="text-sm font-medium">Izin Utama:</span>
                <div className="flex flex-wrap gap-1">
                  {role.permissions.slice(0, 3).map((permission) => {
                    const Icon = PERMISSION_ICONS[permission]
                    return (
                      <Badge key={permission} variant="outline" className="text-xs">
                        <Icon className="h-3 w-3 mr-1" />
                        {PERMISSION_LABELS[permission]}
                      </Badge>
                    )
                  })}
                  {role.permissions.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{role.permissions.length - 3} lainnya
                    </Badge>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewRole(role)}
                  className="flex-1 gap-2 bg-transparent"
                >
                  <Eye className="h-4 w-4" />
                  Lihat
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditRole(role)}
                  className="flex-1 gap-2 bg-transparent"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteRole(role)}
                  className="gap-2 bg-transparent text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Role Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {isEditing ? (selectedRole ? "Edit Role" : "Buat Role Baru") : "Detail Role"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informasi Dasar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="roleName">Nama Role</Label>
                    <Input
                      id="roleName"
                      value={formData.name || ""}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Masukkan nama role"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="roleColor">Warna</Label>
                    <select
                      id="roleColor"
                      value={formData.color || "blue"}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    >
                      <option value="blue">Biru</option>
                      <option value="green">Hijau</option>
                      <option value="purple">Ungu</option>
                      <option value="red">Merah</option>
                      <option value="orange">Orange</option>
                      <option value="gray">Abu-abu</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roleDescription">Deskripsi</Label>
                  <Textarea
                    id="roleDescription"
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Masukkan deskripsi role"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Permissions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Izin Akses</CardTitle>
                <p className="text-sm text-muted-foreground">Pilih izin yang akan diberikan untuk role ini</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(PERMISSION_GROUPS).map(([groupName, permissions]) => (
                  <div key={groupName} className="space-y-3">
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">{groupName}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {permissions.map((permission) => {
                        const Icon = PERMISSION_ICONS[permission]
                        const isChecked = formData.permissions?.includes(permission) || false

                        return (
                          <div
                            key={permission}
                            className={`flex items-center space-x-3 p-3 rounded-lg border ${
                              isChecked ? "bg-primary/5 border-primary/20" : "bg-muted/30"
                            }`}
                          >
                            <Checkbox
                              id={permission}
                              checked={isChecked}
                              onCheckedChange={() => isEditing && togglePermission(permission)}
                              disabled={!isEditing}
                            />
                            <div className="flex items-center gap-2 flex-1">
                              <Icon className="h-4 w-4 text-muted-foreground" />
                              <Label htmlFor={permission} className="text-sm font-medium cursor-pointer">
                                {PERMISSION_LABELS[permission]}
                              </Label>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Summary */}
            {formData.permissions && formData.permissions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ringkasan Izin</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {formData.permissions.map((permission) => {
                      const Icon = PERMISSION_ICONS[permission]
                      return (
                        <Badge key={permission} variant="secondary" className="gap-1">
                          <Icon className="h-3 w-3" />
                          {PERMISSION_LABELS[permission]}
                        </Badge>
                      )
                    })}
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">Total: {formData.permissions.length} izin akses</p>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setIsDialogOpen(false)}>
                {isEditing ? "Batal" : "Tutup"}
              </Button>
              {isEditing && (
                <Button className="flex-1" onClick={handleSaveRole}>
                  {selectedRole ? "Perbarui Role" : "Buat Role"}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

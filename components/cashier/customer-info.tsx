"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { User, Phone, Mail, Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Customer {
  id: string
  name: string
  phone: string
  email?: string
  address?: string
  memberType: "regular" | "silver" | "gold" | "platinum"
  points: number
  totalSpent: number
}

interface CustomerInfoProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCustomerSelect: (customer: Customer | null) => void
  selectedCustomer: Customer | null
}

// Mock customer data
const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "John Doe",
    phone: "081234567890",
    email: "john@email.com",
    address: "Jl. Sudirman No. 123",
    memberType: "gold",
    points: 1250,
    totalSpent: 5000000,
  },
  {
    id: "2",
    name: "Jane Smith",
    phone: "081234567891",
    email: "jane@email.com",
    memberType: "silver",
    points: 750,
    totalSpent: 2500000,
  },
]

export function CustomerInfo({ open, onOpenChange, onCustomerSelect, selectedCustomer }: CustomerInfoProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [customers] = useState<Customer[]>(mockCustomers)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  })
  const { toast } = useToast()

  const filteredCustomers = customers.filter(
    (customer) => customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || customer.phone.includes(searchTerm),
  )

  const getMemberBadge = (memberType: string) => {
    const badges = {
      regular: { color: "secondary", label: "Regular" },
      silver: { color: "default", label: "Silver" },
      gold: { color: "default", label: "Gold" },
      platinum: { color: "default", label: "Platinum" },
    }
    return badges[memberType as keyof typeof badges] || badges.regular
  }

  const handleSelectCustomer = (customer: Customer) => {
    onCustomerSelect(customer)
    onOpenChange(false)
    toast({
      title: "Customer dipilih",
      description: `${customer.name} telah dipilih untuk transaksi ini`,
    })
  }

  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.phone) {
      toast({
        title: "Data tidak lengkap",
        description: "Nama dan nomor telepon harus diisi",
        variant: "destructive",
      })
      return
    }

    const customer: Customer = {
      id: Date.now().toString(),
      ...newCustomer,
      memberType: "regular",
      points: 0,
      totalSpent: 0,
    }

    handleSelectCustomer(customer)
    setNewCustomer({ name: "", phone: "", email: "", address: "" })
    setShowAddForm(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informasi Customer
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Customer */}
          {selectedCustomer && (
            <div className="p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Customer Terpilih</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onCustomerSelect(null)}
                  className="text-destructive hover:text-destructive"
                >
                  Hapus
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">{selectedCustomer.name}</p>
                  <p className="text-muted-foreground">{selectedCustomer.phone}</p>
                </div>
                <div className="text-right">
                  <Badge variant={getMemberBadge(selectedCustomer.memberType).color as any}>
                    {getMemberBadge(selectedCustomer.memberType).label}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">{selectedCustomer.points} poin</p>
                </div>
              </div>
            </div>
          )}

          {/* Search */}
          <div className="space-y-2">
            <Label>Cari Customer</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Nama atau nomor telepon..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline" onClick={() => setShowAddForm(!showAddForm)} className="bg-transparent">
                {showAddForm ? "Batal" : "Tambah Baru"}
              </Button>
            </div>
          </div>

          {/* Add New Customer Form */}
          {showAddForm && (
            <div className="p-4 border rounded-lg space-y-3">
              <h3 className="font-semibold">Tambah Customer Baru</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Nama *</Label>
                  <Input
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                    placeholder="Nama lengkap"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Telepon *</Label>
                  <Input
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    placeholder="08xxxxxxxxxx"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    placeholder="email@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Alamat</Label>
                  <Input
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                    placeholder="Alamat lengkap"
                  />
                </div>
              </div>
              <Button onClick={handleAddCustomer} className="w-full">
                Tambah & Pilih Customer
              </Button>
            </div>
          )}

          {/* Customer List */}
          <div className="space-y-2 max-h-64 overflow-auto">
            <Label>Pilih Customer ({filteredCustomers.length})</Label>
            {filteredCustomers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Tidak ada customer ditemukan</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleSelectCustomer(customer)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{customer.name}</h4>
                          <Badge variant={getMemberBadge(customer.memberType).color as any} className="text-xs">
                            {getMemberBadge(customer.memberType).label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {customer.phone}
                          </div>
                          {customer.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {customer.email}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <div className="flex items-center gap-1 text-yellow-600">
                          <Star className="h-3 w-3" />
                          {customer.points} poin
                        </div>
                        <div className="text-muted-foreground">
                          Total: Rp {customer.totalSpent.toLocaleString("id-ID")}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

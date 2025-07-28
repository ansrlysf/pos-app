"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Gift, Star, Crown, Diamond, Search, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface LoyaltyProgramProps {
  customerId?: string
  onRewardApplied?: (reward: any) => void
}

const LOYALTY_TIERS = [
  {
    id: "bronze",
    name: "Bronze",
    minPoints: 0,
    color: "bg-amber-600",
    icon: Star,
    benefits: ["5% discount on selected items"],
  },
  {
    id: "silver",
    name: "Silver",
    minPoints: 500,
    color: "bg-gray-400",
    icon: Star,
    benefits: ["10% discount", "Free delivery"],
  },
  {
    id: "gold",
    name: "Gold",
    minPoints: 1500,
    color: "bg-yellow-500",
    icon: Crown,
    benefits: ["15% discount", "Priority support", "Birthday rewards"],
  },
  {
    id: "diamond",
    name: "Diamond",
    minPoints: 3000,
    color: "bg-blue-600",
    icon: Diamond,
    benefits: ["20% discount", "VIP events", "Personal shopper"],
  },
]

const REWARDS_CATALOG = [
  {
    id: "1",
    name: "Diskon 10%",
    points: 100,
    type: "discount",
    value: 10,
    description: "Diskon 10% untuk pembelian berikutnya",
  },
  {
    id: "2",
    name: "Gratis Minuman",
    points: 150,
    type: "free_item",
    value: "drink",
    description: "Gratis 1 minuman pilihan",
  },
  {
    id: "3",
    name: "Cashback Rp 25.000",
    points: 250,
    type: "cashback",
    value: 25000,
    description: "Cashback langsung Rp 25.000",
  },
  {
    id: "4",
    name: "Diskon 20%",
    points: 400,
    type: "discount",
    value: 20,
    description: "Diskon 20% untuk pembelian berikutnya",
  },
  {
    id: "5",
    name: "Gratis Makanan",
    points: 300,
    type: "free_item",
    value: "food",
    description: "Gratis 1 makanan pilihan",
  },
  {
    id: "6",
    name: "Cashback Rp 50.000",
    points: 500,
    type: "cashback",
    value: 50000,
    description: "Cashback langsung Rp 50.000",
  },
]

export function LoyaltyProgram({ customerId, onRewardApplied }: LoyaltyProgramProps) {
  const { customers, updateCustomer } = useAppStore()
  const [selectedCustomerId, setSelectedCustomerId] = useState(customerId || "")
  const [searchTerm, setSearchTerm] = useState("")
  const [rewardDialogOpen, setRewardDialogOpen] = useState(false)
  const [selectedReward, setSelectedReward] = useState<any>(null)
  const { toast } = useToast()

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId)
  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone?.includes(searchTerm),
  )

  const getCurrentTier = (points: number) => {
    return (
      LOYALTY_TIERS.slice()
        .reverse()
        .find((tier) => points >= tier.minPoints) || LOYALTY_TIERS[0]
    )
  }

  const getNextTier = (points: number) => {
    return LOYALTY_TIERS.find((tier) => points < tier.minPoints)
  }

  const handleRedeemReward = (reward: any) => {
    if (!selectedCustomer) return

    if (selectedCustomer.loyaltyPoints < reward.points) {
      toast({
        title: "Poin tidak cukup",
        description: `Dibutuhkan ${reward.points} poin, tersedia ${selectedCustomer.loyaltyPoints} poin`,
        variant: "destructive",
      })
      return
    }

    // Deduct points
    updateCustomer(selectedCustomer.id, {
      loyaltyPoints: selectedCustomer.loyaltyPoints - reward.points,
    })

    // Apply reward
    onRewardApplied?.(reward)

    toast({
      title: "Reward berhasil ditukar!",
      description: `${reward.name} telah diterapkan`,
    })

    setRewardDialogOpen(false)
  }

  const addPoints = (points: number) => {
    if (!selectedCustomer) return

    updateCustomer(selectedCustomer.id, {
      loyaltyPoints: selectedCustomer.loyaltyPoints + points,
    })

    toast({
      title: "Poin ditambahkan",
      description: `${points} poin telah ditambahkan ke ${selectedCustomer.name}`,
    })
  }

  if (!selectedCustomer) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Program Loyalitas
          </CardTitle>
          <CardDescription>Pilih customer untuk melihat program loyalitas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredCustomers.map((customer) => {
              const tier = getCurrentTier(customer.loyaltyPoints)
              const TierIcon = tier.icon

              return (
                <div
                  key={customer.id}
                  className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedCustomerId(customer.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${tier.color} text-white`}>
                      <TierIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {customer.loyaltyPoints} poin • {tier.name}
                      </div>
                    </div>
                  </div>
                  <Button size="sm">Pilih</Button>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    )
  }

  const currentTier = getCurrentTier(selectedCustomer.loyaltyPoints)
  const nextTier = getNextTier(selectedCustomer.loyaltyPoints)
  const TierIcon = currentTier.icon
  const progress = nextTier
    ? ((selectedCustomer.loyaltyPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100
    : 100

  return (
    <div className="space-y-6">
      {/* Customer Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Program Loyalitas
            </div>
            <Button variant="outline" size="sm" onClick={() => setSelectedCustomerId("")}>
              Ganti Customer
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${currentTier.color} text-white`}>
              <TierIcon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{selectedCustomer.name}</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{selectedCustomer.email}</span>
                <span>{selectedCustomer.phone}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{selectedCustomer.loyaltyPoints}</div>
              <div className="text-sm text-muted-foreground">Total Poin</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{selectedCustomer.visitCount}</div>
              <div className="text-sm text-muted-foreground">Kunjungan</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                Rp {selectedCustomer.totalSpent.toLocaleString("id-ID")}
              </div>
              <div className="text-sm text-muted-foreground">Total Belanja</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tier Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge className={`${currentTier.color} text-white`}>{currentTier.name}</Badge>
            Status Tier
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {nextTier ? (
            <>
              <div className="flex justify-between text-sm">
                <span>{currentTier.name}</span>
                <span>{nextTier.name}</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="text-center text-sm text-muted-foreground">
                {nextTier.minPoints - selectedCustomer.loyaltyPoints} poin lagi untuk naik ke {nextTier.name}
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <Crown className="h-12 w-12 mx-auto mb-2 text-yellow-500" />
              <div className="font-semibold">Tier Tertinggi!</div>
              <div className="text-sm text-muted-foreground">Anda sudah mencapai tier Diamond</div>
            </div>
          )}

          <Separator />

          <div>
            <h4 className="font-medium mb-2">Benefit {currentTier.name}:</h4>
            <ul className="space-y-1">
              {currentTier.benefits.map((benefit, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                  <div className="w-1 h-1 bg-primary rounded-full" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => addPoints(50)} className="bg-transparent">
              <Plus className="h-4 w-4 mr-2" />
              +50 Poin
            </Button>
            <Button variant="outline" onClick={() => addPoints(100)} className="bg-transparent">
              <Plus className="h-4 w-4 mr-2" />
              +100 Poin
            </Button>
            <Dialog open={rewardDialogOpen} onOpenChange={setRewardDialogOpen}>
              <DialogTrigger asChild>
                <Button className="col-span-2">
                  <Gift className="h-4 w-4 mr-2" />
                  Tukar Reward
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Katalog Reward</DialogTitle>
                  <DialogDescription>Pilih reward yang ingin ditukar dengan poin loyalitas</DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {REWARDS_CATALOG.map((reward) => (
                    <Card key={reward.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{reward.name}</h4>
                          <Badge variant="secondary">{reward.points} poin</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{reward.description}</p>
                        <Button
                          size="sm"
                          className="w-full"
                          disabled={selectedCustomer.loyaltyPoints < reward.points}
                          onClick={() => handleRedeemReward(reward)}
                        >
                          {selectedCustomer.loyaltyPoints < reward.points ? "Poin Tidak Cukup" : "Tukar"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

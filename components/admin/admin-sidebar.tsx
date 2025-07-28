"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LayoutDashboard,
  Package,
  Users,
  Receipt,
  Settings,
  BarChart3,
  Warehouse,
  TrendingUp,
  Shield,
  MapPin,
} from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Produk",
    href: "/admin/products",
    icon: Package,
  },
  {
    name: "Inventori",
    href: "/admin/inventory",
    icon: Warehouse,
  },
  {
    name: "Cabang",
    href: "/admin/branches",
    icon: MapPin,
  },
  {
    name: "Transaksi",
    href: "/admin/transactions",
    icon: Receipt,
  },
  {
    name: "Pengguna",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Role & Akses",
    href: "/admin/roles",
    icon: Shield,
  },
  {
    name: "Laporan",
    href: "/admin/reports",
    icon: BarChart3,
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: TrendingUp,
  },
  {
    name: "Pengaturan",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="pb-12 w-64">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Admin Panel</h2>
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Button
                  key={item.name}
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={cn("w-full justify-start", pathname === item.href && "bg-muted font-medium")}
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

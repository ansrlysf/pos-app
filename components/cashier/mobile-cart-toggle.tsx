"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ShoppingCart } from "lucide-react"
import { MobileCart } from "./mobile-cart"

export function MobileCartToggle() {
  const { cart } = useAppStore()
  const [open, setOpen] = useState(false)

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalAmount = cart.reduce((sum, item) => sum + item.subtotal, 0)

  return (
    <>
      {/* Mobile Cart Button - Fixed at bottom */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-background border-t z-50">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button className="w-full h-14 text-lg font-semibold relative" size="lg">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Keranjang</span>
                  {totalItems > 0 && (
                    <Badge variant="secondary" className="bg-white text-primary">
                      {totalItems}
                    </Badge>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-sm opacity-90">Total</div>
                  <div className="font-bold">Rp {totalAmount.toLocaleString("id-ID")}</div>
                </div>
              </div>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] p-0">
            <MobileCart onClose={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Spacer for mobile to prevent content being hidden behind fixed button */}
      <div className="md:hidden h-20" />
    </>
  )
}

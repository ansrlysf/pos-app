"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { useOfflineStore } from "@/lib/offline-store";
import { CashierHeader } from "@/components/cashier/cashier-header";
import { ProductGrid } from "@/components/cashier/product-grid";
import { ProductSearch } from "@/components/cashier/product-search";
import { Cart } from "@/components/cashier/cart";
import { MobileCart } from "@/components/cashier/mobile-cart";
import { MobileCartToggle } from "@/components/cashier/mobile-cart-toggle";
import { TransactionHistory } from "@/components/cashier/transaction-history";
import { KeyboardShortcuts } from "@/components/cashier/keyboard-shortcuts";
import { LoyaltyProgram } from "@/components/cashier/loyalty-program";
import { SyncStatus } from "@/components/sync-status";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShoppingCart,
  History,
  Keyboard,
  Gift,
  Users,
  BarChart3,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function CashierPage() {
  const { currentUser, isAuthenticated, cart, hasPermission, currentShift } =
    useAppStore();
  const { addOfflineAction } = useOfflineStore();
  const [showMobileCart, setShowMobileCart] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [activeTab, setActiveTab] = useState("pos");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
      return;
    }

    // Auto-login as cashier for demo purposes
    if (!currentUser) {
      const demoUser = {
        id: "cashier1",
        name: "Demo Cashier",
        email: "cashier@demo.com",
        role: "cashier" as const,
        cashierRole: "senior",
        createdAt: new Date(),
      };
      // This would normally be handled by a proper login system
    }
  }, [isAuthenticated, currentUser, router]);

  // Add offline action when cart changes
  useEffect(() => {
    if (cart.length > 0) {
      addOfflineAction("CART_UPDATE", { cart, timestamp: new Date() });
    }
  }, [cart, addOfflineAction]);

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <CashierHeader />

      {/* Sync Status Bar */}
      <div className="bg-white dark:bg-gray-800 border-b px-4 py-2">
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {currentShift ? (
              <span>Shift aktif - {currentUser.name}</span>
            ) : (
              <span>Shift belum dimulai</span>
            )}
          </div>
          <SyncStatus />
        </div>
      </div>

      <div className="container mx-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="pos" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              POS
              {cart.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {cart.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="loyalty" className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              Loyalitas
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Customer
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Riwayat
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pos" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Products */}
              <div className="lg:col-span-2 space-y-6">
                {/* Search */}
                <ProductSearch />

                {/* Product Grid */}
                <ProductGrid />
              </div>

              {/* Right Column - Cart (Desktop) */}
              <div className="hidden lg:block">
                <div className="sticky top-4">
                  <Cart />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="loyalty" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LoyaltyProgram
                customerId={selectedCustomer}
                onRewardApplied={(reward) => {
                  // Apply reward to current transaction
                  addOfflineAction("LOYALTY_REWARD_APPLIED", {
                    reward,
                    customerId: selectedCustomer,
                  });
                }}
              />

              {/* Loyalty Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Statistik Loyalitas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">156</div>
                      <div className="text-sm text-muted-foreground">
                        Member Aktif
                      </div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        2,340
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Poin Ditukar Hari Ini
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Bronze Members</span>
                      <span className="font-medium">89</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Silver Members</span>
                      <span className="font-medium">45</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Gold Members</span>
                      <span className="font-medium">18</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Diamond Members</span>
                      <span className="font-medium">4</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            {hasPermission("access_customer_data") ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Manajemen Customer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Fitur Customer Management</p>
                    <p className="text-sm">
                      Kelola data customer, riwayat pembelian, dan program
                      loyalitas
                    </p>
                    <Button
                      className="mt-4"
                      onClick={() => setActiveTab("loyalty")}
                    >
                      Buka Program Loyalitas
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-12">
                <div className="text-muted-foreground">
                  <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Akses Ditolak</p>
                  <p className="text-sm">
                    Anda tidak memiliki izin untuk mengakses data customer
                  </p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history">
            {hasPermission("view_transaction_history") ? (
              <TransactionHistory />
            ) : (
              <div className="text-center py-12">
                <div className="text-muted-foreground">
                  <History className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Akses Ditolak</p>
                  <p className="text-sm">
                    Anda tidak memiliki izin untuk melihat riwayat transaksi
                  </p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Mobile Cart Toggle */}
      <div className="lg:hidden">
        <MobileCartToggle />
      </div>

      {/* Mobile Cart Overlay */}
      {showMobileCart && (
        <div className="lg:hidden fixed inset-0 bg-white dark:bg-gray-900 z-50">
          <MobileCart onClose={() => setShowMobileCart(false)} />
        </div>
      )}

      {/* Keyboard Shortcuts Button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 left-4 z-40 bg-white"
        onClick={() => setShowKeyboardShortcuts(true)}
      >
        <Keyboard className="h-4 w-4" />
      </Button>

      {/* Keyboard Shortcuts Dialog */}
      <KeyboardShortcuts
        onOpenScanner={() => {}}
        onOpenCart={() => {}}
        onClearCart={() => {}}
        // onOpenChange={setShowKeyboardShortcuts}
      />
    </div>
  );
}

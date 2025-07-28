"use client"

import { useAppStore } from "@/lib/store"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

export function RecentTransactions() {
  const { transactions } = useAppStore()

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  if (recentTransactions.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <p>Belum ada transaksi</p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-4">
        {recentTransactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <p className="text-sm font-medium">#{transaction.id}</p>
              <p className="text-xs text-muted-foreground">{new Date(transaction.createdAt).toLocaleString("id-ID")}</p>
              <p className="text-xs text-muted-foreground">{transaction.items.length} item(s)</p>
            </div>
            <div className="text-right space-y-1">
              <p className="text-sm font-medium">Rp {transaction.finalTotal.toLocaleString("id-ID")}</p>
              <Badge variant={transaction.paymentMethod === "cash" ? "default" : "secondary"}>
                {transaction.paymentMethod === "cash"
                  ? "Tunai"
                  : transaction.paymentMethod === "card"
                    ? "Kartu"
                    : "Digital"}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { History, Clock, Trash2, X } from "lucide-react"

interface SearchHistoryProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectHistory: (term: string) => void
}

export function SearchHistory({ open, onOpenChange, onSelectHistory }: SearchHistoryProps) {
  const [history, setHistory] = useState<string[]>([])

  useEffect(() => {
    if (open) {
      const savedHistory = JSON.parse(localStorage.getItem("searchHistory") || "[]")
      setHistory(savedHistory)
    }
  }, [open])

  const clearHistory = () => {
    localStorage.removeItem("searchHistory")
    setHistory([])
  }

  const removeHistoryItem = (term: string) => {
    const newHistory = history.filter((h) => h !== term)
    setHistory(newHistory)
    localStorage.setItem("searchHistory", JSON.stringify(newHistory))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Riwayat Pencarian
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {history.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Belum ada riwayat pencarian</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{history.length} pencarian terakhir</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearHistory}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Hapus Semua
                </Button>
              </div>

              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {history.map((term, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => {
                        onSelectHistory(term)
                        onOpenChange(false)
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{term}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeHistoryItem(term)
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

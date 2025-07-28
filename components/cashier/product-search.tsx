"use client"

import type React from "react"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ScanLine, X, History } from "lucide-react"
import { BarcodeScanner } from "./barcode-scanner"
import { SearchHistory } from "./search-history"

export function ProductSearch() {
  const [searchTerm, setSearchTerm] = useState("")
  const [scannerOpen, setScannerOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const { products, addToCart } = useAppStore()

  const handleBarcodeSearch = (barcode: string) => {
    const product = products.find((p) => p.barcode === barcode)
    if (product) {
      addToCart(product, 1)
      setSearchTerm("")
      // Add to search history
      addToSearchHistory(barcode)
    }
  }

  const handleProductSearch = (term: string) => {
    const product = products.find((p) => p.name.toLowerCase().includes(term.toLowerCase()) || p.barcode.includes(term))
    if (product) {
      addToCart(product, 1)
      setSearchTerm("")
      addToSearchHistory(term)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchTerm) {
      // Try barcode search first, then product name
      handleBarcodeSearch(searchTerm) || handleProductSearch(searchTerm)
    }
  }

  const addToSearchHistory = (term: string) => {
    const history = JSON.parse(localStorage.getItem("searchHistory") || "[]")
    const newHistory = [term, ...history.filter((h: string) => h !== term)].slice(0, 10)
    localStorage.setItem("searchHistory", JSON.stringify(newHistory))
  }

  const clearSearch = () => {
    setSearchTerm("")
  }

  return (
    <>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari produk atau scan barcode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10 pr-10 h-12 text-base"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
              onClick={clearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 shrink-0 bg-transparent"
          onClick={() => setHistoryOpen(true)}
        >
          <History className="h-5 w-5" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 shrink-0 bg-transparent"
          onClick={() => setScannerOpen(true)}
        >
          <ScanLine className="h-5 w-5" />
        </Button>
      </div>

      <BarcodeScanner open={scannerOpen} onOpenChange={setScannerOpen} />

      <SearchHistory
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        onSelectHistory={(term) => {
          setSearchTerm(term)
          handleProductSearch(term)
        }}
      />
    </>
  )
}

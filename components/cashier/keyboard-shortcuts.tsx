"use client"

import { useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"

interface KeyboardShortcutsProps {
  onOpenScanner: () => void
  onOpenCart: () => void
  onClearCart: () => void
}

export function KeyboardShortcuts({ onOpenScanner, onOpenCart, onClearCart }: KeyboardShortcutsProps) {
  const { clearCart } = useAppStore()
  const { toast } = useToast()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return
      }

      // Ctrl/Cmd + shortcuts
      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case "s":
            event.preventDefault()
            onOpenScanner()
            toast({
              title: "Scanner dibuka",
              description: "Gunakan Ctrl+S untuk membuka scanner",
            })
            break
          case "k":
            event.preventDefault()
            onOpenCart()
            break
          case "delete":
          case "backspace":
            event.preventDefault()
            onClearCart()
            break
        }
      }

      // Function keys
      switch (event.key) {
        case "F1":
          event.preventDefault()
          showShortcutsHelp()
          break
        case "F2":
          event.preventDefault()
          onOpenScanner()
          break
        case "F3":
          event.preventDefault()
          onOpenCart()
          break
        case "Escape":
          // Close any open dialogs
          break
      }
    }

    const showShortcutsHelp = () => {
      toast({
        title: "Keyboard Shortcuts",
        description: "F1: Help | F2: Scanner | F3: Cart | Ctrl+S: Scanner | Ctrl+K: Cart",
      })
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onOpenScanner, onOpenCart, onClearCart, toast])

  return null // This component doesn't render anything
}

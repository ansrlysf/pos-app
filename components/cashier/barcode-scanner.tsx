"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAppStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { ScanLine, Camera, X } from "lucide-react"

interface BarcodeScannerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BarcodeScanner({ open, onOpenChange }: BarcodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [manualBarcode, setManualBarcode] = useState("")
  const videoRef = useRef<HTMLVideoElement>(null)
  const { products, addToCart } = useAppStore()
  const { toast } = useToast()

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Use back camera
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsScanning(true)
      }
    } catch (error) {
      toast({
        title: "Kamera tidak tersedia",
        description: "Gunakan input manual untuk memasukkan barcode",
        variant: "destructive",
      })
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setIsScanning(false)
    }
  }

  const handleBarcodeFound = (barcode: string) => {
    const product = products.find((p) => p.barcode === barcode)
    if (product) {
      addToCart(product, 1)
      toast({
        title: "Produk ditemukan!",
        description: `${product.name} ditambahkan ke keranjang`,
      })
      onOpenChange(false)
    } else {
      toast({
        title: "Produk tidak ditemukan",
        description: `Barcode ${barcode} tidak terdaftar`,
        variant: "destructive",
      })
    }
  }

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (manualBarcode.trim()) {
      handleBarcodeFound(manualBarcode.trim())
      setManualBarcode("")
    }
  }

  // Simulate barcode detection (in real app, use a barcode library like ZXing)
  const simulateScan = () => {
    const sampleBarcodes = products.map((p) => p.barcode)
    const randomBarcode = sampleBarcodes[Math.floor(Math.random() * sampleBarcodes.length)]
    handleBarcodeFound(randomBarcode)
  }

  useEffect(() => {
    if (open) {
      startCamera()
    } else {
      stopCamera()
      setManualBarcode("")
    }

    return () => stopCamera()
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <ScanLine className="h-5 w-5" />
            Scanner Barcode
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-4">
          {/* Camera View */}
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />

            {/* Scanning Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="border-2 border-primary w-64 h-32 rounded-lg relative">
                <div className="absolute inset-0 border border-primary/50 rounded-lg animate-pulse" />
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-primary animate-pulse" />
              </div>
            </div>

            {/* Camera Status */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
              <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {isScanning ? "Scanning..." : "Camera Off"}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/50 text-white hover:bg-black/70"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Manual Input */}
          <div className="space-y-3">
            <div className="text-center text-sm text-muted-foreground">Atau masukkan barcode secara manual</div>
            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Masukkan barcode..."
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-md text-base"
              />
              <Button type="submit" disabled={!manualBarcode.trim()}>
                Cari
              </Button>
            </form>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={isScanning ? stopCamera : startCamera}>
              <Camera className="h-4 w-4 mr-2" />
              {isScanning ? "Stop Kamera" : "Start Kamera"}
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent" onClick={simulateScan}>
              Demo Scan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

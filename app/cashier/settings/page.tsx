"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Settings, Package, Printer, MapPin, Receipt, Percent, Globe, Save } from "lucide-react"

export default function CashierSettingsPage() {
  const { cashierSettings, updateCashierSettings } = useAppStore()
  const [settings, setSettings] = useState(cashierSettings)
  const { toast } = useToast()

  const handleSave = () => {
    updateCashierSettings(settings)
    toast({
      title: "Pengaturan disimpan",
      description: "Semua pengaturan kasir telah berhasil disimpan",
    })
  }

  const handleTestPrint = () => {
    toast({
      title: "Test print dimulai",
      description: "Mengirim test print ke printer...",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Pengaturan Kasir</h2>
            <p className="text-muted-foreground">Konfigurasi pengaturan untuk kasir</p>
          </div>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Simpan Pengaturan
          </Button>
        </div>

        <Tabs defaultValue="stock" className="space-y-4">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="stock" className="gap-2">
              <Package className="h-4 w-4" />
              Stok
            </TabsTrigger>
            <TabsTrigger value="printer" className="gap-2">
              <Printer className="h-4 w-4" />
              Printer
            </TabsTrigger>
            <TabsTrigger value="location" className="gap-2">
              <MapPin className="h-4 w-4" />
              Lokasi
            </TabsTrigger>
            <TabsTrigger value="receipt" className="gap-2">
              <Receipt className="h-4 w-4" />
              Struk
            </TabsTrigger>
            <TabsTrigger value="discount" className="gap-2">
              <Percent className="h-4 w-4" />
              Diskon
            </TabsTrigger>
            <TabsTrigger value="interface" className="gap-2">
              <Settings className="h-4 w-4" />
              Interface
            </TabsTrigger>
            <TabsTrigger value="system" className="gap-2">
              <Globe className="h-4 w-4" />
              Sistem
            </TabsTrigger>
          </TabsList>

          {/* Stock Settings */}
          <TabsContent value="stock" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Pengaturan Stok
                </CardTitle>
                <CardDescription>Konfigurasi validasi dan peringatan stok</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Validasi Stok</Label>
                    <p className="text-sm text-muted-foreground">
                      Periksa ketersediaan stok saat menambah ke keranjang
                    </p>
                  </div>
                  <Switch
                    checked={settings.validateStock}
                    onCheckedChange={(checked) => setSettings({ ...settings, validateStock: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Izinkan Stok Negatif</Label>
                    <p className="text-sm text-muted-foreground">Memungkinkan penjualan meskipun stok habis</p>
                  </div>
                  <Switch
                    checked={settings.allowNegativeStock}
                    onCheckedChange={(checked) => setSettings({ ...settings, allowNegativeStock: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Peringatan Stok Rendah</Label>
                    <p className="text-sm text-muted-foreground">Tampilkan peringatan ketika stok rendah</p>
                  </div>
                  <Switch
                    checked={settings.lowStockWarning}
                    onCheckedChange={(checked) => setSettings({ ...settings, lowStockWarning: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lowStockThreshold">Batas Stok Rendah</Label>
                  <Input
                    id="lowStockThreshold"
                    type="number"
                    min="1"
                    value={settings.lowStockThreshold}
                    onChange={(e) => setSettings({ ...settings, lowStockThreshold: Number(e.target.value) })}
                  />
                  <p className="text-sm text-muted-foreground">Tampilkan peringatan jika stok kurang dari nilai ini</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Printer Settings */}
          <TabsContent value="printer" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Printer className="h-5 w-5" />
                  Pengaturan Printer
                </CardTitle>
                <CardDescription>Konfigurasi printer dan pencetakan struk</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Aktifkan Printer</Label>
                    <p className="text-sm text-muted-foreground">Mengaktifkan fitur pencetakan struk</p>
                  </div>
                  <Switch
                    checked={settings.printerEnabled}
                    onCheckedChange={(checked) => setSettings({ ...settings, printerEnabled: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="printerName">Nama Printer</Label>
                  <Input
                    id="printerName"
                    value={settings.printerName}
                    onChange={(e) => setSettings({ ...settings, printerName: e.target.value })}
                    placeholder="Masukkan nama printer"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paperSize">Ukuran Kertas</Label>
                  <Select
                    value={settings.paperSize}
                    onValueChange={(value: any) => setSettings({ ...settings, paperSize: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="58mm">58mm (Thermal)</SelectItem>
                      <SelectItem value="80mm">80mm (Thermal)</SelectItem>
                      <SelectItem value="A4">A4 (Laser/Inkjet)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="printCopies">Jumlah Salinan</Label>
                  <Input
                    id="printCopies"
                    type="number"
                    min="1"
                    max="5"
                    value={settings.printCopies}
                    onChange={(e) => setSettings({ ...settings, printCopies: Number(e.target.value) })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Cetak Otomatis</Label>
                    <p className="text-sm text-muted-foreground">Cetak struk otomatis setelah pembayaran</p>
                  </div>
                  <Switch
                    checked={settings.autoPrint}
                    onCheckedChange={(checked) => setSettings({ ...settings, autoPrint: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Cetak Logo</Label>
                    <p className="text-sm text-muted-foreground">Tampilkan logo toko di struk</p>
                  </div>
                  <Switch
                    checked={settings.printLogo}
                    onCheckedChange={(checked) => setSettings({ ...settings, printLogo: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Cetak Barcode</Label>
                    <p className="text-sm text-muted-foreground">Tampilkan barcode transaksi di struk</p>
                  </div>
                  <Switch
                    checked={settings.printBarcode}
                    onCheckedChange={(checked) => setSettings({ ...settings, printBarcode: checked })}
                  />
                </div>

                <Separator />

                <Button onClick={handleTestPrint} variant="outline" className="w-full bg-transparent">
                  <Printer className="h-4 w-4 mr-2" />
                  Test Print
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Location Settings */}
          <TabsContent value="location" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Pengaturan Lokasi
                </CardTitle>
                <CardDescription>Informasi toko dan kasir</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Nama Toko</Label>
                  <Input
                    id="storeName"
                    value={settings.storeName}
                    onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storeAddress">Alamat Toko</Label>
                  <Textarea
                    id="storeAddress"
                    value={settings.storeAddress}
                    onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storePhone">Nomor Telepon</Label>
                  <Input
                    id="storePhone"
                    value={settings.storePhone}
                    onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cashRegisterName">Nama Kasir</Label>
                    <Input
                      id="cashRegisterName"
                      value={settings.cashRegisterName}
                      onChange={(e) => setSettings({ ...settings, cashRegisterName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cashierId">ID Kasir</Label>
                    <Input
                      id="cashierId"
                      value={settings.cashierId}
                      onChange={(e) => setSettings({ ...settings, cashierId: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Receipt Settings */}
          <TabsContent value="receipt" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Pengaturan Struk
                </CardTitle>
                <CardDescription>Kustomisasi tampilan dan konten struk</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="receiptHeader">Header Struk</Label>
                  <Input
                    id="receiptHeader"
                    value={settings.receiptHeader}
                    onChange={(e) => setSettings({ ...settings, receiptHeader: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="receiptFooter">Footer Struk</Label>
                  <Textarea
                    id="receiptFooter"
                    value={settings.receiptFooter}
                    onChange={(e) => setSettings({ ...settings, receiptFooter: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Tampilkan Pajak</Label>
                    <p className="text-sm text-muted-foreground">Tampilkan detail pajak di struk</p>
                  </div>
                  <Switch
                    checked={settings.showTax}
                    onCheckedChange={(checked) => setSettings({ ...settings, showTax: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Tampilkan Diskon</Label>
                    <p className="text-sm text-muted-foreground">Tampilkan detail diskon di struk</p>
                  </div>
                  <Switch
                    checked={settings.showDiscount}
                    onCheckedChange={(checked) => setSettings({ ...settings, showDiscount: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Tampilkan Info Customer</Label>
                    <p className="text-sm text-muted-foreground">Tampilkan informasi customer di struk</p>
                  </div>
                  <Switch
                    checked={settings.showCustomerInfo}
                    onCheckedChange={(checked) => setSettings({ ...settings, showCustomerInfo: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Discount Settings */}
          <TabsContent value="discount" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Percent className="h-5 w-5" />
                  Pengaturan Diskon
                </CardTitle>
                <CardDescription>Konfigurasi sistem diskon</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Izinkan Diskon Per Item</Label>
                    <p className="text-sm text-muted-foreground">Memungkinkan pemberian diskon untuk item individual</p>
                  </div>
                  <Switch
                    checked={settings.allowItemDiscount}
                    onCheckedChange={(checked) => setSettings({ ...settings, allowItemDiscount: checked })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxDiscountPercent">Maksimal Diskon (%)</Label>
                    <Input
                      id="maxDiscountPercent"
                      type="number"
                      min="0"
                      max="100"
                      value={settings.maxDiscountPercent}
                      onChange={(e) => setSettings({ ...settings, maxDiscountPercent: Number(e.target.value) })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxDiscountAmount">Maksimal Diskon (Rp)</Label>
                    <Input
                      id="maxDiscountAmount"
                      type="number"
                      min="0"
                      value={settings.maxDiscountAmount}
                      onChange={(e) => setSettings({ ...settings, maxDiscountAmount: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Wajib Alasan Diskon</Label>
                    <p className="text-sm text-muted-foreground">Memerlukan alasan saat memberikan diskon</p>
                  </div>
                  <Switch
                    checked={settings.requireDiscountReason}
                    onCheckedChange={(checked) => setSettings({ ...settings, requireDiscountReason: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Interface Settings */}
          <TabsContent value="interface" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Pengaturan Interface
                </CardTitle>
                <CardDescription>Kustomisasi tampilan dan interaksi</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Suara Notifikasi</Label>
                    <p className="text-sm text-muted-foreground">Aktifkan suara untuk notifikasi</p>
                  </div>
                  <Switch
                    checked={settings.soundEnabled}
                    onCheckedChange={(checked) => setSettings({ ...settings, soundEnabled: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Keyboard Shortcuts</Label>
                    <p className="text-sm text-muted-foreground">Aktifkan shortcut keyboard</p>
                  </div>
                  <Switch
                    checked={settings.keyboardShortcuts}
                    onCheckedChange={(checked) => setSettings({ ...settings, keyboardShortcuts: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Mode Touch</Label>
                    <p className="text-sm text-muted-foreground">Optimasi untuk layar sentuh</p>
                  </div>
                  <Switch
                    checked={settings.touchMode}
                    onCheckedChange={(checked) => setSettings({ ...settings, touchMode: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Settings */}
          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Pengaturan Sistem
                </CardTitle>
                <CardDescription>Konfigurasi sistem dan bahasa</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="language">Bahasa</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value: any) => setSettings({ ...settings, language: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="id">Bahasa Indonesia</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
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
import { Settings, Store, Receipt, Bell, Database, Shield, Download, Upload } from "lucide-react"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // Store Settings
    storeName: "POS Pro Store",
    storeAddress: "Jl. Contoh No. 123, Jakarta",
    storePhone: "+62 21 1234567",
    storeEmail: "store@pos.com",

    // Receipt Settings
    receiptHeader: "Terima kasih telah berbelanja",
    receiptFooter: "Barang yang sudah dibeli tidak dapat dikembalikan",
    showLogo: true,
    printAutomatically: false,

    // Notification Settings
    lowStockAlert: true,
    lowStockThreshold: 10,
    dailyReportEmail: true,
    soundNotifications: true,

    // System Settings
    currency: "IDR",
    taxRate: 10,
    backupFrequency: "daily",
    sessionTimeout: 30,

    // Security Settings
    requirePasswordChange: false,
    passwordExpiry: 90,
    maxLoginAttempts: 3,
    twoFactorAuth: false,
  })

  const { toast } = useToast()

  const handleSave = () => {
    // Simulate saving settings
    toast({
      title: "Pengaturan disimpan",
      description: "Semua pengaturan telah berhasil disimpan",
    })
  }

  const handleExportData = () => {
    toast({
      title: "Export dimulai",
      description: "Data sedang diexport, mohon tunggu...",
    })
  }

  const handleImportData = () => {
    toast({
      title: "Import berhasil",
      description: "Data telah berhasil diimport",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Pengaturan Sistem</h2>
          <p className="text-muted-foreground">Konfigurasi dan pengaturan aplikasi POS</p>
        </div>
        <Button onClick={handleSave}>
          <Settings className="h-4 w-4 mr-2" />
          Simpan Pengaturan
        </Button>
      </div>

      <Tabs defaultValue="store" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="store">
            <Store className="h-4 w-4 mr-2" />
            Toko
          </TabsTrigger>
          <TabsTrigger value="receipt">
            <Receipt className="h-4 w-4 mr-2" />
            Struk
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifikasi
          </TabsTrigger>
          <TabsTrigger value="system">
            <Database className="h-4 w-4 mr-2" />
            Sistem
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Keamanan
          </TabsTrigger>
          <TabsTrigger value="backup">
            <Download className="h-4 w-4 mr-2" />
            Backup
          </TabsTrigger>
        </TabsList>

        <TabsContent value="store" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Toko</CardTitle>
              <CardDescription>Pengaturan informasi dasar toko Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Nama Toko</Label>
                  <Input
                    id="storeName"
                    value={settings.storeName}
                    onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeEmail">Email Toko</Label>
                  <Input
                    id="storeEmail"
                    type="email"
                    value={settings.storeEmail}
                    onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeAddress">Alamat Toko</Label>
                <Textarea
                  id="storeAddress"
                  value={settings.storeAddress}
                  onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })}
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="receipt" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Struk</CardTitle>
              <CardDescription>Kustomisasi tampilan dan konten struk</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Tampilkan Logo</Label>
                  <p className="text-sm text-muted-foreground">Tampilkan logo toko di struk</p>
                </div>
                <Switch
                  checked={settings.showLogo}
                  onCheckedChange={(checked) => setSettings({ ...settings, showLogo: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Cetak Otomatis</Label>
                  <p className="text-sm text-muted-foreground">Cetak struk otomatis setelah transaksi</p>
                </div>
                <Switch
                  checked={settings.printAutomatically}
                  onCheckedChange={(checked) => setSettings({ ...settings, printAutomatically: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Notifikasi</CardTitle>
              <CardDescription>Atur notifikasi dan peringatan sistem</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Peringatan Stok Rendah</Label>
                  <p className="text-sm text-muted-foreground">Notifikasi ketika stok produk rendah</p>
                </div>
                <Switch
                  checked={settings.lowStockAlert}
                  onCheckedChange={(checked) => setSettings({ ...settings, lowStockAlert: checked })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lowStockThreshold">Batas Stok Rendah</Label>
                <Input
                  id="lowStockThreshold"
                  type="number"
                  value={settings.lowStockThreshold}
                  onChange={(e) => setSettings({ ...settings, lowStockThreshold: Number(e.target.value) })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Laporan Harian via Email</Label>
                  <p className="text-sm text-muted-foreground">Kirim laporan harian ke email</p>
                </div>
                <Switch
                  checked={settings.dailyReportEmail}
                  onCheckedChange={(checked) => setSettings({ ...settings, dailyReportEmail: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifikasi Suara</Label>
                  <p className="text-sm text-muted-foreground">Aktifkan suara untuk notifikasi</p>
                </div>
                <Switch
                  checked={settings.soundNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, soundNotifications: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Sistem</CardTitle>
              <CardDescription>Konfigurasi sistem dan operasional</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Mata Uang</Label>
                  <Select
                    value={settings.currency}
                    onValueChange={(value) => setSettings({ ...settings, currency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IDR">Rupiah (IDR)</SelectItem>
                      <SelectItem value="USD">US Dollar (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tarif Pajak (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    value={settings.taxRate}
                    onChange={(e) => setSettings({ ...settings, taxRate: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="backupFrequency">Frekuensi Backup</Label>
                  <Select
                    value={settings.backupFrequency}
                    onValueChange={(value) => setSettings({ ...settings, backupFrequency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Harian</SelectItem>
                      <SelectItem value="weekly">Mingguan</SelectItem>
                      <SelectItem value="monthly">Bulanan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Timeout Sesi (menit)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => setSettings({ ...settings, sessionTimeout: Number(e.target.value) })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Keamanan</CardTitle>
              <CardDescription>Konfigurasi keamanan dan akses sistem</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Wajib Ganti Password</Label>
                  <p className="text-sm text-muted-foreground">Pengguna harus mengganti password secara berkala</p>
                </div>
                <Switch
                  checked={settings.requirePasswordChange}
                  onCheckedChange={(checked) => setSettings({ ...settings, requirePasswordChange: checked })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passwordExpiry">Masa Berlaku Password (hari)</Label>
                <Input
                  id="passwordExpiry"
                  type="number"
                  value={settings.passwordExpiry}
                  onChange={(e) => setSettings({ ...settings, passwordExpiry: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxLoginAttempts">Maksimal Percobaan Login</Label>
                <Input
                  id="maxLoginAttempts"
                  type="number"
                  value={settings.maxLoginAttempts}
                  onChange={(e) => setSettings({ ...settings, maxLoginAttempts: Number(e.target.value) })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Aktifkan autentikasi dua faktor</p>
                </div>
                <Switch
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) => setSettings({ ...settings, twoFactorAuth: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Backup & Restore</CardTitle>
              <CardDescription>Kelola backup dan restore data sistem</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button onClick={handleExportData} className="h-20 flex-col">
                  <Download className="h-6 w-6 mb-2" />
                  Export Data
                </Button>
                <Button onClick={handleImportData} variant="outline" className="h-20 flex-col bg-transparent">
                  <Upload className="h-6 w-6 mb-2" />
                  Import Data
                </Button>
              </div>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-medium">Backup Terakhir</h4>
                <p className="text-sm text-muted-foreground">
                  15 Januari 2024, 10:30 WIB - backup-pos-20240115.zip (2.5 MB)
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Jadwal Backup Otomatis</h4>
                <p className="text-sm text-muted-foreground">
                  Backup otomatis dijadwalkan setiap hari pada pukul 02:00 WIB
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

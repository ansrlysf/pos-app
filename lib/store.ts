import { create } from "zustand"
import { persist } from "zustand/middleware"

// Permission Types
export type Permission =
  | "process_transaction"
  | "apply_item_discount"
  | "apply_global_discount"
  | "void_transaction"
  | "process_refund"
  | "override_price"
  | "access_customer_data"
  | "manage_customers"
  | "view_transaction_history"
  | "reprint_receipt"
  | "manage_shift"
  | "access_settings"
  | "view_reports"
  | "manage_inventory"
  | "access_loyalty"
  | "cash_drawer_operations"
  | "backup_restore"
  | "audit_logs"
  | "transaction_notes"
  | "product_favorites"
  | "customer_credit"
  | "advanced_search"
  | "manage_branches"
  | "inter_branch_transfer"
  | "central_reporting"

// Role Definitions
export interface CashierRole {
  id: string
  name: string
  description: string
  permissions: Permission[]
  color: string
}

export const CASHIER_ROLES: CashierRole[] = [
  {
    id: "junior",
    name: "Kasir Junior",
    description: "Operasi dasar kasir",
    color: "blue",
    permissions: ["process_transaction", "access_customer_data", "view_transaction_history", "transaction_notes"],
  },
  {
    id: "senior",
    name: "Kasir Senior",
    description: "Operasi kasir dengan diskon terbatas",
    color: "green",
    permissions: [
      "process_transaction",
      "apply_item_discount",
      "apply_global_discount",
      "access_customer_data",
      "manage_customers",
      "view_transaction_history",
      "reprint_receipt",
      "access_loyalty",
      "transaction_notes",
      "product_favorites",
      "advanced_search",
    ],
  },
  {
    id: "supervisor",
    name: "Supervisor",
    description: "Semua operasi kasir + fitur lanjutan",
    color: "purple",
    permissions: [
      "process_transaction",
      "apply_item_discount",
      "apply_global_discount",
      "void_transaction",
      "process_refund",
      "override_price",
      "access_customer_data",
      "manage_customers",
      "view_transaction_history",
      "reprint_receipt",
      "manage_shift",
      "access_settings",
      "access_loyalty",
      "cash_drawer_operations",
      "transaction_notes",
      "product_favorites",
      "customer_credit",
      "advanced_search",
      "inter_branch_transfer",
    ],
  },
  {
    id: "manager",
    name: "Manager",
    description: "Akses penuh semua fitur",
    color: "red",
    permissions: [
      "process_transaction",
      "apply_item_discount",
      "apply_global_discount",
      "void_transaction",
      "process_refund",
      "override_price",
      "access_customer_data",
      "manage_customers",
      "view_transaction_history",
      "reprint_receipt",
      "manage_shift",
      "access_settings",
      "view_reports",
      "manage_inventory",
      "access_loyalty",
      "cash_drawer_operations",
      "backup_restore",
      "audit_logs",
      "transaction_notes",
      "product_favorites",
      "customer_credit",
      "advanced_search",
      "manage_branches",
      "inter_branch_transfer",
      "central_reporting",
    ],
  },
]

// Types
export interface Product {
  id: string
  name: string
  category: string
  price: number
  cost: number
  stock: number
  barcode: string
  image?: string
  isFavorite?: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CartItem {
  product: Product
  quantity: number
  subtotal: number
  discount?: {
    type: "percentage" | "amount"
    value: number
    amount: number
    reason?: string
  }
  priceOverride?: {
    originalPrice: number
    newPrice: number
    reason: string
  }
  finalPrice: number
}

export interface Transaction {
  id: string
  items: CartItem[]
  total: number
  discount: number
  tax: number
  finalTotal: number
  paymentMethod: "cash" | "card" | "digital"
  cashReceived?: number
  change?: number
  createdAt: Date
  cashierId: string
  customerId?: string
  customerName?: string
  note?: string
  pointsUsed?: number
  status: "completed" | "voided" | "refunded"
  voidReason?: string
  refundAmount?: number
  refundReason?: string
  branchId?: string
}

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "cashier"
  cashierRole?: string
  permissions?: Permission[]
  branchId?: string
  createdAt: Date
}

export interface Customer {
  id: string
  name: string
  email?: string
  phone?: string
  loyaltyPoints: number
  creditBalance: number
  totalSpent: number
  visitCount: number
  lastVisit: Date
  segment: "new" | "regular" | "vip" | "inactive"
  createdAt: Date
}

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  createdAt: Date
}

export interface CashierSettings {
  // Stock Settings
  validateStock: boolean
  allowNegativeStock: boolean
  lowStockWarning: boolean
  lowStockThreshold: number

  // Printer Settings
  printerEnabled: boolean
  printerName: string
  paperSize: "58mm" | "80mm" | "A4"
  printCopies: number
  autoPrint: boolean
  printLogo: boolean
  printBarcode: boolean

  // Location Settings
  storeName: string
  storeAddress: string
  storePhone: string
  cashRegisterName: string
  cashierId: string

  // Receipt Settings
  receiptHeader: string
  receiptFooter: string
  showTax: boolean
  showDiscount: boolean
  showCustomerInfo: boolean

  // Discount Settings
  allowItemDiscount: boolean
  maxDiscountPercent: number
  maxDiscountAmount: number
  requireDiscountReason: boolean

  // Other Settings
  soundEnabled: boolean
  keyboardShortcuts: boolean
  touchMode: boolean
  language: "id" | "en"

  // New Settings
  allowPriceOverride: boolean
  maxPriceOverridePercent: number
  requireOverrideReason: boolean
  enableCustomerCredit: boolean
  autoBackup: boolean
  backupInterval: number
}

export interface ShiftSummary {
  id: string
  cashierId: string
  cashierName: string
  startTime: Date
  endTime?: Date
  startingCash: number
  endingCash?: number
  totalSales: number
  totalTransactions: number
  cashSales: number
  cardSales: number
  digitalSales: number
  totalDiscount: number
  totalTax: number
  expectedCash: number
  actualCash?: number
  cashDifference?: number
  status: "active" | "closed"
  transactions: string[]
  notes?: string
  voidedTransactions: number
  refundedAmount: number
  branchId?: string
}

export interface AuditLog {
  id: string
  userId: string
  userName: string
  action: string
  details: string
  timestamp: Date
  ipAddress?: string
  userAgent?: string
  branchId?: string
}

export interface ProductFavorite {
  productId: string
  userId: string
  createdAt: Date
}

// Add branches to the main store
export interface Branch {
  id: string
  name: string
  address: string
  phone: string
  email: string
  status: "active" | "inactive" | "maintenance"
}

interface AppState {
  // Auth
  currentUser: User | null
  isAuthenticated: boolean

  // Products
  products: Product[]
  categories: string[]
  productFavorites: ProductFavorite[]

  // Cart
  cart: CartItem[]

  // Transactions
  transactions: Transaction[]

  // Customers
  customers: Customer[]

  // Branches
  branches: Branch[]

  // Cashier Settings
  cashierSettings: CashierSettings

  // Shift Management
  currentShift: ShiftSummary | null
  shifts: ShiftSummary[]

  // Audit Logs
  auditLogs: AuditLog[]

  // UI
  isDarkMode: boolean

  // Notifications
  notifications: Notification[]

  // Actions
  login: (user: User) => void
  logout: () => void
  hasPermission: (permission: Permission) => boolean
  addAuditLog: (action: string, details: string) => void

  // Product actions
  addProduct: (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
  toggleProductFavorite: (productId: string) => void

  // Cart actions
  addToCart: (product: Product, quantity: number) => void
  updateCartItem: (
    productId: string,
    quantity: number,
    discount?: CartItem["discount"],
    priceOverride?: CartItem["priceOverride"],
  ) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void

  // Transaction actions
  processTransaction: (transaction: Omit<Transaction, "id" | "createdAt">) => void
  voidTransaction: (transactionId: string, reason: string) => void
  processRefund: (transactionId: string, amount: number, reason: string) => void

  // Customer actions
  addCustomer: (customer: Omit<Customer, "id" | "createdAt">) => void
  updateCustomer: (id: string, customer: Partial<Customer>) => void
  addCustomerCredit: (customerId: string, amount: number, reason: string) => void
  useCustomerCredit: (customerId: string, amount: number) => void

  // Cashier Settings
  updateCashierSettings: (settings: Partial<CashierSettings>) => void

  // Shift Management
  startShift: (startingCash: number) => void
  endShift: (endingCash: number, notes?: string) => void

  toggleDarkMode: () => void

  // Notification actions
  addNotification: (notification: Omit<Notification, "id" | "createdAt" | "read">) => void
  markNotificationRead: (id: string) => void
  clearNotifications: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentUser: null,
      isAuthenticated: false,
      products: [
        {
          id: "1",
          name: "Coca Cola 330ml",
          category: "Beverages",
          price: 5000,
          cost: 3000,
          stock: 100,
          barcode: "1234567890123",
          isFavorite: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "2",
          name: "Indomie Goreng",
          category: "Food",
          price: 3500,
          cost: 2500,
          stock: 50,
          barcode: "1234567890124",
          isFavorite: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "3",
          name: "Teh Botol Sosro",
          category: "Beverages",
          price: 4000,
          cost: 2800,
          stock: 75,
          barcode: "1234567890125",
          isFavorite: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      categories: ["Food", "Beverages", "Snacks", "Personal Care"],
      productFavorites: [{ productId: "2", userId: "cashier1", createdAt: new Date() }],
      cart: [],
      transactions: [],
      customers: [
        {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          phone: "+62812345678",
          loyaltyPoints: 1250,
          creditBalance: 50000,
          totalSpent: 2500000,
          visitCount: 15,
          lastVisit: new Date(),
          segment: "vip",
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane@example.com",
          phone: "+62812345679",
          loyaltyPoints: 750,
          creditBalance: 25000,
          totalSpent: 1200000,
          visitCount: 8,
          lastVisit: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          segment: "regular",
          createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        },
        {
          id: "3",
          name: "Bob Wilson",
          email: "bob@example.com",
          loyaltyPoints: 150,
          creditBalance: 0,
          totalSpent: 350000,
          visitCount: 2,
          lastVisit: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          segment: "new",
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        },
        {
          id: "4",
          name: "Alice Brown",
          email: "alice@example.com",
          phone: "+62812345680",
          loyaltyPoints: 2500,
          creditBalance: 100000,
          totalSpent: 5000000,
          visitCount: 25,
          lastVisit: new Date(),
          segment: "vip",
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        },
        {
          id: "5",
          name: "Charlie Davis",
          loyaltyPoints: 50,
          creditBalance: 0,
          totalSpent: 150000,
          visitCount: 1,
          lastVisit: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
          segment: "inactive",
          createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
        },
      ],
      branches: [
        {
          id: "branch1",
          name: "Cabang Utama",
          address: "Jl. Sudirman No. 123, Jakarta Pusat",
          phone: "+62 21 1234567",
          email: "utama@posstore.com",
          status: "active",
        },
        {
          id: "branch2",
          name: "Cabang Mall",
          address: "Mall Central Park Lt. 2, Jakarta Barat",
          phone: "+62 21 2345678",
          email: "mall@posstore.com",
          status: "active",
        },
        {
          id: "branch3",
          name: "Cabang Plaza",
          address: "Plaza Indonesia Lt. 1, Jakarta Pusat",
          phone: "+62 21 3456789",
          email: "plaza@posstore.com",
          status: "active",
        },
      ],
      cashierSettings: {
        // Stock Settings
        validateStock: true,
        allowNegativeStock: false,
        lowStockWarning: true,
        lowStockThreshold: 10,

        // Printer Settings
        printerEnabled: true,
        printerName: "Default Printer",
        paperSize: "80mm",
        printCopies: 1,
        autoPrint: false,
        printLogo: true,
        printBarcode: false,

        // Location Settings
        storeName: "POS Pro Store",
        storeAddress: "Jl. Contoh No. 123, Jakarta",
        storePhone: "+62 21 1234567",
        cashRegisterName: "Kasir 1",
        cashierId: "CASH001",

        // Receipt Settings
        receiptHeader: "Terima kasih telah berbelanja",
        receiptFooter: "Barang yang sudah dibeli tidak dapat dikembalikan",
        showTax: true,
        showDiscount: true,
        showCustomerInfo: true,

        // Discount Settings
        allowItemDiscount: true,
        maxDiscountPercent: 50,
        maxDiscountAmount: 100000,
        requireDiscountReason: false,

        // Other Settings
        soundEnabled: true,
        keyboardShortcuts: true,
        touchMode: true,
        language: "id",

        // New Settings
        allowPriceOverride: true,
        maxPriceOverridePercent: 20,
        requireOverrideReason: true,
        enableCustomerCredit: true,
        autoBackup: true,
        backupInterval: 24,
      },
      currentShift: null,
      shifts: [],
      auditLogs: [],
      isDarkMode: false,
      notifications: [],

      // Actions
      login: (user) => {
        set({ currentUser: user, isAuthenticated: true })
        get().addAuditLog("LOGIN", `User ${user.name} logged in`)
      },

      logout: () => {
        const { currentUser } = get()
        if (currentUser) {
          get().addAuditLog("LOGOUT", `User ${currentUser.name} logged out`)
        }
        set({ currentUser: null, isAuthenticated: false })
      },

      hasPermission: (permission) => {
        const { currentUser } = get()
        if (!currentUser) return false

        if (currentUser.role === "admin") return true

        if (currentUser.permissions?.includes(permission)) return true

        if (currentUser.cashierRole) {
          const role = CASHIER_ROLES.find((r) => r.id === currentUser.cashierRole)
          return role?.permissions.includes(permission) || false
        }

        return false
      },

      addAuditLog: (action, details) => {
        const { currentUser } = get()
        if (!currentUser) return

        const newLog: AuditLog = {
          id: Date.now().toString(),
          userId: currentUser.id,
          userName: currentUser.name,
          action,
          details,
          timestamp: new Date(),
          branchId: currentUser.branchId,
        }

        set((state) => ({
          auditLogs: [newLog, ...state.auditLogs].slice(0, 1000), // Keep last 1000 logs
        }))
      },

      addProduct: (productData) => {
        if (!get().hasPermission("manage_inventory")) {
          get().addNotification({
            title: "Akses ditolak",
            message: "Anda tidak memiliki izin untuk menambah produk",
            type: "error",
          })
          return
        }

        const newProduct: Product = {
          ...productData,
          id: Date.now().toString(),
          isFavorite: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        set((state) => ({ products: [...state.products, newProduct] }))
        get().addAuditLog("ADD_PRODUCT", `Added product: ${newProduct.name}`)
      },

      updateProduct: (id, productData) => {
        if (!get().hasPermission("manage_inventory")) {
          get().addNotification({
            title: "Akses ditolak",
            message: "Anda tidak memiliki izin untuk mengubah produk",
            type: "error",
          })
          return
        }

        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...productData, updatedAt: new Date() } : p)),
        }))
        get().addAuditLog("UPDATE_PRODUCT", `Updated product ID: ${id}`)
      },

      deleteProduct: (id) => {
        if (!get().hasPermission("manage_inventory")) {
          get().addNotification({
            title: "Akses ditolak",
            message: "Anda tidak memiliki izin untuk menghapus produk",
            type: "error",
          })
          return
        }

        const product = get().products.find((p) => p.id === id)
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }))
        get().addAuditLog("DELETE_PRODUCT", `Deleted product: ${product?.name || id}`)
      },

      toggleProductFavorite: (productId) => {
        if (!get().hasPermission("product_favorites")) return

        const { currentUser, productFavorites } = get()
        if (!currentUser) return

        const existingFavorite = productFavorites.find((f) => f.productId === productId && f.userId === currentUser.id)

        if (existingFavorite) {
          set((state) => ({
            productFavorites: state.productFavorites.filter(
              (f) => !(f.productId === productId && f.userId === currentUser.id),
            ),
          }))
        } else {
          const newFavorite: ProductFavorite = {
            productId,
            userId: currentUser.id,
            createdAt: new Date(),
          }
          set((state) => ({
            productFavorites: [...state.productFavorites, newFavorite],
          }))
        }

        // Update product favorite status
        set((state) => ({
          products: state.products.map((p) => (p.id === productId ? { ...p, isFavorite: !existingFavorite } : p)),
        }))
      },

      addToCart: (product, quantity) => {
        if (!get().hasPermission("process_transaction")) {
          get().addNotification({
            title: "Akses ditolak",
            message: "Anda tidak memiliki izin untuk memproses transaksi",
            type: "error",
          })
          return
        }

        const { cashierSettings } = get()

        // Validate stock if enabled
        if (cashierSettings.validateStock && !cashierSettings.allowNegativeStock) {
          if (product.stock < quantity) {
            get().addNotification({
              title: "Stok tidak cukup",
              message: `Stok ${product.name} hanya tersisa ${product.stock}`,
              type: "warning",
            })
            return
          }
        }

        set((state) => {
          const existingItem = state.cart.find((item) => item.product.id === product.id)
          if (existingItem) {
            const newQuantity = existingItem.quantity + quantity
            const subtotal = newQuantity * (existingItem.priceOverride?.newPrice || product.price)
            const discountAmount = existingItem.discount?.amount || 0
            const finalPrice = subtotal - discountAmount

            return {
              cart: state.cart.map((item) =>
                item.product.id === product.id
                  ? {
                      ...item,
                      quantity: newQuantity,
                      subtotal,
                      finalPrice,
                    }
                  : item,
              ),
            }
          } else {
            const subtotal = quantity * product.price
            return {
              cart: [
                ...state.cart,
                {
                  product,
                  quantity,
                  subtotal,
                  finalPrice: subtotal,
                },
              ],
            }
          }
        })
      },

      updateCartItem: (productId, quantity, discount, priceOverride) => {
        if (quantity <= 0) {
          get().removeFromCart(productId)
          return
        }

        set((state) => ({
          cart: state.cart.map((item) => {
            if (item.product.id === productId) {
              const basePrice = priceOverride?.newPrice || item.priceOverride?.newPrice || item.product.price
              const subtotal = quantity * basePrice
              const discountAmount = discount?.amount || 0
              const finalPrice = subtotal - discountAmount

              return {
                ...item,
                quantity,
                subtotal,
                discount,
                priceOverride,
                finalPrice,
              }
            }
            return item
          }),
        }))
      },

      removeFromCart: (productId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.product.id !== productId),
        }))
      },

      clearCart: () => set({ cart: [] }),

      processTransaction: (transactionData) => {
        if (!get().hasPermission("process_transaction")) {
          get().addNotification({
            title: "Akses ditolak",
            message: "Anda tidak memiliki izin untuk memproses transaksi",
            type: "error",
          })
          return
        }

        const { currentUser } = get()
        const newTransaction: Transaction = {
          ...transactionData,
          id: Date.now().toString(),
          status: "completed",
          createdAt: new Date(),
          branchId: currentUser?.branchId,
        }

        set((state) => ({
          transactions: [...state.transactions, newTransaction],
          cart: [], // Clear cart after transaction
        }))

        // Update current shift
        const { currentShift } = get()
        if (currentShift) {
          set((state) => ({
            currentShift: {
              ...currentShift,
              totalSales: currentShift.totalSales + transactionData.finalTotal,
              totalTransactions: currentShift.totalTransactions + 1,
              cashSales:
                currentShift.cashSales + (transactionData.paymentMethod === "cash" ? transactionData.finalTotal : 0),
              cardSales:
                currentShift.cardSales + (transactionData.paymentMethod === "card" ? transactionData.finalTotal : 0),
              digitalSales:
                currentShift.digitalSales +
                (transactionData.paymentMethod === "digital" ? transactionData.finalTotal : 0),
              totalDiscount: currentShift.totalDiscount + transactionData.discount,
              totalTax: currentShift.totalTax + transactionData.tax,
              expectedCash:
                currentShift.expectedCash + (transactionData.paymentMethod === "cash" ? transactionData.finalTotal : 0),
              transactions: [...currentShift.transactions, newTransaction.id],
            },
          }))
        }

        // Update product stock
        transactionData.items.forEach((item) => {
          get().updateProduct(item.product.id, {
            stock: item.product.stock - item.quantity,
          })
        })

        get().addAuditLog(
          "PROCESS_TRANSACTION",
          `Processed transaction ${newTransaction.id} - Total: Rp ${transactionData.finalTotal.toLocaleString("id-ID")}`,
        )
      },

      voidTransaction: (transactionId, reason) => {
        if (!get().hasPermission("void_transaction")) {
          get().addNotification({
            title: "Akses ditolak",
            message: "Anda tidak memiliki izin untuk membatalkan transaksi",
            type: "error",
          })
          return
        }

        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === transactionId ? { ...t, status: "voided", voidReason: reason } : t,
          ),
        }))

        // Update shift statistics
        const { currentShift } = get()
        if (currentShift) {
          set((state) => ({
            currentShift: {
              ...currentShift,
              voidedTransactions: currentShift.voidedTransactions + 1,
            },
          }))
        }

        get().addAuditLog("VOID_TRANSACTION", `Voided transaction ${transactionId} - Reason: ${reason}`)
      },

      processRefund: (transactionId, amount, reason) => {
        if (!get().hasPermission("process_refund")) {
          get().addNotification({
            title: "Akses ditolak",
            message: "Anda tidak memiliki izin untuk memproses refund",
            type: "error",
          })
          return
        }

        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === transactionId ? { ...t, status: "refunded", refundAmount: amount, refundReason: reason } : t,
          ),
        }))

        // Update shift statistics
        const { currentShift } = get()
        if (currentShift) {
          set((state) => ({
            currentShift: {
              ...currentShift,
              refundedAmount: currentShift.refundedAmount + amount,
            },
          }))
        }

        get().addAuditLog(
          "PROCESS_REFUND",
          `Processed refund for transaction ${transactionId} - Amount: Rp ${amount.toLocaleString("id-ID")} - Reason: ${reason}`,
        )
      },

      addCustomer: (customerData) => {
        if (!get().hasPermission("manage_customers")) {
          get().addNotification({
            title: "Akses ditolak",
            message: "Anda tidak memiliki izin untuk menambah customer",
            type: "error",
          })
          return
        }

        const newCustomer: Customer = {
          ...customerData,
          id: Date.now().toString(),
          creditBalance: 0,
          createdAt: new Date(),
        }
        set((state) => ({ customers: [...state.customers, newCustomer] }))
        get().addAuditLog("ADD_CUSTOMER", `Added customer: ${newCustomer.name}`)
      },

      updateCustomer: (id, customerData) => {
        if (!get().hasPermission("manage_customers")) {
          get().addNotification({
            title: "Akses ditolak",
            message: "Anda tidak memiliki izin untuk mengubah customer",
            type: "error",
          })
          return
        }

        set((state) => ({
          customers: state.customers.map((c) => (c.id === id ? { ...c, ...customerData } : c)),
        }))
        get().addAuditLog("UPDATE_CUSTOMER", `Updated customer ID: ${id}`)
      },

      addCustomerCredit: (customerId, amount, reason) => {
        if (!get().hasPermission("customer_credit")) {
          get().addNotification({
            title: "Akses ditolak",
            message: "Anda tidak memiliki izin untuk mengelola kredit customer",
            type: "error",
          })
          return
        }

        const customer = get().customers.find((c) => c.id === customerId)
        if (customer) {
          get().updateCustomer(customerId, {
            creditBalance: customer.creditBalance + amount,
          })
          get().addAuditLog(
            "ADD_CUSTOMER_CREDIT",
            `Added credit Rp ${amount.toLocaleString("id-ID")} to ${customer.name} - Reason: ${reason}`,
          )
        }
      },

      useCustomerCredit: (customerId, amount) => {
        if (!get().hasPermission("customer_credit")) return

        const customer = get().customers.find((c) => c.id === customerId)
        if (customer && customer.creditBalance >= amount) {
          get().updateCustomer(customerId, {
            creditBalance: customer.creditBalance - amount,
          })
          get().addAuditLog(
            "USE_CUSTOMER_CREDIT",
            `Used credit Rp ${amount.toLocaleString("id-ID")} from ${customer.name}`,
          )
        }
      },

      updateCashierSettings: (settings) => {
        if (!get().hasPermission("access_settings")) {
          get().addNotification({
            title: "Akses ditolak",
            message: "Anda tidak memiliki izin untuk mengubah pengaturan",
            type: "error",
          })
          return
        }

        set((state) => ({
          cashierSettings: { ...state.cashierSettings, ...settings },
        }))
        get().addAuditLog("UPDATE_SETTINGS", "Updated cashier settings")
      },

      startShift: (startingCash) => {
        if (!get().hasPermission("manage_shift")) {
          get().addNotification({
            title: "Akses ditolak",
            message: "Anda tidak memiliki izin untuk mengelola shift",
            type: "error",
          })
          return
        }

        const { currentUser } = get()
        if (!currentUser) return

        const newShift: ShiftSummary = {
          id: Date.now().toString(),
          cashierId: currentUser.id,
          cashierName: currentUser.name,
          startTime: new Date(),
          startingCash,
          totalSales: 0,
          totalTransactions: 0,
          cashSales: 0,
          cardSales: 0,
          digitalSales: 0,
          totalDiscount: 0,
          totalTax: 0,
          expectedCash: startingCash,
          status: "active",
          transactions: [],
          voidedTransactions: 0,
          refundedAmount: 0,
          branchId: currentUser.branchId,
        }

        set({ currentShift: newShift })
        get().addAuditLog("START_SHIFT", `Started shift with cash: Rp ${startingCash.toLocaleString("id-ID")}`)
      },

      endShift: (endingCash, notes) => {
        if (!get().hasPermission("manage_shift")) {
          get().addNotification({
            title: "Akses ditolak",
            message: "Anda tidak memiliki izin untuk mengelola shift",
            type: "error",
          })
          return
        }

        const { currentShift } = get()
        if (!currentShift) return

        const closedShift: ShiftSummary = {
          ...currentShift,
          endTime: new Date(),
          endingCash,
          actualCash: endingCash,
          cashDifference: endingCash - currentShift.expectedCash,
          status: "closed",
          notes,
        }

        set((state) => ({
          shifts: [...state.shifts, closedShift],
          currentShift: null,
        }))

        get().addAuditLog(
          "END_SHIFT",
          `Ended shift - Cash difference: Rp ${closedShift.cashDifference?.toLocaleString("id-ID") || "0"}`,
        )
      },

      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

      addNotification: (notificationData) => {
        const newNotification: Notification = {
          ...notificationData,
          id: Date.now().toString(),
          read: false,
          createdAt: new Date(),
        }
        set((state) => ({
          notifications: [newNotification, ...state.notifications].slice(0, 50), // Keep only last 50 notifications
        }))
      },

      markNotificationRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        }))
      },

      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: "pos-storage",
    },
  ),
)

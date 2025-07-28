import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Branch {
  id: string
  name: string
  address: string
  phone: string
  email: string
  managerId: string
  managerName: string
  status: "active" | "inactive" | "maintenance"
  timezone: string
  currency: string
  taxRate: number
  openingHours: {
    [key: string]: {
      open: string
      close: string
      closed: boolean
    }
  }
  settings: {
    allowNegativeStock: boolean
    autoBackup: boolean
    printReceipts: boolean
    loyaltyProgram: boolean
  }
  createdAt: Date
  updatedAt: Date
}

export interface BranchInventory {
  branchId: string
  productId: string
  stock: number
  minStock: number
  maxStock: number
  lastRestocked: Date
  supplier?: string
}

export interface InterBranchTransfer {
  id: string
  fromBranchId: string
  fromBranchName: string
  toBranchId: string
  toBranchName: string
  productId: string
  productName: string
  quantity: number
  status: "pending" | "in_transit" | "completed" | "cancelled"
  requestedBy: string
  approvedBy?: string
  completedBy?: string
  requestedAt: Date
  approvedAt?: Date
  completedAt?: Date
  notes?: string
}

export interface CentralReport {
  id: string
  type: "daily" | "weekly" | "monthly" | "custom"
  period: {
    start: Date
    end: Date
  }
  branches: string[]
  data: {
    totalSales: number
    totalTransactions: number
    totalProfit: number
    topProducts: Array<{
      productId: string
      productName: string
      quantity: number
      revenue: number
    }>
    branchPerformance: Array<{
      branchId: string
      branchName: string
      sales: number
      transactions: number
      profit: number
    }>
  }
  generatedAt: Date
  generatedBy: string
}

interface MultiBranchState {
  // Branches
  branches: Branch[]
  currentBranch: Branch | null
  branchInventory: BranchInventory[]

  // Transfers
  transfers: InterBranchTransfer[]

  // Reports
  centralReports: CentralReport[]

  // Actions
  addBranch: (branch: Omit<Branch, "id" | "createdAt" | "updatedAt">) => void
  updateBranch: (id: string, updates: Partial<Branch>) => void
  deleteBranch: (id: string) => void
  setCurrentBranch: (branchId: string) => void

  // Inventory Management
  updateBranchInventory: (branchId: string, productId: string, updates: Partial<BranchInventory>) => void
  getBranchInventory: (branchId: string) => BranchInventory[]

  // Inter-branch Transfers
  requestTransfer: (transfer: Omit<InterBranchTransfer, "id" | "requestedAt" | "status">) => void
  approveTransfer: (transferId: string, approvedBy: string) => void
  completeTransfer: (transferId: string, completedBy: string) => void
  cancelTransfer: (transferId: string, reason: string) => void

  // Central Reporting
  generateCentralReport: (type: CentralReport["type"], branches: string[], period: { start: Date; end: Date }) => void
  getCentralReports: () => CentralReport[]
}

export const useMultiBranchStore = create<MultiBranchState>()(
  persist(
    (set, get) => ({
      branches: [
        {
          id: "branch1",
          name: "Cabang Utama",
          address: "Jl. Sudirman No. 123, Jakarta Pusat",
          phone: "+62 21 1234567",
          email: "utama@posstore.com",
          managerId: "manager1",
          managerName: "Budi Santoso",
          status: "active",
          timezone: "Asia/Jakarta",
          currency: "IDR",
          taxRate: 10,
          openingHours: {
            monday: { open: "08:00", close: "22:00", closed: false },
            tuesday: { open: "08:00", close: "22:00", closed: false },
            wednesday: { open: "08:00", close: "22:00", closed: false },
            thursday: { open: "08:00", close: "22:00", closed: false },
            friday: { open: "08:00", close: "22:00", closed: false },
            saturday: { open: "08:00", close: "23:00", closed: false },
            sunday: { open: "09:00", close: "21:00", closed: false },
          },
          settings: {
            allowNegativeStock: false,
            autoBackup: true,
            printReceipts: true,
            loyaltyProgram: true,
          },
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
        },
        {
          id: "branch2",
          name: "Cabang Mall",
          address: "Mall Central Park Lt. 2, Jakarta Barat",
          phone: "+62 21 2345678",
          email: "mall@posstore.com",
          managerId: "manager2",
          managerName: "Sari Dewi",
          status: "active",
          timezone: "Asia/Jakarta",
          currency: "IDR",
          taxRate: 10,
          openingHours: {
            monday: { open: "10:00", close: "22:00", closed: false },
            tuesday: { open: "10:00", close: "22:00", closed: false },
            wednesday: { open: "10:00", close: "22:00", closed: false },
            thursday: { open: "10:00", close: "22:00", closed: false },
            friday: { open: "10:00", close: "22:00", closed: false },
            saturday: { open: "10:00", close: "23:00", closed: false },
            sunday: { open: "10:00", close: "22:00", closed: false },
          },
          settings: {
            allowNegativeStock: false,
            autoBackup: true,
            printReceipts: true,
            loyaltyProgram: true,
          },
          createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
        },
        {
          id: "branch3",
          name: "Cabang Plaza",
          address: "Plaza Indonesia Lt. 1, Jakarta Pusat",
          phone: "+62 21 3456789",
          email: "plaza@posstore.com",
          managerId: "manager3",
          managerName: "Ahmad Rahman",
          status: "active",
          timezone: "Asia/Jakarta",
          currency: "IDR",
          taxRate: 10,
          openingHours: {
            monday: { open: "10:00", close: "21:00", closed: false },
            tuesday: { open: "10:00", close: "21:00", closed: false },
            wednesday: { open: "10:00", close: "21:00", closed: false },
            thursday: { open: "10:00", close: "21:00", closed: false },
            friday: { open: "10:00", close: "22:00", closed: false },
            saturday: { open: "10:00", close: "22:00", closed: false },
            sunday: { open: "10:00", close: "21:00", closed: false },
          },
          settings: {
            allowNegativeStock: false,
            autoBackup: true,
            printReceipts: true,
            loyaltyProgram: true,
          },
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
        },
      ],
      currentBranch: null,
      branchInventory: [],
      transfers: [
        {
          id: "transfer1",
          fromBranchId: "branch1",
          fromBranchName: "Cabang Utama",
          toBranchId: "branch2",
          toBranchName: "Cabang Mall",
          productId: "1",
          productName: "Coca Cola 330ml",
          quantity: 50,
          status: "completed",
          requestedBy: "manager2",
          approvedBy: "manager1",
          completedBy: "staff1",
          requestedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          approvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
          completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          notes: "Urgent restock for weekend promotion",
        },
        {
          id: "transfer2",
          fromBranchId: "branch1",
          fromBranchName: "Cabang Utama",
          toBranchId: "branch3",
          toBranchName: "Cabang Plaza",
          productId: "2",
          productName: "Indomie Goreng",
          quantity: 100,
          status: "in_transit",
          requestedBy: "manager3",
          approvedBy: "manager1",
          requestedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          approvedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
          notes: "Regular monthly restock",
        },
      ],
      centralReports: [],

      addBranch: (branchData) => {
        const newBranch: Branch = {
          ...branchData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        set((state) => ({
          branches: [...state.branches, newBranch],
        }))
      },

      updateBranch: (id, updates) => {
        set((state) => ({
          branches: state.branches.map((branch) =>
            branch.id === id ? { ...branch, ...updates, updatedAt: new Date() } : branch,
          ),
        }))
      },

      deleteBranch: (id) => {
        set((state) => ({
          branches: state.branches.filter((branch) => branch.id !== id),
        }))
      },

      setCurrentBranch: (branchId) => {
        const branch = get().branches.find((b) => b.id === branchId)
        set({ currentBranch: branch || null })
      },

      updateBranchInventory: (branchId, productId, updates) => {
        set((state) => {
          const existingIndex = state.branchInventory.findIndex(
            (inv) => inv.branchId === branchId && inv.productId === productId,
          )

          if (existingIndex >= 0) {
            const updated = [...state.branchInventory]
            updated[existingIndex] = { ...updated[existingIndex], ...updates }
            return { branchInventory: updated }
          } else {
            const newInventory: BranchInventory = {
              branchId,
              productId,
              stock: 0,
              minStock: 10,
              maxStock: 100,
              lastRestocked: new Date(),
              ...updates,
            }
            return { branchInventory: [...state.branchInventory, newInventory] }
          }
        })
      },

      getBranchInventory: (branchId) => {
        return get().branchInventory.filter((inv) => inv.branchId === branchId)
      },

      requestTransfer: (transferData) => {
        const newTransfer: InterBranchTransfer = {
          ...transferData,
          id: Date.now().toString(),
          status: "pending",
          requestedAt: new Date(),
        }
        set((state) => ({
          transfers: [...state.transfers, newTransfer],
        }))
      },

      approveTransfer: (transferId, approvedBy) => {
        set((state) => ({
          transfers: state.transfers.map((transfer) =>
            transfer.id === transferId
              ? {
                  ...transfer,
                  status: "in_transit" as const,
                  approvedBy,
                  approvedAt: new Date(),
                }
              : transfer,
          ),
        }))
      },

      completeTransfer: (transferId, completedBy) => {
        set((state) => ({
          transfers: state.transfers.map((transfer) =>
            transfer.id === transferId
              ? {
                  ...transfer,
                  status: "completed" as const,
                  completedBy,
                  completedAt: new Date(),
                }
              : transfer,
          ),
        }))
      },

      cancelTransfer: (transferId, reason) => {
        set((state) => ({
          transfers: state.transfers.map((transfer) =>
            transfer.id === transferId
              ? {
                  ...transfer,
                  status: "cancelled" as const,
                  notes: `${transfer.notes || ""}\nCancelled: ${reason}`,
                }
              : transfer,
          ),
        }))
      },

      generateCentralReport: (type, branches, period) => {
        // Mock report generation
        const newReport: CentralReport = {
          id: Date.now().toString(),
          type,
          period,
          branches,
          data: {
            totalSales: 1250000,
            totalTransactions: 456,
            totalProfit: 375000,
            topProducts: [
              { productId: "1", productName: "Coca Cola 330ml", quantity: 150, revenue: 750000 },
              { productId: "2", productName: "Indomie Goreng", quantity: 200, revenue: 700000 },
            ],
            branchPerformance: [
              { branchId: "branch1", branchName: "Cabang Utama", sales: 500000, transactions: 180, profit: 150000 },
              { branchId: "branch2", branchName: "Cabang Mall", sales: 400000, transactions: 156, profit: 120000 },
              { branchId: "branch3", branchName: "Cabang Plaza", sales: 350000, transactions: 120, profit: 105000 },
            ],
          },
          generatedAt: new Date(),
          generatedBy: "admin",
        }

        set((state) => ({
          centralReports: [...state.centralReports, newReport],
        }))
      },

      getCentralReports: () => {
        return get().centralReports
      },
    }),
    {
      name: "multi-branch-storage",
    },
  ),
)

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface OfflineAction {
  id: string
  type: string
  data: any
  timestamp: Date
  retryCount: number
  maxRetries: number
  status: "pending" | "syncing" | "completed" | "failed"
}

export interface SyncStatus {
  isOnline: boolean
  lastSyncTime: Date | null
  pendingActions: OfflineAction[]
  syncInProgress: boolean
  syncErrors: string[]
}

interface OfflineState extends SyncStatus {
  // Actions
  addOfflineAction: (type: string, data: any) => void
  removeOfflineAction: (id: string) => void
  updateActionStatus: (id: string, status: OfflineAction["status"]) => void
  setOnlineStatus: (isOnline: boolean) => void
  setSyncInProgress: (inProgress: boolean) => void
  setLastSyncTime: (time: Date) => void
  addSyncError: (error: string) => void
  clearSyncErrors: () => void
  syncPendingActions: () => Promise<void>
}

export const useOfflineStore = create<OfflineState>()(
  persist(
    (set, get) => ({
      isOnline: navigator.onLine,
      lastSyncTime: null,
      pendingActions: [],
      syncInProgress: false,
      syncErrors: [],

      addOfflineAction: (type, data) => {
        const action: OfflineAction = {
          id: Date.now().toString(),
          type,
          data,
          timestamp: new Date(),
          retryCount: 0,
          maxRetries: 3,
          status: "pending",
        }

        set((state) => ({
          pendingActions: [...state.pendingActions, action],
        }))

        // Try to sync immediately if online
        if (get().isOnline && !get().syncInProgress) {
          get().syncPendingActions()
        }
      },

      removeOfflineAction: (id) => {
        set((state) => ({
          pendingActions: state.pendingActions.filter((action) => action.id !== id),
        }))
      },

      updateActionStatus: (id, status) => {
        set((state) => ({
          pendingActions: state.pendingActions.map((action) => (action.id === id ? { ...action, status } : action)),
        }))
      },

      setOnlineStatus: (isOnline) => {
        set({ isOnline })

        // Auto-sync when coming back online
        if (isOnline && !get().syncInProgress && get().pendingActions.length > 0) {
          get().syncPendingActions()
        }
      },

      setSyncInProgress: (inProgress) => {
        set({ syncInProgress: inProgress })
      },

      setLastSyncTime: (time) => {
        set({ lastSyncTime: time })
      },

      addSyncError: (error) => {
        set((state) => ({
          syncErrors: [...state.syncErrors, error],
        }))
      },

      clearSyncErrors: () => {
        set({ syncErrors: [] })
      },

      syncPendingActions: async () => {
        const { pendingActions, isOnline, syncInProgress } = get()

        if (!isOnline || syncInProgress || pendingActions.length === 0) {
          return
        }

        set({ syncInProgress: true, syncErrors: [] })

        for (const action of pendingActions.filter((a) => a.status === "pending")) {
          try {
            get().updateActionStatus(action.id, "syncing")

            // Simulate API call - replace with actual sync logic
            await new Promise((resolve) => setTimeout(resolve, 1000))

            // Mock success/failure based on retry count
            if (action.retryCount < 2 && Math.random() > 0.7) {
              throw new Error("Sync failed")
            }

            get().updateActionStatus(action.id, "completed")

            // Remove completed actions after a delay
            setTimeout(() => {
              get().removeOfflineAction(action.id)
            }, 5000)
          } catch (error) {
            const updatedAction = {
              ...action,
              retryCount: action.retryCount + 1,
              status: action.retryCount + 1 >= action.maxRetries ? "failed" : "pending",
            }

            set((state) => ({
              pendingActions: state.pendingActions.map((a) => (a.id === action.id ? updatedAction : a)),
            }))

            get().addSyncError(`Failed to sync ${action.type}: ${error}`)
          }
        }

        set({
          syncInProgress: false,
          lastSyncTime: new Date(),
        })
      },
    }),
    {
      name: "offline-storage",
    },
  ),
)

// Network status hook
export const useNetworkStatus = () => {
  const { isOnline, setOnlineStatus } = useOfflineStore()

  if (typeof window !== "undefined") {
    window.addEventListener("online", () => setOnlineStatus(true))
    window.addEventListener("offline", () => setOnlineStatus(false))
  }

  return isOnline
}

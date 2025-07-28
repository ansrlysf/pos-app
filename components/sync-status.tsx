"use client"

import { useState } from "react"
import { useOfflineStore } from "@/lib/offline-store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Wifi, WifiOff, RefreshCw, CheckCircle, XCircle, Clock, AlertTriangle, Activity } from "lucide-react"

export function SyncStatus() {
  const { isOnline, pendingActions, syncInProgress, lastSyncTime, syncErrors, syncPendingActions, clearSyncErrors } =
    useOfflineStore()

  const [detailsOpen, setDetailsOpen] = useState(false)

  const getActionIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "syncing":
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600"
      case "failed":
        return "text-red-600"
      case "syncing":
        return "text-blue-600"
      default:
        return "text-yellow-600"
    }
  }

  const completedActions = pendingActions.filter((a) => a.status === "completed").length
  const failedActions = pendingActions.filter((a) => a.status === "failed").length
  const pendingCount = pendingActions.filter((a) => a.status === "pending").length

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Connection Status */}
        <div className="flex items-center gap-2">
          {isOnline ? <Wifi className="h-4 w-4 text-green-500" /> : <WifiOff className="h-4 w-4 text-red-500" />}
          <span className="text-sm font-medium">{isOnline ? "Online" : "Offline"}</span>
        </div>

        {/* Sync Status */}
        {pendingActions.length > 0 && (
          <div className="flex items-center gap-2">
            {syncInProgress ? (
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
                <span className="text-sm">Syncing...</span>
              </div>
            ) : (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Activity className="h-3 w-3" />
                {pendingCount} pending
              </Badge>
            )}
          </div>
        )}

        {/* Error Indicator */}
        {syncErrors.length > 0 && (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            {syncErrors.length} errors
          </Badge>
        )}

        {/* Last Sync Time */}
        {lastSyncTime && (
          <span className="text-xs text-muted-foreground">Last sync: {lastSyncTime.toLocaleTimeString()}</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Manual Sync Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={syncPendingActions}
          disabled={!isOnline || syncInProgress || pendingActions.length === 0}
          className="bg-transparent"
        >
          <RefreshCw className={`h-4 w-4 mr-1 ${syncInProgress ? "animate-spin" : ""}`} />
          Sync
        </Button>

        {/* Details Dialog */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              Details
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Sync Status Details</DialogTitle>
              <DialogDescription>Detailed information about offline actions and synchronization</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{completedActions}</div>
                  <div className="text-sm text-green-600">Completed</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
                  <div className="text-sm text-yellow-600">Pending</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{failedActions}</div>
                  <div className="text-sm text-red-600">Failed</div>
                </div>
              </div>

              {/* Sync Progress */}
              {syncInProgress && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Sync Progress</span>
                    <span>{Math.round((completedActions / pendingActions.length) * 100)}%</span>
                  </div>
                  <Progress value={(completedActions / pendingActions.length) * 100} />
                </div>
              )}

              {/* Pending Actions */}
              {pendingActions.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium">Pending Actions</h4>
                  <ScrollArea className="h-64">
                    <div className="space-y-2">
                      {pendingActions.map((action) => (
                        <div key={action.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            {getActionIcon(action.status)}
                            <div>
                              <div className="font-medium text-sm">{action.type}</div>
                              <div className="text-xs text-muted-foreground">{action.timestamp.toLocaleString()}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-sm font-medium ${getStatusColor(action.status)}`}>
                              {action.status.charAt(0).toUpperCase() + action.status.slice(1)}
                            </div>
                            {action.retryCount > 0 && (
                              <div className="text-xs text-muted-foreground">
                                Retry {action.retryCount}/{action.maxRetries}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {/* Sync Errors */}
              {syncErrors.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-red-600">Sync Errors</h4>
                    <Button variant="outline" size="sm" onClick={clearSyncErrors}>
                      Clear Errors
                    </Button>
                  </div>
                  <ScrollArea className="h-32">
                    <div className="space-y-2">
                      {syncErrors.map((error, index) => (
                        <div key={index} className="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                          {error}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {/* Connection Info */}
              <Separator />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Connection Status:</span>
                  <span className={`ml-2 ${isOnline ? "text-green-600" : "text-red-600"}`}>
                    {isOnline ? "Online" : "Offline"}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Last Sync:</span>
                  <span className="ml-2 text-muted-foreground">
                    {lastSyncTime ? lastSyncTime.toLocaleString() : "Never"}
                  </span>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

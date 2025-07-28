"use client";

import { AdvancedDashboard } from "@/components/admin/advanced-dashboard";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your business performance and system status
        </p>
      </div>

      <AdvancedDashboard />
    </div>
  );
}

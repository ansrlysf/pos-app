"use client"

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"

const data = [
  { time: "08:00", pendapatan: 1200000 },
  { time: "10:00", pendapatan: 2100000 },
  { time: "12:00", pendapatan: 3800000 },
  { time: "14:00", pendapatan: 2900000 },
  { time: "16:00", pendapatan: 4200000 },
  { time: "18:00", pendapatan: 5100000 },
  { time: "20:00", pendapatan: 3600000 },
]

export function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2BBECB" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#2BBECB" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `Rp ${(value / 1000000).toFixed(1)}M`}
        />
        <Tooltip formatter={(value: number) => [`Rp ${value.toLocaleString("id-ID")}`, "Pendapatan"]} />
        <Area type="monotone" dataKey="pendapatan" stroke="#2BBECB" fillOpacity={1} fill="url(#colorRevenue)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

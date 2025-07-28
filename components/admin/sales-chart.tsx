"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { name: "Sen", total: 1200000 },
  { name: "Sel", total: 1900000 },
  { name: "Rab", total: 800000 },
  { name: "Kam", total: 2780000 },
  { name: "Jum", total: 1890000 },
  { name: "Sab", total: 2390000 },
  { name: "Min", total: 3490000 },
]

export function SalesChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `Rp ${(value / 1000000).toFixed(1)}M`}
        />
        <Tooltip formatter={(value: number) => [`Rp ${value.toLocaleString("id-ID")}`, "Penjualan"]} />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#2BBECB"
          strokeWidth={2}
          dot={{ fill: "#2BBECB", strokeWidth: 2, r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

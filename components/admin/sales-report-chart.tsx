"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"

const data = [
  { name: "Sen", penjualan: 45, transaksi: 12 },
  { name: "Sel", penjualan: 52, transaksi: 15 },
  { name: "Rab", penjualan: 38, transaksi: 10 },
  { name: "Kam", penjualan: 61, transaksi: 18 },
  { name: "Jum", penjualan: 55, transaksi: 16 },
  { name: "Sab", penjualan: 67, transaksi: 20 },
  { name: "Min", penjualan: 43, transaksi: 11 },
]

export function SalesReportChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip
          formatter={(value: number, name: string) => [
            name === "penjualan" ? `${value} item` : `${value} transaksi`,
            name === "penjualan" ? "Penjualan" : "Transaksi",
          ]}
        />
        <Bar dataKey="penjualan" fill="#2BBECB" radius={[4, 4, 0, 0]} />
        <Bar dataKey="transaksi" fill="#FF34AC" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

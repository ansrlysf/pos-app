"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

const data = [
  { name: "Coca Cola", value: 35, color: "#2BBECB" },
  { name: "Indomie", value: 25, color: "#FF34AC" },
  { name: "Teh Botol", value: 20, color: "#FDE6F3" },
  { name: "Snack", value: 15, color: "#8B5CF6" },
  { name: "Lainnya", value: 5, color: "#F59E0B" },
]

export function ProductSalesChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={120} paddingAngle={5} dataKey="value">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => [`${value}%`, "Persentase"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

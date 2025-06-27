"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DashboardStatsProps {
  totalRooms: number;
  availableRooms: number;
  bookedRooms: number;
  notPaidCount: number;
  partialPaidCount: number;
  totalRevenue: number;
}

export function DashboardStats({
  totalRooms,
  availableRooms,
  bookedRooms,
  notPaidCount,
  partialPaidCount,
  totalRevenue
}: DashboardStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const stats = [
    {
      title: "Total Kamar",
      value: totalRooms,
      color: "bg-blue-100 text-blue-800 border-blue-200",
    },
    {
      title: "Kamar Tersedia",
      value: availableRooms,
      color: "bg-green-100 text-green-800 border-green-200",
    },
    {
      title: "Kamar Terisi",
      value: bookedRooms,
      color: "bg-orange-100 text-orange-800 border-orange-200",
    },
    {
      title: "Belum Bayar",
      value: notPaidCount,
      color: "bg-red-100 text-red-800 border-red-200",
    },
    {
      title: "Bayar Sebagian",
      value: partialPaidCount,
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="p-6">
          <div className="flex flex-col items-center text-center">
            <h3 className="text-sm font-medium text-gray-600 mb-2">{stat.title}</h3>
            <Badge className={`text-2xl font-bold py-2 px-4 ${stat.color}`}>
              {stat.value}
            </Badge>
          </div>
        </Card>
      ))}
      
      <Card className="p-6 md:col-span-2 lg:col-span-5">
        <div className="text-center">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Pendapatan Bulanan</h3>
          <div className="text-3xl font-bold text-green-600">
            {formatCurrency(totalRevenue)}
          </div>
        </div>
      </Card>
    </div>
  );
}

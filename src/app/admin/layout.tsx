import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
    title: "Admin Dashboard - Suman Residence",
    description:
        "Admin dashboard untuk mengelola kamar dan penyewa Suman Residence",
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 flex">
            <AdminSidebar />
            <div className="flex-1 min-w-0">
                {children}
            </div>
        </div>
    );
}

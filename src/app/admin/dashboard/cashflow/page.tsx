"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    RefreshCw,
    TrendingUp,
    DollarSign,
    Calendar,
    User,
    Home,
    Download,
    Filter,
    Edit,
    Plus,
    Trash2,
    CreditCard,
    ShoppingCart,
    Headphones,
    FileText,
    Eye,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    CashflowService,
    CashflowEntry,
    CashflowStats,
} from "@/services/cashflow.service";
import { CashflowEditModal } from "@/components/admin/CashflowEditModal";
import {
    FixedCostService,
    FixedCost,
    FixedCostStats,
} from "@/services/fixed-cost.service";
import { FixedCostModal } from "@/components/admin/FixedCostModal";
import {
    VariableCostService,
    VariableCost,
    VariableCostStats,
} from "@/services/variable-cost.service";
import { VariableCostModal } from "@/components/admin/VariableCostModal";
import {
    SupportCostService,
    SupportCost,
    SupportCostStats,
} from "@/services/support-cost.service";
import { SupportCostModal } from "@/components/admin/SupportCostModal";
import { toast } from "sonner";

// Using CashflowEntry and CashflowStats from service

export default function CashflowPage() {
    const [entries, setEntries] = useState<CashflowEntry[]>([]);
    const [filteredEntries, setFilteredEntries] = useState<CashflowEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<CashflowStats>({
        totalIncome: 0,
        pendingAmount: 0,
        completedBookings: 0,
        partialPayments: 0,
    });
    const [activeFilter, setActiveFilter] = useState<string>("all");
    const [editingEntry, setEditingEntry] = useState<CashflowEntry | null>(
        null
    );
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Fixed Costs state
    const [fixedCosts, setFixedCosts] = useState<FixedCost[]>([]);
    const [fixedCostStats, setFixedCostStats] = useState<FixedCostStats>({
        totalExpenses: 0,
        paidExpenses: 0,
        pendingExpenses: 0,
        overdueExpenses: 0,
        monthlyTotal: 0,
    });
    const [editingFixedCost, setEditingFixedCost] = useState<FixedCost | null>(
        null
    );
    const [isFixedCostModalOpen, setIsFixedCostModalOpen] = useState(false);

    // Variable Costs state
    const [variableCosts, setVariableCosts] = useState<VariableCost[]>([]);
    const [variableCostStats, setVariableCostStats] =
        useState<VariableCostStats>({
            totalExpenses: 0,
            paidExpenses: 0,
            pendingExpenses: 0,
            overdueExpenses: 0,
            monthlyTotal: 0,
        });
    const [editingVariableCost, setEditingVariableCost] =
        useState<VariableCost | null>(null);
    const [isVariableCostModalOpen, setIsVariableCostModalOpen] =
        useState(false);

    // Support Costs state
    const [supportCosts, setSupportCosts] = useState<SupportCost[]>([]);
    const [supportCostStats, setSupportCostStats] = useState<SupportCostStats>({
        totalExpenses: 0,
        paidExpenses: 0,
        pendingExpenses: 0,
        overdueExpenses: 0,
        monthlyTotal: 0,
    });
    const [editingSupportCost, setEditingSupportCost] =
        useState<SupportCost | null>(null);
    const [isSupportCostModalOpen, setIsSupportCostModalOpen] = useState(false);

    const [activeSection, setActiveSection] = useState<
        "income" | "fixed-costs" | "variable-costs" | "support-costs"
    >("income");

    const fetchCashflowData = async () => {
        try {
            setLoading(true);
            const result = await CashflowService.getCashflowData();

            if (result.success) {
                setEntries(result.entries || []);
                setFilteredEntries(result.entries || []);
                setStats(
                    result.stats || {
                        totalIncome: 0,
                        pendingAmount: 0,
                        completedBookings: 0,
                        partialPayments: 0,
                    }
                );
            } else {
                toast.error(result.error || "Failed to fetch cashflow data");
            }
        } catch (error) {
            console.error("Error fetching cashflow data:", error);
            toast.error("Failed to fetch cashflow data");
        } finally {
            setLoading(false);
        }
    };

    const fetchFixedCosts = async () => {
        try {
            const result = await FixedCostService.getAllFixedCosts();

            if (result.success) {
                setFixedCosts(result.fixedCosts || []);
                setFixedCostStats(
                    FixedCostService.calculateStats(result.fixedCosts || [])
                );
            } else {
                toast.error(result.error || "Failed to fetch fixed costs");
            }
        } catch (error) {
            console.error("Error fetching fixed costs:", error);
            toast.error("Failed to fetch fixed costs");
        }
    };

    const fetchVariableCosts = async () => {
        try {
            const result = await VariableCostService.getAllVariableCosts();

            if (result.success) {
                setVariableCosts(result.variableCosts || []);
                setVariableCostStats(
                    VariableCostService.calculateStats(
                        result.variableCosts || []
                    )
                );
            } else {
                toast.error(result.error || "Failed to fetch variable costs");
            }
        } catch (error) {
            console.error("Error fetching variable costs:", error);
            toast.error("Failed to fetch variable costs");
        }
    };

    const fetchSupportCosts = async () => {
        try {
            const result = await SupportCostService.getAllSupportCosts();

            if (result.success) {
                setSupportCosts(result.supportCosts || []);
                setSupportCostStats(
                    SupportCostService.calculateStats(result.supportCosts || [])
                );
            } else {
                toast.error(result.error || "Failed to fetch support costs");
            }
        } catch (error) {
            console.error("Error fetching support costs:", error);
            toast.error("Failed to fetch support costs");
        }
    };

    useEffect(() => {
        fetchCashflowData();
        fetchFixedCosts();
        fetchVariableCosts();
        fetchSupportCosts();
    }, []);

    // Filter entries based on active filter
    useEffect(() => {
        let filtered = entries;

        switch (activeFilter) {
            case "income":
                filtered = entries.filter((entry) => entry.status === "Income");
                break;
            case "pending":
                filtered = entries.filter(
                    (entry) => entry.status === "Pending"
                );
                break;
            case "paid":
                filtered = entries.filter(
                    (entry) => entry.paymentStatus === "Paid"
                );
                break;
            case "partial":
                filtered = entries.filter(
                    (entry) => entry.paymentStatus === "Partial"
                );
                break;
            case "unpaid":
                filtered = entries.filter(
                    (entry) => entry.paymentStatus === "Not Paid"
                );
                break;
            default:
                filtered = entries;
        }

        setFilteredEntries(filtered);
    }, [entries, activeFilter]);

    const handleExportCsv = () => {
        if (filteredEntries.length === 0) {
            toast.error("No data to export");
            return;
        }

        CashflowService.exportToCsv(filteredEntries);
        toast.success("Data exported successfully");
    };

    const handleEditEntry = (entry: CashflowEntry) => {
        setEditingEntry(entry);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditingEntry(null);
    };

    const handleSaveEdit = () => {
        // Refresh data after successful edit
        fetchCashflowData();
    };

    // Fixed Cost handlers
    const handleAddFixedCost = () => {
        setEditingFixedCost(null);
        setIsFixedCostModalOpen(true);
    };

    const handleEditFixedCost = (fixedCost: FixedCost) => {
        setEditingFixedCost(fixedCost);
        setIsFixedCostModalOpen(true);
    };

    const handleDeleteFixedCost = async (fixedCost: FixedCost) => {
        if (
            window.confirm(
                `Are you sure you want to delete "${fixedCost.caption}"?`
            )
        ) {
            const result = await FixedCostService.deleteFixedCost(fixedCost.id);
            if (result.success) {
                toast.success("Fixed cost deleted successfully");
                fetchFixedCosts();
            } else {
                toast.error(result.error || "Failed to delete fixed cost");
            }
        }
    };

    const handleCloseFixedCostModal = () => {
        setIsFixedCostModalOpen(false);
        setEditingFixedCost(null);
    };

    const handleSaveFixedCost = () => {
        fetchFixedCosts();
    };

    // Variable Cost handlers
    const handleAddVariableCost = () => {
        setEditingVariableCost(null);
        setIsVariableCostModalOpen(true);
    };

    const handleEditVariableCost = (variableCost: VariableCost) => {
        setEditingVariableCost(variableCost);
        setIsVariableCostModalOpen(true);
    };

    const handleDeleteVariableCost = async (variableCost: VariableCost) => {
        if (
            window.confirm(
                `Are you sure you want to delete "${variableCost.caption}"?`
            )
        ) {
            const result = await VariableCostService.deleteVariableCost(
                variableCost.id
            );
            if (result.success) {
                toast.success("Variable cost deleted successfully");
                fetchVariableCosts();
            } else {
                toast.error(result.error || "Failed to delete variable cost");
            }
        }
    };

    const handleCloseVariableCostModal = () => {
        setIsVariableCostModalOpen(false);
        setEditingVariableCost(null);
    };

    const handleSaveVariableCost = () => {
        fetchVariableCosts();
    };

    // Support Cost handlers
    const handleAddSupportCost = () => {
        setEditingSupportCost(null);
        setIsSupportCostModalOpen(true);
    };

    const handleEditSupportCost = (supportCost: SupportCost) => {
        setEditingSupportCost(supportCost);
        setIsSupportCostModalOpen(true);
    };

    const handleDeleteSupportCost = async (supportCost: SupportCost) => {
        if (
            window.confirm(
                `Are you sure you want to delete "${supportCost.caption}"?`
            )
        ) {
            const result = await SupportCostService.deleteSupportCost(
                supportCost.id
            );
            if (result.success) {
                toast.success("Support cost deleted successfully");
                fetchSupportCosts();
            } else {
                toast.error(result.error || "Failed to delete support cost");
            }
        }
    };

    const handleCloseSupportCostModal = () => {
        setIsSupportCostModalOpen(false);
        setEditingSupportCost(null);
    };

    const handleSaveSupportCost = () => {
        fetchSupportCosts();
    };

    const handleRefreshAll = () => {
        fetchCashflowData();
        fetchFixedCosts();
        fetchVariableCosts();
        fetchSupportCosts();
    };

    const formatCurrency = CashflowService.formatCurrency;
    const formatDate = CashflowService.formatDate;

    const getStatusBadge = (status: string) => {
        if (status === "Income") {
            return (
                <Badge className="bg-green-100 text-green-800">Income</Badge>
            );
        }
        return <Badge className="bg-orange-100 text-orange-800">Pending</Badge>;
    };

    const getPaymentStatusBadge = (status: string) => {
        switch (status) {
            case "Paid":
                return (
                    <Badge className="bg-green-100 text-green-800">Lunas</Badge>
                );
            case "Partial":
                return (
                    <Badge className="bg-yellow-100 text-yellow-800">
                        Sebagian
                    </Badge>
                );
            default:
                return (
                    <Badge className="bg-red-100 text-red-800">
                        Belum Bayar
                    </Badge>
                );
        }
    };

    const getFixedCostStatusBadge = (status: string) => {
        switch (status) {
            case "Paid":
                return (
                    <Badge className="bg-green-100 text-green-800">Paid</Badge>
                );
            case "Overdue":
                return (
                    <Badge className="bg-red-100 text-red-800">Overdue</Badge>
                );
            default:
                return (
                    <Badge className="bg-yellow-100 text-yellow-800">
                        Pending
                    </Badge>
                );
        }
    };

    const formatDateSafe = (date: Date | string | any): string => {
        try {
            if (!date) return "-";
            if (date instanceof Date) {
                return formatDate(date.toISOString().split("T")[0]);
            }
            if (typeof date === "string") {
                return formatDate(date);
            }
            // Handle Firestore Timestamp or other date objects
            if (date.toDate && typeof date.toDate === "function") {
                return formatDate(date.toDate().toISOString().split("T")[0]);
            }
            return formatDate(new Date(date).toISOString().split("T")[0]);
        } catch (error) {
            console.error("Error formatting date:", error);
            return "-";
        }
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between flex-wrap items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Cashflow Management
                    </h1>
                    <p className="text-gray-600">
                        Track financial data from approved bookings
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={handleExportCsv}
                        variant="outline"
                        disabled={loading || filteredEntries.length === 0}
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                    </Button>
                    <Button
                        onClick={handleRefreshAll}
                        variant="outline"
                        disabled={loading}
                    >
                        <RefreshCw
                            className={`h-4 w-4 mr-2 ${
                                loading ? "animate-spin" : ""
                            }`}
                        />
                        Refresh Data
                    </Button>
                </div>
            </div>

            {/* Section Toggle */}
            <div className="flex gap-2 mb-6 flex-wrap">
                <Button
                    variant={activeSection === "income" ? "default" : "outline"}
                    onClick={() => setActiveSection("income")}
                    className="flex items-center"
                >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Income (Rental)
                </Button>
                <Button
                    variant={
                        activeSection === "fixed-costs" ? "default" : "outline"
                    }
                    onClick={() => setActiveSection("fixed-costs")}
                    className="flex items-center"
                >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Fixed Costs
                </Button>
                <Button
                    variant={
                        activeSection === "variable-costs"
                            ? "default"
                            : "outline"
                    }
                    onClick={() => setActiveSection("variable-costs")}
                    className="flex items-center"
                >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Variable Costs
                </Button>
                <Button
                    variant={
                        activeSection === "support-costs"
                            ? "default"
                            : "outline"
                    }
                    onClick={() => setActiveSection("support-costs")}
                    className="flex items-center"
                >
                    <Headphones className="h-4 w-4 mr-2" />
                    Support
                </Button>
            </div>

            {/* Summary Cards - Always Visible */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="p-4">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                                <TrendingUp className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-blue-700">
                                    Income
                                </p>
                                <p className="text-xl font-bold text-blue-900">
                                    {formatCurrency(stats.totalIncome)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
                    <CardContent className="p-4">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center mr-3">
                                <CreditCard className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-red-700">
                                    Expense
                                </p>
                                <p className="text-xl font-bold text-red-900">
                                    {formatCurrency(
                                        fixedCostStats.totalExpenses +
                                            variableCostStats.totalExpenses +
                                            supportCostStats.totalExpenses
                                    )}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                    <CardContent className="p-4">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                                <DollarSign className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-green-700">
                                    Free Cash
                                </p>
                                <p className="text-xl font-bold text-green-900">
                                    {formatCurrency(
                                        stats.totalIncome -
                                            (fixedCostStats.totalExpenses +
                                                variableCostStats.totalExpenses +
                                                supportCostStats.totalExpenses)
                                    )}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Content based on active section */}
            {activeSection === "income" ? (
                <>
                    {/* Filter Bar */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        <Button
                            variant={
                                activeFilter === "all" ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setActiveFilter("all")}
                        >
                            <Filter className="h-4 w-4 mr-1" />
                            All ({entries.length})
                        </Button>
                        <Button
                            variant={
                                activeFilter === "income"
                                    ? "default"
                                    : "outline"
                            }
                            size="sm"
                            onClick={() => setActiveFilter("income")}
                        >
                            Income (
                            {
                                entries.filter((e) => e.status === "Income")
                                    .length
                            }
                            )
                        </Button>
                        <Button
                            variant={
                                activeFilter === "pending"
                                    ? "default"
                                    : "outline"
                            }
                            size="sm"
                            onClick={() => setActiveFilter("pending")}
                        >
                            Pending (
                            {
                                entries.filter((e) => e.status === "Pending")
                                    .length
                            }
                            )
                        </Button>
                        <Button
                            variant={
                                activeFilter === "paid" ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setActiveFilter("paid")}
                        >
                            Paid (
                            {
                                entries.filter(
                                    (e) => e.paymentStatus === "Paid"
                                ).length
                            }
                            )
                        </Button>
                        <Button
                            variant={
                                activeFilter === "partial"
                                    ? "default"
                                    : "outline"
                            }
                            size="sm"
                            onClick={() => setActiveFilter("partial")}
                        >
                            Partial (
                            {
                                entries.filter(
                                    (e) => e.paymentStatus === "Partial"
                                ).length
                            }
                            )
                        </Button>
                        <Button
                            variant={
                                activeFilter === "unpaid"
                                    ? "default"
                                    : "outline"
                            }
                            size="sm"
                            onClick={() => setActiveFilter("unpaid")}
                        >
                            Unpaid (
                            {
                                entries.filter(
                                    (e) => e.paymentStatus === "Not Paid"
                                ).length
                            }
                            )
                        </Button>
                    </div>
                </>
            ) : activeSection === "fixed-costs" ? (
                <>
                    {/* Fixed Costs Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Fixed Costs Management
                            </h2>
                            <p className="text-sm text-gray-600">
                                Manage recurring expenses like utilities, wifi,
                                etc.
                            </p>
                        </div>
                        <Button
                            onClick={handleAddFixedCost}
                            className="flex items-center"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Fixed Cost
                        </Button>
                    </div>
                </>
            ) : activeSection === "variable-costs" ? (
                <>
                    {/* Variable Costs Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Variable Costs Management
                            </h2>
                            <p className="text-sm text-gray-600">
                                Manage one-time expenses like galon, gas,
                                supplies, etc.
                            </p>
                        </div>
                        <Button
                            onClick={handleAddVariableCost}
                            className="flex items-center"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Variable Cost
                        </Button>
                    </div>
                </>
            ) : (
                <>
                    {/* Support Costs Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Support Services Management
                            </h2>
                            <p className="text-sm text-gray-600">
                                Manage service expenses like laundry, charging,
                                maintenance, etc.
                            </p>
                        </div>
                        <Button
                            onClick={handleAddSupportCost}
                            className="flex items-center"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Support Cost
                        </Button>
                    </div>
                </>
            )}

            {/* Content Tables */}
            {activeSection === "income" ? (
                <>
                    {loading ? (
                        <div className="flex items-center justify-center p-8">
                            <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                            <span className="ml-2 text-gray-600">
                                Loading cashflow data...
                            </span>
                        </div>
                    ) : filteredEntries.length === 0 ? (
                        <div className="text-center p-8 text-gray-500">
                            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p>No entries found for the selected filter</p>
                            <p className="text-sm">
                                {entries.length === 0
                                    ? "Approved bookings will appear here automatically"
                                    : "Try changing the filter to see more entries"}
                            </p>
                        </div>
              ) : (
                  <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span className="text-lg font-semibold text-gray-900">Financial Tracking</span>
                            <span className="text-sm font-normal text-gray-500">
                                Showing {filteredEntries.length} of {entries.length} entries
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <div className="flex items-center justify-center p-8">
                          <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                          <span className="ml-2 text-gray-600">
                            Loading cashflow data...
                          </span>
                        </div>
                      ) : filteredEntries.length === 0 ? (
                        <div className="text-center p-8 text-gray-500">
                          <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p>No entries found for the selected filter</p>
                          <p className="text-sm">
                            {entries.length === 0
                              ? "Approved bookings will appear here automatically"
                              : "Try changing the filter to see more entries"}
                          </p>
                        </div>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Status</TableHead>
                              <TableHead>Content</TableHead>
                              <TableHead>Harga</TableHead>
                              <TableHead>Dibayar</TableHead>
                              <TableHead>Sisa</TableHead>
                              <TableHead>Direction</TableHead>
                              <TableHead>1st Payment</TableHead>
                              <TableHead>2nd Payment</TableHead>
                              <TableHead>Room</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredEntries.map((entry) => (
                              <TableRow key={entry.id}>
                                <TableCell>
                                  {getStatusBadge(entry.status)}
                                </TableCell>
                                <TableCell>
                                  <div>
                                    <div className="font-medium text-gray-900">
                                      {entry.content}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {entry.checkIn} -{" "}
                                      {entry.checkOut}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="font-medium text-gray-900">
                                  {formatCurrency(entry.harga)}
                                </TableCell>
                                <TableCell>
                                  <div className="font-medium text-green-600">
                                    {formatCurrency(entry.dibayar)}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div
                                    className={`font-medium ${entry.sisa > 0
                                        ? "text-red-600"
                                        : "text-green-600"
                                      }`}
                                  >
                                    {formatCurrency(entry.sisa)}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {getPaymentStatusBadge(
                                    entry.paymentStatus
                                  )}
                                </TableCell>
                                <TableCell className="text-gray-600">
                                  {formatDate(
                                    entry.tanggal1stPayment
                                  )}
                                </TableCell>
                                <TableCell className="text-gray-600">
                                  {formatDate(
                                    entry.tanggal2ndPayment
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    <Home className="h-4 w-4 text-gray-400 mr-1" />
                                    <span className="text-sm text-gray-600">
                                      {entry.roomNumber} (
                                      {entry.roomType})
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      handleEditEntry(entry)
                                    }
                                    className="h-8 px-2"
                                  >
                                    <Edit className="h-3 w-3 mr-1" />
                                    Edit
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>)}
                        </CardContent>
                      </Card>
                    )}
                </>
            ) : activeSection === "fixed-costs" ? (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Fixed Costs</span>
                            <span className="text-sm font-normal text-gray-500">
                                {fixedCosts.length} total expenses
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex items-center justify-center p-8">
                                <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                                <span className="ml-2 text-gray-600">
                                    Loading fixed costs...
                                </span>
                            </div>
                        ) : fixedCosts.length === 0 ? (
                            <div className="text-center p-8 text-gray-500">
                                <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                <p>No fixed costs found</p>
                                <p className="text-sm">
                                    Click "Add Fixed Cost" to create your first
                                    expense entry
                                </p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Receipt</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {fixedCosts.map((cost) => (
                                        <TableRow key={cost.id}>
                                            <TableCell>
                                                {getFixedCostStatusBadge(
                                                    cost.status
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium text-gray-900">
                                                    {cost.caption}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    Created:{" "}
                                                    {formatDateSafe(
                                                        cost.createdAt
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium text-gray-900">
                                                {formatCurrency(cost.harga)}
                                            </TableCell>
                                            <TableCell className="text-gray-600">
                                                {formatDate(cost.tanggal)}
                                            </TableCell>
                                            <TableCell>
                                                {cost.receiptFile ? (
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="h-4 w-4 text-green-600" />
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => window.open(cost.receiptFile!.url, '_blank')}
                                                            className="h-7 px-2 text-green-600 border-green-600 hover:bg-green-50"
                                                        >
                                                            <Eye className="h-3 w-3 mr-1" />
                                                            View
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 text-sm">No receipt</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            handleEditFixedCost(
                                                                cost
                                                            )
                                                        }
                                                        className="h-8 px-2"
                                                    >
                                                        <Edit className="h-3 w-3 mr-1" />
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            handleDeleteFixedCost(
                                                                cost
                                                            )
                                                        }
                                                        className="h-8 px-2 text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-3 w-3 mr-1" />
                                                        Delete
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            ) : activeSection === "variable-costs" ? (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Variable Costs</span>
                            <span className="text-sm font-normal text-gray-500">
                                {variableCosts.length} total expenses
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex items-center justify-center p-8">
                                <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                                <span className="ml-2 text-gray-600">
                                    Loading variable costs...
                                </span>
                            </div>
                        ) : variableCosts.length === 0 ? (
                            <div className="text-center p-8 text-gray-500">
                                <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                <p>No variable costs found</p>
                                <p className="text-sm">
                                    Click "Add Variable Cost" to create your
                                    first expense entry
                                </p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Receipt</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {variableCosts.map((cost) => (
                                        <TableRow key={cost.id}>
                                            <TableCell>
                                                {getFixedCostStatusBadge(
                                                    cost.status
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium text-gray-900">
                                                    {cost.caption}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    Created:{" "}
                                                    {formatDateSafe(
                                                        cost.createdAt
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium text-gray-900">
                                                {formatCurrency(cost.harga)}
                                            </TableCell>
                                            <TableCell className="text-gray-600">
                                                {formatDate(cost.tanggal)}
                                            </TableCell>
                                            <TableCell>
                                                {cost.receiptFile ? (
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="h-4 w-4 text-green-600" />
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => window.open(cost.receiptFile!.url, '_blank')}
                                                            className="h-7 px-2 text-green-600 border-green-600 hover:bg-green-50"
                                                        >
                                                            <Eye className="h-3 w-3 mr-1" />
                                                            View
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 text-sm">No receipt</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            handleEditVariableCost(
                                                                cost
                                                            )
                                                        }
                                                        className="h-8 px-2"
                                                    >
                                                        <Edit className="h-3 w-3 mr-1" />
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            handleDeleteVariableCost(
                                                                cost
                                                            )
                                                        }
                                                        className="h-8 px-2 text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-3 w-3 mr-1" />
                                                        Delete
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Support Services</span>
                            <span className="text-sm font-normal text-gray-500">
                                {supportCosts.length} total services
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex items-center justify-center p-8">
                                <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                                <span className="ml-2 text-gray-600">
                                    Loading support costs...
                                </span>
                            </div>
                        ) : supportCosts.length === 0 ? (
                            <div className="text-center p-8 text-gray-500">
                                <Headphones className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                <p>No support costs found</p>
                                <p className="text-sm">
                                    Click "Add Support Cost" to create your
                                    first service entry
                                </p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Receipt</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {supportCosts.map((cost) => (
                                        <TableRow key={cost.id}>
                                            <TableCell>
                                                {getFixedCostStatusBadge(
                                                    cost.status
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium text-gray-900">
                                                    {cost.caption}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    Created:{" "}
                                                    {formatDateSafe(
                                                        cost.createdAt
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium text-gray-900">
                                                {formatCurrency(cost.harga)}
                                            </TableCell>
                                            <TableCell className="text-gray-600">
                                                {formatDate(cost.tanggal)}
                                            </TableCell>
                                            <TableCell>
                                                {cost.receiptFile ? (
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="h-4 w-4 text-green-600" />
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => window.open(cost.receiptFile!.url, '_blank')}
                                                            className="h-7 px-2 text-green-600 border-green-600 hover:bg-green-50"
                                                        >
                                                            <Eye className="h-3 w-3 mr-1" />
                                                            View
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 text-sm">No receipt</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            handleEditSupportCost(
                                                                cost
                                                            )
                                                        }
                                                        className="h-8 px-2"
                                                    >
                                                        <Edit className="h-3 w-3 mr-1" />
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            handleDeleteSupportCost(
                                                                cost
                                                            )
                                                        }
                                                        className="h-8 px-2 text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-3 w-3 mr-1" />
                                                        Delete
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Edit Modals */}
            <CashflowEditModal
                entry={editingEntry}
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                onSave={handleSaveEdit}
            />

            <FixedCostModal
                fixedCost={editingFixedCost}
                isOpen={isFixedCostModalOpen}
                onClose={handleCloseFixedCostModal}
                onSave={handleSaveFixedCost}
            />

            <VariableCostModal
                variableCost={editingVariableCost}
                isOpen={isVariableCostModalOpen}
                onClose={handleCloseVariableCostModal}
                onSave={handleSaveVariableCost}
            />

            <SupportCostModal
                supportCost={editingSupportCost}
                isOpen={isSupportCostModalOpen}
                onClose={handleCloseSupportCostModal}
                onSave={handleSaveSupportCost}
            />
        </div>
    );
}

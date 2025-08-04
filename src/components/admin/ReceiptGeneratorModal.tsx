"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, FileText, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";

interface ReceiptData {
    guestName: string;
    startDate: string;
    endDate: string;
    description: string;
    quantity: number;
    priceIdr: number;
    totalPrice: number;
    paidPrice: number;
    unpaidPrice: number;
    finalTotal: number;
}

interface ReceiptGeneratorModalProps {
    bookingId: string;
    initialData?: Partial<ReceiptData>;
    onClose: () => void;
    onReceiptGenerated: (bookingId: string, file: File) => void;
}

export default function ReceiptGeneratorModal({
    bookingId,
    initialData,
    onClose,
    onReceiptGenerated,
}: ReceiptGeneratorModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<ReceiptData>({
        guestName: initialData?.guestName || "",
        startDate: initialData?.startDate || new Date().toISOString().split("T")[0],
        endDate: initialData?.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 30 days from now
        description: initialData?.description || "Sewa Kamar Kost",
        quantity: initialData?.quantity || 1,
        priceIdr: initialData?.priceIdr || 0,
        totalPrice: initialData?.totalPrice || 0,
        paidPrice: initialData?.paidPrice || 0,
        unpaidPrice: initialData?.unpaidPrice || 0,
        finalTotal: initialData?.finalTotal || 0,
    });

    // Calculate total price, unpaid price, and final total automatically
    React.useEffect(() => {
        const total = formData.quantity * formData.priceIdr;
        const unpaid = total - formData.paidPrice;
        const finalTotal = Math.max(0, unpaid); // Ensure final total is not negative
        setFormData((prev) => ({ 
            ...prev, 
            totalPrice: total,
            unpaidPrice: Math.max(0, unpaid), // Ensure unpaid price is not negative
            finalTotal: finalTotal
        }));
    }, [formData.quantity, formData.priceIdr, formData.paidPrice]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]:
                name === "quantity" ||
                name === "priceIdr" ||
                name === "totalPrice" ||
                name === "paidPrice" ||
                name === "unpaidPrice" ||
                name === "finalTotal"
                    ? Number(value) || 0
                    : value,
        }));
    };

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDateIndonesian = (dateString: string): string => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        }).format(date);
    };

    const loadTemplateFile = async (): Promise<ArrayBuffer> => {
        try {
            // Try to load template from public folder
            const response = await fetch("/templates/receipt-template.docx");
            if (!response.ok) {
                throw new Error("Template file not found");
            }
            return await response.arrayBuffer();
        } catch (error) {
            // If template doesn't exist, create a basic one
            toast.error(
                "Template tidak ditemukan. Silakan upload template receipt ke folder /public/templates/receipt-template.docx"
            );
            throw error;
        }
    };

    const generateReceipt = async () => {
        try {
            setLoading(true);

            // Load the template
            const templateBuffer = await loadTemplateFile();

            // Create a new zip instance
            const zip = new PizZip(templateBuffer);

            // Create docxtemplater instance
            const doc = new Docxtemplater(zip, {
                paragraphLoop: true,
                linebreaks: true,
            });

            // Prepare data for template
            const templateData = {
                // Receipt header
                receiptNumber: `RCP-${bookingId.substring(0, 8)}-${Date.now()}`,
                
                // Guest information
                guestName: formData.guestName,
                
                // Booking dates
                startDate: formatDateIndonesian(formData.startDate),
                endDate: formatDateIndonesian(formData.endDate),
                bookDate: formatDateIndonesian(formData.startDate), // For backward compatibility
                bookDateRaw: formData.startDate,
                
                // Service details
                description: formData.description,
                quantity: formData.quantity,
                
                // Pricing (formatted for display)
                priceIdr: formatCurrency(formData.priceIdr),
                totalPrice: formatCurrency(formData.totalPrice),
                paidPrice: formatCurrency(formData.paidPrice),
                unpaidPrice: formatCurrency(formData.unpaidPrice),
                finalTotal: formatCurrency(formData.finalTotal),
                
                // Raw numbers (for calculations if needed)
                priceIdrRaw: formData.priceIdr,
                totalPriceRaw: formData.totalPrice,
                paidPriceRaw: formData.paidPrice,
                unpaidPriceRaw: formData.unpaidPrice,
                finalTotalRaw: formData.finalTotal,
                
                // Receipt metadata
                receiptDate: formatDateIndonesian(new Date().toISOString()),
                bookingId: bookingId,
                
                // Company information
                companyName: "SUMAN RESIDENCE",
                companyAddress: "Lr. Apel Lamgugob, Kec. Syiah Kuala,",
                companyCity: "Kota Banda Aceh, 23115",
                companyPhone: "0812-3456-7890",
            };

            // Render the document
            doc.render(templateData);

            // Get the generated document
            const buffer = doc.getZip().generate({
                type: "arraybuffer",
                compression: "DEFLATE",
            });

            // Create file blob
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            });

            // Create file object
            const fileName = `receipt-${bookingId.substring(
                0,
                8
            )}-${Date.now()}.docx`;
            const file = new File([blob], fileName, {
                type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            });

            // Call the parent component's handler
            onReceiptGenerated(bookingId, file);

            toast.success("Receipt berhasil dibuat!");
            onClose();
        } catch (error: any) {
            console.error("Error generating receipt:", error);
            toast.error(error.message || "Gagal membuat receipt");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate required fields
        if (!formData.guestName.trim()) {
            toast.error("Nama tamu harus diisi");
            return;
        }

        if (!formData.startDate) {
            toast.error("Tanggal mulai harus diisi");
            return;
        }

        if (!formData.endDate) {
            toast.error("Tanggal berakhir harus diisi");
            return;
        }

        if (new Date(formData.endDate) <= new Date(formData.startDate)) {
            toast.error("Tanggal berakhir harus setelah tanggal mulai");
            return;
        }

        if (!formData.description.trim()) {
            toast.error("Deskripsi harus diisi");
            return;
        }

        if (formData.quantity <= 0) {
            toast.error("Jumlah harus lebih dari 0");
            return;
        }

        if (formData.priceIdr <= 0) {
            toast.error("Harga harus lebih dari 0");
            return;
        }

        if (formData.paidPrice < 0) {
            toast.error("Jumlah pembayaran tidak boleh negatif");
            return;
        }

        if (formData.paidPrice > formData.totalPrice) {
            toast.error("Jumlah pembayaran tidak boleh lebih besar dari total harga");
            return;
        }

        generateReceipt();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Generate Receipt
                            </h2>
                            <p className="text-sm text-gray-600">
                                Booking ID: {bookingId.substring(0, 8)}...
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                            disabled={loading}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Guest Name */}
                        <div>
                            <Label htmlFor="guestName">Nama Tamu *</Label>
                            <Input
                                id="guestName"
                                name="guestName"
                                type="text"
                                value={formData.guestName}
                                onChange={handleInputChange}
                                placeholder="Masukkan nama tamu"
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Start Date and End Date */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="startDate">Tanggal Mulai *</Label>
                                <Input
                                    id="startDate"
                                    name="startDate"
                                    type="date"
                                    value={formData.startDate}
                                    onChange={handleInputChange}
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div>
                                <Label htmlFor="endDate">Tanggal Berakhir *</Label>
                                <Input
                                    id="endDate"
                                    name="endDate"
                                    type="date"
                                    value={formData.endDate}
                                    onChange={handleInputChange}
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <Label htmlFor="description">Deskripsi *</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Masukkan deskripsi layanan"
                                rows={3}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Quantity */}
                            <div>
                                <Label htmlFor="quantity">Jumlah *</Label>
                                <Input
                                    id="quantity"
                                    name="quantity"
                                    type="number"
                                    min="1"
                                    value={formData.quantity}
                                    onChange={handleInputChange}
                                    placeholder="1"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            {/* Price IDR */}
                            <div>
                                <Label htmlFor="priceIdr">
                                    Harga per Item (IDR) *
                                </Label>
                                <Input
                                    id="priceIdr"
                                    name="priceIdr"
                                    type="number"
                                    min="0"
                                    step="1000"
                                    value={formData.priceIdr}
                                    onChange={handleInputChange}
                                    placeholder="500000"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Paid Amount */}
                        <div>
                            <Label htmlFor="paidPrice">Jumlah Dibayar (IDR) *</Label>
                            <Input
                                id="paidPrice"
                                name="paidPrice"
                                type="number"
                                min="0"
                                step="1000"
                                value={formData.paidPrice}
                                onChange={handleInputChange}
                                placeholder="0"
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Summary */}
                        <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                            <div className="flex justify-between text-sm">
                                <span>Total Harga:</span>
                                <span className="font-medium">{formatCurrency(formData.totalPrice)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Jumlah Dibayar:</span>
                                <span className="font-medium text-green-600">{formatCurrency(formData.paidPrice)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Sisa Pembayaran:</span>
                                <span className="font-medium text-red-600">{formatCurrency(formData.unpaidPrice)}</span>
                            </div>
                            <div className="border-t pt-2">
                                <div className="flex justify-between">
                                    <span className="font-semibold">SISA YANG HARUS DIBAYAR:</span>
                                    <span className="text-2xl font-bold text-orange-600">{formatCurrency(formData.finalTotal)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Info Box */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start">
                                <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                                <div className="text-sm text-blue-700">
                                    <p className="font-medium mb-1">
                                        Template Receipt:
                                    </p>
                                    <ul className="space-y-1 text-xs">
                                        <li>
                                            • Pastikan file template tersedia
                                            di: /public/templates/receipt-template.docx
                                        </li>
                                        <li>
                                            • Variabel tersedia: {`{receiptNumber}, {guestName}, {startDate}, {endDate}, {description}, {quantity}, {priceIdr}, {totalPrice}, {paidPrice}, {unpaidPrice}, {finalTotal}`}
                                        </li>
                                        <li>
                                            • Template akan diisi dengan data
                                            yang Anda masukkan
                                        </li>
                                        <li>
                                            • File receipt akan dibuat dengan
                                            format .docx
                                        </li>
                                        <li>
                                            • Receipt akan otomatis diupload ke
                                            sistem setelah dibuat
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex space-x-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="flex-1"
                                disabled={loading}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Membuat Receipt...
                                    </>
                                ) : (
                                    <>
                                        <FileText className="w-4 h-4 mr-2" />
                                        Buat Receipt
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
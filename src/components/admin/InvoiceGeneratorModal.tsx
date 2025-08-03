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

interface InvoiceData {
    guestName: string;
    bookDate: string;
    description: string;
    quantity: number;
    priceIdr: number;
    totalPrice: number;
}

interface InvoiceGeneratorModalProps {
    bookingId: string;
    initialData?: Partial<InvoiceData>;
    onClose: () => void;
    onInvoiceGenerated: (bookingId: string, file: File) => void;
}

export default function InvoiceGeneratorModal({
    bookingId,
    initialData,
    onClose,
    onInvoiceGenerated,
}: InvoiceGeneratorModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<InvoiceData>({
        guestName: initialData?.guestName || "",
        bookDate:
            initialData?.bookDate || new Date().toISOString().split("T")[0],
        description: initialData?.description || "Sewa Kamar Kost",
        quantity: initialData?.quantity || 1,
        priceIdr: initialData?.priceIdr || 0,
        totalPrice: initialData?.totalPrice || 0,
    });

    // Calculate total price automatically when quantity or priceIdr changes
    React.useEffect(() => {
        const total = formData.quantity * formData.priceIdr;
        setFormData((prev) => ({ ...prev, totalPrice: total }));
    }, [formData.quantity, formData.priceIdr]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]:
                name === "quantity" ||
                name === "priceIdr" ||
                name === "totalPrice"
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
            const response = await fetch("/templates/invoice-template.docx");
            if (!response.ok) {
                throw new Error("Template file not found");
            }
            return await response.arrayBuffer();
        } catch (error) {
            // If template doesn't exist, create a basic one
            toast.error(
                "Template tidak ditemukan. Silakan upload template invoice ke folder /public/templates/invoice-template.docx"
            );
            throw error;
        }
    };

    const generateInvoice = async () => {
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
                guestName: formData.guestName,
                bookDate: formatDateIndonesian(formData.bookDate),
                bookDateRaw: formData.bookDate,
                description: formData.description,
                quantity: formData.quantity,
                priceIdr: formatCurrency(formData.priceIdr),
                priceIdrRaw: formData.priceIdr,
                totalPrice: formatCurrency(formData.totalPrice),
                totalPriceRaw: formData.totalPrice,
                invoiceNumber: `INV-${bookingId.substring(0, 8)}-${Date.now()}`,
                invoiceDate: formatDateIndonesian(new Date().toISOString()),
                bookingId: bookingId,
                // Additional template variables
                companyName: "Suman Residence",
                companyAddress: "Alamat Kost Suman Residence",
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
            const fileName = `invoice-${bookingId.substring(
                0,
                8
            )}-${Date.now()}.docx`;
            const file = new File([blob], fileName, {
                type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            });

            // Call the parent component's handler
            onInvoiceGenerated(bookingId, file);

            toast.success("Invoice berhasil dibuat!");
            onClose();
        } catch (error: any) {
            console.error("Error generating invoice:", error);
            toast.error(error.message || "Gagal membuat invoice");
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

        generateInvoice();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Generate Invoice
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

                        {/* Book Date */}
                        <div>
                            <Label htmlFor="bookDate">Tanggal Booking *</Label>
                            <Input
                                id="bookDate"
                                name="bookDate"
                                type="date"
                                value={formData.bookDate}
                                onChange={handleInputChange}
                                required
                                disabled={loading}
                            />
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

                        {/* Total Price (Auto-calculated) */}
                        <div>
                            <Label htmlFor="totalPrice">
                                Total Harga (IDR)
                            </Label>
                            <div className="text-2xl font-bold text-green-600 p-3 bg-green-50 rounded-lg">
                                {formatCurrency(formData.totalPrice)}
                            </div>
                        </div>

                        {/* Info Box */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start">
                                <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                                <div className="text-sm text-blue-700">
                                    <p className="font-medium mb-1">
                                        Template Invoice:
                                    </p>
                                    <ul className="space-y-1 text-xs">
                                        <li>
                                            • Pastikan file template tersedia
                                            di:
                                            /public/templates/invoice-template.docx
                                        </li>
                                        <li>
                                            • Template akan diisi dengan data
                                            yang Anda masukkan
                                        </li>
                                        <li>
                                            • File invoice akan dibuat dengan
                                            format .docx
                                        </li>
                                        <li>
                                            • Invoice akan otomatis diupload ke
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
                                        Membuat Invoice...
                                    </>
                                ) : (
                                    <>
                                        <FileText className="w-4 h-4 mr-2" />
                                        Buat Invoice
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

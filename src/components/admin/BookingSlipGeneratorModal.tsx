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

interface BookingSlipData {
    guestName: string;
    renterPhoneNumber: string;
    roomNumber: string;
    startDate: string;
    endDate: string;
    durasiSewa: string;
    rentPriceIdr: number;
}

interface BookingSlipGeneratorModalProps {
    bookingId: string;
    initialData?: Partial<BookingSlipData>;
    onClose: () => void;
    onBookingSlipGenerated: (bookingId: string, file: File) => void;
}

export default function BookingSlipGeneratorModal({
    bookingId,
    initialData,
    onClose,
    onBookingSlipGenerated,
}: BookingSlipGeneratorModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<BookingSlipData>({
        guestName: initialData?.guestName || "",
        renterPhoneNumber: initialData?.renterPhoneNumber || "",
        roomNumber: initialData?.roomNumber || "",
        startDate: initialData?.startDate || new Date().toISOString().split("T")[0],
        endDate: initialData?.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 30 days from now
        durasiSewa: initialData?.durasiSewa || "1 Bulan",
        rentPriceIdr: initialData?.rentPriceIdr || 0,
    });

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]:
                name === "rentPriceIdr"
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

    const getMonthInRoman = (dateString: string): string => {
        const date = new Date(dateString);
        const month = date.getMonth() + 1; // getMonth() returns 0-11
        const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
        return romanNumerals[month - 1];
    };

    const getYear = (dateString: string): string => {
        const date = new Date(dateString);
        return date.getFullYear().toString();
    };

    const loadTemplateFile = async (): Promise<ArrayBuffer> => {
        try {
            // Try to load template from public folder
            const response = await fetch("/templates/booking-slip-template.docx");
            if (!response.ok) {
                throw new Error("Template file not found");
            }
            return await response.arrayBuffer();
        } catch (error) {
            // If template doesn't exist, create a basic one
            toast.error(
                "Template tidak ditemukan. Silakan upload template booking slip ke folder /public/templates/booking-slip-template.docx"
            );
            throw error;
        }
    };

    const generateBookingSlip = async () => {
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

            // Generate contract number
            const noRent = `SR-${bookingId.substring(0, 8)}-${Date.now()}`;

            // Prepare data for template
            const templateData = {
                // Contract information
                noRent: noRent,
                monthInRomanNumber: getMonthInRoman(formData.startDate),
                year: getYear(formData.startDate),
                
                // Guest and rental information
                guestName: formData.guestName,
                renterPhoneNumber: formData.renterPhoneNumber,
                roomNumber: formData.roomNumber,
                
                // Rental period
                startDate: formatDateIndonesian(formData.startDate),
                endDate: formatDateIndonesian(formData.endDate),
                startDateRaw: formData.startDate,
                endDateRaw: formData.endDate,
                durasiSewa: formData.durasiSewa,
                
                // Pricing
                rentPriceIdr: formatCurrency(formData.rentPriceIdr),
                rentPriceIdrRaw: formData.rentPriceIdr,
                
                // Contract metadata
                contractDate: formatDateIndonesian(new Date().toISOString()),
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
            const fileName = `booking-slip-${bookingId.substring(
                0,
                8
            )}-${Date.now()}.docx`;
            const file = new File([blob], fileName, {
                type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            });

            // Call the parent component's handler
            onBookingSlipGenerated(bookingId, file);

            toast.success("Booking slip berhasil dibuat!");
            onClose();
        } catch (error: any) {
            console.error("Error generating booking slip:", error);
            toast.error(error.message || "Gagal membuat booking slip");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate required fields
        if (!formData.guestName.trim()) {
            toast.error("Nama penyewa harus diisi");
            return;
        }

        if (!formData.renterPhoneNumber.trim()) {
            toast.error("Nomor telepon penyewa harus diisi");
            return;
        }

        if (!formData.roomNumber.trim()) {
            toast.error("Nomor kamar harus diisi");
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

        if (!formData.durasiSewa.trim()) {
            toast.error("Durasi sewa harus diisi");
            return;
        }

        if (formData.rentPriceIdr <= 0) {
            toast.error("Harga sewa harus lebih dari 0");
            return;
        }

        generateBookingSlip();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Generate Booking Slip
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
                            <Label htmlFor="guestName">Nama Penyewa *</Label>
                            <Input
                                id="guestName"
                                name="guestName"
                                type="text"
                                value={formData.guestName}
                                onChange={handleInputChange}
                                placeholder="Masukkan nama penyewa"
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Renter Phone Number */}
                        <div>
                            <Label htmlFor="renterPhoneNumber">Nomor Telepon Penyewa *</Label>
                            <Input
                                id="renterPhoneNumber"
                                name="renterPhoneNumber"
                                type="tel"
                                value={formData.renterPhoneNumber}
                                onChange={handleInputChange}
                                placeholder="Masukkan nomor telepon (contoh: 08123456789)"
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Room Number */}
                        <div>
                            <Label htmlFor="roomNumber">Nomor Kamar *</Label>
                            <Input
                                id="roomNumber"
                                name="roomNumber"
                                type="text"
                                value={formData.roomNumber}
                                onChange={handleInputChange}
                                placeholder="Masukkan nomor kamar (contoh: A1, B2)"
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Start Date and End Date */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="startDate">Tanggal Mulai Sewa *</Label>
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
                                <Label htmlFor="endDate">Tanggal Berakhir Sewa *</Label>
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

                        {/* Duration and Rent Price */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="durasiSewa">Durasi Sewa *</Label>
                                <Input
                                    id="durasiSewa"
                                    name="durasiSewa"
                                    type="text"
                                    value={formData.durasiSewa}
                                    onChange={handleInputChange}
                                    placeholder="1 Bulan, 6 Bulan, 1 Tahun"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <Label htmlFor="rentPriceIdr">
                                    Harga Sewa (IDR) *
                                </Label>
                                <Input
                                    id="rentPriceIdr"
                                    name="rentPriceIdr"
                                    type="number"
                                    min="0"
                                    step="1000"
                                    value={formData.rentPriceIdr}
                                    onChange={handleInputChange}
                                    placeholder="500000"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                            <div className="flex justify-between text-sm">
                                <span>Nama Penyewa:</span>
                                <span className="font-medium">{formData.guestName || '-'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Kamar:</span>
                                <span className="font-medium">{formData.roomNumber || '-'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Durasi Sewa:</span>
                                <span className="font-medium">{formData.durasiSewa}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Periode:</span>
                                <span className="font-medium">
                                    {formData.startDate && formData.endDate 
                                        ? `${formatDateIndonesian(formData.startDate)} - ${formatDateIndonesian(formData.endDate)}`
                                        : '-'
                                    }
                                </span>
                            </div>
                            <div className="border-t pt-2">
                                <div className="flex justify-between">
                                    <span className="font-semibold">HARGA SEWA:</span>
                                    <span className="text-2xl font-bold text-green-600">{formatCurrency(formData.rentPriceIdr)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Info Box */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start">
                                <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                                <div className="text-sm text-blue-700">
                                    <p className="font-medium mb-1">
                                        Template Booking Slip:
                                    </p>
                                    <ul className="space-y-1 text-xs">
                                        <li>
                                            • Pastikan file template tersedia
                                            di: /public/templates/booking-slip-template.docx
                                        </li>
                                        <li>
                                            • Variabel tersedia: {`{noRent}, {monthInRomanNumber}, {year}, {guestName}, {renterPhoneNumber}, {roomNumber}, {startDate}, {endDate}, {durasiSewa}, {rentPriceIdr}`}
                                        </li>
                                        <li>
                                            • Template akan diisi dengan data
                                            yang Anda masukkan
                                        </li>
                                        <li>
                                            • File booking slip akan dibuat dengan
                                            format .docx
                                        </li>
                                        <li>
                                            • Booking slip akan otomatis diupload ke
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
                                        Membuat Booking Slip...
                                    </>
                                ) : (
                                    <>
                                        <FileText className="w-4 h-4 mr-2" />
                                        Buat Booking Slip
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
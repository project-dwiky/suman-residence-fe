import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { Booking } from "@/components/admin/types";

export interface DocumentGenerationResult {
  success: boolean;
  file?: File;
  error?: string;
}

export class DocumentGenerationService {
  // Helper function to format currency
  private static formatCurrency(amount: number): string {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  }

  // Helper function to format date in Indonesian
  private static formatDateIndonesian(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  }

  // Helper function to get month in Roman numerals
  private static getMonthInRoman(dateString: string): string {
    const romanMonths = [
      "I", "II", "III", "IV", "V", "VI",
      "VII", "VIII", "IX", "X", "XI", "XII"
    ];
    const date = new Date(dateString);
    return romanMonths[date.getMonth()];
  }

  // Helper function to get year
  private static getYear(dateString: string): string {
    const date = new Date(dateString);
    return date.getFullYear().toString();
  }

  // Load template file
  private static async loadTemplateFile(templateName: string): Promise<ArrayBuffer> {
    try {
      const response = await fetch(`/templates/${templateName}`);
      if (!response.ok) {
        throw new Error(`Template ${templateName} not found`);
      }
      return await response.arrayBuffer();
    } catch (error) {
      throw new Error(`Failed to load template ${templateName}: ${error}`);
    }
  }

  // Generate Invoice
  static async generateInvoice(booking: Booking): Promise<DocumentGenerationResult> {
    try {
      const templateBuffer = await this.loadTemplateFile("invoice-template.docx");
      const zip = new PizZip(templateBuffer);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      const totalPrice = booking.pricing?.amount || 0;
      const paidAmount = booking.pricing?.paidAmount || 0;
      const unpaidPrice = Math.max(0, totalPrice - paidAmount);

      const templateData = {
        // Invoice header
        invoiceNumber: `INV-${booking.id.substring(0, 8)}-${Date.now()}`,
        
        // Guest information
        guestName: booking.contactInfo?.name || '',
        
        // Booking dates
        startDate: this.formatDateIndonesian(booking.rentalPeriod?.startDate || ''),
        endDate: this.formatDateIndonesian(booking.rentalPeriod?.endDate || ''),
        bookDate: this.formatDateIndonesian(booking.rentalPeriod?.startDate || ''),
        bookDateRaw: booking.rentalPeriod?.startDate || '',
        
        // Service details
        description: `Sewa Kamar Kost - ${booking.room?.roomNumber || ''}`,
        quantity: 1,
        
        // Pricing (formatted for display)
        priceIdr: this.formatCurrency(totalPrice),
        totalPrice: this.formatCurrency(totalPrice),
        dpPrice: this.formatCurrency(paidAmount),
        unpaidPrice: this.formatCurrency(unpaidPrice),
        finalTotal: this.formatCurrency(unpaidPrice),
        
        // Raw numbers
        priceIdrRaw: totalPrice,
        totalPriceRaw: totalPrice,
        dpPriceRaw: paidAmount,
        unpaidPriceRaw: unpaidPrice,
        finalTotalRaw: unpaidPrice,
        
        // Invoice metadata
        invoiceDate: this.formatDateIndonesian(new Date().toISOString()),
        bookingId: booking.id,
        
        // Company information
        companyName: "SUMAN RESIDENCE",
        companyAddress: "Lr. Apel Lamgugob, Kec. Syiah Kuala,",
        companyCity: "Kota Banda Aceh, 23115",
        companyPhone: "0812-3456-7890",
      };

      doc.render(templateData);

      const buffer = doc.getZip().generate({
        type: "arraybuffer",
        compression: "DEFLATE",
      });

      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      const fileName = `invoice-${booking.id.substring(0, 8)}-${Date.now()}.docx`;
      const file = new File([blob], fileName, {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      return { success: true, file };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to generate invoice' };
    }
  }

  // Generate Receipt
  static async generateReceipt(booking: Booking): Promise<DocumentGenerationResult> {
    try {
      const templateBuffer = await this.loadTemplateFile("receipt-template.docx");
      const zip = new PizZip(templateBuffer);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      const totalPrice = booking.pricing?.amount || 0;
      const paidAmount = booking.pricing?.paidAmount || 0;
      const unpaidPrice = Math.max(0, totalPrice - paidAmount);

      const templateData = {
        // Receipt header
        receiptNumber: `RCP-${booking.id.substring(0, 8)}-${Date.now()}`,
        
        // Guest information
        guestName: booking.contactInfo?.name || '',
        
        // Booking dates
        startDate: this.formatDateIndonesian(booking.rentalPeriod?.startDate || ''),
        endDate: this.formatDateIndonesian(booking.rentalPeriod?.endDate || ''),
        bookDate: this.formatDateIndonesian(booking.rentalPeriod?.startDate || ''),
        bookDateRaw: booking.rentalPeriod?.startDate || '',
        
        // Service details
        description: `Sewa Kamar Kost - ${booking.room?.roomNumber || ''}`,
        quantity: 1,
        
        // Pricing (formatted for display)
        priceIdr: this.formatCurrency(totalPrice),
        totalPrice: this.formatCurrency(totalPrice),
        paidPrice: this.formatCurrency(paidAmount),
        unpaidPrice: this.formatCurrency(unpaidPrice),
        finalTotal: this.formatCurrency(paidAmount), // For receipt, show what was paid
        
        // Raw numbers
        priceIdrRaw: totalPrice,
        totalPriceRaw: totalPrice,
        paidPriceRaw: paidAmount,
        unpaidPriceRaw: unpaidPrice,
        finalTotalRaw: paidAmount,
        
        // Receipt metadata
        receiptDate: this.formatDateIndonesian(new Date().toISOString()),
        bookingId: booking.id,
        
        // Company information
        companyName: "SUMAN RESIDENCE",
        companyAddress: "Lr. Apel Lamgugob, Kec. Syiah Kuala,",
        companyCity: "Kota Banda Aceh, 23115",
        companyPhone: "0812-3456-7890",
      };

      doc.render(templateData);

      const buffer = doc.getZip().generate({
        type: "arraybuffer",
        compression: "DEFLATE",
      });

      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      const fileName = `receipt-${booking.id.substring(0, 8)}-${Date.now()}.docx`;
      const file = new File([blob], fileName, {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      return { success: true, file };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to generate receipt' };
    }
  }

  // Generate Booking Slip
  static async generateBookingSlip(booking: Booking): Promise<DocumentGenerationResult> {
    try {
      const templateBuffer = await this.loadTemplateFile("booking-slip-template.docx");
      const zip = new PizZip(templateBuffer);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      const noRent = `SR-${booking.id.substring(0, 8)}-${Date.now()}`;
      
      // Calculate duration
      const startDate = new Date(booking.rentalPeriod?.startDate || '');
      const endDate = new Date(booking.rentalPeriod?.endDate || '');
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      let durasiSewa = '';
      if (booking.rentalPeriod?.durationType === 'WEEKLY') {
        durasiSewa = `${Math.ceil(diffDays / 7)} minggu`;
      } else if (booking.rentalPeriod?.durationType === 'MONTHLY') {
        durasiSewa = `${Math.ceil(diffDays / 30)} bulan`;
      } else if (booking.rentalPeriod?.durationType === 'SEMESTER') {
        durasiSewa = `${Math.ceil(diffDays / 180)} semester`;
      } else if (booking.rentalPeriod?.durationType === 'YEARLY') {
        durasiSewa = `${Math.ceil(diffDays / 365)} tahun`;
      } else {
        durasiSewa = `${diffDays} hari`;
      }

      const templateData = {
        // Contract information
        noRent: noRent,
        monthInRomanNumber: this.getMonthInRoman(booking.rentalPeriod?.startDate || ''),
        year: this.getYear(booking.rentalPeriod?.startDate || ''),
        
        // Guest and rental information
        guestName: booking.contactInfo?.name || '',
        renterPhoneNumber: booking.contactInfo?.phone || '',
        roomNumber: booking.room?.roomNumber || '',
        
        // Rental period
        startDate: this.formatDateIndonesian(booking.rentalPeriod?.startDate || ''),
        endDate: this.formatDateIndonesian(booking.rentalPeriod?.endDate || ''),
        startDateRaw: booking.rentalPeriod?.startDate || '',
        endDateRaw: booking.rentalPeriod?.endDate || '',
        durasiSewa: durasiSewa,
        
        // Pricing
        rentPriceIdr: this.formatCurrency(booking.pricing?.amount || 0),
        rentPriceIdrRaw: booking.pricing?.amount || 0,
        
        // Contract metadata
        contractDate: this.formatDateIndonesian(new Date().toISOString()),
        bookingId: booking.id,
        
        // Company information
        companyName: "SUMAN RESIDENCE",
        companyAddress: "Lr. Apel Lamgugob, Kec. Syiah Kuala,",
        companyCity: "Kota Banda Aceh, 23115",
        companyPhone: "0812-3456-7890",
      };

      doc.render(templateData);

      const buffer = doc.getZip().generate({
        type: "arraybuffer",
        compression: "DEFLATE",
      });

      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      const fileName = `booking-slip-${booking.id.substring(0, 8)}-${Date.now()}.docx`;
      const file = new File([blob], fileName, {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      return { success: true, file };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to generate booking slip' };
    }
  }

  // Generate all documents
  static async generateAllDocuments(booking: Booking): Promise<{
    success: boolean;
    files?: { bookingSlip: File; receipt: File; invoice: File };
    error?: string;
  }> {
    try {
      const [bookingSlipResult, receiptResult, invoiceResult] = await Promise.all([
        this.generateBookingSlip(booking),
        this.generateReceipt(booking),
        this.generateInvoice(booking),
      ]);

      if (!bookingSlipResult.success || !receiptResult.success || !invoiceResult.success) {
        const errors = [
          bookingSlipResult.error && `Booking Slip: ${bookingSlipResult.error}`,
          receiptResult.error && `Receipt: ${receiptResult.error}`,
          invoiceResult.error && `Invoice: ${invoiceResult.error}`,
        ].filter(Boolean).join('; ');
        
        return { success: false, error: errors };
      }

      return {
        success: true,
        files: {
          bookingSlip: bookingSlipResult.file!,
          receipt: receiptResult.file!,
          invoice: invoiceResult.file!,
        }
      };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to generate documents' };
    }
  }
}

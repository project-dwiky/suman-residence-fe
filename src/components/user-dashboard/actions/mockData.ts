import { 
  RentalStatus, 
  PaymentStatus, 
  DocumentType, 
  RentalData,
  RentalDuration
} from '../types';

/**
 * Mock data untuk simulasi rental data dari server
 */
export const mockRentalDataList: RentalData[] = [
  {
    id: "rental-123456",
    userId: "user123",
    room: {
      id: "room101",
      roomNumber: "101",
      type: "Standard",
      floor: 1,
      size: "3x4 m",
      description: "Kamar standard dengan fasilitas lengkap termasuk AC, tempat tidur, lemari, dan meja belajar.",
      totalPrice: 5100000,
      facilities: ["AC", "Kamar Mandi Dalam", "Tempat Tidur", "Meja Belajar", "Lemari", "WiFi"],
      imagesGallery: [
        "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=1740",
        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1471",
        "https://images.unsplash.com/photo-1630699144867-37acec97df5a?q=80&w=1470",
        "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=1470"
      ]
    },
    rentalStatus: RentalStatus.ACTIVE,
    rentalPeriod: {
      startDate: "2025-01-01",
      endDate: "2025-06-30",
      durationType: RentalDuration.SEMESTER
    },
    payment: {
      status: PaymentStatus.PAID,
      lastPaymentDate: "2025-05-15",
      receiptUrl: "/receipts/payment-may-2025.pdf"
    },
    documents: [
      {
        id: "doc101",
        type: DocumentType.BOOKING_SLIP,
        fileName: "Booking_Slip_101.pdf",
        fileUrl: "/documents/booking_slip_101.pdf",
        createdAt: "2024-12-15"
      },
      {
        id: "doc102",
        type: DocumentType.RECEIPT,
        fileName: "Receipt_May_2025.pdf",
        fileUrl: "/documents/receipt_may_2025.pdf",
        createdAt: "2025-05-15"
      },
      {
        id: "doc103",
        type: DocumentType.SOP,
        fileName: "SOP_Penghuni_2025.pdf",
        fileUrl: "/documents/sop_penghuni_2025.pdf",
        createdAt: "2025-01-01"
      }
    ],
    notes: "Perpanjangan sewa akan diinformasikan 1 bulan sebelum masa sewa berakhir",
    createdAt: "2024-12-15T08:30:00Z",
    updatedAt: "2025-01-10T14:15:00Z"
  },
  {
    id: "rental-789012",
    userId: "user123",
    room: {
      id: "room205",
      roomNumber: "205",
      type: "Premium",
      floor: 2,
      size: "4x5 m",
      description: "Kamar premium dengan fasilitas lengkap, lebih luas, dengan pemandangan depan.",
      totalPrice: 1250000,
      facilities: ["AC", "Kamar Mandi Dalam", "Tempat Tidur Queen", "Meja Belajar", "Lemari Besar", "WiFi", "TV"],
      imagesGallery: [
        "https://images.unsplash.com/photo-1598928636135-d146006ff4be?q=80&w=1470",
        "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=1470",
        "https://images.unsplash.com/photo-1585779034823-7e9ac8faec70?q=80&w=1470",
        "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?q=80&w=1470",
        "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=1470"
      ]
    },
    rentalStatus: RentalStatus.ACTIVE,
    rentalPeriod: {
      startDate: "2025-01-15",
      endDate: "2025-02-15",
      durationType: RentalDuration.MONTHLY
    },
    payment: {
      status: PaymentStatus.UNPAID,
      lastPaymentDate: "2025-05-15",
      receiptUrl: "/receipts/payment-may-2025-205.pdf"
    },
    documents: [
      {
        id: "doc201",
        type: DocumentType.BOOKING_SLIP,
        fileName: "Booking_Slip_205.pdf",
        fileUrl: "/documents/booking_slip_205.pdf",
        createdAt: "2025-03-10"
      },
      {
        id: "doc202",
        type: DocumentType.INVOICE,
        fileName: "Invoice_June_2025.pdf",
        fileUrl: "/documents/invoice_june_2025.pdf",
        createdAt: "2025-06-01"
      },
      {
        id: "doc203",
        type: DocumentType.SOP,
        fileName: "SOP_Penghuni_2025.pdf",
        fileUrl: "/documents/sop_penghuni_2025.pdf",
        createdAt: "2025-01-01"
      }
    ],
    notes: "Perpanjangan sewa akan diinformasikan 1 bulan sebelum masa sewa berakhir",
    createdAt: "2024-12-15T08:30:00Z",
    updatedAt: "2025-01-10T14:15:00Z"
  },
  {
    id: "rental-345678",
    userId: "user123",
    room: {
      id: "room310",
      roomNumber: "310",
      type: "Standard",
      floor: 3,
      size: "3x4 m",
      description: "Kamar standard lantai 3 dengan pemandangan belakang, dekat dengan area komunal.",
      totalPrice: 5100000,
      facilities: ["AC", "Kamar Mandi Dalam", "Tempat Tidur", "Meja Belajar", "Lemari", "WiFi"],
      imagesGallery: [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1470",
        "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1457",
        "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?q=80&w=1470",
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1470"
      ]
    },
    rentalStatus: RentalStatus.EXPIRED,
    rentalPeriod: {
      startDate: "2025-01-01",
      endDate: "2026-01-01",
      durationType: RentalDuration.YEARLY
    },
    payment: {
      status: PaymentStatus.PAID,
      lastPaymentDate: "2025-04-30",
      receiptUrl: "/receipts/payment-april-2025.pdf"
    },
    documents: [
      {
        id: "doc301",
        type: DocumentType.BOOKING_SLIP,
        fileName: "Booking_Slip_310.pdf",
        fileUrl: "/documents/booking_slip_310.pdf",
        createdAt: "2024-10-15"
      },
      {
        id: "doc302",
        type: DocumentType.RECEIPT,
        fileName: "Receipt_April_2025.pdf",
        fileUrl: "/documents/receipt_april_2025.pdf",
        createdAt: "2025-04-30"
      }
    ],
    notes: "Perpanjangan sewa akan diinformasikan 1 bulan sebelum masa sewa berakhir",
    createdAt: "2024-12-15T08:30:00Z",
    updatedAt: "2025-01-10T14:15:00Z"
  },
  {
    id: "rental-567890",
    userId: "user123",
    room: {
      id: "room402",
      roomNumber: "402",
      type: "Deluxe",
      floor: 4,
      size: "5x6 m",
      description: "Kamar deluxe dengan fasilitas premium, ruang kerja terpisah, dan pemandangan kota.",
      totalPrice: 7500000,
      facilities: ["AC", "Kamar Mandi Dalam", "Tempat Tidur King", "Ruang Kerja", "Lemari Walk-in", "WiFi", "TV", "Kulkas Mini"],
      imagesGallery: [
        "https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=1374",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1470",
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1470",
        "https://images.unsplash.com/photo-1618221118493-9cfa1a1c00da?q=80&w=1332",
        "https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=1480"
      ]
    },
    rentalStatus: RentalStatus.ACTIVE,
    rentalPeriod: {
      startDate: "2025-01-15",
      endDate: "2025-04-15",
      durationType: RentalDuration.SEMESTER
    },
    payment: {
      status: PaymentStatus.PAID,
      lastPaymentDate: "2025-01-10",
      receiptUrl: "/receipts/payment-jan-2025.pdf"
    },
    documents: [
      {
        id: "doc401",
        type: DocumentType.BOOKING_SLIP,
        fileName: "Booking_Slip_402.pdf",
        fileUrl: "/documents/booking_slip_402.pdf",
        createdAt: "2024-12-20"
      },
      {
        id: "doc402",
        type: DocumentType.RECEIPT,
        fileName: "Receipt_Jan_2025.pdf",
        fileUrl: "/documents/receipt_jan_2025.pdf",
        createdAt: "2025-01-10"
      }
    ],
    notes: "Termasuk layanan pembersihan mingguan",
    createdAt: "2024-12-20T10:30:00Z",
    updatedAt: "2025-01-10T08:15:00Z"
  },
  {
    id: "rental-234567",
    userId: "user123",
    room: {
      id: "room503",
      roomNumber: "503",
      type: "Studio",
      floor: 5,
      size: "4x6 m",
      description: "Studio dengan dapur kecil, area makan, dan pemandangan taman.",
      totalPrice: 1200000,
      facilities: ["AC", "Kamar Mandi Dalam", "Tempat Tidur Queen", "Dapur Mini", "Meja Makan", "Lemari", "WiFi", "TV"],
      imagesGallery: [
        "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?q=80&w=1471",
        "https://images.unsplash.com/photo-1560184897-ae75f418493e?q=80&w=1470",
        "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?q=80&w=1470",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0c2?q=80&w=1470",
        "https://images.unsplash.com/photo-1560448075-d5f3e4582cfb?q=80&w=1470"
      ]
    },
    rentalStatus: RentalStatus.NOT_RENEWED,
    rentalPeriod: {
      startDate: "2025-02-01",
      endDate: "2025-03-01",
      durationType: RentalDuration.MONTHLY
    },
    payment: {
      status: PaymentStatus.PAID,
      lastPaymentDate: "2025-02-01",
      receiptUrl: "/receipts/payment-feb-2025.pdf"
    },
    documents: [
      {
        id: "doc501",
        type: DocumentType.BOOKING_SLIP,
        fileName: "Booking_Slip_503.pdf",
        fileUrl: "/documents/booking_slip_503.pdf",
        createdAt: "2025-01-15"
      },
      {
        id: "doc502",
        type: DocumentType.RECEIPT,
        fileName: "Receipt_Feb_2025.pdf",
        fileUrl: "/documents/receipt_feb_2025.pdf",
        createdAt: "2025-02-01"
      }
    ],
    notes: "Akses ke fasilitas gym dan kolam renang",
    createdAt: "2025-01-15T14:20:00Z",
    updatedAt: "2025-02-01T09:45:00Z"
  },
  {
    id: "rental-678901",
    userId: "user123",
    room: {
      id: "room604",
      roomNumber: "604",
      type: "Standard Plus",
      floor: 6,
      size: "3.5x5 m",
      description: "Kamar standard plus dengan balkon pribadi dan pemandangan kota.",
      totalPrice: 3000000,
      facilities: ["AC", "Kamar Mandi Dalam", "Tempat Tidur Queen", "Meja Belajar", "Lemari", "WiFi", "Balkon"],
      imagesGallery: [
        "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?q=80&w=1471",
        "https://images.unsplash.com/photo-1560184897-ae75f418493e?q=80&w=1470",
        "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?q=80&w=1470",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0c2?q=80&w=1470",
        "https://images.unsplash.com/photo-1560448075-d5f3e4582cfb?q=80&w=1470"
      ]
    },
    rentalStatus: RentalStatus.ACTIVE,
    rentalPeriod: {
      startDate: "2025-01-15",
      endDate: "2025-04-15",
      durationType: RentalDuration.SEMESTER
    },
    payment: {
      status: PaymentStatus.PARTIALLY_PAID,
      lastPaymentDate: "2025-01-15",
      receiptUrl: "/receipts/payment-jan-2025-604.pdf"
    },
    documents: [
      {
        id: "doc601",
        type: DocumentType.BOOKING_SLIP,
        fileName: "Booking_Slip_604.pdf",
        fileUrl: "/documents/booking_slip_604.pdf",
        createdAt: "2024-12-28"
      },
      {
        id: "doc602",
        type: DocumentType.INVOICE,
        fileName: "Invoice_Feb_2025.pdf",
        fileUrl: "/documents/invoice_feb_2025.pdf",
        createdAt: "2025-02-01"
      }
    ],
    notes: "Renovasi kamar mandi dijadwalkan pada bulan Maret",
    createdAt: "2024-12-28T11:10:00Z",
    updatedAt: "2025-01-15T16:30:00Z"
  },
  {
    id: "rental-567890",
    userId: "user123",
    room: {
      id: "room405",
      roomNumber: "405",
      type: "Premium",
      floor: 4,
      size: "4x5 m",
      description: "Kamar premium dengan balkon, furnitur berkualitas tinggi, kamar mandi pribadi luas dan pemandangan kota.",
      totalPrice: 7500000,
      facilities: ["AC", "Kamar Mandi Dalam", "Tempat Tidur Queen", "Meja Kerja", "Lemari Besar", "WiFi", "TV LED", "Balkon", "Kulkas Mini"],
      imagesGallery: [
        "https://images.unsplash.com/photo-1591825729269-caeb344f6df2?q=80&w=1470",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1458",
        "https://images.unsplash.com/photo-1609946860441-a51ffec4a232?q=80&w=1470",
        "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?q=80&w=1470"
      ]
    },
    rentalStatus: RentalStatus.PENDING,
    rentalPeriod: {
      startDate: "2025-07-01",
      endDate: "2026-06-30",
      durationType: RentalDuration.YEARLY
    },
    payment: {
      status: PaymentStatus.UNPAID,
      lastPaymentDate: undefined,
      receiptUrl: undefined
    },
    documents: [
      {
        id: "doc701",
        type: DocumentType.BOOKING_SLIP,
        fileName: "Booking_Request_405.pdf",
        fileUrl: "/documents/booking_request_405.pdf",
        createdAt: "2025-05-25"
      }
    ],
    notes: "Pengajuan sewa kamar, menunggu verifikasi admin dan pembayaran deposit",
    createdAt: "2025-05-25T09:45:00Z",
    updatedAt: "2025-05-25T09:45:00Z"
  }
];

/**
 * Function untuk mengambil daftar data rental
 * @returns Promise with rental data list
 */
export const getRentalDataList = async (): Promise<RentalData[]> => {
  // Simulasi network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return mockRentalDataList;
};

/**
 * Function untuk mengambil detail data rental berdasarkan ID
 * @param rentalId ID dari rental yang ingin diambil
 * @returns Promise with rental data
 */
export const getRentalDataById = async (rentalId: string): Promise<RentalData | undefined> => {
  // Simulasi network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return mockRentalDataList.find(rental => rental.id === rentalId);
};

/**
 * Function untuk download dokumen
 * @param documentId ID dokumen yang akan didownload
 * @returns Promise boolean yang menunjukkan keberhasilan download
 */
export async function downloadDocument(documentId: string): Promise<boolean> {
  // Simulasi network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simulasi keberhasilan download berdasarkan ID (untuk testing)
  // Dalam implementasi nyata akan mengarah ke endpoint download yang sebenarnya
  const success = documentId.startsWith("doc-");
  return success;
}


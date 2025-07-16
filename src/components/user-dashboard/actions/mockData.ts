import { 
  RentalStatus, 
  RentalData,
  RentalDuration,
  DocumentType
} from '../types';

/**
 * Simplified mock data for user dashboard - only essential info for manual booking system
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
      description: "Kamar standard dengan fasilitas lengkap",
      totalPrice: 2500000,
      facilities: ["AC", "Kamar Mandi Dalam", "Tempat Tidur", "Meja Belajar", "Lemari", "WiFi"],
      imagesGallery: ["/galeri/kamar_A/h1.JPG", "/galeri/kamar_A/h2.JPG"]
    },
    rentalStatus: RentalStatus.ACTIVE,
    rentalPeriod: {
      startDate: "2025-01-01",
      endDate: "2025-06-30",
      durationType: RentalDuration.SEMESTER
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
        fileName: "Receipt_2025.pdf",
        fileUrl: "/documents/receipt_2025.pdf",
        createdAt: "2025-01-01"
      },
      {
        id: "doc103",
        type: DocumentType.SOP,
        fileName: "SOP_Penghuni_2025.pdf",
        fileUrl: "/documents/sop_penghuni_2025.pdf",
        createdAt: "2025-01-01"
      }
    ],
    notes: "Sewa aktif sampai dengan 30 Juni 2025",
    createdAt: "2024-12-15T08:30:00Z",
    updatedAt: "2025-01-01T14:15:00Z"
  }
];

/**
 * Function untuk mengambil daftar data rental
 * @returns Promise with rental data list
 */
export const getRentalDataList = async (): Promise<RentalData[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return mockRentalDataList;
};

/**
 * Function untuk mengambil detail data rental berdasarkan ID
 * @param rentalId ID dari rental yang ingin diambil
 * @returns Promise with rental data
 */
export const getRentalDataById = async (rentalId: string): Promise<RentalData | undefined> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return mockRentalDataList.find(rental => rental.id === rentalId);
};

/**
 * Function untuk download dokumen - simplified
 * @param documentId ID dokumen yang akan didownload
 * @returns Promise boolean yang menunjukkan keberhasilan download
 */
export async function downloadDocument(documentId: string): Promise<boolean> {
  try {
    // Simulate download process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In real implementation, this would handle actual file download
    console.log(`Downloading document: ${documentId}`);
    
    return true;
  } catch (error) {
    console.error('Error downloading document:', error);
    return false;
  }
}

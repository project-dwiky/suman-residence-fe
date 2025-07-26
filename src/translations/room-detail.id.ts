import { RoomDetailTranslationKeys } from './room-detail.en';

export const roomDetailId: RoomDetailTranslationKeys = {
  navigation: {
    home: "Home",
    rooms: "Kamar"
  },
  
  notFound: {
    title: "Kamar tidak ditemukan",
    backLink: "Kembali ke daftar kamar"
  },

  roomInfo: {
    maxGuests: "Max {count} tamu",
    floor: "Lantai",
    roomDescription: "Deskripsi Kamar",
    roomAmenities: "Fasilitas Kamar",
    costBreakdown: "Rincian Biaya",
    included: "Sudah Termasuk",
    additionalCosts: "Biaya Tambahan",
    roomPolicies: "Kebijakan Kamar"
  },

  booking: {
    title: "Pesan Kamar",
    checkIn: "Check-in",
    checkOut: "Check-out", 
    guestCount: "Jumlah Tamu",
    selectGuests: "Pilih jumlah tamu",
    guest: "Tamu",
    guests: "Tamu",
    bookNow: "Pesan Sekarang",
    needHelp: "Butuh bantuan?",
    customerService: "24/7 Customer Service"
  },

  rooms: {
    typeA: {
      title: "Kamar Tipe A",
      size: "4 x 4 meter",
      price: "Rp 1.500.000",
      originalPrice: "Rp 1.800.000",
      description: "Kamar eksklusif khusus perempuan dengan ukuran 4x4 meter. Dilengkapi dengan fasilitas modern untuk kenyamanan maksimal dalam hunian kos-kosan premium di Banda Aceh.",
      longDescription: "Kamar Tipe A di Suman Residence menawarkan hunian kos-kosan eksklusif khusus perempuan dengan konsep \"Cozy Living Space\". Dengan ukuran 4x4 meter, kamar ini dilengkapi dengan kasur Queen Bed yang nyaman, AC untuk kenyamanan suhu ruangan, lemari pakaian yang cukup luas, meja nakas, dan tempat sampah.",
      features: ["AC", "Kasur Queen Bed", "WiFi Gratis", "Lemari Pakaian", "Meja Nakas", "Tempat Sampah"],
      bedType: "Queen Bed",
      view: "Full Furnished",
      floor: "1-3",
      checkIn: "Fleksibel 24 jam",
      checkOut: "Sesuai kontrak sewa",
      images: [
        "/galeri/kamar_A/h1.JPG", 
        "/galeri/kamar_A/h2.JPG",
        "/galeri/kamar_A/1.png",
        "/galeri/kamar_A/2.png",
        "/galeri/kamar_A/3.png"
      ],
      amenities: {
        ac: {
          name: "AC",
          description: "Air conditioning untuk kenyamanan suhu ruangan"
        },
        bed: {
          name: "Kasur Queen Bed", 
          description: "Kasur queen size yang nyaman untuk istirahat optimal"
        },
        wifi: {
          name: "WiFi Gratis",
          description: "Koneksi internet gratis untuk kebutuhan digital"
        },
        wardrobe: {
          name: "Lemari Pakaian",
          description: "Lemari pakaian dengan kapasitas yang memadai"
        },
        table: {
          name: "Meja Nakas",
          description: "Meja nakas untuk keperluan pribadi"
        },
        trash: {
          name: "Tempat Sampah",
          description: "Tempat sampah untuk menjaga kebersihan kamar"
        }
      }
    },
    typeB: {
      title: "Kamar Tipe B", 
      size: "4 x 5,5 meter",
      price: "Rp 2.100.000",
      originalPrice: "Rp 2.400.000",
      description: "Kamar premium khusus perempuan dengan ukuran lebih luas 4x5,5 meter. Suite eksklusif dengan ruang yang lebih fleksibel untuk kenyamanan maksimal.",
      longDescription: "Kamar Tipe B di Suman Residence adalah pilihan premium dengan ukuran 4x5,5 meter yang memberikan ruang lebih luas dan fleksibel. Hunian kos-kosan eksklusif khusus perempuan ini dilengkapi dengan semua fasilitas modern termasuk kasur Queen Bed, AC, lemari pakaian yang lebih besar, meja nakas, dan area yang lebih lega untuk aktivitas sehari-hari.",
      features: ["AC", "Kasur Queen Bed", "WiFi Gratis", "Lemari Pakaian Besar", "Meja Nakas", "Area Lebih Luas"],
      bedType: "Queen Bed",
      view: "Full Furnished", 
      floor: "2-3",
      checkIn: "Fleksibel 24 jam",
      checkOut: "Sesuai kontrak sewa",
      images: [
        "/galeri/kamar_B/1.png"
      ],
      amenities: {
        ac: {
          name: "AC",
          description: "Air conditioning untuk kenyamanan suhu ruangan"
        },
        bed: {
          name: "Kasur Queen Bed",
          description: "Kasur queen size premium yang sangat nyaman"
        },
        wifi: {
          name: "WiFi Gratis", 
          description: "Koneksi internet gratis unlimited"
        },
        wardrobe: {
          name: "Lemari Pakaian Besar",
          description: "Lemari pakaian dengan kapasitas ekstra besar"
        },
        table: {
          name: "Meja Nakas",
          description: "Meja nakas dengan storage tambahan"
        },
        area: {
          name: "Area Lebih Luas",
          description: "Ruang kamar yang lebih lega dan fleksibel"
        }
      }
    }
  },

  facilities: {
    included: ["Free Air PDAM", "Free WiFi", "Free Parkir"],
    excluded: ["Listrik prabayar per kamar"],
    additional: ["Laundry antar jemput tersedia (berbayar)"],
    shared: ["Void Lounge", "Dapur Bersama", "Area Jemuran", "Balkon", "Parkiran (Mobil & Motor)"]
  },

  policies: [
    "Hunian khusus perempuan",
    "Check-in fleksibel 24 jam", 
    "Akses WiFi gratis unlimited",
    "Air PDAM gratis",
    "Parkir gratis (mobil & motor)",
    "Listrik prabayar per kamar",
    "Laundry antar jemput tersedia"
  ],

  contact: {
    owner: "08221140701",
    admin: "081265945003", 
    email: "Sumanresidence338@gmail.com",
    instagram: "@Suman_Residence",
    tiktok: "@Suman.Residence"
  },

  common: {
    rating: 4.9,
    reviewCount: 89,
    maxGuests: 2,
    totalUnits: 39,
    rentalPeriods: ["Mingguan", "Bulanan", "Semester", "Tahunan"]
  }
}; 
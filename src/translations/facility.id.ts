import { FacilityTranslationKeys } from './facility.en';

export const facilityId: FacilityTranslationKeys = {
  title: "Fasilitas Eksklusif",
  description: "Nikmati berbagai fasilitas modern yang dirancang untuk memberikan pengalaman tinggal setara bintang 5.",
  
  roomTypes: {
    title: "Pilihan Kamar Premium",
    description: "Dirancang dengan mengedepankan kenyamanan dan keindahan, setiap kamar kami dilengkapi dengan fasilitas modern untuk memenuhi kebutuhan gaya hidup Anda.",
    badges: {
      totalUnits: "Total Unit",
      womenOnly: "Khusus Wanita"
    },
    rooms: {
      typeA: {
        title: "Kamar Tipe A",
        size: "4 x 4 meter",
        price: "Rp 1.500.000",
        description: "Kamar nyaman dengan ukuran compact, ideal untuk mahasiswi atau profesional muda.",
        features: [
          "AC",
          "Kasur Queen Bed",
          "Wi-Fi",
          "Lemari Pakaian",
          "Meja Nakas",
          "Tempat Sampah"
        ]
      },
      typeB: {
        title: "Kamar Tipe B", 
        size: "4 x 5,5 meter",
        price: "Rp 2.100.000",
        description: "Kamar luas dengan ruang yang lebih fleksibel untuk kebutuhan Anda.",
        features: [
          "AC",
          "Kasur Queen Bed", 
          "Wi-Fi",
          "Lemari Pakaian Besar",
          "Meja Nakas",
          "Area Kerja"
        ]
      }
    }
  },

  amenities: {
    title: "Fasilitas Umum",
    description: "Berbagai fasilitas premium yang didesain untuk meningkatkan kualitas hidup Anda selama tinggal di Suman Residence.",
    items: {
      wifi: {
        title: "Wi-Fi Berkecepatan Tinggi",
        description: "Akses internet gratis di seluruh area residence dengan kecepatan premium"
      },
      water: {
        title: "Air PDAM 24 Jam",
        description: "Supply air bersih tanpa terputus untuk kenyamanan maksimal"
      },
      parking: {
        title: "Area Parkir Luas",
        description: "Parkir aman dan gratis untuk kendaraan roda dua dan roda empat"
      },
      lounge: {
        title: "Lounge Area Eksklusif",
        description: "Ruang santai modern dengan desain interior premium untuk bersantai"
      },
      kitchen: {
        title: "Dapur Berkonsep Modern",
        description: "Dapur bersama dengan peralatan lengkap untuk kebutuhan memasak"
      },
      laundry: {
        title: "Layanan Laundry",
        description: "Layanan antar-jemput laundry untuk memudahkan kebutuhan harian Anda"
      },
      balcony: {
        title: "Balkon Pemandangan yang Bagus",
        description: "Nikmati pemandangan bagus dari balkon dengan desain minimalis modern"
      },
      security: {
        title: "Keamanan 24 Jam",
        description: "Sistem keamanan dan staff security yang menjaga residence sepanjang hari"
      }
    }
  },

  rentalOptions: {
    title: "Pilihan Durasi Sewa",
    description: "Kami menawarkan fleksibilitas dalam durasi sewa untuk menyesuaikan dengan kebutuhan Anda.",
    options: {
      weekly: {
        title: "Pilih Mingguan",
        period: "Fleksibilitas maksimal",
        benefits: [
          "Tanpa kontrak jangka panjang",
          "Fleksibel untuk kebutuhan singkat",
          "Semua fasilitas termasuk"
        ]
      },
      monthly: {
        title: "Pilih Bulanan",
        period: "Paling populer",
        benefits: [
          "Harga lebih ekonomis",
          "Cocok untuk kebutuhan menengah",
          "Fleksibilitas perpanjangan",
          "Semua fasilitas termasuk"
        ]
      },
      semester: {
        title: "Pilih Semester",
        period: "Untuk periode akademik",
        benefits: [
          "Diskon khusus",
          "Pengajuan deposit lebih rendah",
          "Prioritas perpanjangan",
          "Semua fasilitas termasuk"
        ]
      },
      yearly: {
        title: "Pilih Tahunan",
        period: "Value terbaik",
        benefits: [
          "Harga terendah per bulan",
          "Terjamin ketersediaan kamar",
          "Prioritas pemilihan kamar",
          "Semua fasilitas termasuk"
        ]
      }
    }
  }
}; 
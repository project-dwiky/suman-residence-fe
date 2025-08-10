export const roomDetailEn = {
  navigation: {
    home: "Home",
    rooms: "Rooms"
  },
  
  notFound: {
    title: "Room not found",
    backLink: "Back to room list"
  },

  roomInfo: {
    maxGuests: "Max {count} guests",
    floor: "Floor",
    roomDescription: "Room Description",
    roomAmenities: "Room Facilities",
    costBreakdown: "Cost Breakdown",
    included: "Included",
    additionalCosts: "Additional Costs",
    roomPolicies: "Room Policies"
  },

  booking: {
    title: "Book Room",
    checkIn: "Check-in",
    checkOut: "Check-out", 
    guestCount: "Number of Guests",
    selectGuests: "Select number of guests",
    guest: "Guest",
    guests: "Guests",
    bookNow: "Book Now",
    needHelp: "Need help?",
    customerService: "24/7 Customer Service"
  },

  rooms: {
    typeA: {
      title: "Room Type A",
      size: "4 x 4 meter",
      price: "Rp 1,500,000",
      originalPrice: "Rp 1,800,000",
      description: "Exclusive women-only room with 4x4 meter size. Equipped with modern facilities for maximum comfort in premium boarding house accommodation in Banda Aceh.",
      longDescription: "Room Type A at Suman Residence offers exclusive women-only accommodation with a 'Cozy Living Space' concept. With a size of 4x4 meters, this room is equipped with a comfortable Queen Bed, AC for room temperature comfort, spacious wardrobe, bedside table, and trash bin.",
      features: ["AC", "Queen Bed", "Free WiFi", "Wardrobe", "Bedside Table", "Trash Bin"],
      bedType: "Queen Bed",
      view: "Full Furnished",
      floor: "1-3",
      checkIn: "Flexible 24 hours",
      checkOut: "According to rental contract",
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
          description: "Air conditioning for room temperature comfort"
        },
        bed: {
          name: "Queen Bed", 
          description: "Comfortable queen size bed for optimal rest"
        },
        wifi: {
          name: "Free WiFi",
          description: "Free internet connection for digital needs"
        },
        wardrobe: {
          name: "Wardrobe",
          description: "Wardrobe with adequate capacity"
        },
        table: {
          name: "Bedside Table",
          description: "Bedside table for personal needs"
        },
        trash: {
          name: "Trash Bin",
          description: "Trash bin to maintain room cleanliness"
        }
      }
    },
    typeB: {
      title: "Room Type B", 
      size: "4 x 5.5 meter",
      price: "Rp 2,100,000",
      originalPrice: "Rp 2,400,000",
      description: "Premium women-only room with larger 4x5.5 meter size. Exclusive suite with more flexible space for maximum comfort.",
      longDescription: "Room Type B at Suman Residence is a premium choice with 4x5.5 meter size that provides more spacious and flexible space. This exclusive women-only boarding house accommodation is equipped with all modern facilities including Queen Bed, AC, larger wardrobe, bedside table, and more spacious area for daily activities.",
      features: ["AC", "Queen Bed", "Free WiFi", "Large Wardrobe", "Bedside Table", "Larger Area"],
      bedType: "Queen Bed",
      view: "Full Furnished", 
      floor: "2-3",
      checkIn: "Flexible 24 hours",
      checkOut: "According to rental contract",
      images: [
        "/galeri/kamar_B/1.png"
      ],
      amenities: {
        ac: {
          name: "AC",
          description: "Air conditioning for room temperature comfort"
        },
        bed: {
          name: "Queen Bed",
          description: "Premium queen size bed that is very comfortable"
        },
        wifi: {
          name: "Free WiFi", 
          description: "Free unlimited internet connection"
        },
        wardrobe: {
          name: "Large Wardrobe",
          description: "Wardrobe with extra large capacity"
        },
        table: {
          name: "Bedside Table",
          description: "Bedside table with additional storage"
        },
        area: {
          name: "Larger Area",
          description: "More spacious and flexible room space"
        }
      }
    }
  },

  facilities: {
    included: ["Free Water Supply", "Free WiFi", "Free Parking"],
    excluded: ["Prepaid electricity per room"],
    additional: ["Pick-up and delivery laundry service (paid)", "Monthly garbage fee"],
    shared: ["Void Lounge", "Shared Kitchen", "Drying Area", "Balcony", "Parking (Car & Motorcycle)"]
  },

  policies: [
    "Women-only accommodation",
    "Flexible 24-hour check-in", 
    "Free unlimited WiFi access",
    "Free water supply",
    "Free parking (car & motorcycle)",
    "Prepaid electricity per room",
    "Pick-up and delivery laundry service available"
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
    rentalPeriods: ["Weekly", "Monthly", "Semester", "Yearly"]
  }
};

export type RoomDetailTranslationKeys = typeof roomDetailEn; 
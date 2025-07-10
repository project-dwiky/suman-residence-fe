export const kamarEn = {
  hero: {
    title: "Our Room Options",
    description: "Enjoy comfort and luxury in every room specially designed to provide the best accommodation experience"
  },
  
  rooms: {
    typeA: {
      title: "Room Type A",
      size: "4 x 4 meter",
      price: "Rp 1,500,000",
      description: "Comfortable room with compact size, ideal for students or young professionals. Equipped with modern facilities for maximum comfort.",
      features: ["AC", "Queen Bed", "Free Wi-Fi", "Wardrobe", "Bedside Table", "Trash Bin"]
    },
    typeB: {
      title: "Room Type B",
      size: "4 x 5.5 meter", 
      price: "Rp 2,100,000",
      description: "Spacious room with more flexible space for your needs. Premium suite with work area and larger storage.",
      features: ["AC", "Queen Bed", "Free Wi-Fi", "Large Wardrobe", "Bedside Table", "Work Area"]
    }
  },

  additionalInfo: {
    flexibleCheckin: {
      title: "Flexible Check-in",
      description: "Check-in available with friendly and professional service"
    },
    instantReservation: {
      title: "Instant Reservation", 
      description: "Room booking can be done online with instant confirmation"
    },
    maximumComfort: {
      title: "Maximum Comfort",
      description: "Every room is designed to provide the best comfort and privacy"
    }
  }
};

export type KamarTranslationKeys = typeof kamarEn; 
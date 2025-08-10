export const facilityEn = {
  title: "Exclusive Facilities",
  description: "Enjoy various modern facilities designed to provide a 5-star living experience.",
  
  roomTypes: {
    title: "Premium Room Options",
    description: "Designed with comfort and beauty in mind, each of our rooms is equipped with modern facilities to meet your lifestyle needs.",
    badges: {
      totalUnits: "Total Units",
      womenOnly: "Women Only"
    },
    rooms: {
      typeA: {
        title: "Room Type A",
        size: "4 x 4 meter",
        price: "Rp 1,500,000",
        description: "Comfortable room with compact size, ideal for students or young professionals.",
        features: [
          "AC",
          "Queen Bed",
          "Wi-Fi",
          "Wardrobe",
          "Bedside Table",
          "Trash Bin"
        ]
      },
      typeB: {
        title: "Room Type B", 
        size: "4 x 5.5 meter",
        price: "Rp 2,100,000",
        description: "Spacious room with more flexible space for your needs.",
        features: [
          "AC",
          "Queen Bed", 
          "Wi-Fi",
          "Large Wardrobe",
          "Bedside Table",
          "Work Area"
        ]
      }
    }
  },

  amenities: {
    title: "Common Facilities",
    description: "Various premium facilities designed to improve your quality of life while staying at Suman Residence.",
    items: {
      wifi: {
        title: "High-Speed Wi-Fi",
        description: "Free internet access throughout the residence with premium speed"
      },
      water: {
        title: "24-Hour Water Supply",
        description: "Uninterrupted clean water supply for maximum comfort"
      },
      parking: {
        title: "Spacious Parking Area",
        description: "Safe and free parking for motorcycles and cars"
      },
      lounge: {
        title: "Exclusive Lounge Area",
        description: "Modern relaxation space with premium interior design for relaxing"
      },
      kitchen: {
        title: "Modern Concept Kitchen",
        description: "Shared kitchen with complete equipment for cooking needs"
      },
      laundry: {
        title: "Laundry Service",
        description: "Pick-up and delivery laundry service to ease your daily needs"
      },
      balcony: {
        title: "Beautiful View Balcony",
        description: "Enjoy beautiful views from the balcony with modern minimalist design"
      },
      security: {
        title: "24-Hour Security",
        description: "Security system and security staff that guard the residence all day long"
      }
    }
  },

  rentalOptions: {
    title: "Rental Duration Options",
    description: "We offer flexibility in rental duration to suit your needs.",
    options: {
      weekly: {
        title: "Choose Weekly",
        period: "Maximum flexibility",
        benefits: [
          "No long-term contract",
          "Flexible for short-term needs",
          "All facilities included"
        ]
      },
      monthly: {
        title: "Choose Monthly",
        period: "Most popular",
        benefits: [
          "More economical price",
          "Suitable for medium-term needs",
          "Extension flexibility",
          "All facilities included"
        ]
      },
      semester: {
        title: "Choose Semester",
        period: "For academic period",
        benefits: [
          "Special discount",
          "Parking priority",
          "Extension priority",
          "All facilities included"
        ]
      },
      yearly: {
        title: "Choose Yearly",
        period: "Best value",
        benefits: [
          "Lowest monthly price",
          "Parking priority",
          "Room selection priority",
          "All facilities included"
        ]
      }
    }
  }
};

export type FacilityTranslationKeys = typeof facilityEn; 
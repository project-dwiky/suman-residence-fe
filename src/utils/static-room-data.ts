import { Language, getRoomDetailTranslation } from "@/translations";
import { Snowflake, Bed, Wifi, Users, Tv, Bath, Armchair } from "lucide-react";

export interface StaticRoom {
  id: string;
  title: string;
  size: string;
  price: string;
  originalPrice: string;
  pricePerMonth: string;
  description: string;
  longDescription: string;
  features: string[];
  amenities: Array<{
    name: string;
    icon: any;
    description: string;
  }>;
  images: string[];
  availability: "available" | "limited";
  type: "A" | "B";
  units: number;
  totalUnits: number;
  rating: number;
  reviewCount: number;
  maxGuests: number;
  bedType: string;
  view: string;
  floor: string;
  checkIn: string;
  checkOut: string;
  rentalPeriods: string[];
  policies: string[];
  includedFacilities: string[];
  excludedFacilities: string[];
  sharedFacilities: string[];
  contact: {
    owner: string;
    admin: string;
    email: string;
    instagram: string;
    tiktok: string;
  };
  pricing: {
    weekly: number;
    monthly: number;
    semester: number;
    yearly: number;
  };
}

export const getStaticRoomData = (language: Language): StaticRoom[] => {
  const t = getRoomDetailTranslation(language);
  
  return [
    {
      id: "1",
      title: t.rooms.typeA.title,
      size: t.rooms.typeA.size,
      price: t.rooms.typeA.price,
      originalPrice: t.rooms.typeA.originalPrice,
      pricePerMonth: t.rooms.typeA.price,
      description: t.rooms.typeA.description,
      longDescription: t.rooms.typeA.longDescription,
      features: t.rooms.typeA.features,
      amenities: [
        {
          name: t.rooms.typeA.amenities.ac.name,
          icon: Snowflake,
          description: t.rooms.typeA.amenities.ac.description,
        },
        {
          name: t.rooms.typeA.amenities.bed.name,
          icon: Bed,
          description: t.rooms.typeA.amenities.bed.description,
        },
        {
          name: t.rooms.typeA.amenities.wifi.name,
          icon: Wifi,
          description: t.rooms.typeA.amenities.wifi.description,
        },
        {
          name: t.rooms.typeA.amenities.wardrobe.name,
          icon: Users,
          description: t.rooms.typeA.amenities.wardrobe.description,
        },
        {
          name: t.rooms.typeA.amenities.table.name,
          icon: Tv,
          description: t.rooms.typeA.amenities.table.description,
        },
        {
          name: t.rooms.typeA.amenities.trash.name,
          icon: Bath,
          description: t.rooms.typeA.amenities.trash.description,
        },
      ],
      images: [
        "/galeri/kamar_A/h1.JPG", 
        "/galeri/kamar_A/h2.JPG",
        "/galeri/kamar_A/1.png",
        "/galeri/kamar_A/2.png",
        "/galeri/kamar_A/3.png"
      ],
      availability: "available" as const,
      type: "A" as const,
      units: 35,
      totalUnits: t.common.totalUnits,
      rating: t.common.rating,
      reviewCount: t.common.reviewCount,
      maxGuests: t.common.maxGuests,
      bedType: t.rooms.typeA.bedType,
      view: t.rooms.typeA.view,
      floor: t.rooms.typeA.floor,
      checkIn: t.rooms.typeA.checkIn,
      checkOut: t.rooms.typeA.checkOut,
      rentalPeriods: t.common.rentalPeriods,
      policies: t.policies,
      includedFacilities: t.facilities.included,
      excludedFacilities: t.facilities.excluded,
      sharedFacilities: t.facilities.shared,
      contact: t.contact,
      pricing: {
        weekly: 400000,
        monthly: 1500000,
        semester: 8500000,
        yearly: 16000000,
      },
    },
    {
      id: "2",
      title: t.rooms.typeB.title,
      size: t.rooms.typeB.size,
      price: t.rooms.typeB.price,
      originalPrice: t.rooms.typeB.originalPrice,
      pricePerMonth: t.rooms.typeB.price,
      description: t.rooms.typeB.description,
      longDescription: t.rooms.typeB.longDescription,
      features: t.rooms.typeB.features,
      amenities: [
        {
          name: t.rooms.typeB.amenities.ac.name,
          icon: Snowflake,
          description: t.rooms.typeB.amenities.ac.description,
        },
        {
          name: t.rooms.typeB.amenities.bed.name,
          icon: Bed,
          description: t.rooms.typeB.amenities.bed.description,
        },
        {
          name: t.rooms.typeB.amenities.wifi.name,
          icon: Wifi,
          description: t.rooms.typeB.amenities.wifi.description,
        },
        {
          name: t.rooms.typeB.amenities.wardrobe.name,
          icon: Users,
          description: t.rooms.typeB.amenities.wardrobe.description,
        },
        {
          name: t.rooms.typeB.amenities.table.name,
          icon: Tv,
          description: t.rooms.typeB.amenities.table.description,
        },
        {
          name: t.rooms.typeB.amenities.area.name,
          icon: Armchair,
          description: t.rooms.typeB.amenities.area.description,
        },
      ],
      images: [
        "/galeri/kamar_B/1.png"
      ],
      availability: "limited" as const,
      type: "B" as const,
      units: 5,
      totalUnits: t.common.totalUnits,
      rating: t.common.rating,
      reviewCount: t.common.reviewCount,
      maxGuests: t.common.maxGuests,
      bedType: t.rooms.typeB.bedType,
      view: t.rooms.typeB.view,
      floor: t.rooms.typeB.floor,
      checkIn: t.rooms.typeB.checkIn,
      checkOut: t.rooms.typeB.checkOut,
      rentalPeriods: t.common.rentalPeriods,
      policies: t.policies,
      includedFacilities: t.facilities.included,
      excludedFacilities: t.facilities.excluded,
      sharedFacilities: t.facilities.shared,
      contact: t.contact,
      pricing: {
        weekly: 550000,
        monthly: 2100000,
        semester: 11500000,
        yearly: 22000000,
      },
    },
  ];
};

export const getStaticRoomById = (roomId: string, language: Language): StaticRoom | null => {
  const rooms = getStaticRoomData(language);
  return rooms.find(room => room.id === roomId) || null;
};

// Helper function to get room data for Kamar page
export const getKamarRoomData = (language: Language) => {
  const staticRooms = getStaticRoomData(language);
  
  return staticRooms.map((room) => ({
    id: room.id, // Keep as string to match RoomTypeCard props
    title: room.title,
    size: room.size,
    price: room.price,
    description: room.description,
    features: room.features,
    image: room.images[0],
    availability: room.availability,
    type: room.type,
    units: room.units
  }));
};

// Function to get image URLs for specific room types
export const getRoomImageUrls = (roomType: 'A' | 'B', language: Language = 'id'): string[] => {
  const room = getStaticRoomById(roomType, language);
  return room ? room.images : [];
};

// Function to get the main/first image URL for a room type
export const getRoomMainImage = (roomType: 'A' | 'B', language: Language = 'id'): string => {
  const images = getRoomImageUrls(roomType, language);
  if (images.length > 0) {
    return images[0];
  }
  
  // Fallback to hardcoded image paths if static data fails
  if (roomType === 'A') {
    return '/galeri/kamar_A/h1.JPG';
  } else if (roomType === 'B') {
    return '/galeri/kamar_B/1.png';
  }
  
  // Ultimate fallback
  return '/galeri/kamar_A/h1.JPG';
};

// Function to get all room images for both types
export const getAllRoomImages = (language: Language = 'id'): { typeA: string[], typeB: string[] } => {
  return {
    typeA: getRoomImageUrls('A', language),
    typeB: getRoomImageUrls('B', language)
  };
};

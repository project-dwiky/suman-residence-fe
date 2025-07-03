import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';

export interface RoomTypeProps {
  id?: number;
  title: string;
  size: string;
  price: string;
  description: string;
  features: string[];
  image: string;
  availability: 'available' | 'limited' | 'booked';
  type: 'A' | 'B';
  units: number;
}

const RoomTypeCard: React.FC<RoomTypeProps> = ({
  id,
  title,
  size,
  price,
  description,
  features,
  image,
  availability,
  type,
  units
}) => {
  const availabilityStyles = {
    available: 'bg-green-50 text-green-700 border-green-200',
    limited: 'bg-amber-50 text-amber-700 border-amber-200',
    booked: 'bg-red-50 text-red-700 border-red-200',
  };

  const availabilityText = {
    available: 'Tersedia',
    limited: 'Terbatas',
    booked: 'Penuh',
  };

  const typeColor = type === 'A' ? 'bg-primary' : 'bg-secondary';
  
  return (
    <motion.div 
      className="overflow-hidden rounded-2xl bg-white shadow-lg group h-full flex flex-col"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Image - Fixed Height */}
      <div className="relative">
        <div className="relative h-[200px] overflow-hidden">
          <Image 
            src={image} 
            fill 
            alt={title}
            className="object-cover transition-transform duration-700 group-hover:scale-110" 
          />
          <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold text-white ${typeColor}`}>
            Tipe {type}
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-24 opacity-70"></div>
        <div className="absolute bottom-4 left-4">
          <p className="text-white text-xl font-bold">{title}</p>
          <p className="text-white/90 text-sm font-medium">{size}</p>
        </div>
      </div>
      
      {/* Content - Flex Grow */}
      <div className="p-6 flex-grow flex flex-col">
        
        {/* Description - Fixed Height */}
        <div className="mb-4 min-h-[60px]">
          <p className="text-muted-foreground line-clamp-3">{description}</p>
        </div>
        
        {/* Features - Min Height */}
        <div className="border-t pt-4 flex-grow">
          <p className="font-medium mb-2 text-sm">Fasilitas Kamar:</p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 min-h-[100px]">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start text-sm">
                <svg className="w-4 h-4 mr-2 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="line-clamp-2">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Footer - Fixed Height */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">{units} Unit</span> tersedia
          </div>
          <Link 
            href={id ? `/kamar/${id}` : '/kamar'}
            className="bg-primary hover:bg-primary/90 transition-colors text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Lihat Detail
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default RoomTypeCard;

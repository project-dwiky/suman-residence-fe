import React from 'react';
import { motion } from 'framer-motion';

export interface RentalOptionProps {
  title: string;
  period: string;
  benefits: string[];
  recommended?: boolean;
}

const RentalOption: React.FC<RentalOptionProps> = ({ title, period, benefits, recommended = false }) => {
  return (
    <motion.div 
      className={`rounded-2xl overflow-hidden shadow-lg relative h-full ${recommended ? 'border-2 border-primary ring-2 ring-primary/20' : 'border border-gray-100'}`}
      whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {recommended && (
        <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 rounded-bl-lg text-sm font-medium z-10">
          Rekomendasi
        </div>
      )}
      <div className="bg-white p-6 flex flex-col h-full">
        {/* Header - Fixed Height */}
        <div className="text-center mb-6 h-[70px] flex flex-col justify-center">
          <h3 className={`text-xl ${recommended ? 'text-primary' : 'text-gray-800'} font-bold mb-1`}>{title}</h3>
          <p className="text-muted-foreground text-sm">{period}</p>
        </div>

        {/* Benefits - Flex Grow with Min Height */}
        <div className="space-y-3 mb-6 flex-grow min-h-[180px]">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start">
              <svg 
                className={`w-5 h-5 mr-3 mt-0.5 ${recommended ? 'text-primary' : 'text-gray-500'} flex-shrink-0`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-gray-600">{benefit}</span>
            </div>
          ))}
          
          {/* Add empty space fillers for cards with fewer benefits */}
          {Array.from({ length: Math.max(0, 4 - benefits.length) }).map((_, i) => (
            <div key={`empty-${i}`} className="h-[24px]"></div>
          ))}
        </div>

        {/* Button - Fixed Height */}
        <button 
          className={`w-full py-3 rounded-lg font-medium transition-colors ${
            recommended 
              ? 'bg-primary text-white hover:bg-primary/90' 
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          Pilih {title}
        </button>
      </div>
    </motion.div>
  );
};

export default RentalOption;

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Star, CheckCircle } from 'lucide-react';
import { Language } from '@/translations';

export interface RentalOptionProps {
  title: string;
  period: string;
  benefits: string[];
  recommended?: boolean;
  language: Language;
}

const RentalOption: React.FC<RentalOptionProps> = ({ title, period, benefits, recommended = false, language }) => {
  return (
    <motion.div 
      className={`rounded-2xl overflow-hidden shadow-lg relative h-full ${
        recommended 
          ? 'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-2 border-gradient-to-r border-secondary/30' 
          : 'bg-gradient-to-br from-white via-gray-50 to-amber-50/30 border border-gray-200'
      }`}
      whileHover={{ 
        y: -8, 
        boxShadow: recommended 
          ? '0 25px 50px -12px rgba(214, 149, 11, 0.25), 0 0 0 1px rgba(214, 149, 11, 0.1)' 
          : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className={`absolute top-0 right-0 w-32 h-32 rounded-full ${
          recommended ? 'bg-gradient-to-br from-secondary to-amber-600' : 'bg-gradient-to-br from-gray-300 to-amber-300'
        } transform translate-x-16 -translate-y-16`}></div>
        <div className={`absolute bottom-0 left-0 w-24 h-24 rounded-full ${
          recommended ? 'bg-gradient-to-tr from-yellow-500 to-secondary' : 'bg-gradient-to-tr from-gray-200 to-amber-200'
        } transform -translate-x-12 translate-y-12`}></div>
      </div>

      {recommended && (
        <motion.div 
          className="absolute top-0 right-0 bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-bl-xl text-sm font-semibold z-10 shadow-lg"
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-current" />
            {language === 'id' ? 'Rekomendasi' : 'Recommended'}
          </div>
        </motion.div>
      )}

      <div className="relative z-10 p-6 flex flex-col h-full">
        {/* Header - Fixed Height with enhanced styling */}
        <div className="text-center mb-6 h-[70px] flex flex-col justify-center">
          <h3 className={`text-xl font-bold mb-1 ${
            recommended 
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary' 
              : 'text-gray-800'
          }`}>
            {title}
          </h3>
          <p className={`text-sm font-medium ${
            recommended ? 'text-primary' : 'text-gray-600'
          }`}>
            {period}
          </p>
        </div>

        {/* Benefits - Enhanced with better icons and colors */}
        <div className="space-y-4 mb-6 flex-grow min-h-[180px]">
          {benefits.map((benefit, index) => (
            <motion.div 
              key={index} 
              className="flex items-start"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 ${
                recommended 
                  ? 'bg-gradient-to-r from-primary to-secondary' 
                  : 'bg-gradient-to-r from-gray-400 to-amber-400'
              }`}>
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <span className={`text-sm leading-relaxed ${
                recommended ? 'text-gray-700' : 'text-gray-600'
              }`}>
                {benefit}
              </span>
            </motion.div>
          ))}
          
          {/* Add empty space fillers for cards with fewer benefits */}
          {Array.from({ length: Math.max(0, 4 - benefits.length) }).map((_, i) => (
            <div key={`empty-${i}`} className="h-[28px]"></div>
          ))}
        </div>

        {/* Enhanced Button with gradients and hover effects */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            className={`w-full py-4 rounded-xl font-semibold text-base transition-all duration-300 shadow-lg ${
              recommended 
                ? 'bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90 hover:shadow-xl' 
                : 'bg-gradient-to-r from-gray-100 to-amber-100 text-gray-800 hover:from-gray-200 hover:to-amber-200 border border-gray-300'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              {title}
              {recommended && <Star className="w-4 h-4 fill-current" />}
            </div>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default RentalOption;

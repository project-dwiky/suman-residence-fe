import React from 'react';
import { motion } from 'framer-motion';

export interface AmenityProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const AmenityCard: React.FC<AmenityProps> = ({ icon, title, description }) => {
  return (
    <motion.div 
      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center text-center h-full">
        <div className="mb-4 text-primary p-2 bg-primary/5 rounded-full w-16 h-16 flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2 text-primary min-h-[56px] flex items-center">{title}</h3>
        <p className="text-muted-foreground text-sm flex-grow">{description}</p>
      </div>
    </motion.div>
  );
};

export default AmenityCard;

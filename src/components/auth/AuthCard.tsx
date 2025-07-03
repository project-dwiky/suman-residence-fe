"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const AuthCard = ({ title, subtitle, children }: AuthCardProps) => {
  return (
    <motion.div 
      className="bg-card rounded-xl p-8 shadow-md w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
      animate={{ opacity: 1, y: 0, boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="flex flex-col items-center mb-6">
        <div className="mb-4">
          <Image 
            src="/icon.png" 
            alt="Suman Residence Logo" 
            width={80} 
            height={80}
            className="rounded-full"
          />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-1 text-center">
          <span className="text-secondary">{title}</span>
        </h1>
        {subtitle && (
          <p className="text-muted-foreground text-center">{subtitle}</p>
        )}
      </div>
      
      <div>
        {children}
      </div>
    </motion.div>
  );
};

export default AuthCard;

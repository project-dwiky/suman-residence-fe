"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import AuthInput from './AuthInput';
import { Mail, Lock, User, Phone, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface RegisterFormProps {
  onSuccess?: () => void;
}

const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const formatPhoneNumber = (phone: string): string => {
    // Remove all non-digit characters first
    let digits = phone.replace(/\D/g, '');
    
    // Handle Indonesian numbers
    if (digits.startsWith('62')) {
      return `+${digits}`; // Already has country code, just add +
    } else if (digits.startsWith('0')) {
      return `+62${digits.substring(1)}`; // Convert 08xx to +628xx
    } else if (!phone.startsWith('+')) {
      return `+62${digits}`; // Assume it's an Indonesian number without prefix
    }
    
    // If it already has a plus sign, keep the original input
    return phone;
  };
  
  const validatePhoneNumber = (phone: string): boolean => {
    // Basic validation for Indonesian numbers
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Check if it's a valid Indonesian number (minimum length after country code)
    if (phone.startsWith('+62') && cleanPhone.length >= 10 && cleanPhone.length <= 14) {
      return true;
    }
    
    // If starts with 0, it should have 10-12 digits (including the leading 0)
    if (phone.startsWith('0') && cleanPhone.length >= 10 && cleanPhone.length <= 12) {
      return true;
    }
    
    return false;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Special handling for phone number
    if (name === 'phone') {
      // Store the original input value for now - we'll format on submit
      setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate form
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    
    // Validate phone number format
    if (!validatePhoneNumber(formData.phone)) {
      setError("Please enter a valid Indonesian phone number");
      return;
    }
    
    // Format phone number to consistent format
    const formattedPhone = formatPhoneNumber(formData.phone);
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formattedPhone, // Send the formatted phone number
          password: formData.password,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/auth/login?registered=true');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      {error && (
        <div className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm">
          {error}
        </div>
      )}
      
      <AuthInput
        label="Full Name"
        type="text"
        id="name"
        name="name"
        placeholder="Enter your full name"
        icon={<User size={18} />}
        value={formData.name}
        onChange={handleChange}
        required
      />
      
      <AuthInput
        label="Email"
        type="email"
        id="email"
        name="email"
        placeholder="Enter your email"
        icon={<Mail size={18} />}
        value={formData.email}
        onChange={handleChange}
        required
      />
      
      <div className="space-y-1">
        <AuthInput
          label="Phone Number"
          type="tel"
          id="phone"
          name="phone"
          placeholder="Enter your phone number (e.g. 08123456789)"
          icon={<Phone size={18} />}
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <p className="text-xs text-muted-foreground ml-1">
          Format: 08xx or +62xx (will be formatted as +62xxx...)
        </p>
      </div>
      
      <AuthInput
        label="Password"
        type="password"
        id="password"
        name="password"
        placeholder="Create a password"
        icon={<Lock size={18} />}
        value={formData.password}
        onChange={handleChange}
        required
      />
      
      <AuthInput
        label="Confirm Password"
        type="password"
        id="confirmPassword"
        name="confirmPassword"
        placeholder="Confirm your password"
        icon={<Lock size={18} />}
        value={formData.confirmPassword}
        onChange={handleChange}
        required
      />
      
      <Button 
        type="submit" 
        className="w-full bg-primary text-white hover:bg-primary/90 rounded-lg h-11 mt-4"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Registering...
          </>
        ) : 'Register'}
      </Button>
      
      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </motion.form>
  );
};

export default RegisterForm;

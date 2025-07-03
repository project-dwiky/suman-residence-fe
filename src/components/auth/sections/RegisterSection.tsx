"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Lock, User, Phone, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AuthInput from '../AuthInput';
import AuthCard from '../AuthCard';
import { toast } from 'sonner';

const RegisterSection = () => {
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
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate form
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      toast.error("Passwords don't match");
      return;
    }
    
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      toast.error("Password must be at least 6 characters long");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      toast.success('Registration successful! Please sign in.');
      router.push('/auth/login?registered=true');
      
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
      toast.error(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto py-8 px-4">
      <AuthCard title="Create Account" subtitle="Sign up to get started">
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
          
          <AuthInput
            label="Phone Number"
            type="tel"
            id="phone"
            name="phone"
            placeholder="Enter your phone number"
            icon={<Phone size={18} />}
            value={formData.phone}
            onChange={handleChange}
            required
          />
          
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
      </AuthCard>
    </div>
  );
};

export default RegisterSection;

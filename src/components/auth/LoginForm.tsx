"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import AuthInput from './AuthInput';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      if (onSuccess) {
        onSuccess();
      } else {
        // Default redirect to dashboard or home page
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-6"
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
        label="Email"
        type="email"
        id="email"
        placeholder="Enter your email"
        icon={<Mail size={18} />}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      
      <AuthInput
        label="Password"
        type="password"
        id="password"
        placeholder="Enter your password"
        icon={<Lock size={18} />}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      
      <div className="flex justify-end">
        <Link 
          href="/auth/forgot-password" 
          className="text-sm text-primary hover:underline transition-all"
        >
          Forgot password?
        </Link>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-primary text-white hover:bg-primary/90 rounded-lg h-11"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing In...
          </>
        ) : 'Sign In'}
      </Button>
      
      <div className="text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <Link href="/auth/register" className="text-primary hover:underline">
          Register here
        </Link>
      </div>
    </motion.form>
  );
};

export default LoginForm;

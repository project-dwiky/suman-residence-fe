"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Lock, Loader2, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AuthInput from '../AuthInput';
import AuthCard from '../AuthCard';
import { toast } from 'sonner';

interface LoginSectionProps {
  message?: string;
  success?: string;
  registered?: boolean;
  redirectTo?: string;
}

const LoginSection = ({ message, success, registered, redirectTo }: LoginSectionProps) => {
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
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      toast.success('Login successful!');
      
      // If redirectTo is undefined, check user role to determine redirect destination
      if (!redirectTo) {
        // Check if user is admin to redirect to admin dashboard
        if (data.data && data.data.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/dashboard');
        }
      } else {
        // Use the specified redirectTo path
        router.push(redirectTo);
      }
      
      router.refresh();
      
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
      toast.error(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto py-8 px-4">
      <AuthCard title="Welcome Back" subtitle="Sign in to your account">
        <motion.form 
          onSubmit={handleSubmit} 
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {error && (
            <div className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          {message && (
            <motion.div 
              className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm flex items-start gap-2"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{message}</span>
            </motion.div>
          )}
          
          {success && (
            <motion.div 
              className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-3 text-sm flex items-start gap-2"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-600" />
              <span>{success}</span>
            </motion.div>
          )}
          
          {registered && (
            <motion.div 
              className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-3 text-sm flex items-start gap-2"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-600" />
              <span>Registration successful! You can now sign in.</span>
            </motion.div>
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
      </AuthCard>
    </div>
  );
};

export default LoginSection;

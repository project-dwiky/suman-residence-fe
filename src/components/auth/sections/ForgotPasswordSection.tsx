"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AuthInput from '../AuthInput';
import AuthCard from '../AuthCard';
import { toast } from 'sonner';

const ForgotPasswordSection = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset password link');
      }
      
      toast.success('Reset password link sent successfully!');
      setSuccess(true);
      
    } catch (err: any) {
      setError(err.message || 'Failed to send reset password link. Please try again.');
      toast.error(err.message || 'Failed to send reset password link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Tampilkan pesan sukses
  if (success) {
    return (
      <div className="w-full max-w-md mx-auto py-8 px-4">
        <AuthCard title="Check Your WhatsApp" subtitle="Reset password link has been sent">
          <div className="flex flex-col items-center justify-center p-6 space-y-4">
            <CheckCircle className="h-16 w-16 text-green-600 mt-2" />
            <p className="text-center text-muted-foreground">
              We've sent a reset password link to your WhatsApp. Please click the link to reset your password.
            </p>
            <p className="text-center text-sm text-muted-foreground">
              If you don't receive it within a few minutes, please check if your email is correct and try again.
            </p>
            <Button 
              className="w-full mt-4"
              onClick={() => setSuccess(false)}
            >
              Request Again
            </Button>
            <Button 
              className="w-full mt-2 bg-transparent border border-primary text-primary hover:bg-primary/5"
              onClick={() => router.push('/auth/login')}
            >
              Back to Login
            </Button>
          </div>
        </AuthCard>
      </div>
    );
  }
  
  return (
    <div className="w-full max-w-md mx-auto py-8 px-4">
      <AuthCard title="Forgot Password" subtitle="Enter your email to reset your password">
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
          
          <AuthInput
            label="Email"
            type="email"
            id="email"
            placeholder="Enter your registered email"
            icon={<Mail size={18} />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <Button 
            type="submit" 
            className="w-full bg-primary text-white hover:bg-primary/90 rounded-lg h-11"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : 'Send Reset Link'}
          </Button>
          
          <div className="text-center text-sm text-muted-foreground">
            Remember your password?{' '}
            <Link href="/auth/login" className="text-primary hover:underline">
              Sign in here
            </Link>
          </div>
        </motion.form>
      </AuthCard>
    </div>
  );
};

export default ForgotPasswordSection;

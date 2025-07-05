"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Lock, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AuthInput from '../AuthInput';
import AuthCard from '../AuthCard';
import { toast } from 'sonner';

interface ResetPasswordSectionProps {
  token?: string;
}

const ResetPasswordSection = ({ token }: ResetPasswordSectionProps) => {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [tokenValidating, setTokenValidating] = useState(true);
  const [resetSuccess, setResetSuccess] = useState(false);
  
  useEffect(() => {
    // Validate token on component mount if token exists
    const validateToken = async () => {
      if (!token) {
        setTokenValid(false);
        setTokenValidating(false);
        return;
      }
      
      try {
        setTokenValidating(true);
        console.log('Validating token:', token);
        
        const response = await fetch(`/api/auth/reset-password?token=${token}`);
        const data = await response.json();
        
        console.log('Token validation response:', data);
        setTokenValid(data.valid);
      } catch (error) {
        console.error('Error validating token:', error);
        setTokenValid(false);
      } finally {
        setTokenValidating(false);
      }
    };
    
    validateToken();
  }, [token]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validasi password
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }
      
      toast.success('Password reset successful!');
      setResetSuccess(true);
      
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
      
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. Please try again.');
      toast.error(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Tampilkan loading saat validasi token
  if (tokenValidating) {
    return (
      <div className="w-full max-w-md mx-auto py-8 px-4">
        <AuthCard title="Reset Password" subtitle="Please wait while we validate your link">
          <div className="flex flex-col items-center justify-center p-10 space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground">Validating reset password link...</p>
          </div>
        </AuthCard>
      </div>
    );
  }
  
  // Tampilkan error jika token tidak valid
  if (!tokenValid) {
    return (
      <div className="w-full max-w-md mx-auto py-8 px-4">
        <AuthCard title="Invalid Link" subtitle="This reset password link is invalid or expired">
          <div className="flex flex-col items-center justify-center p-6 space-y-4">
            <AlertCircle className="h-16 w-16 text-destructive mt-2" />
            <p className="text-center text-muted-foreground">
              The reset password link is invalid or has expired. Please request a new reset password link.
            </p>
            <Button 
              className="w-full mt-4"
              onClick={() => router.push('/auth/forgot-password')}
            >
              Request New Link
            </Button>
          </div>
        </AuthCard>
      </div>
    );
  }
  
  // Tampilkan sukses jika reset password berhasil
  if (resetSuccess) {
    return (
      <div className="w-full max-w-md mx-auto py-8 px-4">
        <AuthCard title="Password Reset Successful" subtitle="Your password has been reset successfully">
          <div className="flex flex-col items-center justify-center p-6 space-y-4">
            <CheckCircle className="h-16 w-16 text-green-600 mt-2" />
            <p className="text-center text-muted-foreground">
              Your password has been reset successfully. You will be redirected to login page in a few seconds.
            </p>
            <Button 
              className="w-full mt-4"
              onClick={() => router.push('/auth/login')}
            >
              Go to Login
            </Button>
          </div>
        </AuthCard>
      </div>
    );
  }
  
  // Form reset password
  return (
    <div className="w-full max-w-md mx-auto py-8 px-4">
      <AuthCard title="Reset Password" subtitle="Enter your new password">
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
            label="New Password"
            type="password"
            id="password"
            placeholder="Enter your new password"
            icon={<Lock size={18} />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <AuthInput
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            placeholder="Confirm your new password"
            icon={<Lock size={18} />}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
                Resetting Password...
              </>
            ) : 'Reset Password'}
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

export default ResetPasswordSection;

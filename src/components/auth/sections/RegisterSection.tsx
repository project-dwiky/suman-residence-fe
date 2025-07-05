"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Lock, User, Phone, Loader2, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AuthInput from '../AuthInput';
import AuthCard from '../AuthCard';
import { toast } from 'sonner';
import { formatPhoneNumber } from '@/utils/format-phonenumber';

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
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [countdown, setCountdown] = useState(4);
  const [emailAlreadyExists, setEmailAlreadyExists] = useState(false);
  const [sendingLink, setSendingLink] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Function to send confirmation link
  const handleSendConfirmationLink = async () => {
    setSendingLink(true);
    setError('');
    
    try {
      const response = await fetch('/api/auth/link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send confirmation link');
      }
      
      toast.success('Confirmation link sent successfully!');
      setRegistrationSuccess(true);
      setEmailAlreadyExists(false);
      
    } catch (err: any) {
      setError(err.message || 'Failed to send confirmation link. Please try again.');
      toast.error(err.message || 'Failed to send confirmation link. Please try again.');
    } finally {
      setSendingLink(false);
    }
  };

  // Timer countdown effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (registrationSuccess && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (registrationSuccess && countdown === 0) {
      router.push('/auth/login?registered=true');
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [registrationSuccess, countdown, router]);
  
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

    const formattedPhone = formatPhoneNumber(formData.phone);
    
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
          phone: formattedPhone,
          password: formData.password,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Handle specific case: email already exists but not verified
        if (data.code === 'EMAIL_ALREADY_EXISTS') {
          setEmailAlreadyExists(true);
          setError('');
          return;
        }
        throw new Error(data.message || 'Registration failed');
      }
      
      toast.success('Registration successful!');
      setRegistrationSuccess(true);
      
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
      toast.error(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Show email already exists message
  if (emailAlreadyExists) {
    return (
      <div className="w-full max-w-md mx-auto py-8 px-4">
        <AuthCard title="Email Already Registered" subtitle="">
          <motion.div 
            className="text-center space-y-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-orange-600" />
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Account Not Activated
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                This email <span className="font-medium text-gray-900">{formData.email}</span> is already registered but hasn't been verified yet. 
                Please check your WhatsApp for the confirmation link or resend it below.
              </p>
            </div>
            
            {error && (
              <div className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-3">
              <Button 
                onClick={handleSendConfirmationLink}
                className="w-full bg-primary text-white hover:bg-primary/90 rounded-lg h-11"
                disabled={sendingLink}
              >
                {sendingLink ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Link...
                  </>
                ) : 'Send Back Confirmation Link'}
              </Button>
              
              <Button 
                onClick={() => {
                  setEmailAlreadyExists(false);
                  setError('');
                }}
                variant="outline"
                className="w-full rounded-lg h-11"
              >
                Back to Registration
              </Button>
            </div>
            
            <div className="text-center text-sm text-muted-foreground">
              Already activated your account?{' '}
              <Link href="/auth/login" className="text-primary hover:underline">
                Sign in here
              </Link>
            </div>
          </motion.div>
        </AuthCard>
      </div>
    );
  }

  // Show success message with countdown
  if (registrationSuccess) {
    return (
      <div className="w-full max-w-md mx-auto py-8 px-4">
        <AuthCard title="Registration Successful!" subtitle="">
          <motion.div 
            className="text-center space-y-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Account Created Successfully!
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                We have sent a confirmation link to your WhatsApp number 
                <span className="font-medium text-gray-900"> {formData.phone}</span> to activate your account. 
                Please check your WhatsApp and click the link to complete your registration.
              </p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                Redirecting to login page in <span className="font-bold text-blue-900">{countdown}</span> seconds...
              </p>
            </div>
            
            <Button 
              onClick={() => router.push('/auth/login?registered=true')}
              className="w-full bg-primary text-white hover:bg-primary/90 rounded-lg h-11"
            >
              Go to Login Now
            </Button>
          </motion.div>
        </AuthCard>
      </div>
    );
  }
  
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
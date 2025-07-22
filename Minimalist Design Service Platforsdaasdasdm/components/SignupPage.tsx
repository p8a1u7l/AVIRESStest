"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Logo from './Logo';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  acceptTerms: boolean;
  marketingEmails: boolean;
}

interface SignupPageProps {
  onSignup: (userData: UserData) => void;
  onNavigateToLogin: () => void;
  onNavigateHome: () => void;
  loading?: boolean;
}

export default function SignupPage({ 
  onSignup, 
  onNavigateToLogin, 
  onNavigateHome, 
  loading = false 
}: SignupPageProps) {
  const [formData, setFormData] = useState<UserData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    acceptTerms: false,
    marketingEmails: false
  });

  const [errors, setErrors] = useState<Partial<UserData>>({});
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors: Partial<UserData> = {};

    // Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    // Terms validation
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loading && validateForm()) {
      onSignup(formData);
    }
  };

  const handleInputChange = (field: keyof UserData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const pageVariants = {
    initial: { 
      opacity: 0, 
      y: 20,
      scale: 0.98
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.23, 1, 0.32, 1]
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: [0.76, 0, 0.24, 1]
      }
    }
  };

  const formVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: 0.2,
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center px-4 py-20"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <motion.div
            className="mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Logo size="md" animated={true} variant="default" />
          </motion.div>
          <h1 className="mb-2">Join AVIRESS</h1>
          <p>Create your account to access premium design services</p>
        </motion.div>

        {/* Signup Form */}
        <motion.div
          className="section-clean"
          variants={formVariants}
        >
          <div className="liquid-glass-bg-hover"></div>
          <div className="relative z-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block mb-2">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`w-full px-4 py-3 bg-white/5 border rounded-lg transition-colors duration-200 ${
                      errors.firstName 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-white/10 focus:border-white/30'
                    }`}
                    placeholder="First name"
                    disabled={loading}
                    autoComplete="given-name"
                  />
                  {errors.firstName && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-sm mt-1"
                    >
                      {errors.firstName}
                    </motion.p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block mb-2">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`w-full px-4 py-3 bg-white/5 border rounded-lg transition-colors duration-200 ${
                      errors.lastName 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-white/10 focus:border-white/30'
                    }`}
                    placeholder="Last name"
                    disabled={loading}
                    autoComplete="family-name"
                  />
                  {errors.lastName && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-sm mt-1"
                    >
                      {errors.lastName}
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-3 bg-white/5 border rounded-lg transition-colors duration-200 ${
                    errors.email 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-white/10 focus:border-white/30'
                  }`}
                  placeholder="Enter your email"
                  disabled={loading}
                  autoComplete="email"
                />
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm mt-1"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full px-4 py-3 pr-12 bg-white/5 border rounded-lg transition-colors duration-200 ${
                      errors.password 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-white/10 focus:border-white/30'
                    }`}
                    placeholder="Create a strong password"
                    disabled={loading}
                    autoComplete="new-password"
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    disabled={loading}
                  >
                    <svg 
                      className="w-5 h-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      {showPassword ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.636 6.636m3.242 3.242l4.242 4.242m0 0L17.364 17.364" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      )}
                    </svg>
                  </motion.button>
                </div>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm mt-1"
                  >
                    {errors.password}
                  </motion.p>
                )}
              </div>

              {/* Checkboxes */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <motion.button
                    type="button"
                    onClick={() => handleInputChange('acceptTerms', !formData.acceptTerms)}
                    className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200 ${
                      formData.acceptTerms 
                        ? 'bg-white/20 border-white/50' 
                        : 'bg-white/5 border-white/20'
                    } ${errors.acceptTerms ? 'border-red-500' : ''}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    disabled={loading}
                  >
                    {formData.acceptTerms && (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </motion.button>
                  <div className="flex-1">
                    <label className="text-sm leading-relaxed">
                      I agree to the <span className="text-primary hover:underline cursor-pointer">Terms of Service</span> and <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>
                    </label>
                    {errors.acceptTerms && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-1"
                      >
                        {errors.acceptTerms}
                      </motion.p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <motion.button
                    type="button"
                    onClick={() => handleInputChange('marketingEmails', !formData.marketingEmails)}
                    className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200 ${
                      formData.marketingEmails 
                        ? 'bg-white/20 border-white/50' 
                        : 'bg-white/5 border-white/20'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    disabled={loading}
                  >
                    {formData.marketingEmails && (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </motion.button>
                  <label className="text-sm leading-relaxed">
                    I would like to receive marketing emails about new designs and features
                  </label>
                </div>
              </div>

              {/* Signup Button */}
              <motion.button
                type="submit"
                className="w-full primary-button-hover"
                whileHover={{ 
                  scale: loading ? 1 : 1.02,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                disabled={loading}
              >
                <div className="liquid-glass-bg-hover"></div>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </span>
              </motion.button>
            </form>

            {/* Footer Links */}
            <div className="mt-8 text-center space-y-4">
              <motion.button
                onClick={onNavigateToLogin}
                className="text-secondary hover:text-primary transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                disabled={loading}
              >
                Already have an account? Sign in
              </motion.button>

              <motion.button
                onClick={onNavigateHome}
                className="block w-full text-secondary hover:text-primary transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                disabled={loading}
              >
                ← Back to Home
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
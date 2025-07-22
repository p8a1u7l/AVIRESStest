"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, User, Zap } from 'lucide-react';
import Logo from './Logo';
import { TEST_ACCOUNTS, canUseTestAccounts, type TestAccount } from '../utils/testAccounts';

interface LoginPageProps {
  onLogin: (email: string, password: string) => void;
  onNavigateToSignup: () => void;
  onNavigateHome: () => void;
  loading?: boolean;
}

export default function LoginPage({ 
  onLogin, 
  onNavigateToSignup, 
  onNavigateHome, 
  loading = false 
}: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showTestAccounts, setShowTestAccounts] = useState(false);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loading && validateForm()) {
      onLogin(email, password);
    }
  };

  const handleTestAccountLogin = (account: TestAccount) => {
    setEmail(account.email);
    setPassword(account.password);
    
    // Auto-submit after a brief delay for better UX
    setTimeout(() => {
      onLogin(account.email, account.password);
    }, 300);
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
          <h1 className="mb-2">Welcome Back</h1>
          <p>Sign in to access your AVIRESS account</p>
        </motion.div>

        {/* Test Accounts Section - Only in development/demo */}
        {canUseTestAccounts() && (
          <motion.div
            className="section-clean mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <div className="liquid-glass-bg-hover"></div>
            <div className="relative z-10">
              <motion.button
                onClick={() => setShowTestAccounts(!showTestAccounts)}
                className="w-full flex items-center justify-between p-4 hover:bg-white/5 rounded-lg transition-colors duration-200"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <div className="text-left">
                    <h4 className="text-sm font-medium">빠른 테스트 로그인</h4>
                    <p className="text-xs text-secondary">데모용 계정으로 바로 체험하기</p>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: showTestAccounts ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
              </motion.button>

              <motion.div
                initial={false}
                animate={{
                  height: showTestAccounts ? 'auto' : 0,
                  opacity: showTestAccounts ? 1 : 0
                }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ overflow: 'hidden' }}
              >
                <div className="pt-4 space-y-3">
                  {TEST_ACCOUNTS.map((account, index) => (
                    <motion.button
                      key={account.email}
                      onClick={() => handleTestAccountLogin(account)}
                      className="w-full p-3 hover:bg-white/5 rounded-lg transition-colors duration-200 text-left border border-white/10 hover:border-white/20"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={loading}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          account.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                          account.role === 'designer' ? 'bg-blue-500/20 text-blue-400' :
                          account.role === 'customer' && account.email.includes('premium') ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          <User className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">{account.displayName}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              account.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                              account.role === 'designer' ? 'bg-blue-500/20 text-blue-400' :
                              account.role === 'customer' && account.email.includes('premium') ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-green-500/20 text-green-400'
                            }`}>
                              {account.role === 'customer' && account.email.includes('premium') ? 'Premium' : account.role}
                            </span>
                          </div>
                          <p className="text-xs text-secondary">{account.description}</p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Login Form */}
        <motion.div
          className="section-clean"
          variants={formVariants}
        >
          <div className="liquid-glass-bg-hover"></div>
          <div className="relative z-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                  }}
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
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
                    }}
                    className={`w-full px-4 py-3 pr-12 bg-white/5 border rounded-lg transition-colors duration-200 ${
                      errors.password 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-white/10 focus:border-white/30'
                    }`}
                    placeholder="Enter your password"
                    disabled={loading}
                    autoComplete="current-password"
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
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

              {/* Login Button */}
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
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </span>
              </motion.button>
            </form>

            {/* Footer Links */}
            <div className="mt-8 text-center space-y-4">
              <motion.button
                onClick={onNavigateToSignup}
                className="text-secondary hover:text-primary transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                disabled={loading}
              >
                Don't have an account? Sign up
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
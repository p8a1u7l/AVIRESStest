"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

interface InitialLoadingProps {
  onComplete?: () => void;
}

export default function InitialLoading({ onComplete }: InitialLoadingProps) {
  useEffect(() => {
    // Lock body scroll during animation
    document.body.style.overflow = 'hidden';

    // Check if this is the first visit
    const hasVisited = sessionStorage.getItem('aviress-visited');
    
    if (hasVisited) {
      // Skip loading animation if already visited but still show briefly
      const quickTimer = setTimeout(() => {
        document.body.style.overflow = 'unset';
        onComplete?.();
      }, 500);
      return () => {
        clearTimeout(quickTimer);
        document.body.style.overflow = 'unset';
      };
    }

    // Mark as visited
    sessionStorage.setItem('aviress-visited', 'true');

    // Total animation timing:
    // Logo fade in: 0.4s
    // Hold period: 1.0s  
    // Fade out: 0.3s
    // Total: ~1.7s
    const timer = setTimeout(() => {
      document.body.style.overflow = 'unset';
      onComplete?.();
    }, 1700);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'unset';
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex items-center justify-center"
        style={{ backgroundColor: '#000000' }}
        initial={{ opacity: 1 }}
        exit={{ 
          opacity: 0,
          transition: { duration: 0.3, ease: 'easeInOut' }
        }}
      >
        {/* Logo with simple fade animation */}
        <motion.div 
          className="w-1/3 min-w-[150px] max-w-[250px]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            transition: {
              duration: 0.4,
              ease: 'easeOut',
              delay: 0.1
            }
          }}
        >
          <Logo 
            size="xl" 
            animated={true}
            variant="transition"
            className="transform-gpu"
          />
        </motion.div>

        {/* Subtle ambient animation during logo display */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 0.05, 0],
            scale: [1, 1.02, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5
          }}
          style={{
            background: 'radial-gradient(circle at center, rgba(255,255,255,0.02) 0%, transparent 50%)'
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
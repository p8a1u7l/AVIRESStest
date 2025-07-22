"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

interface PageTransitionProps {
  isTransitioning: boolean;
  onTransitionComplete: () => void;
}

export default function PageTransition({ isTransitioning, onTransitionComplete }: PageTransitionProps) {
  const [phase, setPhase] = useState<'fadeOut' | 'logoIn' | 'hold' | 'logoOut' | 'complete'>('fadeOut');

  useEffect(() => {
    if (!isTransitioning) return;

    console.log(`🎬 Starting page transition sequence`);

    // Lock body scroll during transition
    document.body.style.overflow = 'hidden';

    const runTransitionSequence = async () => {
      // Phase 1: Current page fade out (300ms)
      console.log(`📤 Phase 1 - Page fade out (300ms)`);
      setPhase('fadeOut');
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Phase 2: Logo fade in (200ms)
      console.log(`🔆 Phase 2 - Logo fade in (200ms)`);
      setPhase('logoIn');
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Phase 3: Hold logo visible (400ms - simple fade animation)
      console.log(`⏳ Phase 3 - Hold logo (400ms)`);
      setPhase('hold');
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Phase 4: Logo fade out (200ms)
      console.log(`🌅 Phase 4 - Logo fade out (200ms)`);
      setPhase('logoOut');
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Phase 5: Complete and restore page
      console.log(`✅ Phase 5 - Transition complete`);
      setPhase('complete');
      document.body.style.overflow = 'unset';
      onTransitionComplete();
    };

    runTransitionSequence();

    // Cleanup function
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isTransitioning, onTransitionComplete]);

  // Don't render anything if not transitioning
  if (!isTransitioning) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="page-transition"
        className="fixed inset-0 z-[9999] flex items-center justify-center"
        style={{ backgroundColor: '#000000' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {/* Logo Container */}
        <AnimatePresence mode="wait">
          {(phase === 'logoIn' || phase === 'hold' || phase === 'logoOut') && (
            <motion.div
              key="transition-logo"
              className="w-1/4 min-w-[120px] max-w-[200px]"
              initial={{ 
                opacity: 0, 
                scale: 0.8
              }}
              animate={{ 
                opacity: phase === 'logoOut' ? 0 : 1,
                scale: phase === 'logoOut' ? 0.8 : 1
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.8
              }}
              transition={{ 
                duration: phase === 'logoIn' ? 0.2 : phase === 'logoOut' ? 0.2 : 0,
                ease: 'easeInOut'
              }}
            >
              {/* Simple Fade Logo Animation */}
              <Logo 
                size="xl" 
                animated={true}
                variant="transition"
                className="transform-gpu"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
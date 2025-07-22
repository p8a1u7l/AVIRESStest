"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from './PageTransition';
import InitialLoading from './InitialLoading';

interface TransitionContextType {
  navigateWithTransition: (callback: () => void) => void;
  isTransitioning: boolean;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export const useTransition = () => {
  const context = useContext(TransitionContext);
  if (context === undefined) {
    throw new Error('useTransition must be used within a TransitionProvider');
  }
  return context;
};

interface TransitionProviderProps {
  children: ReactNode;
}

export default function TransitionProvider({ children }: TransitionProviderProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);
  const [showInitialLoading, setShowInitialLoading] = useState(true);
  const [appReady, setAppReady] = useState(false);

  const navigateWithTransition = useCallback((callback: () => void) => {
    console.log(`🔄 Navigation with transition requested`);
    
    // Prevent multiple transitions
    if (isTransitioning) {
      console.log(`⚠️ Already transitioning, ignoring`);
      return;
    }
    
    console.log(`✅ Starting transition sequence`);
    setIsTransitioning(true);
    setPendingNavigation(() => callback);
  }, [isTransitioning]);

  const handleTransitionComplete = useCallback(() => {
    console.log(`🎯 Transition complete - executing navigation callback`);
    
    setIsTransitioning(false);
    if (pendingNavigation) {
      console.log(`📞 Executing pending navigation`);
      pendingNavigation();
      setPendingNavigation(null);
      console.log(`✅ Navigation completed`);
    }
  }, [pendingNavigation]);

  const handleInitialLoadingComplete = useCallback(() => {
    console.log(`🚀 Initial loading complete - app ready`);
    setShowInitialLoading(false);
    setAppReady(true);
  }, []);

  return (
    <TransitionContext.Provider value={{ navigateWithTransition, isTransitioning }}>
      <div className="relative min-h-screen">
        {/* Initial Loading with Drawing Animation */}
        {showInitialLoading && (
          <InitialLoading onComplete={handleInitialLoadingComplete} />
        )}
        
        {/* Main App Content */}
        {appReady && (
          <AnimatePresence mode="wait">
            {!isTransitioning && (
              <motion.div
                key="app-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                {children}
              </motion.div>
            )}
          </AnimatePresence>
        )}
        
        {/* Page Transitions with Logo Animation */}
        {appReady && (
          <PageTransition 
            isTransitioning={isTransitioning}
            onTransitionComplete={handleTransitionComplete}
          />
        )}
      </div>
    </TransitionContext.Provider>
  );
}
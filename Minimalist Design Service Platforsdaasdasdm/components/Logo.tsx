"use client";

import { motion } from 'framer-motion';
import svgPaths from "../imports/svg-p4niezbumf";

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  variant?: 'header' | 'transition' | 'default';
}

export default function Logo({ 
  className = '', 
  size = 'md', 
  animated = true,
  variant = 'default'
}: LogoProps) {
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  // For page transitions, use larger size
  const effectiveSize = variant === 'transition' ? 'xl' : size;

  const logoVariants = {
    initial: { 
      opacity: 0,
      scale: 0.9
    },
    animate: { 
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: 'easeInOut'
      }
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1
      }
    }
  };

  // Fade in animation for transition variant
  const transitionVariants = {
    initial: { 
      opacity: 0,
      scale: 0.8
    },
    animate: { 
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: 'easeOut'
      }
    }
  };

  return (
    <motion.div
      className={`${sizeClasses[effectiveSize]} ${className} relative cursor-pointer select-none`}
      variants={animated ? (variant === 'transition' ? transitionVariants : logoVariants) : undefined}
      initial={animated ? 'initial' : undefined}
      animate={animated ? 'animate' : undefined}
      whileHover={animated && variant !== 'transition' ? 'hover' : undefined}
      whileTap={animated && variant !== 'transition' ? 'tap' : undefined}
    >
      <motion.div
        className="relative size-full"
        style={{ background: 'transparent' }}
      >
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 290 247"
        >
          <g clipPath="url(#clip0_3_164)">
            <motion.path
              d={svgPaths.p1c5d7100}
              fill="#ffffff"
              stroke="none"
              initial={animated ? { opacity: 0, scale: 0.9 } : undefined}
              animate={animated ? { opacity: 1, scale: 1 } : undefined}
              transition={animated ? { duration: 0.4, ease: 'easeOut' } : undefined}
              style={variant === 'header' ? {
                filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5))'
              } : undefined}
            />
          </g>
          <defs>
            <clipPath id="clip0_3_164">
              <rect fill="white" height="246.2" width="289.36" />
            </clipPath>
          </defs>
        </svg>
      </motion.div>
      
      {/* Additional glow effect on hover */}
      {animated && variant !== 'transition' && (
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-full"
          initial={{ opacity: 0 }}
          whileHover={{ 
            opacity: 1,
            boxShadow: '0 0 20px rgba(255,255,255,0.2)'
          }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
}
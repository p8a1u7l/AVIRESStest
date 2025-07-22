"use client";

import { motion } from 'framer-motion';
import { Users, Palette, CreditCard, Type, MessageCircle } from 'lucide-react';

interface QuickLink {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: string;
}

interface QuickLinksProps {
  onNavigate?: (action: string) => void;
}

export default function QuickLinks({ onNavigate }: QuickLinksProps) {
  const quickLinks: QuickLink[] = [
    {
      id: 'browse-designers',
      title: 'Browse All Designers',
      description: 'Explore our curated collection of exceptional designers',
      icon: <Users className="w-6 h-6" />,
      action: 'designers'
    },
    {
      id: 'logo-design',
      title: 'Logo Design',
      description: 'Professional logo design services for your brand',
      icon: <Palette className="w-6 h-6" />,
      action: 'logo-design'
    },
    {
      id: 'business-cards',
      title: 'Business Cards',
      description: 'Premium business card design and printing',
      icon: <CreditCard className="w-6 h-6" />,
      action: 'business-cards'
    },
    {
      id: 'buy-fonts',
      title: 'Buy Fonts',
      description: 'Instant download of premium typography',
      icon: <Type className="w-6 h-6" />,
      action: 'font-purchase'
    },
    {
      id: 'public-projects',
      title: 'Public Projects',
      description: 'Post your project publicly and get multiple proposals',
      icon: <MessageCircle className="w-6 h-6" />,
      action: 'public-projects'
    }
  ];

  const handleLinkClick = (action: string) => {
    console.log(`🎯 QuickLinks: Navigating to ${action}`);
    onNavigate?.(action);
  };

  // Clean Animation Variants
  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    initial: { 
      opacity: 0, 
      y: 40,
      scale: 0.95
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const cardVariants = {
    initial: { 
      scale: 1,
      z: 0
    },
    hover: { 
      scale: 1.02,
      z: 20,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-24 border-t">
      <div className="container mx-auto px-8">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8"
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          {quickLinks.map((link, index) => (
            <motion.div
              key={link.id}
              variants={itemVariants}
              className="group cursor-pointer"
              onClick={() => handleLinkClick(link.action)}
            >
              {/* Clean Card with automatic liquid glass */}
              <motion.div
                variants={cardVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                className="simple-card relative overflow-hidden h-full"
                style={{
                  willChange: 'transform',
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* Content Container */}
                <div className="relative z-10 p-8 flex flex-col items-center text-center space-y-6 h-full">
                  {/* Icon with Motion */}
                  <motion.div 
                    className="group-hover:opacity-90 transition-all duration-300"
                    whileHover={{ 
                      scale: 1.1,
                      rotate: 5,
                      transition: { duration: 0.3 }
                    }}
                  >
                    {link.icon}
                  </motion.div>
                  
                  {/* Text Content */}
                  <div className="space-y-3 flex-1 flex flex-col justify-center">
                    <motion.h3 
                      className="group-hover:opacity-90 transition-colors duration-300"
                      whileHover={{ 
                        scale: 1.02,
                        transition: { duration: 0.2 }
                      }}
                    >
                      {link.title}
                    </motion.h3>
                    <motion.p 
                      className="leading-relaxed group-hover:opacity-90 transition-colors duration-300"
                      initial={{ opacity: 0.8 }}
                      whileHover={{ opacity: 1 }}
                    >
                      {link.description}
                    </motion.p>
                  </div>

                  {/* Subtle CTA Indicator */}
                  <motion.div
                    className="w-8 h-0.5 bg-current group-hover:opacity-100 transition-colors duration-300 opacity-0 group-hover:opacity-100"
                    initial={{ width: 0 }}
                    whileHover={{ 
                      width: 32,
                      transition: { duration: 0.3, delay: 0.1 }
                    }}
                  />
                </div>

                {/* Hover Glow Effect */}
                <motion.div
                  className="absolute inset-0 rounded-20px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'linear-gradient(135deg, rgba(100, 116, 139, 0.05) 0%, rgba(100, 116, 139, 0.02) 100%)',
                    boxShadow: '0 0 30px rgba(100, 116, 139, 0.1)'
                  }}
                />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Section Footer with automatic liquid glass */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.6, 
            delay: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        >
          <div className="section-clean max-w-2xl mx-auto">
            <div className="relative z-10 text-center">
              <motion.p 
                className="leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                Need something custom? Our designers are ready to bring your vision to life with 
                personalized solutions tailored to your brand.
              </motion.p>
              
              <motion.button
                onClick={() => handleLinkClick('designers')}
                className="primary-button-hover mt-6"
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                <span className="relative z-10 font-medium">
                  Start Custom Project
                </span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
"use client";

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ExternalLink, Download, Share2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PortfolioItem {
  id: string;
  title: string;
  designer: string;
  category: string;
  imageUrl: string;
  isLiked?: boolean;
  description?: string;
  price?: number;
  tags?: string[];
  features?: string[];
}

interface DesignerInfo {
  name: string;
  specialty: string;
  bio: string;
  profileImage?: string;
  location?: string;
  experience?: string;
}

interface DesignerPortfolioPageProps {
  designerName: string;
  items: PortfolioItem[];
  onLike: (itemId: string) => void;
  onBack: () => void;
  onItemClick: (product: PortfolioItem) => void;
  onPurchase: (product: PortfolioItem) => void;
  isLoggedIn: boolean;
}

export default function DesignerPortfolioPage({ 
  designerName, 
  items, 
  onLike, 
  onBack,
  onItemClick,
  onPurchase,
  isLoggedIn
}: DesignerPortfolioPageProps) {
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  
  // Add null check and use items directly (already filtered in App.tsx)
  const designerItems = items || [];
  
  // Mock designer info - in real app, this would come from API
  const designerInfo: DesignerInfo = {
    name: designerName,
    specialty: getDesignerSpecialty(designerName),
    bio: getDesignerBio(designerName),
    location: getDesignerLocation(designerName),
    experience: getDesignerExperience(designerName)
  };

  function getDesignerSpecialty(name: string): string {
    const specialties: { [key: string]: string } = {
      'Sarah Chen': 'Minimalist Brand Identity',
      'Alex Rivera': 'Typography & Digital Interfaces',
      'Maria Santos': 'Luxury Business Card Design',
      'David Kim': 'Architectural Branding',
      'Emma Johnson': 'Editorial Typography',
      'Carlos Rodriguez': 'Restaurant & Hospitality Branding',
      'Lisa Zhang': 'Creative Studio Design',
      'Ryan Mitchell': 'Tech Startup Branding',
      'Sophia Williams': 'Luxury Fashion Typography',
      'Michael Brown': 'Corporate Identity Systems',
      'Isabella Garcia': 'Artisanal Print Design',
      'James Taylor': 'Display Typography & Lettering'
    };
    return specialties[name] || 'Brand & Visual Identity';
  }

  function getDesignerBio(name: string): string {
    const bios: { [key: string]: string } = {
      'Sarah Chen': 'Award-winning designer specializing in clean, geometric brand identities for tech startups and modern businesses.',
      'Alex Rivera': 'Typography expert with 8+ years creating custom typefaces for digital platforms and brand systems.',
      'Maria Santos': 'Luxury design specialist crafting premium business cards and stationery with exceptional attention to detail.',
      'David Kim': 'Architectural background brings structural thinking to bold, construction-inspired brand identities.',
      'Emma Johnson': 'Editorial designer creating elegant serif typefaces perfect for publishing and luxury brands.',
      'Carlos Rodriguez': 'Hospitality branding expert bringing warmth and authenticity to restaurant and food brands.'
    };
    return bios[name] || 'Passionate designer creating impactful visual identities and memorable brand experiences.';
  }

  function getDesignerLocation(name: string): string {
    const locations: { [key: string]: string } = {
      'Sarah Chen': 'San Francisco, CA',
      'Alex Rivera': 'New York, NY',
      'Maria Santos': 'Los Angeles, CA',
      'David Kim': 'Seattle, WA',
      'Emma Johnson': 'Portland, OR',
      'Carlos Rodriguez': 'Austin, TX'
    };
    return locations[name] || 'Remote';
  }

  function getDesignerExperience(name: string): string {
    const experiences: { [key: string]: string } = {
      'Sarah Chen': '6+ years',
      'Alex Rivera': '8+ years',
      'Maria Santos': '5+ years',
      'David Kim': '7+ years',
      'Emma Johnson': '4+ years',
      'Carlos Rodriguez': '9+ years'
    };
    return experiences[name] || '5+ years';
  }

  const handleItemClick = (item: PortfolioItem) => {
    setSelectedItem(item);
  };

  const handleViewDetails = (item: PortfolioItem) => {
    onItemClick(item);
  };

  // Optimized handleLikeClick with useCallback
  const handleLikeClick = useCallback((e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    onLike(itemId);
  }, [onLike]);

  // Apple Liquid Glass Animation Variants
  const pageVariants = {
    initial: { 
      opacity: 0, 
      y: 40,
      scale: 0.98,
      filter: "blur(4px)"
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.6,
        ease: [0.23, 1, 0.32, 1],
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      scale: 1.02,
      filter: "blur(2px)",
      transition: {
        duration: 0.4,
        ease: [0.76, 0, 0.24, 1]
      }
    }
  };

  const staggerContainer = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.2
      }
    }
  };

  const staggerItem = {
    initial: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const liquidGlassCardVariants = {
    initial: { 
      scale: 1,
      rotateY: 0,
      z: 0
    },
    hover: { 
      scale: 1.01,
      rotateY: 0.5,
      z: 20,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    tap: {
      scale: 0.99,
      transition: {
        duration: 0.1,
        ease: "easeOut"
      }
    }
  };

  // Optimized Heart Button Component
  const HeartButton = ({ item, onClick }: { item: PortfolioItem, onClick: (e: React.MouseEvent, id: string) => void }) => {
    const handleClick = useCallback((e: React.MouseEvent) => {
      onClick(e, item.id);
    }, [item.id, onClick]);

    return (
      <motion.button
        onClick={handleClick}
        className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center transition-all duration-300"
        whileHover={{ 
          scale: 1.15,
          transition: { duration: 0.2 }
        }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.div
          animate={item.isLiked ? {
            scale: [1, 1.3, 1],
            rotate: [0, 8, -4, 0]
          } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <svg 
            className={`w-5 h-5 transition-all duration-300 ${
              item.isLiked 
                ? 'fill-white text-white' 
                : 'fill-none text-white/70 hover:text-white stroke-2'
            }`}
            fill={item.isLiked ? 'currentColor' : 'none'}
            stroke="currentColor" 
            strokeWidth={item.isLiked ? 0 : 2}
            viewBox="0 0 24 24"
            style={{
              filter: item.isLiked 
                ? 'drop-shadow(0 0 8px rgba(255,255,255,0.6)) drop-shadow(0 2px 6px rgba(0,0,0,0.8)) drop-shadow(0 4px 12px rgba(0,0,0,0.4))' 
                : 'drop-shadow(0 2px 4px rgba(0,0,0,0.8)) drop-shadow(0 1px 2px rgba(0,0,0,0.9))'
            }}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
            />
          </svg>
        </motion.div>
      </motion.button>
    );
  };

  return (
    <motion.div
      className="pt-20 min-h-screen"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="container mx-auto px-8 py-8">
        {/* Back Button with Liquid Glass - 클릭 가능하도록 수정 */}
        <motion.div
          variants={staggerItem}
          className="mb-8"
        >
          <motion.button
            onClick={onBack}
            className="liquid-glass-button focus-none relative"
            style={{ zIndex: 1002 }}
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="liquid-glass-bg-hover"></div>
            <span className="relative z-10 flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Designers
            </span>
          </motion.button>
        </motion.div>

        {/* Designer Header with Liquid Glass */}
        <motion.div
          variants={staggerItem}
          className="mb-12"
        >
          <div className="liquid-glass-section">
            <div className="absolute inset-0 liquid-glass-bg"></div>
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
                <div className="flex-1">
                  <h1 className="mb-2">{designerInfo.name}</h1>
                  <p className="mb-3">{designerInfo.specialty}</p>
                  <p className="leading-relaxed max-w-2xl">
                    {designerInfo.bio}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <div>📍 {designerInfo.location}</div>
                  <div>⏱️ {designerInfo.experience} experience</div>
                  <div>🎨 {designerItems.length} projects</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Portfolio Grid with Liquid Glass */}
        <motion.div
          variants={staggerContainer}
          className="space-y-8"
        >
          <div className="masonry-grid">
            {designerItems.map((item, index) => (
              <motion.div
                key={item.id}
                variants={staggerItem}
                className="masonry-item group cursor-pointer"
                onClick={() => handleItemClick(item)}
              >
                {/* Apple Liquid Glass Card */}
                <motion.div
                  variants={liquidGlassCardVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  className="liquid-glass-card relative overflow-hidden"
                  style={{
                    willChange: 'transform',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {/* Liquid Glass Background */}
                  <div className="absolute inset-0 liquid-glass-bg"></div>
                  
                  {/* Content Container */}
                  <div className="relative z-10">
                    {/* Image Container */}
                    <motion.div 
                      className="relative overflow-hidden"
                      whileHover={{ 
                        scale: 1.03,
                        transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
                      }}
                    >
                      <ImageWithFallback
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-auto object-cover transition-all duration-500 group-hover:brightness-110"
                      />
                      
                      {/* Gradient Overlay */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100"
                        transition={{ duration: 0.3 }}
                      />
                      
                      {/* White Heart Button */}
                      <HeartButton item={item} onClick={handleLikeClick} />

                      {/* Price Tag */}
                      {item.price && (
                        <motion.div
                          className="absolute top-3 left-3 liquid-glass-price-tag"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 }}
                        >
                          <span className="font-medium">${item.price}</span>
                        </motion.div>
                      )}

                      {/* Hover Actions */}
                      <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(item);
                          }}
                          className="w-8 h-8 liquid-glass-heart-button flex items-center justify-center hover:opacity-80"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          className="w-8 h-8 liquid-glass-heart-button flex items-center justify-center hover:opacity-80"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Share2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </motion.div>

                    {/* Content */}
                    <motion.div 
                      className="p-5"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.4 }}
                    >
                      <motion.h3 
                        className="mb-2 tracking-tight"
                        whileHover={{ x: 3, transition: { duration: 0.2 } }}
                      >
                        {item.title}
                      </motion.h3>
                      <motion.p 
                        className="line-clamp-2 mb-4 leading-relaxed"
                        initial={{ opacity: 0.8 }}
                        whileHover={{ opacity: 1 }}
                      >
                        {item.description}
                      </motion.p>
                      <div className="flex items-center justify-between">
                        <motion.span 
                          className="liquid-glass-tag"
                        >
                          {item.category}
                        </motion.span>
                        <div className="flex items-center gap-1">
                          <svg 
                            className={`w-3 h-3 ${
                              item.isLiked 
                                ? 'fill-white text-white' 
                                : 'fill-none stroke-current'
                            }`}
                            fill={item.isLiked ? 'currentColor' : 'none'}
                            stroke="currentColor" 
                            strokeWidth={item.isLiked ? 0 : 2}
                            viewBox="0 0 24 24"
                            style={{
                              filter: item.isLiked 
                                ? 'drop-shadow(0 0 4px rgba(255,255,255,0.5)) drop-shadow(0 1px 3px rgba(0,0,0,0.8))' 
                                : 'drop-shadow(0 1px 2px rgba(0,0,0,0.6))'
                            }}
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                            />
                          </svg>
                          <span>{item.isLiked ? '1' : '0'}</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Empty State with Liquid Glass */}
        {designerItems.length === 0 && (
          <motion.div
            variants={staggerItem}
            className="text-center py-20"
          >
            <div className="liquid-glass-section max-w-md mx-auto">
              <div className="absolute inset-0 liquid-glass-bg"></div>
              <div className="relative z-10 text-center">
                <h3 className="mb-4">No Portfolio Items</h3>
                <p>
                  This designer hasn't uploaded any work yet.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Lightbox Modal with Liquid Glass */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-8 liquid-glass-transition-overlay"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="liquid-glass-modal max-w-4xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col md:flex-row h-full">
                {/* Image */}
                <div className="flex-1 relative">
                  <ImageWithFallback
                    src={selectedItem.imageUrl}
                    alt={selectedItem.title}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="absolute top-4 right-4 w-8 h-8 liquid-glass-heart-button flex items-center justify-center hover:opacity-80 transition-colors"
                  >
                    ×
                  </button>
                </div>

                {/* Content */}
                <div className="w-full md:w-80 p-6 flex flex-col">
                  <div className="flex-1">
                    <h2 className="mb-2">{selectedItem.title}</h2>
                    <p className="mb-4">by {selectedItem.designer}</p>
                    <p className="mb-6 leading-relaxed">
                      {selectedItem.description}
                    </p>
                    <div className="flex items-center gap-2 mb-6">
                      <span className="liquid-glass-tag">
                        {selectedItem.category}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <motion.button
                      onClick={(e) => handleLikeClick(e, selectedItem.id)}
                      className={`liquid-glass-secondary-button p-3 ${
                        selectedItem.isLiked ? 'opacity-100' : 'opacity-80'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg 
                        className={`w-4 h-4 ${
                          selectedItem.isLiked 
                            ? 'fill-white text-white' 
                            : 'fill-none stroke-current'
                        }`}
                        fill={selectedItem.isLiked ? 'currentColor' : 'none'}
                        stroke="currentColor" 
                        strokeWidth={selectedItem.isLiked ? 0 : 2}
                        viewBox="0 0 24 24"
                        style={{
                          filter: selectedItem.isLiked 
                            ? 'drop-shadow(0 0 6px rgba(255,255,255,0.6)) drop-shadow(0 2px 4px rgba(0,0,0,0.8))' 
                            : 'drop-shadow(0 1px 3px rgba(0,0,0,0.7))'
                        }}
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                        />
                      </svg>
                    </motion.button>
                    
                    <motion.button
                      onClick={() => onPurchase(selectedItem)}
                      className="flex-1 liquid-glass-primary-button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-center gap-2">
                        {isLoggedIn ? 'Purchase' : 'Login to Purchase'}
                        {selectedItem.price && <span>${selectedItem.price}</span>}
                      </div>
                    </motion.button>
                    
                    <motion.button 
                      className="liquid-glass-secondary-button p-3"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Download className="w-4 h-4" />
                    </motion.button>
                    <motion.button 
                      className="liquid-glass-secondary-button p-3"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Share2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
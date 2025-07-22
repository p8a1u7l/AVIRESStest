"use client";

import { useState, useEffect } from 'react';
import { Heart, Eye, X, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { Dialog, DialogContent } from './ui/dialog';

interface PortfolioItem {
  id: string;
  title: string;
  designer: string;
  category: string;
  imageUrl: string;
  isLiked?: boolean;
  description?: string;
  likes?: number;
  designerAvatar?: string;
}

interface PortfolioGridProps {
  items: PortfolioItem[];
  onLike?: (itemId: string) => void;
  onItemClick?: (item: PortfolioItem) => void;
  onDesignerClick?: (designerName: string) => void;
  onPurchase?: (item: PortfolioItem) => void;
  isLoggedIn?: boolean;
}

export default function PortfolioGrid({ 
  items, 
  onLike, 
  onItemClick,
  onDesignerClick,
  onPurchase,
  isLoggedIn = false 
}: PortfolioGridProps) {
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Enhanced items with likes count
  const enhancedItems = items.map(item => ({
    ...item,
    likes: item.likes || Math.floor(Math.random() * 150) + 5,
    designerAvatar: item.designerAvatar || `https://images.unsplash.com/photo-${
      ['1535713875002-d1d0cf227877', '1494790108755-2616c96ac1b3', '1527980965255-f85e5c88d7c5'][
        Math.floor(Math.random() * 3)
      ]
    }?w=40&h=40&fit=crop&crop=face`
  }));

  const handleLike = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    if (isLoggedIn) {
      onLike?.(itemId);
    } else {
      setShowLoginPrompt(true);
    }
  };

  const handleItemClick = (item: PortfolioItem, index: number) => {
    // 외부 핸들러가 있으면 그것을 사용, 없으면 내부 라이트박스 사용
    if (onItemClick) {
      onItemClick(item);
    } else {
      setSelectedItem(item);
      setSelectedIndex(index);
    }
  };

  const navigateToNext = () => {
    const nextIndex = (selectedIndex + 1) % enhancedItems.length;
    setSelectedIndex(nextIndex);
    setSelectedItem(enhancedItems[nextIndex]);
  };

  const navigateToPrevious = () => {
    const prevIndex = selectedIndex === 0 ? enhancedItems.length - 1 : selectedIndex - 1;
    setSelectedIndex(prevIndex);
    setSelectedItem(enhancedItems[prevIndex]);
  };

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedItem]);

  return (
    <>
      {/* Pinterest-Style Masonry Grid - 컨테이너 중복 제거 */}
      <div className="masonry-grid">
          {enhancedItems.map((item, index) => (
            <motion.div
              key={item.id}
              className="masonry-item group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.05,
                ease: 'easeOut'
              }}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => handleItemClick(item, index)}
            >
              {/* UPDATED: Added simple-card class for liquid glass effect */}
              <div className="simple-card group relative overflow-hidden">
                <div className="liquid-glass-bg-hover"></div>
                <div className="relative z-10">
                  {/* Main Image */}
                  <div className="relative">
                    <ImageWithFallback
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-auto object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                    
                    {/* Hover Overlay */}
                    <AnimatePresence>
                      {hoveredItem === item.id && (
                        <motion.div
                          className="absolute inset-0 bg-black/60 flex items-center justify-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                          {/* Center Actions */}
                          <div className="flex items-center space-x-4">
                            {/* Like Button - UPDATED: Added heart-button-clean class */}
                            <motion.button
                              className={`heart-button-clean ${
                                item.isLiked 
                                  ? 'bg-red-500/20 text-red-400' 
                                  : 'bg-white/20 text-white hover:bg-white/30'
                              }`}
                              onClick={(e) => handleLike(e, item.id)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                            >
                              <div className="liquid-glass-bg-hover"></div>
                              <Heart 
                                className={`w-5 h-5 relative z-10 transition-all duration-200 ${
                                  item.isLiked ? 'fill-current' : ''
                                }`} 
                              />
                            </motion.button>

                            {/* View Details Button - UPDATED: Added standard-button class */}
                            <motion.button
                              className="standard-button flex items-center space-x-2"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              initial={{ scale: 0, y: 10 }}
                              animate={{ scale: 1, y: 0 }}
                              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                            >
                              <div className="liquid-glass-bg-hover"></div>
                              <div className="relative z-10 flex items-center space-x-2">
                                <Eye className="w-4 h-4" />
                                <span className="text-sm font-medium">View Details</span>
                              </div>
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Info Footer */}
                  <div className="p-4 space-y-3">
                    {/* Designer Info */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDesignerClick?.(item.designer);
                        }}
                        className="flex items-center space-x-3 flex-1 min-w-0 hover:opacity-80 transition-opacity"
                      >
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-secondary flex-shrink-0">
                          {item.designerAvatar ? (
                            <ImageWithFallback
                              src={item.designerAvatar}
                              alt={item.designer}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <User className="w-4 h-4 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-sm font-medium text-foreground truncate">
                            {item.designer}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {item.category}
                          </p>
                        </div>
                      </button>
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        <Heart className="w-3 h-3" />
                        <span className="text-xs">{item.likes}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <p className="text-sm text-foreground line-clamp-1">
                      {item.title}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {/* Close Button - UPDATED: Added standard-button class */}
            <motion.button
              className="standard-button absolute top-6 right-6 z-10"
              onClick={() => setSelectedItem(null)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="liquid-glass-bg-hover"></div>
              <X className="w-6 h-6 relative z-10" />
            </motion.button>

            {/* Navigation Arrows */}
            {enhancedItems.length > 1 && (
              <>
                <motion.button
                  className="standard-button absolute left-6 top-1/2 -translate-y-1/2 z-10"
                  onClick={navigateToPrevious}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="liquid-glass-bg-hover"></div>
                  <ChevronLeft className="w-6 h-6 relative z-10" />
                </motion.button>

                <motion.button
                  className="standard-button absolute right-6 top-1/2 -translate-y-1/2 z-10"
                  onClick={navigateToNext}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="liquid-glass-bg-hover"></div>
                  <ChevronRight className="w-6 h-6 relative z-10" />
                </motion.button>
              </>
            )}

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row items-center justify-center max-w-7xl w-full mx-auto px-6 py-12 space-y-8 lg:space-y-0 lg:space-x-12">
              {/* Image */}
              <motion.div
                className="flex-1 flex items-center justify-center max-w-4xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <ImageWithFallback
                  src={selectedItem.imageUrl}
                  alt={selectedItem.title}
                  className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                />
              </motion.div>

              {/* Details Sidebar */}
              <motion.div
                className="w-full lg:w-80 space-y-6 text-white"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
              >
                {/* Designer Info */}
                <button
                  onClick={() => {
                    onDesignerClick?.(selectedItem.designer);
                    setSelectedItem(null); // 모달 닫기
                  }}
                  className="flex items-center space-x-4 hover:opacity-80 transition-opacity"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-white/10">
                    {selectedItem.designerAvatar ? (
                      <ImageWithFallback
                        src={selectedItem.designerAvatar}
                        alt={selectedItem.designer}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white/60" />
                      </div>
                    )}
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium">{selectedItem.designer}</h3>
                    <p className="text-white/60 text-sm">{selectedItem.category}</p>
                  </div>
                </button>

                {/* Title */}
                <h2 className="text-xl font-medium">{selectedItem.title}</h2>

                {/* Stats */}
                <div className="flex items-center space-x-6 text-white/80">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">{selectedItem.likes} likes</span>
                  </div>
                </div>

                {/* Description */}
                {selectedItem.description && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-white/90">Description</h4>
                    <p className="text-white/70 text-sm leading-relaxed">
                      {selectedItem.description}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center space-x-3 pt-4">
                  {isLoggedIn && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => handleLike(e, selectedItem.id)}
                      className={`border-white/20 hover:bg-white/10 ${
                        selectedItem.isLiked 
                          ? 'text-red-400 border-red-400/50' 
                          : 'text-white hover:text-white'
                      }`}
                    >
                      <Heart className={`w-4 h-4 mr-2 ${selectedItem.isLiked ? 'fill-current' : ''}`} />
                      {selectedItem.isLiked ? 'Liked' : 'Like'}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    className="bg-white text-black hover:bg-white/90"
                    onClick={() => {
                      onPurchase?.(selectedItem);
                      setSelectedItem(null); // 모달 닫기
                    }}
                  >
                    Purchase Design
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Prompt Modal */}
      <Dialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt}>
        <DialogContent className="section-clean">
          <div className="liquid-glass-bg-hover"></div>
          <div className="relative z-10 text-center space-y-4 py-4">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-medium">Like this design?</h3>
            <p className="text-muted-foreground">
              Sign in to save your favorite designs and get personalized recommendations.
            </p>
            <div className="flex space-x-3 pt-4">
              <Button 
                className="flex-1 primary-button-hover"
                onClick={() => setShowLoginPrompt(false)}
              >
                <div className="liquid-glass-bg-hover"></div>
                <span className="relative z-10">Sign In</span>
              </Button>
              <Button 
                variant="outline" 
                className="standard-button"
                onClick={() => setShowLoginPrompt(false)}
              >
                <div className="liquid-glass-bg-hover"></div>
                <span className="relative z-10">Maybe Later</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
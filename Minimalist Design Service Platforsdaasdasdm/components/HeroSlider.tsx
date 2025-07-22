"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PortfolioItem {
  id: string;
  title: string;
  designer: string;
  imageUrl: string;
  price: number;
  category: string;
  description: string;
  isLiked: boolean;
  tags?: string[];
  features?: string[];
}

interface SlideData {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  ctaText: string;
  ctaAction: string;
  secondaryCtaText?: string;
  secondaryCtaAction?: string;
}

interface HeroSliderProps {
  portfolioItems?: PortfolioItem[];
  onNavigate?: (action: string) => void;
  autoSlideInterval?: number;
}

export default function HeroSlider({ 
  portfolioItems = [], 
  onNavigate, 
  autoSlideInterval = 7000 
}: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // 포트폴리오 아이템을 슬라이드 데이터로 변환
  const slides: SlideData[] = portfolioItems.slice(0, 5).map((item, index) => ({
    id: item.id,
    title: item.title,
    description: `Designed by ${item.designer} • ${item.category} • ${item.price}`,
    imageUrl: item.imageUrl,
    ctaText: 'Explore Design',
    ctaAction: 'products',
    secondaryCtaText: index % 2 === 0 ? 'View Designer' : 'Browse Category',
    secondaryCtaAction: index % 2 === 0 ? 'designers' : item.category.toLowerCase().replace(/\s+/g, '-')
  }));

  const nextSlide = useCallback(() => {
    if (slides.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    if (slides.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }
  }, [slides.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    if (!isPaused && !isHovered) {
      const interval = setInterval(nextSlide, autoSlideInterval);
      return () => clearInterval(interval);
    }
  }, [nextSlide, autoSlideInterval, isPaused, isHovered]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === ' ') {
        e.preventDefault();
        setIsPaused(!isPaused);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, isPaused]);

  const handleCTAClick = (action: string) => {
    onNavigate?.(action);
  };

  // 데이터가 없거나 로딩 중일 때 기본 슬라이더 표시
  if (!portfolioItems.length || slides.length === 0) {
    return (
      <section className="relative w-full h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-8">
            <motion.div 
              className="max-w-4xl mx-auto text-center space-y-8"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.2,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              <div className="space-y-6">
                <motion.h1 
                  className="text-4xl md:text-6xl lg:text-7xl tracking-tight text-white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.4,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                >
                  Welcome to AVIRESS
                </motion.h1>
                <motion.p 
                  className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.5,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                >
                  Premium design services platform for creative professionals
                </motion.p>
              </div>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.6,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              >
                <motion.button
                  onClick={() => onNavigate?.('products')}
                  className="liquid-glass-primary-button px-8 py-4 text-lg"
                  whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10 text-white font-medium">
                    Explore Designs
                  </span>
                </motion.button>

                <motion.button
                  onClick={() => onNavigate?.('designers')}
                  className="liquid-glass-secondary-button px-8 py-4 text-lg"
                  whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10 text-white/90 font-medium">
                    Meet Designers
                  </span>
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      className="relative w-full h-screen overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <motion.div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-105'
            }`}
            style={{ zIndex: index === currentSlide ? 1 : 0 }}
          >
            {/* Background Image */}
            <div className="absolute inset-0 transform transition-transform duration-[8000ms] ease-linear hover:scale-105">
              <ImageWithFallback
                src={slide.imageUrl}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Dark Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />

            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="container mx-auto px-8">
                <motion.div 
                  className="max-w-4xl mx-auto text-center space-y-8"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: 0.2,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                >
                  <div className="space-y-6">
                    <motion.h1 
                      className="text-4xl md:text-6xl lg:text-7xl tracking-tight text-white"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.6, 
                        delay: 0.4,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }}
                    >
                      {slide.title}
                    </motion.h1>
                    <motion.p 
                      className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.6, 
                        delay: 0.5,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }}
                    >
                      {slide.description}
                    </motion.p>
                  </div>

                  <motion.div 
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: 0.6,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                  >
                    {/* Primary CTA with Liquid Glass */}
                    <motion.button
                      onClick={() => handleCTAClick(slide.ctaAction)}
                      className="liquid-glass-primary-button px-8 py-4 text-lg"
                      whileHover={{ 
                        scale: 1.05,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="relative z-10 text-white font-medium">
                        {slide.ctaText}
                      </span>
                    </motion.button>

                    {/* Secondary CTA with Liquid Glass */}
                    {slide.secondaryCtaText && slide.secondaryCtaAction && (
                      <motion.button
                        onClick={() => handleCTAClick(slide.secondaryCtaAction)}
                        className="liquid-glass-secondary-button px-8 py-4 text-lg"
                        whileHover={{ 
                          scale: 1.05,
                          transition: { duration: 0.2 }
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="relative z-10 text-white/90 font-medium">
                          {slide.secondaryCtaText}
                        </span>
                      </motion.button>
                    )}
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Navigation Arrows with Liquid Glass */}
      <motion.button
        onClick={prevSlide}
        className="absolute left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 liquid-glass-heart-button flex items-center justify-center text-white/60 hover:text-white"
        aria-label="Previous slide"
        whileHover={{ 
          scale: 1.1,
          transition: { duration: 0.2 }
        }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronLeft className="w-6 h-6" />
      </motion.button>
      
      <motion.button
        onClick={nextSlide}
        className="absolute right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 liquid-glass-heart-button flex items-center justify-center text-white/60 hover:text-white"
        aria-label="Next slide"
        whileHover={{ 
          scale: 1.1,
          transition: { duration: 0.2 }
        }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronRight className="w-6 h-6" />
      </motion.button>

      {/* Slide Indicators with Liquid Glass */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex space-x-3">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1.5 transition-all duration-300 liquid-glass-bg ${
              index === currentSlide 
                ? 'w-8 bg-white/80' 
                : 'w-4 bg-white/30 hover:bg-white/50'
            }`}
            style={{
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              borderRadius: '12px'
            }}
            aria-label={`Go to slide ${index + 1}`}
            whileHover={{ 
              scale: 1.2,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>

      {/* Play/Pause Indicator with Liquid Glass */}
      <div className="absolute top-8 right-8 z-10">
        <motion.button
          onClick={() => setIsPaused(!isPaused)}
          className="liquid-glass-button px-3 py-1 text-sm"
          aria-label={isPaused ? 'Resume autoplay' : 'Pause autoplay'}
          whileHover={{ 
            scale: 1.05,
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative z-10 text-white/60 hover:text-white">
            {isPaused ? 'PAUSED' : 'AUTO'}
          </span>
        </motion.button>
      </div>
    </section>
  );
}
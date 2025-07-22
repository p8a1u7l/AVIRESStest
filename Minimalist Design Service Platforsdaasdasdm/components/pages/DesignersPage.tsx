"use client";

import { motion } from 'framer-motion';
import { MapPin, Star, Award, Users, Filter } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import PortfolioGrid from '../PortfolioGrid';

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

interface DesignersPageProps {
  portfolioItems: PortfolioItem[];
  onDesignerClick: (designerName: string) => void;
}

export default function DesignersPage({ portfolioItems = [], onDesignerClick }: DesignersPageProps) {
  // Safe filtering with fallback to empty array
  const safePortfolioItems = Array.isArray(portfolioItems) ? portfolioItems : [];

  const featuredDesigners = [
    {
      id: 1,
      name: 'Sarah Chen',
      title: 'Brand Identity Specialist',
      location: 'San Francisco, CA',
      rating: 4.9,
      reviews: 127,
      projects: 89,
      specialties: ['Logo Design', 'Brand Identity', 'Visual Systems'],
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b93e4d3e?w=200&h=200&fit=crop&crop=face',
      portfolio: safePortfolioItems.filter(item => item.designer === 'Sarah Chen')
    },
    {
      id: 2,
      name: 'Alex Rivera',
      title: 'Typography & Digital Design',
      location: 'New York, NY',
      rating: 4.8,
      reviews: 93,
      projects: 156,
      specialties: ['Typography', 'Web Design', 'UI/UX'],
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
      portfolio: safePortfolioItems.filter(item => item.designer === 'Alex Rivera')
    },
    {
      id: 3,
      name: 'Maria Santos',
      title: 'Print & Packaging Design',
      location: 'Barcelona, Spain',
      rating: 5.0,
      reviews: 78,
      projects: 112,
      specialties: ['Print Design', 'Packaging', 'Business Cards'],
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
      portfolio: safePortfolioItems.filter(item => item.designer === 'Maria Santos')
    },
    {
      id: 4,
      name: 'David Kim',
      title: 'Architecture & Branding',
      location: 'Seoul, South Korea',
      rating: 4.9,
      reviews: 104,
      projects: 67,
      specialties: ['Architecture Branding', 'Corporate Identity', 'Environmental Design'],
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
      portfolio: safePortfolioItems.filter(item => item.designer === 'David Kim')
    },
    {
      id: 5,
      name: 'Emma Johnson',
      title: 'Font & Typography Design',
      location: 'London, UK',
      rating: 4.8,
      reviews: 156,
      projects: 234,
      specialties: ['Typography', 'Font Design', 'Editorial'],
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face',
      portfolio: safePortfolioItems.filter(item => item.designer === 'Emma Johnson')
    },
    {
      id: 6,
      name: 'Carlos Rodriguez',
      title: 'Restaurant & Hospitality Branding',
      location: 'Mexico City, Mexico',
      rating: 4.9,
      reviews: 89,
      projects: 145,
      specialties: ['Restaurant Branding', 'Hospitality', 'Menu Design'],
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
      portfolio: safePortfolioItems.filter(item => item.designer === 'Carlos Rodriguez')
    }
  ];

  return (
    <motion.div
      className="pt-20 min-h-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-8">
          <motion.div
            className="max-w-4xl mx-auto text-center space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="space-y-4">
              <motion.div
                className="section-clean inline-flex items-center gap-2 px-4 py-2 text-sm"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="liquid-glass-bg-hover"></div>
                <div className="relative z-10 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Curated Talent Network
                </div>
              </motion.div>
              
              <h1 className="mb-4">
                Discover Designers
              </h1>
              
              <p className="max-w-2xl mx-auto">
                Connect with exceptional designers who bring your vision to life with creativity and expertise.
              </p>
            </div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.button
                className="primary-button-hover group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="liquid-glass-bg-hover"></div>
                <span className="relative z-10 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filter Designers
                </span>
              </motion.button>
              
              <motion.button
                className="standard-button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="liquid-glass-bg-hover"></div>
                <span className="relative z-10">Post a Project</span>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Designers */}
      <section className="py-20">
        <div className="container mx-auto px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="mb-4">Featured Designers</h2>
            <p className="max-w-2xl mx-auto">
              Meet our top-rated designers ready to work on your next project
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {featuredDesigners.map((designer, index) => (
              <motion.div
                key={designer.id}
                className="simple-card group"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
              >
                <div className="liquid-glass-bg-hover"></div>
                <div className="relative z-10 p-6">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                      <img
                        src={designer.avatar}
                        alt={designer.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="group-hover:text-primary transition-colors">
                          {designer.name}
                        </h3>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{designer.rating}</span>
                        </div>
                      </div>
                      
                      <p className="text-secondary mb-2">{designer.title}</p>
                      
                      <div className="flex items-center gap-2 text-sm text-secondary mb-4">
                        <MapPin className="w-3 h-3" />
                        {designer.location}
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {designer.specialties.map((specialty) => (
                          <span 
                            key={specialty}
                            className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-xs"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-secondary mb-4">
                        <span>{designer.projects} Projects</span>
                        <span>{designer.reviews} Reviews</span>
                      </div>
                    </div>
                  </div>
                  
                  <motion.button
                    onClick={() => onDesignerClick(designer.name)}
                    className="w-full primary-button-hover"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="liquid-glass-bg-hover"></div>
                    <span className="relative z-10">View Portfolio</span>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* All Designer Work */}
      {safePortfolioItems.length > 0 && (
        <section className="pb-20">
          <div className="container mx-auto px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h2 className="mb-4">Designer Portfolio</h2>
              <p className="max-w-2xl mx-auto">
                Browse work from our entire designer community
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <PortfolioGrid
                items={safePortfolioItems}
                onLike={() => {}}
                isLoggedIn={false}
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {safePortfolioItems.length === 0 && (
        <section className="pb-20">
          <div className="container mx-auto px-8">
            <motion.div
              className="text-center max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="section-clean">
                <div className="liquid-glass-bg-hover"></div>
                <div className="relative z-10">
                  <Users className="w-16 h-16 mx-auto mb-4 text-secondary" />
                  <h3 className="mb-2">Loading Designer Portfolio</h3>
                  <p className="text-secondary">
                    Please wait while we load the designer portfolio...
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </motion.div>
  );
}
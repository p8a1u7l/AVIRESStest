"use client";

import { motion } from 'framer-motion';
import { Type, Download, Layers, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import PortfolioGrid from '../PortfolioGrid';

interface PortfolioItem {
  id: string;
  title: string;
  designer: string;
  category: string;
  imageUrl: string;
  isLiked?: boolean;
  description?: string;
}

interface FontDesignPageProps {
  items: PortfolioItem[];
  onLike: (itemId: string) => void;
  onNavigate: (section: string) => void;
  isLoggedIn: boolean;
}

export default function FontDesignPage({ items, onLike, onNavigate, isLoggedIn }: FontDesignPageProps) {
  const fontItems = items.filter(item => item.category.toLowerCase().includes('font'));

  return (
    <motion.div
      className="pt-16 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <section className="py-20 border-b border-border">
        <div className="container mx-auto px-8">
          <motion.div
            className="max-w-4xl mx-auto text-center space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="space-y-4">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full text-sm"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Type className="w-4 h-4 text-blue-400" />
                Custom Typography Design
              </motion.div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl tracking-tight">
                Font Design
                <span className="block text-gradient bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Services
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                Create distinctive custom typefaces that elevate your brand with unique personality and style.
              </p>
            </div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button size="lg" className="group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                Start Font Project
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => onNavigate('font-purchase')}>
                Buy Ready Fonts
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Typography Showcase */}
      <section className="py-20">
        <div className="container mx-auto px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-3xl md:text-4xl mb-4">Typography Excellence</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Crafting custom typefaces for brands that demand distinction
            </p>
          </motion.div>

          <motion.div
            className="bg-card p-12 rounded-lg border border-border mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="space-y-8">
              <div className="text-center">
                <div className="text-6xl md:text-8xl mb-4" style={{ fontFamily: 'Inter', fontWeight: '300' }}>
                  Aa Bb Cc
                </div>
                <p className="text-muted-foreground">Custom typeface example - Display variant</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-4xl mb-2" style={{ fontFamily: 'Inter', fontWeight: '100' }}>Light</div>
                  <p className="text-sm text-muted-foreground">100 Weight</p>
                </div>
                <div>
                  <div className="text-4xl mb-2" style={{ fontFamily: 'Inter', fontWeight: '400' }}>Regular</div>
                  <p className="text-sm text-muted-foreground">400 Weight</p>
                </div>
                <div>
                  <div className="text-4xl mb-2" style={{ fontFamily: 'Inter', fontWeight: '700' }}>Bold</div>
                  <p className="text-sm text-muted-foreground">700 Weight</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Font Design Portfolio */}
      <section className="pb-20">
        <div className="container mx-auto px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl mb-4">Font Design Portfolio</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore our collection of custom typography designs
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <PortfolioGrid
              items={fontItems}
              onLike={onLike}
              isLoggedIn={isLoggedIn}
            />
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
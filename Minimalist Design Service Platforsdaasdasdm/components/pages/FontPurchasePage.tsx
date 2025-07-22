"use client";

import { motion } from 'framer-motion';
import { Download, ShoppingCart, Type, Zap, ArrowRight } from 'lucide-react';
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
}

interface FontPurchasePageProps {
  items: PortfolioItem[];
  onLike: (itemId: string) => void;
  onNavigate: (section: string) => void;
  isLoggedIn: boolean;
}

export default function FontPurchasePage({ items, onLike, onNavigate, isLoggedIn }: FontPurchasePageProps) {
  const fontItems = items.filter(item => item.category.toLowerCase().includes('font'));

  const featuredFonts = [
    {
      name: 'Aviress Display',
      price: '$49',
      category: 'Display',
      formats: ['OTF', 'TTF', 'WOFF'],
      weights: 7,
      preview: 'The quick brown fox jumps'
    },
    {
      name: 'Modern Sans Pro',
      price: '$79',
      category: 'Sans Serif',
      formats: ['OTF', 'TTF', 'WOFF', 'EOT'],
      weights: 12,
      preview: 'Typography Excellence'
    },
    {
      name: 'Elegant Serif',
      price: '$65',
      category: 'Serif',
      formats: ['OTF', 'TTF', 'WOFF'],
      weights: 8,
      preview: 'Sophisticated Design'
    }
  ];

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
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full text-sm"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <ShoppingCart className="w-4 h-4 text-orange-400" />
                Instant Download
              </motion.div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl tracking-tight">
                Buy Fonts
                <span className="block text-gradient bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  Instantly
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                Download premium fonts instantly. Commercial licenses included for all your design projects.
              </p>
            </div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button size="lg" className="group bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
                Browse All Fonts
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => onNavigate('font-design')}>
                Custom Font Design
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Fonts */}
      <section className="py-20">
        <div className="container mx-auto px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-3xl md:text-4xl mb-4">Featured Fonts</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Handpicked premium fonts ready for instant download
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {featuredFonts.map((font, index) => (
              <motion.div
                key={font.name}
                className="group p-8 bg-card hover:bg-accent/30 rounded-lg border border-border transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
              >
                <div className="mb-6">
                  <div className="text-3xl mb-4" style={{ fontFamily: 'Inter', fontWeight: '600' }}>
                    {font.preview}
                  </div>
                  <Badge variant="secondary">{font.category}</Badge>
                </div>
                
                <div className="space-y-2 mb-6">
                  <h3 className="text-xl">{font.name}</h3>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{font.weights} weights</span>
                    <span>{font.formats.join(', ')}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-semibold">{font.price}</span>
                  <Button className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Download className="mr-2 w-4 h-4" />
                    Buy Now
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Font Collection */}
      <section className="pb-20">
        <div className="container mx-auto px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl mb-4">Font Collection</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Browse our complete library of premium fonts
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
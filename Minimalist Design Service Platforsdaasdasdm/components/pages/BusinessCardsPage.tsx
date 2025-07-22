"use client";

import { motion } from 'framer-motion';
import { CreditCard, Award, Truck, Star, ArrowRight } from 'lucide-react';
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

interface BusinessCardsPageProps {
  items: PortfolioItem[];
  onLike: (itemId: string) => void;
  onNavigate: (section: string) => void;
  isLoggedIn: boolean;
}

export default function BusinessCardsPage({ items, onLike, onNavigate, isLoggedIn }: BusinessCardsPageProps) {
  const businessCardItems = items.filter(item => item.category.toLowerCase().includes('business'));

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
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full text-sm"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <CreditCard className="w-4 h-4 text-green-400" />
                Premium Business Cards
              </motion.div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl tracking-tight">
                Business Card
                <span className="block text-gradient bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  Design
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                Make a lasting first impression with premium business cards that reflect your professional excellence.
              </p>
            </div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button size="lg" className="group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                Design Your Cards
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" size="lg">
                View Templates
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-8">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="text-center p-8">
              <Award className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <h3 className="text-xl mb-3">Premium Materials</h3>
              <p className="text-muted-foreground">High-quality paper stocks and finishing options</p>
            </div>
            <div className="text-center p-8">
              <Star className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <h3 className="text-xl mb-3">Professional Design</h3>
              <p className="text-muted-foreground">Custom designs by expert graphic designers</p>
            </div>
            <div className="text-center p-8">
              <Truck className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <h3 className="text-xl mb-3">Fast Delivery</h3>
              <p className="text-muted-foreground">Quick turnaround with express shipping options</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Portfolio */}
      <section className="pb-20">
        <div className="container mx-auto px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl mb-4">Business Card Portfolio</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover our collection of premium business card designs
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <PortfolioGrid
              items={businessCardItems}
              onLike={onLike}
              isLoggedIn={isLoggedIn}
            />
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
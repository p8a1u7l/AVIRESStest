"use client";

import { motion } from 'framer-motion';
import { Palette, Zap, Award, CheckCircle, ArrowRight } from 'lucide-react';
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

interface LogoDesignPageProps {
  items: PortfolioItem[];
  onLike: (itemId: string) => void;
  onNavigate: (section: string) => void;
  isLoggedIn: boolean;
}

export default function LogoDesignPage({ items, onLike, onNavigate, isLoggedIn }: LogoDesignPageProps) {
  const logoItems = items.filter(item => item.category.toLowerCase().includes('logo'));

  const features = [
    {
      icon: <Palette className="w-6 h-6" />,
      title: 'Custom Brand Identity',
      description: 'Unique logos tailored to your brand personality and values'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Fast Turnaround',
      description: 'Professional logo designs delivered in 3-5 business days'
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: 'Multiple Concepts',
      description: 'Receive 3-5 initial concepts to choose from'
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: 'Unlimited Revisions',
      description: 'Perfect your logo with unlimited revisions included'
    }
  ];

  const packages = [
    {
      name: 'Basic Logo',
      price: '$299',
      features: [
        '3 Logo concepts',
        '3 Revisions included',
        'High-resolution files',
        'Basic brand guidelines',
        '7-day delivery'
      ],
      popular: false
    },
    {
      name: 'Professional Brand',
      price: '$599',
      features: [
        '5 Logo concepts',
        'Unlimited revisions',
        'Complete file package',
        'Brand style guide',
        'Business card design',
        '5-day delivery'
      ],
      popular: true
    },
    {
      name: 'Enterprise Identity',
      price: '$1,299',
      features: [
        '7 Logo concepts',
        'Unlimited revisions',
        'Complete brand system',
        'Brand strategy session',
        'Marketing materials',
        'Trademark consultation',
        '3-day delivery'
      ],
      popular: false
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
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full text-sm"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Palette className="w-4 h-4 text-purple-400" />
                Professional Logo Design
              </motion.div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl tracking-tight">
                Logo Design
                <span className="block text-gradient bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Excellence
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                Transform your brand with stunning, memorable logos crafted by world-class designers.
              </p>
            </div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button size="lg" className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Start Your Logo Project
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => onNavigate('designers')}>
                Browse Designers
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-3xl md:text-4xl mb-4">Why Choose Our Logo Design</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Professional logo design that captures your brand essence and drives recognition
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="text-center p-8 bg-card hover:bg-accent/30 rounded-lg border border-border transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-purple-400">
                  {feature.icon}
                </div>
                <h3 className="text-xl mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-accent/20">
        <div className="container mx-auto px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl mb-4">Logo Design Packages</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Choose the perfect package for your brand identity needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                className={`relative p-8 bg-card rounded-lg border transition-all duration-300 ${
                  pkg.popular ? 'border-purple-500 ring-2 ring-purple-500/20' : 'border-border hover:border-purple-500/50'
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl mb-2">{pkg.name}</h3>
                  <div className="text-4xl mb-4">
                    {pkg.price}
                    <span className="text-base text-muted-foreground">/project</span>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${
                    pkg.popular 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' 
                      : 'bg-primary hover:bg-primary/90'
                  }`}
                >
                  Get Started
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-20">
        <div className="container mx-auto px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl mb-4">Logo Design Portfolio</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore our collection of stunning logo designs
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <PortfolioGrid
              items={logoItems}
              onLike={onLike}
              isLoggedIn={isLoggedIn}
            />
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Users, Palette, Type, CreditCard, Search } from 'lucide-react';
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

interface ProductsPageProps {
  items: PortfolioItem[];
  onItemClick?: (item: PortfolioItem) => void;
  onDesignerClick?: (designerName: string) => void;
  onLike?: (itemId: string) => void;
  onPurchase?: (item: PortfolioItem) => void;
  isLoggedIn?: boolean;
}

export default function ProductsPage({ 
  items = [], 
  onItemClick,
  onDesignerClick,
  onLike, 
  onPurchase,
  isLoggedIn = false
}: ProductsPageProps) {
  // 상태 관리 추가
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Safe filtering with fallback to empty array
  const safePortfolioItems = Array.isArray(items) ? items : [];
  
  // 카테고리 목록 생성
  const categories = ['All', ...Array.from(new Set(safePortfolioItems.map(item => item.category || 'Other')))];
  
  // 필터링된 아이템들
  const filteredItems = safePortfolioItems.filter(item => {
    const matchesSearch = !searchQuery || 
      (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.designer && item.designer.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || 
      (item.category && item.category === selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  const productCategories = [
    {
      id: 'logo-design',
      title: 'Logo Design',
      description: 'Professional brand identity and logo design services',
      icon: <Palette className="w-8 h-8" />,
      count: safePortfolioItems.filter(item => item.category === 'Logo Design').length,
      color: 'from-purple-500/20 to-pink-500/20'
    },
    {
      id: 'font-design',
      title: 'Font Design',
      description: 'Custom typography and typeface creation',
      icon: <Type className="w-8 h-8" />,
      count: safePortfolioItems.filter(item => item.category === 'Font Design').length,
      color: 'from-blue-500/20 to-cyan-500/20'
    },
    {
      id: 'business-cards',
      title: 'Business Cards',
      description: 'Premium business card design and printing',
      icon: <CreditCard className="w-8 h-8" />,
      count: safePortfolioItems.filter(item => item.category === 'Business Card Design').length,
      color: 'from-green-500/20 to-emerald-500/20'
    }
  ];

  const handleCategorySelect = (categoryId: string) => {
    const categoryMapping: { [key: string]: string } = {
      'logo-design': 'Logo Design',
      'font-design': 'Font Design',
      'business-cards': 'Business Card Design'
    };
    
    setSelectedCategory(categoryMapping[categoryId] || 'All');
  };

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
                  <Star className="w-4 h-4" />
                  Premium Design Services
                </div>
              </motion.div>
              
              <h1 className="mb-4">
                All Products
              </h1>
              
              <p className="max-w-2xl mx-auto">
                Explore our complete collection of professional design services and ready-made products.
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
                  Browse Designers
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </motion.button>
              
              <motion.button
                className="standard-button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="liquid-glass-bg-hover"></div>
                <span className="relative z-10">Buy Fonts Instantly</span>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12">
        <div className="container mx-auto px-8">
          <div className="max-w-4xl mx-auto">
            {/* Search Bar */}
            <motion.div
              className="search-bar-clean mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="liquid-glass-bg-hover"></div>
              <div className="relative z-10 flex items-center w-full">
                <Search className="w-5 h-5 text-secondary mr-3" />
                <input
                  type="text"
                  placeholder="Search designs, designers, or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none placeholder-secondary"
                />
              </div>
            </motion.div>

            {/* Category Filters */}
            <motion.div
              className="flex flex-wrap gap-2 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {categories.map((category) => (
                <motion.button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`filter-tab-clean ${selectedCategory === category ? 'active' : ''}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="liquid-glass-bg-hover"></div>
                  <span className="relative z-10">{category}</span>
                </motion.button>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="container mx-auto px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="mb-4">Browse by Category</h2>
            <p className="max-w-2xl mx-auto">
              Find exactly what you need from our specialized design categories
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {productCategories.map((category, index) => (
              <motion.button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className="simple-card group text-left"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="liquid-glass-bg-hover"></div>
                <div className="relative z-10 p-8">
                  <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {category.icon}
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="group-hover:text-primary transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-secondary text-sm leading-relaxed">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-secondary">
                        {category.count} items
                      </span>
                      <ArrowRight className="w-4 h-4 text-secondary group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="pb-20">
        <div className="container mx-auto px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h2 className="mb-4">
              {selectedCategory === 'All' ? 'Featured Work' : `${selectedCategory} Designs`}
            </h2>
            <p className="max-w-2xl mx-auto">
              {selectedCategory === 'All' 
                ? 'Discover exceptional design work from our talented community'
                : `Browse ${(selectedCategory || '').toLowerCase()} designs from our designers`
              }
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            {filteredItems.length > 0 ? (
              <PortfolioGrid
                items={filteredItems}
                onItemClick={onItemClick}
                onDesignerClick={onDesignerClick}
                onLike={onLike}
                onPurchase={onPurchase}
                isLoggedIn={isLoggedIn}
              />
            ) : (
              <div className="section-clean text-center max-w-md mx-auto">
                <div className="liquid-glass-bg-hover"></div>
                <div className="relative z-10">
                  <Palette className="w-16 h-16 mx-auto mb-4 text-secondary" />
                  <h3 className="mb-2">No Products Found</h3>
                  <p className="text-secondary">
                    {searchQuery 
                      ? `No results found for "${searchQuery}"`
                      : selectedCategory !== 'All' 
                        ? `No ${(selectedCategory || '').toLowerCase()} designs available`
                        : 'Loading products...'
                    }
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
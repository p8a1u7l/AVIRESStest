"use client";

import { useState, useEffect, useRef } from 'react';
import { 
  ChevronDown, User, LogIn, ShoppingBag, Heart, Settings, LogOut, X,
  Package, TrendingUp, FileText, Users, BarChart3, PlusCircle, Upload,
  MessageCircle, ClipboardList, DollarSign, CreditCard, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import Logo from './Logo';
import { getTestAccountByEmail } from '../utils/testAccounts';

interface SupabaseUser {
  id: string;
  email: string;
  user_metadata: {
    first_name: string;
    last_name: string;
    full_name: string;
    marketing_emails: boolean;
  };
}

interface HeaderProps {
  isLoggedIn?: boolean;
  onNavigate?: (section: string) => void;
  user?: SupabaseUser | null;
  currentSection?: string;
  authLoading?: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export default function Header({ 
  isLoggedIn = false, 
  onNavigate, 
  user, 
  currentSection = 'home',
  authLoading = false,
  searchQuery = '',
  onSearchChange
}: HeaderProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // 사용자 역할 확인
  const testAccount = user?.email ? getTestAccountByEmail(user.email) : null;
  const isDesigner = testAccount?.role === 'designer';
  const isAdmin = testAccount?.role === 'admin';

  console.log('🎯 Header - User role:', testAccount?.role, 'isDesigner:', isDesigner);

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle body scroll lock
  useEffect(() => {
    if (activeDropdown) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [activeDropdown]);

  // Keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeDropdown) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeDropdown]);

  const handleNavigation = (section: string) => {
    console.log(`🎯 Header Navigation: ${section}`);
    setActiveDropdown(null);
    onNavigate?.(section);
  };

  const handleDropdownToggle = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleOverlayClick = () => {
    setActiveDropdown(null);
  };

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.2, ease: 'easeInOut' }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2, ease: 'easeInOut' }
    }
  };

  const dropdownVariants = {
    hidden: { 
      opacity: 0, 
      y: -20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.3, 
        ease: 'easeOut',
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      scale: 0.95,
      transition: { 
        duration: 0.2, 
        ease: 'easeIn'
      }
    }
  };

  const menuItemVariants = {
    hidden: { 
      opacity: 0, 
      y: 10
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3, 
        ease: 'easeOut'
      }
    }
  };

  // Products 드롭다운 - 역할별 다른 메뉴
  const ProductsDropdownContent = () => {
    // 디자이너용 Products 메뉴
    const designerProductItems = [
      { 
        title: 'Portfolio Upload', 
        description: 'Upload your design work to showcase',
        action: 'portfolio-upload',
        icon: Upload
      },
      { 
        title: 'Public Projects', 
        description: 'Browse and bid on public projects',
        action: 'public-projects',
        icon: ClipboardList
      },
      { 
        title: 'Custom Form Creator', 
        description: 'Create custom request forms for clients',
        action: 'custom-form-creator',
        icon: FileText
      },
      { 
        title: 'All Products', 
        description: 'Browse design marketplace',
        action: 'products',
        icon: Package
      },
      { 
        title: 'Other Designers', 
        description: 'Explore other designer portfolios',
        action: 'designers',
        icon: Users
      }
    ];

    // 고객용 Products 메뉴
    const customerProductItems = [
      { 
        title: 'All Products', 
        description: 'Browse our complete design collection',
        action: 'products',
        icon: Package
      },
      { 
        title: 'Designers', 
        description: 'Explore exceptional designer portfolios',
        action: 'designers',
        icon: Users
      },
      { 
        title: 'Logo Design', 
        description: 'Professional logo design services',
        action: 'logo-design',
        icon: Star
      },
      { 
        title: 'Font Design', 
        description: 'Custom typography and font creation',
        action: 'font-design',
        icon: FileText
      },
      { 
        title: 'Business Cards', 
        description: 'Premium business card design',
        action: 'business-cards',
        icon: CreditCard
      },
      { 
        title: 'Font Purchase', 
        description: 'Buy ready-made fonts instantly',
        action: 'font-purchase',
        icon: ShoppingBag
      },
      { 
        title: 'Public Projects', 
        description: 'Post projects publicly and get proposals',
        action: 'public-projects',
        icon: ClipboardList
      },
      { 
        title: 'Custom Project', 
        description: 'Request a custom design project',
        action: 'project-request',
        icon: PlusCircle
      }
    ];

    const productItems = (isDesigner || isAdmin) ? designerProductItems : customerProductItems;

    return (
      <motion.div 
        className={`grid grid-cols-1 md:grid-cols-3 ${(isDesigner || isAdmin) ? 'lg:grid-cols-5' : 'lg:grid-cols-8'} gap-4 max-w-7xl mx-auto`}
        variants={dropdownVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {productItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <motion.div
              key={`product-${item.title.replace(/\s+/g, '-').toLowerCase()}-${index}`}
              variants={menuItemVariants}
              className="menu-hover-item"
            >
              <motion.button
                onClick={() => handleNavigation(item.action)}
                className="w-full p-4 text-left relative z-10 transition-all duration-300 flex flex-col items-start"
                whileHover={{ 
                  scale: 1.02,
                  y: -2,
                  transition: { duration: 0.2, ease: 'easeOut' }
                }}
                whileTap={{ 
                  scale: 0.98,
                  transition: { duration: 0.1 }
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                  className="mb-3"
                >
                  <IconComponent className="menu-icon h-6 w-6" />
                </motion.div>
                
                <h3 className="menu-title mb-2">
                  {item.title}
                </h3>
                
                {/* Description appears on hover via pure CSS */}
                <p className="menu-description">
                  {item.description}
                </p>
              </motion.button>
            </motion.div>
          );
        })}
      </motion.div>
    );
  };

  // Dashboard 드롭다운 - 역할별 다른 메뉴
  const DashboardDropdownContent = () => {
    const loggedOutItems = [
      {
        title: 'Login',
        description: 'Access your account and orders',
        action: 'login',
        icon: LogIn
      },
      {
        title: 'Sign Up',
        description: 'Create a new account',
        action: 'signup',
        icon: User
      }
    ];

    // 디자이너용 Dashboard 메뉴
    const designerDashboardItems = [
      { 
        title: 'Project Analytics', 
        description: 'View earnings and project statistics', 
        action: 'designer-analytics', 
        icon: BarChart3 
      },
      { 
        title: 'Client Projects', 
        description: 'Manage active client work', 
        action: 'designer-projects', 
        icon: ClipboardList 
      },
      { 
        title: 'Custom Forms', 
        description: 'Manage your request forms', 
        action: 'designer-forms', 
        icon: FileText 
      },
      { 
        title: 'Earnings', 
        description: 'Track your revenue and payments', 
        action: 'designer-earnings', 
        icon: DollarSign 
      },
      { 
        title: 'Designer Profile', 
        description: 'Update your professional profile', 
        action: 'designer-profile', 
        icon: User 
      }
    ];

    // 고객용 Dashboard 메뉴
    const customerDashboardItems = [
      { 
        title: 'My Orders', 
        description: 'View your purchase history', 
        action: 'orders', 
        icon: ShoppingBag 
      },
      { 
        title: 'My Projects', 
        description: 'Track custom project requests', 
        action: 'orders', 
        icon: ClipboardList 
      },
      { 
        title: 'Favorites', 
        description: 'Your liked designs', 
        action: 'favorites', 
        icon: Heart 
      },
      { 
        title: 'Subscriptions', 
        description: 'Manage your subscriptions', 
        action: 'subscription', 
        icon: CreditCard 
      },
      { 
        title: 'Profile Settings', 
        description: 'Account and preference settings', 
        action: 'profile', 
        icon: Settings 
      }
    ];

    const loggedInItems = (isDesigner || isAdmin) ? designerDashboardItems : customerDashboardItems;

    return (
      <motion.div 
        className="max-w-4xl mx-auto"
        variants={dropdownVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {!isLoggedIn ? (
          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loggedOutItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={`auth-${item.action}-${index}`}
                  variants={menuItemVariants}
                  className="menu-hover-item"
                >
                  <motion.button
                    onClick={() => handleNavigation(item.action)}
                    className="w-full p-6 text-left flex items-start relative z-10 transition-all duration-300"
                    whileHover={{ 
                      scale: 1.02,
                      y: -2,
                      transition: { duration: 0.2, ease: 'easeOut' }
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                      className="mr-4 mt-1"
                    >
                      <IconComponent className="menu-icon h-6 w-6" />
                    </motion.div>
                    
                    <div className="flex-1">
                      <h3 className="menu-title mb-1">
                        {item.title}
                      </h3>
                      
                      {/* Description appears on hover via pure CSS */}
                      <p className="menu-description">
                        {item.description}
                      </p>
                    </div>
                  </motion.button>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div className="space-y-4">
            <motion.div className={`grid grid-cols-1 md:grid-cols-3 ${(isDesigner || isAdmin) ? 'lg:grid-cols-5' : 'lg:grid-cols-5'} gap-3`}>
              {loggedInItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    key={`dashboard-${item.title.replace(/\s+/g, '-').toLowerCase()}-${index}`}
                    variants={menuItemVariants}
                    className="menu-hover-item"
                  >
                    <motion.button
                      onClick={() => handleNavigation(item.action)}
                      className="w-full p-4 text-left flex items-start relative z-10 transition-all duration-300"
                      whileHover={{ 
                        scale: 1.02,
                        y: -2,
                        transition: { duration: 0.2, ease: 'easeOut' }
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                        className="mr-3"
                      >
                        <IconComponent className="menu-icon h-5 w-5" />
                      </motion.div>
                      
                      <div className="flex-1">
                        <h3 className="menu-title text-sm mb-1">
                          {item.title}
                        </h3>
                        
                        {/* Description appears on hover via pure CSS */}
                        <p className="menu-description text-xs">
                          {item.description}
                        </p>
                      </div>
                    </motion.button>
                  </motion.div>
                );
              })}
            </motion.div>
            
            <motion.div 
              className="border-t border-white/10 pt-4"
              variants={menuItemVariants}
            >
              <motion.div
                className="menu-hover-item mx-auto inline-block"
              >
                <motion.button
                  onClick={() => handleNavigation('logout')}
                  className="p-3 text-left flex items-center relative z-10 transition-all duration-300"
                  whileHover={{ 
                    scale: 1.02,
                    y: -1,
                    transition: { duration: 0.2, ease: 'easeOut' }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <LogOut className="menu-icon mr-3 h-4 w-4" />
                  </motion.div>
                  
                  <div>
                    <span className="menu-title text-sm">Logout</span>
                    
                    {/* Description appears on hover via pure CSS */}
                    <p className="menu-description text-xs mt-1">
                      Sign out of your account
                    </p>
                  </div>
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    );
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border/30" style={{
        backgroundColor: 'rgba(17, 17, 17, 0.97)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)'
      }}>
        <div className="container mx-auto px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.button
              onClick={() => handleNavigation('home')}
              className="flex items-center hover:opacity-80 transition-all duration-300 ease-in-out no-liquid-glass"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Logo size="lg" animated={true} variant="header" />
            </motion.button>

            {/* Desktop Navigation */}
            {!isMobile && (
              <div className="flex items-center space-x-6">
                {/* Products */}
                <motion.button
                  onClick={() => handleDropdownToggle('products')}
                  className="header-menu-button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="header-text">
                    {(isDesigner || isAdmin) ? 'Designer Tools' : 'Products'}
                  </span>
                  <motion.div
                    animate={{ rotate: activeDropdown === 'products' ? 180 : 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="header-text"
                  >
                    <ChevronDown className="h-3 w-3" />
                  </motion.div>
                </motion.button>

                {/* Dashboard */}
                <motion.button
                  onClick={() => handleDropdownToggle('dashboard')}
                  className="header-menu-button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="header-text">
                    {(isDesigner || isAdmin) ? '디자이너 대시보드' : '내 대시보드'}
                  </span>
                  <motion.div
                    animate={{ rotate: activeDropdown === 'dashboard' ? 180 : 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="header-text"
                  >
                    <ChevronDown className="h-3 w-3" />
                  </motion.div>
                </motion.button>
              </div>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <motion.button
                onClick={() => handleDropdownToggle('mobile')}
                className="hover:opacity-70 transition-opacity p-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence mode="wait">
                  {activeDropdown === 'mobile' ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="header-text"
                    >
                      <X className="h-6 w-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-1 header-text"
                    >
                      <motion.div 
                        className="w-6 h-0.5 bg-current"
                        initial={{ width: 24 }}
                        whileHover={{ width: 20 }}
                        transition={{ duration: 0.2 }}
                      />
                      <motion.div 
                        className="w-6 h-0.5 bg-current"
                        whileHover={{ width: 28 }}
                        transition={{ duration: 0.2 }}
                      />
                      <motion.div 
                        className="w-6 h-0.5 bg-current"
                        initial={{ width: 24 }}
                        whileHover={{ width: 16 }}
                        transition={{ duration: 0.2 }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            )}
          </div>
        </div>
      </header>

      {/* Overlay */}
      <AnimatePresence>
        {activeDropdown && (
          <motion.div
            ref={overlayRef}
            className="fixed inset-0 z-40"
            style={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              top: isMobile ? '0' : '80px'
            }}
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleOverlayClick}
          />
        )}
      </AnimatePresence>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {activeDropdown && (
          <motion.div
            ref={dropdownRef}
            className={`fixed left-0 right-0 z-50 ${
              isMobile 
                ? 'top-0 bottom-0 bg-[#1A1A1A]' 
                : 'top-20 bg-[#1A1A1A] shadow-2xl'
            }`}
            style={{
              height: isMobile ? '100vh' : activeDropdown === 'products' ? '320px' : '250px'
            }}
            initial={{ 
              opacity: 0, 
              y: isMobile ? '100%' : '-100%',
              scale: isMobile ? 1 : 0.95
            }}
            animate={{ 
              opacity: 1, 
              y: 0,
              scale: 1
            }}
            exit={{ 
              opacity: 0, 
              y: isMobile ? '100%' : '-100%',
              scale: isMobile ? 1 : 0.95
            }}
            transition={{ 
              duration: isMobile ? 0.4 : 0.3, 
              ease: 'easeOut'
            }}
          >
            <div className="h-full overflow-y-auto">
              <div className={`${isMobile ? 'pt-20 pb-8' : 'py-12'} px-8`}>
                {/* Mobile Close Button */}
                {isMobile && (
                  <motion.button
                    onClick={() => setActiveDropdown(null)}
                    className="absolute top-6 right-8 hover:opacity-80 no-liquid-glass p-2"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="h-6 w-6 header-text" />
                  </motion.button>
                )}

                {/* Desktop Dropdowns */}
                <AnimatePresence mode="wait">
                  {activeDropdown === 'products' && !isMobile && (
                    <ProductsDropdownContent key="products" />
                  )}
                  {activeDropdown === 'dashboard' && !isMobile && (
                    <DashboardDropdownContent key="dashboard" />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
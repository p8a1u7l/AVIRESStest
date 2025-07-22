// Enhanced Image Utility System with Figma Design Integration
// Provides fallback handling and optimized image loading

// Fallback image URLs for different categories
export const fallbackImages = {
  heroDefault: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1920&h=1080&fit=crop&q=80',
  logoDefault: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop&q=80',
  fontDefault: 'https://images.unsplash.com/photo-1586717791821-3de0db5b4b8e?w=400&h=500&fit=crop&q=80',
  businessCardDefault: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=300&fit=crop&q=80',
  designerDefault: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&q=80',
  portfolioDefault: 'https://images.unsplash.com/photo-1586717799252-bd134ad00e26?w=400&h=600&fit=crop&q=80'
}

// Portfolio image mapping (safe fallback structure)
export const portfolioImages = {
  logoMinimal: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop&q=80',
  logoArchitectural: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=700&fit=crop&q=80',
  logoRestaurant: 'https://images.unsplash.com/photo-1551731409-43eb3e517a1a?w=400&h=550&fit=crop&q=80',
  logoTech: 'https://images.unsplash.com/photo-1508345228704-935cc84bf5e2?w=400&h=450&fit=crop&q=80',
  logoCorporate: 'https://images.unsplash.com/photo-1542744095-291d1f67b221?w=400&h=500&fit=crop&q=80',
  
  fontModern: 'https://images.unsplash.com/photo-1586717791821-3de0db5b4b8e?w=400&h=500&fit=crop&q=80',
  fontSerif: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80',
  fontLuxury: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=650&fit=crop&q=80',
  fontDisplay: 'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=400&h=700&fit=crop&q=80',
  
  businessElegant: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=300&fit=crop&q=80',
  businessCreative: 'https://images.unsplash.com/photo-1586717799252-bd134ad00e26?w=400&h=600&fit=crop&q=80',
  businessBoutique: 'https://images.unsplash.com/photo-1586282023692-349c0f0b4b4c?w=400&h=400&fit=crop&q=80'
}

// Hero image mapping for slides
export const heroImages = {
  'logo-excellence': 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1920&h=1080&fit=crop&q=80',
  'designer-featured': 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1920&h=1080&fit=crop&q=80',
  'business-cards': 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1920&h=1080&fit=crop&q=80',
  'typography-mastery': 'https://images.unsplash.com/photo-1586717791821-3de0db5b4b8e?w=1920&h=1080&fit=crop&q=80'
}

// Designer profile images
export const designerImages = {
  'Sarah Chen': 'https://images.unsplash.com/photo-1494790108755-2616c36b6568?w=400&h=400&fit=crop&q=80',
  'Alex Rivera': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80',
  'Maria Santos': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&q=80',
  'David Kim': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&q=80',
  'Emma Johnson': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&q=80',
  'Carlos Rodriguez': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&q=80',
  'Lisa Zhang': 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop&q=80',
  'Ryan Mitchell': 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=400&h=400&fit=crop&q=80',
  'Sophia Williams': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&q=80',
  'Michael Brown': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80',
  'Isabella Garcia': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&q=80',
  'James Taylor': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&q=80'
}

// Safe image URL getter with fallback
export const getImageUrl = (primaryUrl: string, fallbackUrl: string): string => {
  try {
    // If primary URL is valid, use it
    if (primaryUrl && typeof primaryUrl === 'string' && primaryUrl.trim() !== '') {
      return primaryUrl
    }
    
    // Otherwise use fallback
    return fallbackUrl || fallbackImages.portfolioDefault
  } catch (error) {
    console.warn('Error getting image URL:', error)
    return fallbackUrl || fallbackImages.portfolioDefault
  }
}

// Get image by category
export const getImageByCategory = (category: string): string => {
  try {
    const categoryMap: { [key: string]: string } = {
      'Logo Design': fallbackImages.logoDefault,
      'Font Design': fallbackImages.fontDefault,
      'Business Card Design': fallbackImages.businessCardDefault
    }
    
    return categoryMap[category] || fallbackImages.portfolioDefault
  } catch (error) {
    console.warn('Error getting category image:', error)
    return fallbackImages.portfolioDefault
  }
}

// Get designer image
export const getDesignerImage = (designerName: string): string => {
  try {
    return designerImages[designerName as keyof typeof designerImages] || fallbackImages.designerDefault
  } catch (error) {
    console.warn('Error getting designer image:', error)
    return fallbackImages.designerDefault
  }
}

// Get hero image
export const getHeroImage = (slideId: string): string => {
  try {
    return heroImages[slideId as keyof typeof heroImages] || fallbackImages.heroDefault
  } catch (error) {
    console.warn('Error getting hero image:', error)
    return fallbackImages.heroDefault
  }
}

// Preload critical images for better performance
export const preloadCriticalImages = (): void => {
  try {
    const criticalImages = [
      fallbackImages.heroDefault,
      fallbackImages.logoDefault,
      fallbackImages.fontDefault,
      fallbackImages.businessCardDefault
    ]

    criticalImages.forEach((src) => {
      if (typeof window !== 'undefined') {
        const img = new Image()
        img.src = src
      }
    })
  } catch (error) {
    console.warn('Error preloading images:', error)
  }
}

// Mock Figma design images (placeholder structure)
export const figmaDesignImages = {
  logos: {
    minimal: portfolioImages.logoMinimal,
    architectural: portfolioImages.logoArchitectural,
    restaurant: portfolioImages.logoRestaurant,
    techStartup: portfolioImages.logoTech,
    corporate: portfolioImages.logoCorporate
  },
  typography: {
    modern: portfolioImages.fontModern,
    serif: portfolioImages.fontSerif,
    luxury: portfolioImages.fontLuxury,
    display: portfolioImages.fontDisplay
  },
  businessCards: {
    elegant: portfolioImages.businessElegant,
    creative: portfolioImages.businessCreative,
    boutique: portfolioImages.businessBoutique
  }
}

// Validate image URL
export const isValidImageUrl = (url: string): boolean => {
  try {
    if (!url || typeof url !== 'string') return false
    
    // Basic URL validation
    const urlPattern = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i
    return urlPattern.test(url)
  } catch (error) {
    console.warn('Error validating image URL:', error)
    return false
  }
}

// Get optimized image URL with size parameters
export const getOptimizedImageUrl = (
  baseUrl: string, 
  width?: number, 
  height?: number, 
  quality: number = 80
): string => {
  try {
    if (!baseUrl) return fallbackImages.portfolioDefault
    
    // If it's an Unsplash URL, add optimization parameters
    if (baseUrl.includes('images.unsplash.com')) {
      const url = new URL(baseUrl)
      if (width) url.searchParams.set('w', width.toString())
      if (height) url.searchParams.set('h', height.toString())
      url.searchParams.set('fit', 'crop')
      url.searchParams.set('q', quality.toString())
      return url.toString()
    }
    
    return baseUrl
  } catch (error) {
    console.warn('Error optimizing image URL:', error)
    return baseUrl || fallbackImages.portfolioDefault
  }
}

export default {
  fallbackImages,
  portfolioImages,
  heroImages,
  designerImages,
  figmaDesignImages,
  getImageUrl,
  getImageByCategory,
  getDesignerImage,
  getHeroImage,
  preloadCriticalImages,
  isValidImageUrl,
  getOptimizedImageUrl
}
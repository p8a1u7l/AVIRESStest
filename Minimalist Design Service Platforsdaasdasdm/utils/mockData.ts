// AVIRESS 플랫폼을 위한 확장된 목업 데이터
// 테스트 계정별로 다른 경험을 제공하기 위한 데이터

import { type TestAccount, TEST_ACCOUNTS } from './testAccounts';

// 포트폴리오 아이템 타입 정의
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

// 디자이너 프로필 타입 정의
interface DesignerProfile {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  rating: number;
  projectsCompleted: number;
  portfolio: string[];
  description: string;
  tags: string[];
  earnings: number;
  isActive: boolean;
}

// 포트폴리오 아이템들 (전체 제품 목록)
export const portfolioItems: PortfolioItem[] = [
  {
    id: '1',
    title: 'Modern Business Logo Design',
    designer: '김민준',
    imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop',
    price: 150,
    category: 'Logo Design',
    description: '현대적이고 미니멀한 비즈니스 로고 디자인입니다. 다양한 브랜드에 적용 가능한 깔끔한 디자인으로 제작되었습니다.',
    isLiked: false,
    tags: ['Modern', 'Minimalist', 'Business', 'Clean'],
    features: ['고해상도 파일', 'AI, EPS, PNG 형식', '컬러/흑백 버전', '사용 가이드 포함']
  },
  {
    id: '2',
    title: 'Premium Font Family',
    designer: '박지은',
    imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=500&fit=crop',
    price: 89,
    category: 'Font Design',
    description: '우아하고 읽기 쉬운 프리미엄 폰트 패밀리입니다. 다양한 두께와 스타일을 제공합니다.',
    isLiked: true,
    tags: ['Typography', 'Modern', 'Readable', 'Family'],
    features: ['6가지 두께', 'Regular, Italic', '웹폰트 포함', '다국어 지원']
  },
  {
    id: '3',
    title: 'Elegant Business Cards',
    designer: '이현우',
    imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=300&fit=crop',
    price: 75,
    category: 'Business Card Design',
    description: '세련되고 전문적인 명함 디자인입니다. 다양한 업종에 활용 가능한 범용적인 디자인입니다.',
    isLiked: false,
    tags: ['Professional', 'Elegant', 'Versatile', 'Print-ready'],
    features: ['양면 디자인', '인쇄용 파일', '3가지 컬러 버전', '편집 가능한 템플릿']
  },
  {
    id: '4',
    title: 'Creative Startup Logo',
    designer: '김민준',
    imageUrl: 'https://images.unsplash.com/photo-1542744095-291d1f67b221?w=400&h=500&fit=crop',
    price: 199,
    category: 'Logo Design',
    description: '창의적이고 역동적인 스타트업을 위한 로고 디자인입니다. 젊고 혁신적인 이미지를 전달합니다.',
    isLiked: true,
    tags: ['Creative', 'Startup', 'Dynamic', 'Innovative'],
    features: ['브랜드 가이드라인', '애니메이션 버전', '소셜미디어 패키지', '다양한 응용 예시']
  },
  {
    id: '5',
    title: 'Handwritten Script Font',
    designer: '박지은',
    imageUrl: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=650&fit=crop',
    price: 129,
    category: 'Font Design',
    description: '자연스럽고 따뜻한 필기체 폰트입니다. 브랜딩과 제품 패키징에 완벽합니다.',
    isLiked: false,
    tags: ['Handwritten', 'Script', 'Natural', 'Warm'],
    features: ['대소문자', '숫자 및 기호', '리가처', '자연스러운 변형']
  },
  {
    id: '6',
    title: 'Luxury Brand Cards',
    designer: '이현우',
    imageUrl: 'https://images.unsplash.com/photo-1586282023692-349c0f0b4b4c?w=400&h=400&fit=crop',
    price: 120,
    category: 'Business Card Design',
    description: '고급스럽고 우아한 럭셔리 브랜드를 위한 명함 디자인입니다. 프리미엄 소재와 마감을 고려한 디자인입니다.',
    isLiked: true,
    tags: ['Luxury', 'Premium', 'Elegant', 'Gold-foil'],
    features: ['골드 포일 버전', '특수 마감 지침', '럭셔리 소재 가이드', '브랜드 컬러 매칭']
  },
  {
    id: '7',
    title: 'Tech Company Logo',
    designer: '김민준',
    imageUrl: 'https://images.unsplash.com/photo-1508345228704-935cc84bf5e2?w=400&h=450&fit=crop',
    price: 250,
    category: 'Logo Design',
    description: '혁신적인 테크 회사를 위한 현대적 로고 디자인입니다. 기술과 미래지향적 가치를 표현합니다.',
    isLiked: false,
    tags: ['Technology', 'Modern', 'Futuristic', 'Clean'],
    features: ['앱 아이콘 버전', '파비콘 포함', '다크/라이트 모드', '반응형 로고']
  },
  {
    id: '8',
    title: 'Display Font Collection',
    designer: '박지은',
    imageUrl: 'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=400&h=700&fit=crop',
    price: 179,
    category: 'Font Design',
    description: '임팩트 있는 디스플레이 폰트 컬렉션입니다. 헤드라인과 포스터 디자인에 완벽합니다.',
    isLiked: true,
    tags: ['Display', 'Bold', 'Impact', 'Headline'],
    features: ['5가지 스타일', '아웃라인 버전', '그래픽 요소', 'OpenType 기능']
  },
  {
    id: '9',
    title: 'Corporate Business Cards',
    designer: '이현우',
    imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=700&fit=crop',
    price: 85,
    category: 'Business Card Design',
    description: '기업용 명함 디자인으로 신뢰감과 전문성을 전달합니다. 대기업부터 중소기업까지 활용 가능합니다.',
    isLiked: false,
    tags: ['Corporate', 'Professional', 'Trust', 'Conservative'],
    features: ['회사 로고 적용', '부서별 버전', '직급별 디자인', '명함 홀더 템플릿']
  },
  {
    id: '10',
    title: 'Geometric Sans Font',
    designer: '박지은',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    price: 95,
    category: 'Font Design',
    description: '기하학적이고 모던한 산세리프 폰트입니다. 웹과 인쇄물 모두에 적합한 범용 폰트입니다.',
    isLiked: true,
    tags: ['Geometric', 'Sans-serif', 'Modern', 'Versatile'],
    features: ['7가지 두께', '확장 문자셋', '웹폰트 라이선스', '브랜딩 가이드']
  },
  {
    id: '11',
    title: 'Vintage Logo Design',
    designer: '김민준',
    imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop',
    price: 175,
    category: 'Logo Design',
    description: '클래식하고 빈티지한 감성의 로고 디자인입니다. 전통적인 비즈니스와 크래프트 브랜드에 완벽합니다.',
    isLiked: false,
    tags: ['Vintage', 'Classic', 'Traditional', 'Craft'],
    features: ['빈티지 텍스처', '모노그램 버전', '스탬프 스타일', '에이징 효과']
  },
  {
    id: '12',
    title: 'Creative Business Cards',
    designer: '이현우',
    imageUrl: 'https://images.unsplash.com/photo-1586717791821-3de0db5b4b8e?w=400&h=500&fit=crop',
    price: 110,
    category: 'Business Card Design',
    description: '창의적이고 독특한 명함 디자인입니다. 디자이너, 아티스트, 크리에이티브 업계 전문가를 위한 디자인입니다.',
    isLiked: true,
    tags: ['Creative', 'Unique', 'Artistic', 'Designer'],
    features: ['독특한 레이아웃', '컬러 그라디언트', '일러스트 요소', '창의적 타이포그래피']
  }
];

// 디자이너 프로필들
export const designerProfiles: DesignerProfile[] = [
  {
    id: 'designer1',
    name: '김민준',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    specialty: 'Logo Design',
    rating: 4.8,
    projectsCompleted: 85,
    portfolio: ['1', '4', '7', '11'],
    description: '로고 디자인 전문가로 5년간 다양한 브랜드 아이덴티티 프로젝트를 진행했습니다. 미니멀하고 강력한 디자인으로 브랜드의 본질을 표현합니다.',
    tags: ['Logo Design', 'Brand Identity', 'Minimalist', 'Modern'],
    earnings: 28750,
    isActive: true
  },
  {
    id: 'designer2',
    name: '박지은',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616c96ac1b3?w=200&h=200&fit=crop&crop=face',
    specialty: 'Font Design',
    rating: 4.9,
    projectsCompleted: 112,
    portfolio: ['2', '5', '8', '10'],
    description: '타이포그래피 전문가로 7년간 폰트 디자인과 타이포그래피 컨설팅을 진행해왔습니다. 가독성과 아름다움을 동시에 추구합니다.',
    tags: ['Typography', 'Font Design', 'Legibility', 'Custom Fonts'],
    earnings: 35600,
    isActive: true
  },
  {
    id: 'designer3',
    name: '이현우',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    specialty: 'Business Card Design',
    rating: 4.7,
    projectsCompleted: 98,
    portfolio: ['3', '6', '9', '12'],
    description: '브랜드 아이덴티티 전문가로 6년간 명함 디자인과 기업 브랜딩 작업을 해왔습니다. 클라이언트의 비즈니스 목표에 맞는 디자인을 제공합니다.',
    tags: ['Business Cards', 'Brand Identity', 'Corporate', 'Print Design'],
    earnings: 31200,
    isActive: true
  }
];

// 테스트 계정 목록 (testAccounts.ts에서 가져온 데이터를 재가공)
export const testAccounts = TEST_ACCOUNTS.map(account => ({
  id: account.email.split('@')[0],
  email: account.email,
  role: account.role,
  name: account.displayName,
  avatar: account.role === 'designer' ? 
    designerProfiles.find(d => account.email.includes(d.name.replace(' ', '').toLowerCase()))?.avatar || 
    'https://images.unsplash.com/photo-1535713875002-d1d0cf227877?w=200&h=200&fit=crop&crop=face'
    : 'https://images.unsplash.com/photo-1535713875002-d1d0cf227877?w=200&h=200&fit=crop&crop=face'
}));

// 확장된 주문 데이터 (테스트 계정별)
export const mockOrdersByAccount = {
  'demo@aviress.com': [
    {
      id: 'order-demo-1',
      title: 'Minimal Brand Identity',
      designer: 'Sarah Chen',
      category: 'Logo Design',
      imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop',
      price: 299,
      purchaseDate: '2024-01-15',
      status: 'completed' as const,
      downloadUrl: '/downloads/minimal-brand-identity.zip',
      orderNumber: 'AV-2024-001'
    },
    {
      id: 'order-demo-2',
      title: 'Elegant Business Cards',
      designer: 'Maria Santos',
      category: 'Business Card Design',
      imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=300&fit=crop',
      price: 99,
      purchaseDate: '2024-01-10',
      status: 'completed' as const,
      downloadUrl: '/downloads/elegant-business-cards.zip',
      orderNumber: 'AV-2024-002'
    }
  ],
  'premium@aviress.com': [
    {
      id: 'order-premium-1',
      title: 'Corporate Identity System',
      designer: 'Michael Brown',
      category: 'Logo Design',
      imageUrl: 'https://images.unsplash.com/photo-1542744095-291d1f67b221?w=400&h=500&fit=crop',
      price: 599,
      purchaseDate: '2024-01-20',
      status: 'completed' as const,
      downloadUrl: '/downloads/corporate-identity.zip',
      orderNumber: 'AV-2024-003'
    },
    {
      id: 'order-premium-2',
      title: 'Luxury Brand Typeface',
      designer: 'Sophia Williams',
      category: 'Font Design',
      imageUrl: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=650&fit=crop',
      price: 299,
      purchaseDate: '2024-01-18',
      status: 'completed' as const,
      downloadUrl: '/downloads/luxury-typeface.zip',
      orderNumber: 'AV-2024-004'
    },
    {
      id: 'order-premium-3',
      title: 'Tech Startup Logo',
      designer: 'Ryan Mitchell',
      category: 'Logo Design',
      imageUrl: 'https://images.unsplash.com/photo-1508345228704-935cc84bf5e2?w=400&h=450&fit=crop',
      price: 329,
      purchaseDate: '2024-01-22',
      status: 'processing' as const,
      orderNumber: 'AV-2024-005'
    },
    {
      id: 'order-premium-4',
      title: 'Modern Typography System',
      designer: 'Alex Rivera',
      category: 'Font Design',
      imageUrl: 'https://images.unsplash.com/photo-1586717791821-3de0db5b4b8e?w=400&h=500&fit=crop',
      price: 149,
      purchaseDate: '2024-01-25',
      status: 'completed' as const,
      downloadUrl: '/downloads/modern-typography.zip',
      orderNumber: 'AV-2024-006'
    }
  ],
  'designer@aviress.com': [
    {
      id: 'order-designer-1',
      title: 'Architectural Branding',
      designer: 'David Kim',
      category: 'Logo Design',
      imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=700&fit=crop',
      price: 399,
      purchaseDate: '2024-01-12',
      status: 'completed' as const,
      downloadUrl: '/downloads/architectural-branding.zip',
      orderNumber: 'AV-2024-007'
    }
  ],
  'designer2@aviress.com': [
    {
      id: 'order-designer2-1',
      title: 'Custom Font Family',
      designer: 'Emma Johnson',
      category: 'Font Design',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      price: 179,
      purchaseDate: '2024-01-20',
      status: 'completed' as const,
      downloadUrl: '/downloads/custom-font-family.zip',
      orderNumber: 'AV-2024-015'
    },
    {
      id: 'order-designer2-2',
      title: 'Typography Guidelines',
      designer: 'Alex Rivera',
      category: 'Font Design',
      imageUrl: 'https://images.unsplash.com/photo-1586717791821-3de0db5b4b8e?w=400&h=500&fit=crop',
      price: 89,
      purchaseDate: '2024-01-18',
      status: 'completed' as const,
      downloadUrl: '/downloads/typography-guidelines.zip',
      orderNumber: 'AV-2024-016'
    }
  ],
  'designer3@aviress.com': [
    {
      id: 'order-designer3-1',
      title: 'Brand Style Guide',
      designer: 'Sarah Chen',
      category: 'Business Card Design',
      imageUrl: 'https://images.unsplash.com/photo-1586282023692-349c0f0b4b4c?w=400&h=400&fit=crop',
      price: 159,
      purchaseDate: '2024-01-25',
      status: 'completed' as const,
      downloadUrl: '/downloads/brand-style-guide.zip',
      orderNumber: 'AV-2024-017'
    }
  ],
  'admin@aviress.com': [
    {
      id: 'order-admin-1',
      title: 'Display Font Collection',
      designer: 'James Taylor',
      category: 'Font Design',
      imageUrl: 'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=400&h=700&fit=crop',
      price: 199,
      purchaseDate: '2024-01-08',
      status: 'completed' as const,
      downloadUrl: '/downloads/display-fonts.zip',
      orderNumber: 'AV-2024-008'
    }
  ]
};

// 구독 데이터 (테스트 계정별)
export const mockSubscriptionsByAccount = {
  'demo@aviress.com': [],
  'premium@aviress.com': [
    {
      id: 'sub-premium-1',
      name: 'AVIRESS Pro',
      price: 29,
      interval: 'monthly' as const,
      features: [
        'Unlimited downloads',
        'Premium designer access',
        'Early access to new designs',
        'Priority customer support',
        'Commercial license included'
      ],
      status: 'active' as const,
      nextBillingDate: '2024-02-25',
      renewalDate: '2024-02-25'
    }
  ],
  'designer@aviress.com': [
    {
      id: 'sub-designer-1',
      name: 'AVIRESS Designer Plan',
      price: 19,
      interval: 'monthly' as const,
      features: [
        'Portfolio management',
        'Upload unlimited designs',
        'Analytics dashboard',
        'Customer messaging',
        'Revenue tracking'
      ],
      status: 'active' as const,
      nextBillingDate: '2024-02-20',
      renewalDate: '2024-02-20'
    }
  ],
  'designer2@aviress.com': [
    {
      id: 'sub-designer2-1',
      name: 'AVIRESS Pro Designer',
      price: 39,
      interval: 'monthly' as const,
      features: [
        'Premium portfolio showcase',
        'Priority project visibility',
        'Advanced analytics',
        'Client management tools',
        'Revenue optimization'
      ],
      status: 'active' as const,
      nextBillingDate: '2024-02-22',
      renewalDate: '2024-02-22'
    }
  ],
  'designer3@aviress.com': [
    {
      id: 'sub-designer3-1',
      name: 'AVIRESS Designer Plan',
      price: 19,
      interval: 'monthly' as const,
      features: [
        'Portfolio management',
        'Upload unlimited designs',
        'Analytics dashboard',
        'Customer messaging',
        'Revenue tracking'
      ],
      status: 'active' as const,
      nextBillingDate: '2024-02-18',
      renewalDate: '2024-02-18'
    }
  ],
  'admin@aviress.com': [
    {
      id: 'sub-admin-1',
      name: 'AVIRESS Enterprise',
      price: 99,
      interval: 'monthly' as const,
      features: [
        'Full platform access',
        'User management',
        'Analytics & reporting',
        'Content management',
        'Priority support'
      ],
      status: 'active' as const,
      nextBillingDate: '2024-02-15',
      renewalDate: '2024-02-15'
    }
  ]
};

// 즐겨찾기 데이터 (테스트 계정별)
export const mockFavoritesByAccount = {
  'demo@aviress.com': ['1', '3', '5'],
  'premium@aviress.com': ['2', '4', '6', '8', '10'],
  'designer@aviress.com': ['7', '9', '11'],
  'designer2@aviress.com': ['2', '5', '8', '12'],
  'designer3@aviress.com': ['1', '3', '6', '10'],
  'admin@aviress.com': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
};

// 사용자 프로필 데이터 (테스트 계정별)
export const mockUserProfilesByAccount = {
  'demo@aviress.com': {
    firstName: 'Demo',
    lastName: 'User',
    email: 'demo@aviress.com',
    phone: '+1 (555) 123-4567',
    company: 'Demo Company',
    location: 'San Francisco, CA',
    bio: '디자인에 관심이 많은 일반 사용자입니다. AVIRESS에서 다양한 디자인을 탐색하고 구매하고 있습니다.',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf227877?w=200&h=200&fit=crop&crop=face',
    joinDate: '2024-01-01',
    totalPurchases: 2,
    favoriteCategories: ['Logo Design', 'Business Card Design']
  },
  'premium@aviress.com': {
    firstName: 'Premium',
    lastName: 'User',
    email: 'premium@aviress.com',
    phone: '+1 (555) 987-6543',
    company: 'Premium Corp',
    location: 'New York, NY',
    bio: 'AVIRESS Pro 구독자로서 프리미엄 디자인 서비스를 적극 활용하고 있습니다. 브랜딩 전문가입니다.',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616c96ac1b3?w=200&h=200&fit=crop&crop=face',
    joinDate: '2023-12-15',
    totalPurchases: 8,
    favoriteCategories: ['Logo Design', 'Font Design']
  },
  'designer@aviress.com': {
    firstName: '김민준',
    lastName: 'Designer',
    email: 'designer@aviress.com',
    phone: '+82 10-1234-5678',
    company: 'MinJun Design Studio',
    location: 'Seoul, Korea',
    bio: '로고 디자인 전문가로 5년간 다양한 브랜드 아이덴티티 프로젝트를 진행했습니다. 미니멀하고 강력한 디자인으로 브랜드의 본질을 표현합니다.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    joinDate: '2023-06-01',
    totalPurchases: 1,
    favoriteCategories: ['Logo Design'],
    designerStats: {
      totalSales: 85,
      rating: 4.8,
      totalRevenue: 28750,
      activeProjects: 7,
      completedProjects: 65
    }
  },
  'designer2@aviress.com': {
    firstName: '박지은',
    lastName: 'Designer',
    email: 'designer2@aviress.com',
    phone: '+82 10-2345-6789',
    company: 'JiEun Typography Studio',
    location: 'Busan, Korea',
    bio: '타이포그래피 전문��로 7년간 폰트 디자인과 타이포그래피 컨설팅을 진행해왔습니다. 가독성과 아름다움을 동시에 추구합니다.',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616c96ac1b3?w=200&h=200&fit=crop&crop=face',
    joinDate: '2023-03-15',
    totalPurchases: 2,
    favoriteCategories: ['Font Design', 'Typography'],
    designerStats: {
      totalSales: 112,
      rating: 4.9,
      totalRevenue: 35600,
      activeProjects: 9,
      completedProjects: 78
    }
  },
  'designer3@aviress.com': {
    firstName: '이현우',
    lastName: 'Designer',
    email: 'designer3@aviress.com',
    phone: '+82 10-3456-7890',
    company: 'HyunWoo Brand Studio',
    location: 'Incheon, Korea',
    bio: '브랜드 아이덴티티 전문가로 6년간 명함 디자인과 기업 브랜딩 작업을 해왔습니다. 클라이언트의 비즈니스 목표에 맞는 디자인을 제공합니다.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    joinDate: '2023-08-10',
    totalPurchases: 1,
    favoriteCategories: ['Business Card Design', 'Brand Identity'],
    designerStats: {
      totalSales: 98,
      rating: 4.7,
      totalRevenue: 31200,
      activeProjects: 6,
      completedProjects: 72
    }
  },
  'admin@aviress.com': {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@aviress.com',
    phone: '+1 (555) 000-0000',
    company: 'AVIRESS Inc.',
    location: 'Seattle, WA',
    bio: 'AVIRESS 플랫폼의 관리자입니다. 플랫폼 운영 및 사용자 지원을 담당하고 있습니다.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    joinDate: '2023-01-01',
    totalPurchases: 1,
    favoriteCategories: ['Logo Design', 'Font Design', 'Business Card Design'],
    adminStats: {
      totalUsers: 1250,
      totalDesigners: 87,
      totalRevenue: 234560,
      monthlyGrowth: 12.5
    }
  }
};

// 알림 데이터 (테스트 계정별)
export const mockNotificationsByAccount = {
  'demo@aviress.com': [
    {
      id: 'notif-demo-1',
      type: 'purchase' as const,
      title: '구매 완료',
      message: 'Minimal Brand Identity 다운로드가 준비되었습니다.',
      timestamp: '2024-01-15T10:30:00Z',
      read: false
    },
    {
      id: 'notif-demo-2',
      type: 'info' as const,
      title: '새로운 디자이너',
      message: 'Emma Johnson이 새로운 작품을 업로드했습니다.',
      timestamp: '2024-01-14T15:45:00Z',
      read: true
    }
  ],
  'premium@aviress.com': [
    {
      id: 'notif-premium-1',
      type: 'purchase' as const,
      title: '프리미엄 구매',
      message: 'Corporate Identity System 다운로드 준비 완료',
      timestamp: '2024-01-20T09:15:00Z',
      read: false
    },
    {
      id: 'notif-premium-2',
      type: 'subscription' as const,
      title: '구독 갱신',
      message: 'AVIRESS Pro 구독이 곧 갱신됩니다.',
      timestamp: '2024-01-19T12:00:00Z',
      read: false
    },
    {
      id: 'notif-premium-3',
      type: 'exclusive' as const,
      title: '독점 액세스',
      message: '신규 프리미엄 디자이너 작품에 우선 접근하세요.',
      timestamp: '2024-01-18T16:30:00Z',
      read: true
    }
  ],
  'designer@aviress.com': [
    {
      id: 'notif-designer-1',
      type: 'sale' as const,
      title: '작품 판매',
      message: 'Minimal Brand Identity가 판매되었습니다. 수익: $239.20',
      timestamp: '2024-01-15T11:00:00Z',
      read: false
    },
    {
      id: 'notif-designer-2',
      type: 'review' as const,
      title: '새로운 리뷰',
      message: '고객이 5성 리뷰를 남겼습니다.',
      timestamp: '2024-01-14T14:20:00Z',
      read: true
    }
  ],
  'admin@aviress.com': [
    {
      id: 'notif-admin-1',
      type: 'system' as const,
      title: '시스템 알림',
      message: '새로운 디자이너 승인 요청이 있습니다.',
      timestamp: '2024-01-22T08:30:00Z',
      read: false
    },
    {
      id: 'notif-admin-2',
      type: 'report' as const,
      title: '월간 리포트',
      message: '1월 플랫폼 성과 리포트가 준비되었습니다.',
      timestamp: '2024-01-21T17:00:00Z',
      read: false
    }
  ]
};

// 테스트 계정별 데이터 가져오기 헬퍼 함수들
export const getOrdersByAccount = (email: string) => {
  return mockOrdersByAccount[email as keyof typeof mockOrdersByAccount] || [];
};

export const getSubscriptionsByAccount = (email: string) => {
  return mockSubscriptionsByAccount[email as keyof typeof mockSubscriptionsByAccount] || [];
};

export const getFavoritesByAccount = (email: string) => {
  return mockFavoritesByAccount[email as keyof typeof mockFavoritesByAccount] || [];
};

export const getUserProfileByAccount = (email: string) => {
  return mockUserProfilesByAccount[email as keyof typeof mockUserProfilesByAccount] || null;
};

export const getNotificationsByAccount = (email: string) => {
  return mockNotificationsByAccount[email as keyof typeof mockNotificationsByAccount] || [];
};

// 모든 목업 데이터를 초기화하는 함수
export const initializeMockDataForAccount = (email: string) => {
  return {
    orders: getOrdersByAccount(email),
    subscriptions: getSubscriptionsByAccount(email),
    favorites: getFavoritesByAccount(email),
    profile: getUserProfileByAccount(email),
    notifications: getNotificationsByAccount(email)
  };
};

export default {
  mockOrdersByAccount,
  mockSubscriptionsByAccount,
  mockFavoritesByAccount,
  mockUserProfilesByAccount,
  mockNotificationsByAccount,
  getOrdersByAccount,
  getSubscriptionsByAccount,
  getFavoritesByAccount,
  getUserProfileByAccount,
  getNotificationsByAccount,
  initializeMockDataForAccount
};
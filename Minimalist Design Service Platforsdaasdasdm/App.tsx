import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ========================================
// 컴포넌트 임포트 섹션
// ========================================

// 기본 레이아웃 컴포넌트들
import Header from './components/Header';
import InitialLoading from './components/InitialLoading';
import TransitionProvider from './components/TransitionProvider';
import { ImageWithFallback } from './components/figma/ImageWithFallback';

// 페이지 컴포넌트들
import HeroSlider from './components/HeroSlider';
import QuickLinks from './components/QuickLinks';
import PortfolioGrid from './components/PortfolioGrid';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import DesignerPortfolioPage from './components/DesignerPortfolioPage';

// 전문 페이지 컴포넌트들 (각 카테고리별)
import ProductsPage from './components/pages/ProductsPage';
import LogoDesignPage from './components/pages/LogoDesignPage';
import FontDesignPage from './components/pages/FontDesignPage';
import BusinessCardsPage from './components/pages/BusinessCardsPage';
import DesignersPage from './components/pages/DesignersPage';
import PortfolioUploadPage from './components/pages/PortfolioUploadPage';

// 대시보드 컴포넌트들 (통합 대시보드 시스템)
import DashboardPages from './components/pages/DashboardPages';

// 모달 컴포넌트들 (사용자 상호작용용)
import StyleSelectionModal from './components/StyleSelectionModal';
import RevisionRequestModal from './components/RevisionRequestModal';
import ProjectRequestModal from './components/ProjectRequestModal';
import DesignerQuestionModal from './components/DesignerQuestionModal';
import ProjectAcceptRejectModal from './components/ProjectAcceptRejectModal';
import CustomFormCreatorModal from './components/CustomFormCreatorModal';
import EnhancedProjectRequestModal from './components/EnhancedProjectRequestModal';
import PublicProjectBoardModal from './components/PublicProjectBoardModal';

// 유틸리티 임포트들
import { portfolioItems, designerProfiles, testAccounts } from './utils/mockData';
import { supabase, signInWithEmail, signUpWithEmail, signOut } from './utils/supabase';

// ========================================
// 타입 정의 섹션
// ========================================

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

// 주문 정보 타입 정의
interface Order {
  id: string;
  productId: string;
  productTitle: string;
  designer: string;
  price: number;
  status: 'completed' | 'in-progress' | 'pending';
  orderDate: string;
  imageUrl: string;
  downloadUrl?: string;
  remainingRevisions: number;
  selectedStyles?: string[];
}

// 구독 정보 타입 정의
interface Subscription {
  id: string;
  plan: string;
  status: 'active' | 'cancelled' | 'pending';
  nextBilling: string;
  price: number;
}

// 수정 요청 타입 정의
interface RevisionRequest {
  id: string;
  orderId: string;
  requestText: string;
  status: 'pending' | 'completed' | 'in-progress';
  createdAt: string;
  response?: string;
}

// 프로젝트 요청 타입 정의
interface ProjectRequest {
  id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
  clientId: string;
  assignedDesigner?: string;
  createdAt: string;
  isRush?: boolean;
  rushFee?: number;
  premiumConcepts?: number;
  premiumRevisions?: number;
  selectedForm?: string;
}

// 디자이너 질문 타입 정의
interface DesignerQuestion {
  id: string;
  projectId: string;
  designerId: string;
  question: string;
  answer?: string;
  status: 'pending' | 'answered';
  createdAt: string;
}

// 커스텀 폼 타입 정의
interface CustomForm {
  id: string;
  designerId: string;
  title: string;
  description: string;
  fields: Array<{
    id: string;
    type: 'text' | 'textarea' | 'select' | 'checkbox';
    label: string;
    required: boolean;
    options?: string[];
  }>;
  createdAt: string;
}

// 공개 프로젝트 타입 정의
interface PublicProject {
  id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  clientId: string;
  proposals: Array<{
    designerId: string;
    designerName: string;
    proposal: string;
    estimatedPrice: number;
    estimatedDuration: string;
  }>;
  status: 'open' | 'assigned' | 'completed';
  createdAt: string;
}

// 사용자 타입 정의
interface User {
  id: string;
  email: string;
  role: 'customer' | 'designer';
  name: string;
  avatar?: string;
}

// ========================================
// 애니메이션 변형 정의
// ========================================

// 페이지 전환 애니메이션 설정
const premiumPageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 1.02,
    transition: {
      duration: 0.4,
      ease: [0.55, 0.085, 0.68, 0.53],
    },
  },
};

// ========================================
// 메인 앱 컴포넌트
// ========================================
export default function App() {
  // =====================================
  // 상태 관리 섹션
  // =====================================

  // 기본 앱 상태들
  const [isLoading, setIsLoading] = useState(true);                    // 초기 로딩 상태
  const [currentSection, setCurrentSection] = useState('home');        // 현재 활성 섹션
  const [isLoggedIn, setIsLoggedIn] = useState(false);                // 로그인 상태
  const [user, setUser] = useState<User | null>(null);                // 현재 사용자 정보

  // 선택된 항목들 상태
  const [selectedProduct, setSelectedProduct] = useState<PortfolioItem | null>(null);     // 선택된 제품
  const [selectedDesigner, setSelectedDesigner] = useState<string | null>(null);          // 선택된 디자이너

  // 사용자 데이터 상태들
  const [orders, setOrders] = useState<Order[]>([]);                   // 사용자 주문 목록
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);  // 사용자 구독 목록
  const [revisionRequests, setRevisionRequests] = useState<RevisionRequest[]>([]);  // 수정 요청 목록
  const [projectRequests, setProjectRequests] = useState<ProjectRequest[]>([]);      // 프로젝트 요청 목록
  const [designerQuestions, setDesignerQuestions] = useState<DesignerQuestion[]>([]);  // 디자이너 질문 목록
  const [customForms, setCustomForms] = useState<CustomForm[]>([]);    // 커스텀 폼 목록
  const [publicProjects, setPublicProjects] = useState<PublicProject[]>([]);  // 공개 프로젝트 목록

  // 모달 상태들 (각 모달의 열림/닫힘 상태 관리)
  const [isStyleSelectionOpen, setIsStyleSelectionOpen] = useState(false);
  const [isRevisionRequestOpen, setIsRevisionRequestOpen] = useState(false);
  const [isProjectRequestOpen, setIsProjectRequestOpen] = useState(false);
  const [isDesignerQuestionOpen, setIsDesignerQuestionOpen] = useState(false);
  const [isProjectAcceptRejectOpen, setIsProjectAcceptRejectOpen] = useState(false);
  const [isCustomFormCreatorOpen, setIsCustomFormCreatorOpen] = useState(false);
  const [isEnhancedProjectRequestOpen, setIsEnhancedProjectRequestOpen] = useState(false);
  const [isPublicProjectBoardOpen, setIsPublicProjectBoardOpen] = useState(false);

  // 모달에서 사용할 선택된 항목들
  const [selectedProductForPurchase, setSelectedProductForPurchase] = useState<PortfolioItem | null>(null);
  const [selectedOrderForRevision, setSelectedOrderForRevision] = useState<Order | null>(null);
  const [selectedProjectForQuestions, setSelectedProjectForQuestions] = useState<ProjectRequest | null>(null);
  const [selectedProjectForDecision, setSelectedProjectForDecision] = useState<ProjectRequest | null>(null);

  // 인증 관련 상태들
  const [authLoading, setAuthLoading] = useState(false);               // 인증 처리 중 로딩 상태
  const [authError, setAuthError] = useState<string | null>(null);     // 인증 에러 메시지

  // =====================================
  // 초기화 및 생명주기 관리
  // =====================================

  // 컴포넌트 마운트 시 초기화 작업
  useEffect(() => {
    // 기존 사용자 세션 확인 (로딩과 별도로 실행)
    checkUserSession();
  }, []);

  // 로딩 완료 핸들러
  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  // 사용자 세션 확인 함수
  const checkUserSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // 세션이 있으면 사용자 정보 설정
        const userData = {
          id: session.user.id,
          email: session.user.email || '',
          role: (session.user.user_metadata?.role || 'customer') as 'customer' | 'designer',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
          avatar: session.user.user_metadata?.avatar_url,
        };
        setUser(userData);
        setIsLoggedIn(true);
        
        // 사용자 데이터 로드
        loadUserData(userData.id, userData.role);
      }
    } catch (error) {
      console.error('세션 확인 중 오류:', error);
    }
  };

  // 사용자 데이터 로드 함수 (주문, 구독 등)
  const loadUserData = (userId: string, role: 'customer' | 'designer') => {
    if (role === 'customer') {
      loadCustomerData(userId);
    } else {
      loadDesignerData(userId);
    }
  };

  // 고객 데이터 로드
  const loadCustomerData = (userId: string) => {
    // 모캣 주문 데이터 설정
    const mockOrders: Order[] = [
      {
        id: '1',
        productId: '1',
        productTitle: 'Modern Business Logo Design',
        designer: '김민준',
        price: 150,
        status: 'completed',
        orderDate: '2024-01-15',
        imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400',
        downloadUrl: '/downloads/logo-design-1.zip',
        remainingRevisions: 2,
        selectedStyles: ['Minimalist', 'Modern']
      },
      {
        id: '2',
        productId: '2',
        productTitle: 'Premium Font Family',
        designer: '박지은',
        price: 89,
        status: 'in-progress',
        orderDate: '2024-01-20',
        imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400',
        remainingRevisions: 3
      }
    ];

    // 모캣 구독 데이터 설정
    const mockSubscriptions: Subscription[] = [
      {
        id: '1',
        plan: 'Pro Designer Access',
        status: 'active',
        nextBilling: '2024-02-15',
        price: 29.99
      }
    ];

    setOrders(mockOrders);
    setSubscriptions(mockSubscriptions);
  };

  // 디자이너 데이터 로드
  const loadDesignerData = (userId: string) => {
    // 모캣 프로젝트 요청 데이터
    const mockProjectRequests: ProjectRequest[] = [
      {
        id: '1',
        title: '스타트업 브랜딩 패키지',
        description: '새로운 테크 스타트업을 위한 완전한 브랜딩 패키지가 필요합니다.',
        budget: 2500,
        deadline: '2024-02-28',
        status: 'open',
        clientId: 'client-1',
        createdAt: '2024-01-22',
        isRush: false
      },
      {
        id: '2',
        title: '레스토랑 메뉴 디자인',
        description: '고급 이탈리안 레스토랑을 위한 메뉴 디자인',
        budget: 800,
        deadline: '2024-02-10',
        status: 'open',
        clientId: 'client-2',
        createdAt: '2024-01-20',
        isRush: true,
        rushFee: 200
      }
    ];

    setProjectRequests(mockProjectRequests);
  };

  // =====================================
  // 네비게이션 핸들러 함수들
  // =====================================

  // 메인 네비게이션 함수 - 모든 페이지 이동을 처리
  const handleNavigation = (section: string) => {
    setCurrentSection(section);
    setSelectedProduct(null);      // 제품 선택 초기화
    setSelectedDesigner(null);     // 디자이너 선택 초기화
    setAuthError(null);           // 인증 에러 초기화
  };

  // 제품 클릭 핸들러 - 제품 상세 페이지로 이동
  const handleProductClick = (product: PortfolioItem) => {
    setSelectedProduct(product);
    setCurrentSection('product-detail');
  };

  // 디자이너 클릭 핸들러 - 디자이너 포트폴리오 페이지로 이동
  const handleDesignerClick = (designerName: string) => {
    setSelectedDesigner(designerName);
    setCurrentSection('designer-portfolio');
  };

  // 제품 목록으로 돌아가기
  const handleBackToProducts = () => {
    setSelectedProduct(null);
    setCurrentSection('products');
  };

  // 디자이너 목록으로 돌아가기
  const handleBackToDesigners = () => {
    setSelectedDesigner(null);
    setCurrentSection('designers');
  };

  // 대시보드로 돌아가기
  const handleBackToDashboard = () => {
    if (user?.role === 'designer') {
      setCurrentSection('designer-analytics');
    } else {
      setCurrentSection('orders');
    }
  };

  // =====================================
  // 인증 관련 핸들러 함수들
  // =====================================

  // 로그인 처리 함수
  const handleLogin = async (email: string, password: string) => {
    setAuthLoading(true);
    setAuthError(null);

    try {
      // 테스트 계정 확인
      const testAccount = testAccounts.find(account => account.email === email);
      
      if (testAccount && password === 'test123') {
        // 테스트 계정으로 로그인
        const userData: User = {
          id: testAccount.id,
          email: testAccount.email,
          role: testAccount.role,
          name: testAccount.name,
          avatar: testAccount.avatar
        };
        
        setUser(userData);
        setIsLoggedIn(true);
        loadUserData(userData.id, userData.role);
        
        // 역할에 따라 적절한 대시보드로 이동
        if (userData.role === 'designer') {
          handleNavigation('designer-analytics');
        } else {
          handleNavigation('orders');
        }
      } else {
        // 실제 Supabase 인증
        const { data, error } = await signInWithEmail(email, password);
        
        if (error) {
          setAuthError(error.message);
        } else if (data.user) {
          const userData: User = {
            id: data.user.id,
            email: data.user.email || '',
            role: (data.user.user_metadata?.role || 'customer') as 'customer' | 'designer',
            name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
            avatar: data.user.user_metadata?.avatar_url
          };
          
          setUser(userData);
          setIsLoggedIn(true);
          loadUserData(userData.id, userData.role);
          
          // 역할에 따라 적절한 대시보드로 이동
          if (userData.role === 'designer') {
            handleNavigation('designer-analytics');
          } else {
            handleNavigation('orders');
          }
        }
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      setAuthError('로그인 처리 중 오류가 발생했습니다.');
    } finally {
      setAuthLoading(false);
    }
  };

  // 회원가입 처리 함수
  const handleSignup = async (email: string, password: string, name: string, role: 'customer' | 'designer') => {
    setAuthLoading(true);
    setAuthError(null);

    try {
      const { data, error } = await signUpWithEmail(email, password, {
        name,
        role,
      });

      if (error) {
        setAuthError(error.message);
      } else if (data.user) {
        // 회원가입 성공 - 이메일 확인 필요
        setAuthError('회원가입이 완료되었습니다. 이메일을 확인해주세요.');
        setTimeout(() => {
          handleNavigation('login');
        }, 2000);
      }
    } catch (error) {
      console.error('회원가입 오류:', error);
      setAuthError('회원가입 처리 중 오류가 발생했습니다.');
    } finally {
      setAuthLoading(false);
    }
  };

  // 로그아웃 처리 함수
  const handleLogout = async () => {
    try {
      await signOut();
      setUser(null);
      setIsLoggedIn(false);
      setOrders([]);
      setSubscriptions([]);
      setRevisionRequests([]);
      setProjectRequests([]);
      setDesignerQuestions([]);
      setCustomForms([]);
      setPublicProjects([]);
      handleNavigation('home');
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  // =====================================
  // 상호작용 핸들러 함수들
  // =====================================

  // 좋아요 토글 핸들러
  const handleLike = (productId: string) => {
    // 포트폴리오 아이템의 좋아요 상태를 토글
    // 실제 구현에서는 서버에 상태를 저장해야 함
    console.log(`좋아요 토글: ${productId}`);
  };

  // 제품 구매 핸들러
  const handlePurchase = (product: PortfolioItem) => {
    if (!isLoggedIn) {
      handleNavigation('login');
      return;
    }
    
    setSelectedProductForPurchase(product);
    setIsStyleSelectionOpen(true);
  };

  // 스타일 선택 완료 핸들러
  const handleStyleSelection = (product: PortfolioItem, selectedStyles: string[]) => {
    // 새 주문 생성
    const newOrder: Order = {
      id: Date.now().toString(),
      productId: product.id,
      productTitle: product.title,
      designer: product.designer,
      price: product.price,
      status: 'pending',
      orderDate: new Date().toISOString().split('T')[0],
      imageUrl: product.imageUrl,
      remainingRevisions: 3,
      selectedStyles
    };

    setOrders(prev => [newOrder, ...prev]);
    setIsStyleSelectionOpen(false);
    setSelectedProductForPurchase(null);
    
    // 주문 완료 후 주문 페이지로 이동
    handleNavigation('orders');
  };

  // 다운로드 핸들러
  const handleDownload = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order?.downloadUrl) {
      // 실제 다운로드 로직
      window.open(order.downloadUrl, '_blank');
    } else {
      console.log('다운로드 파일이 준비되지 않았습니다.');
    }
  };

  // 수정 요청 핸들러
  const handleRevisionRequest = (order: Order) => {
    setSelectedOrderForRevision(order);
    setIsRevisionRequestOpen(true);
  };

  // 수정 요청 제출 핸들러
  const handleRevisionSubmit = (orderId: string, requestText: string) => {
    const newRevision: RevisionRequest = {
      id: Date.now().toString(),
      orderId,
      requestText,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setRevisionRequests(prev => [newRevision, ...prev]);
    
    // 주문의 남은 수정 횟수 감소
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, remainingRevisions: Math.max(0, order.remainingRevisions - 1) }
        : order
    ));

    setIsRevisionRequestOpen(false);
    setSelectedOrderForRevision(null);
  };

  // 기본 프로젝트 요청 핸들러
  const handleProjectRequest = (projectData: any) => {
    const newProject: ProjectRequest = {
      id: Date.now().toString(),
      title: projectData.title,
      description: projectData.description,
      budget: projectData.budget,
      deadline: projectData.deadline,
      status: 'open',
      clientId: user?.id || 'anonymous',
      createdAt: new Date().toISOString()
    };

    setProjectRequests(prev => [newProject, ...prev]);
    setIsProjectRequestOpen(false);
  };

  // 향상된 프로젝트 요청 핸들러
  const handleEnhancedProjectRequest = (projectData: any) => {
    const newProject: ProjectRequest = {
      id: Date.now().toString(),
      title: projectData.title,
      description: projectData.description,
      budget: projectData.budget,
      deadline: projectData.deadline,
      status: 'open',
      clientId: user?.id || 'anonymous',
      createdAt: new Date().toISOString(),
      isRush: projectData.isRush,
      rushFee: projectData.rushFee,
      premiumConcepts: projectData.premiumConcepts,
      premiumRevisions: projectData.premiumRevisions,
      selectedForm: projectData.selectedForm
    };

    setProjectRequests(prev => [newProject, ...prev]);
    setIsEnhancedProjectRequestOpen(false);
  };

  // 디자이너 질문 핸들러
  const handleDesignerQuestion = (project: ProjectRequest) => {
    setSelectedProjectForQuestions(project);
    setIsDesignerQuestionOpen(true);
  };

  // 질문 제출 핸들러
  const handleQuestionSubmit = (projectId: string, question: string) => {
    const newQuestion: DesignerQuestion = {
      id: Date.now().toString(),
      projectId,
      designerId: user?.id || '',
      question,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setDesignerQuestions(prev => [newQuestion, ...prev]);
    setIsDesignerQuestionOpen(false);
    setSelectedProjectForQuestions(null);
  };

  // 프로젝트 결정 핸들러
  const handleProjectDecision = (project: ProjectRequest) => {
    setSelectedProjectForDecision(project);
    setIsProjectAcceptRejectOpen(true);
  };

  // 프로젝트 수락 핸들러
  const handleProjectAccept = (projectId: string, message: string) => {
    setProjectRequests(prev => prev.map(project =>
      project.id === projectId
        ? { ...project, status: 'in-progress', assignedDesigner: user?.name }
        : project
    ));
    setIsProjectAcceptRejectOpen(false);
    setSelectedProjectForDecision(null);
  };

  // 프로젝트 거절 핸들러
  const handleProjectReject = (projectId: string, reason: string) => {
    // 프로젝트 상태는 open으로 유지 (다른 디자이너가 수락할 수 있도록)
    setIsProjectAcceptRejectOpen(false);
    setSelectedProjectForDecision(null);
  };

  // 커스텀 폼 생성 핸들러
  const handleCustomFormCreate = (formData: any) => {
    const newForm: CustomForm = {
      id: Date.now().toString(),
      designerId: user?.id || '',
      title: formData.title,
      description: formData.description,
      fields: formData.fields,
      createdAt: new Date().toISOString()
    };

    setCustomForms(prev => [newForm, ...prev]);
    setIsCustomFormCreatorOpen(false);
  };

  // 공개 프로젝트 생성 핸들러
  const handlePublicProjectCreate = (projectData: any) => {
    const newPublicProject: PublicProject = {
      id: Date.now().toString(),
      title: projectData.title,
      description: projectData.description,
      budget: projectData.budget,
      deadline: projectData.deadline,
      clientId: user?.id || 'anonymous',
      proposals: [],
      status: 'open',
      createdAt: new Date().toISOString()
    };

    setPublicProjects(prev => [newPublicProject, ...prev]);
  };

  // 프로젝트 제안 핸들러
  const handleProjectPropose = (projectId: string, proposalData: any) => {
    setPublicProjects(prev => prev.map(project =>
      project.id === projectId
        ? {
            ...project,
            proposals: [...project.proposals, {
              designerId: user?.id || '',
              designerName: user?.name || '',
              proposal: proposalData.proposal,
              estimatedPrice: proposalData.estimatedPrice,
              estimatedDuration: proposalData.estimatedDuration
            }]
          }
        : project
    ));
  };

  // =====================================
  // 렌더링 섹션
  // =====================================

  // 로딩 중일 때 로딩 화면 표시
  if (isLoading) {
    return <InitialLoading onComplete={handleLoadingComplete} />;
  }

  return (
    <TransitionProvider>
      <motion.div 
        className="min-h-screen bg-background relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* =====================================
            헤더 컴포넌트 (전역 네비게이션)
            ===================================== */}
        <Header
          currentSection={currentSection}        // 현재 활성 섹션
          onNavigate={handleNavigation}          // 네비게이션 함수
          isLoggedIn={isLoggedIn}               // 로그인 상태
          user={user}                           // 사용자 정보
          onLogout={handleLogout}               // 로그아웃 함수
          onProjectRequest={() => setIsEnhancedProjectRequestOpen(true)}     // 프로젝트 요청 모달 열기
          onPublicProjectBoard={() => setIsPublicProjectBoardOpen(true)}     // 공개 프로젝트 게시판 열기
        />

        {/* =====================================
            메인 콘텐츠 영역 (페이지별 렌더링)
            ===================================== */}
        <AnimatePresence mode="wait">

          {/* === 홈페이지 === */}
          {currentSection === 'home' && (
            <motion.div
              key="home"
              variants={premiumPageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="pt-20"
            >
              {/* 히어로 슬라이더 섹션 */}
              <HeroSlider
                onNavigate={handleNavigation}
                portfolioItems={portfolioItems || []}
              />
              
              {/* 빠른 링크 섹션 */}
              <QuickLinks onNavigate={handleNavigation} />
              
              {/* 포트폴리오 그리드 섹션 */}
              <section className="py-20">
                <div className="container mx-auto px-8">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="space-y-12"
                  >
                    <h2 className="text-center">Featured Designs</h2>
                    <div className="w-full">
                      <PortfolioGrid
                        items={(portfolioItems || []).slice(0, 12)}  // 처음 12개만 표시
                        onItemClick={handleProductClick}
                        onDesignerClick={handleDesignerClick}
                        onLike={handleLike}
                        onPurchase={handlePurchase}
                        isLoggedIn={isLoggedIn}
                      />
                    </div>
                  </motion.div>
                </div>
              </section>
            </motion.div>
          )}

          {/* === 제품 페이지들 === */}
          
          {/* 전체 제품 페이지 */}
          {currentSection === 'products' && (
            <ProductsPage
              key="products"
              items={portfolioItems || []}
              onItemClick={handleProductClick}
              onDesignerClick={handleDesignerClick}
              onLike={handleLike}
              onPurchase={handlePurchase}
              isLoggedIn={isLoggedIn}
            />
          )}

          {/* 로고 디자인 페이지 */}
          {currentSection === 'logo-design' && (
            <LogoDesignPage
              key="logo-design"
              items={(portfolioItems || []).filter(item => item.category === 'Logo Design')} // 로고만 필터링
              onItemClick={handleProductClick}
              onDesignerClick={handleDesignerClick}
              onLike={handleLike}
              onPurchase={handlePurchase}
              isLoggedIn={isLoggedIn}
            />
          )}

          {/* 폰트 디자인 페이지 */}
          {currentSection === 'font-design' && (
            <FontDesignPage
              key="font-design"
              items={(portfolioItems || []).filter(item => item.category === 'Font Design')} // 폰트만 필터링
              onItemClick={handleProductClick}
              onDesignerClick={handleDesignerClick}
              onLike={handleLike}
              onPurchase={handlePurchase}
              isLoggedIn={isLoggedIn}
            />
          )}

          {/* 명함 디자인 페이지 */}
          {currentSection === 'business-cards' && (
            <BusinessCardsPage
              key="business-cards"
              items={(portfolioItems || []).filter(item => item.category === 'Business Card Design')} // 명함만 필터링
              onItemClick={handleProductClick}
              onDesignerClick={handleDesignerClick}
              onLike={handleLike}
              onPurchase={handlePurchase}
              isLoggedIn={isLoggedIn}
            />
          )}

          {/* 디자이너 목록 페이지 */}
          {currentSection === 'designers' && (
            <DesignersPage
              key="designers"
              designers={designerProfiles || []}
              onDesignerClick={handleDesignerClick}
              portfolioItems={portfolioItems || []}
            />
          )}

          {/* === 디자이너 포트폴리오 상세 페이지 === */}
          {currentSection === 'designer-portfolio' && selectedDesigner && (
            <DesignerPortfolioPage
              key={`designer-${selectedDesigner}`} // 디자이너별 고유 키
              designerName={selectedDesigner}           // 선택된 디자이너 이름
              items={(portfolioItems || []).filter(item => item.designer === selectedDesigner)} // 해당 디자이너의 작품만
              onItemClick={handleProductClick}          // 제품 클릭 핸들러
              onLike={handleLike}                      // 좋아요 핸들러
              onBack={handleBackToDesigners}            // 디자이너 목록으로 돌아가기 (수정됨)
              onPurchase={handlePurchase}              // 구매 핸들러
              isLoggedIn={isLoggedIn}                  // 로그인 상태
            />
          )}

          {/* === 제품 상세 페이지 === */}
          {currentSection === 'product-detail' && selectedProduct && (
            <motion.div
              key={`product-${selectedProduct.id}`}   // 제품별 고유 키
              variants={premiumPageVariants}          // 페이지 전환 애니메이션
              initial="initial"
              animate="animate"
              exit="exit"
              className="pt-20 min-h-screen"
            >
              <div className="container mx-auto px-8 py-16">
                <motion.div
                  className="max-w-4xl mx-auto"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {/* 뒤로가기 버튼 - z-index와 포커스 수정 */}
                  <motion.button
                    onClick={handleBackToProducts}
                    className="standard-button mb-8 flex items-center gap-2 focus-none relative"
                    style={{ zIndex: 1002 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="liquid-glass-bg-hover"></div>
                    <span className="relative z-10">← Back to Products</span>
                  </motion.button>

                  {/* 제품 상세 내용 */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* 제품 이미지 */}
                    <motion.div
                      className="aspect-[4/5] overflow-hidden rounded-2xl"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    >
                      <ImageWithFallback
                        src={selectedProduct.imageUrl}
                        alt={selectedProduct.title}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>

                    {/* 제품 정보 */}
                    <motion.div
                      className="space-y-8"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      {/* 기본 정보 */}
                      <div>
                        <h1 className="mb-4">{selectedProduct.title}</h1>
                        <div className="flex items-center gap-4 mb-4">
                          <span className="text-secondary">by</span>
                          <motion.button
                            onClick={() => handleDesignerClick(selectedProduct.designer)}
                            className="standard-button focus-none relative"
                            style={{ zIndex: 1002 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="liquid-glass-bg-hover"></div>
                            <span className="relative z-10">{selectedProduct.designer}</span>
                          </motion.button>
                        </div>
                        <p className="text-secondary text-lg">{selectedProduct.description}</p>
                      </div>

                      {/* 가격 및 액션 */}
                      <div className="simple-card">
                        <div className="liquid-glass-bg-hover"></div>
                        <div className="relative z-10 p-6">
                          <div className="flex items-center justify-between mb-6">
                            <span className="text-3xl font-semibold">${selectedProduct.price}</span>
                            <motion.button
                              onClick={() => handleLike(selectedProduct.id)}
                              className="heart-button-clean"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <div className="liquid-glass-bg-hover"></div>
                              <span className="relative z-10 text-xl">
                                {selectedProduct.isLiked ? '❤️' : '🤍'}
                              </span>
                            </motion.button>
                          </div>
                          
                          <motion.button
                            onClick={() => handlePurchase(selectedProduct)}
                            className="primary-button-hover w-full mb-4 focus-none relative"
                            style={{ zIndex: 1002 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="liquid-glass-bg-hover"></div>
                            <span className="relative z-10">Purchase Design</span>
                          </motion.button>

                          <motion.button
                            onClick={() => setIsEnhancedProjectRequestOpen(true)}
                            className="standard-button w-full focus-none relative"
                            style={{ zIndex: 1002 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="liquid-glass-bg-hover"></div>
                            <span className="relative z-10">Request Custom Version</span>
                          </motion.button>
                        </div>
                      </div>

                      {/* 포함된 기능들 */}
                      {selectedProduct.features && (
                        <div className="simple-card">
                          <div className="liquid-glass-bg-hover"></div>
                          <div className="relative z-10 p-6">
                            <h4 className="mb-4">What's Included</h4>
                            <ul className="space-y-2">
                              {selectedProduct.features.map((feature, index) => (
                                <li key={index} className="flex items-center gap-3">
                                  <span className="text-green-400">✓</span>
                                  <span className="text-secondary">{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* 태그들 */}
                      {selectedProduct.tags && (
                        <div>
                          <h4 className="mb-4">Tags</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedProduct.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-secondary/50 rounded-full text-secondary text-sm"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* === 인증 페이지들 === */}
          
          {/* 로그인 페이지 */}
          {currentSection === 'login' && (
            <LoginPage
              key="login"
              onLogin={handleLogin}                    // 로그인 핸들러 전달
              onNavigate={handleNavigation}           // 네비게이션 함수 전달
              isLoading={authLoading}                 // 인증 로딩 상태 전달
              error={authError}                       // 인증 에러 메시지 전달
            />
          )}

          {/* 회원가입 페이지 */}
          {currentSection === 'signup' && (
            <SignupPage
              key="signup"
              onSignup={handleSignup}                 // 회원가입 핸들러 전달
              onNavigate={handleNavigation}           // 네비게이션 함수 전달
              isLoading={authLoading}                 // 인증 로딩 상태 전달
              error={authError}                       // 인증 에러 메시지 전달
            />
          )}

          {/* === 대시보드 페이지들 === */}
          
          {/* 통합 대시보드 페이지 (역할별 분기 포함) */}
          {(currentSection === 'orders' || currentSection === 'favorites' || currentSection === 'profile' || currentSection === 'subscription' ||
            currentSection === 'designer-analytics' || currentSection === 'designer-projects' || currentSection === 'designer-forms' || 
            currentSection === 'designer-earnings' || currentSection === 'designer-profile') && (
            <motion.div
              key={currentSection}                    // 섹션별 고유 키 (애니메이션용)
              variants={premiumPageVariants}          // 페이지 전환 애니메이션
              initial="initial"
              animate="animate"
              exit="exit"
              className="pt-20 min-h-screen"
            >
              <div className="container mx-auto px-8 py-16">
                <motion.div
                  className="max-w-7xl mx-auto"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {/* 역할별 대시보드 렌더링 (통합 컴포넌트 사용) */}
                  <DashboardPages
                    currentSection={currentSection}      // 현재 섹션 (orders, favorites 등)
                    onSectionChange={handleNavigation}   // 섹션 변경 함수
                    orders={orders}                      // 사용자 주문 목록
                    subscriptions={subscriptions}        // 사용자 구독 목록
                    favoriteItems={(portfolioItems || []).filter(item => item.isLiked)} // 좋아요한 아이템들
                    user={user}                          // 사용자 정보
                    onItemClick={handleProductClick}     // 제품 클릭 핸들러
                    onDesignerClick={handleDesignerClick} // 디자이너 클릭 핸들러
                    onLike={handleLike}                  // 좋아요 핸들러
                    onDownload={handleDownload}          // 다운로드 핸들러
                    onRevisionRequest={handleRevisionRequest} // 수정 요청 핸들러
                    revisionRequests={revisionRequests}  // 수정 요청 목록
                    projectRequests={projectRequests}    // 프로젝트 요청 목록
                    designerQuestions={designerQuestions} // 디자이너 질문 목록
                    customForms={customForms}            // 커스텀 폼 목록
                    onDesignerQuestion={handleDesignerQuestion} // 디자이너 질문 핸들러
                    onProjectDecision={handleProjectDecision}   // 프로젝트 결정 핸들러
                  />
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* === 포트폴리오 업로드 페이지 (디자이너 전용) === */}
          {currentSection === 'portfolio-upload' && (
            <PortfolioUploadPage
              key="portfolio-upload"
              onNavigate={handleNavigation}           // 네비게이션 함수 전달
              user={user}                            // 사용자 정보 전달
              onBackToDashboard={handleBackToDashboard} // 대시보드로 돌아가기 핸들러
            />
          )}

        </AnimatePresence>

        {/* =====================================
            모달 시스템 (전역 오버레이)
            ===================================== */}

        {/* === 기존 모달들 === */}
        
        {/* 스타일 선택 모달 - 제품 구매 시 스타일을 선택하��� 모달 */}
        {isStyleSelectionOpen && selectedProductForPurchase && (
          <StyleSelectionModal
            product={selectedProductForPurchase}      // 구매할 제품 정보
            isOpen={isStyleSelectionOpen}            // 모달 열림 상태
            onClose={() => {                         // 모달 닫기 핸들러
              setIsStyleSelectionOpen(false);        // 모달 상태 false로 변경
              setSelectedProductForPurchase(null);   // 선택된 제품 초기화
            }}
            onStyleSelect={handleStyleSelection}     // 스타일 선택 완료 핸들러
          />
        )}

        {/* 수정 요청 모달 - 구매한 디자인의 수정을 요청하는 모달 */}
        {isRevisionRequestOpen && selectedOrderForRevision && (
          <RevisionRequestModal
            order={selectedOrderForRevision}         // 수정 요청 대상 주문
            isOpen={isRevisionRequestOpen}           // 모달 열림 상태
            onClose={() => {                        // 모달 닫기 핸들러
              setIsRevisionRequestOpen(false);       // 모달 상태 false로 변경
              setSelectedOrderForRevision(null);     // 선택된 주문 초기화
            }}
            onSubmit={handleRevisionSubmit}          // 수정 요청 제출 핸들러
          />
        )}

        {/* 기본 프로젝트 요청 모달 (레거시) - 향상된 버전으로 대체됨 */}
        {isProjectRequestOpen && (
          <ProjectRequestModal
            isOpen={isProjectRequestOpen}            // 모달 열림 상태
            onClose={() => setIsProjectRequestOpen(false)} // 모달 닫기 핸들러
            onSubmit={handleProjectRequest}          // 프로젝트 요청 제출 핸들러
          />
        )}

        {/* === 새로운 디자이너 상호작용 모달들 === */}
        
        {/* 디자이너 질문 모달 - 디자이너가 클라이언트에게 질문하는 모달 */}
        {isDesignerQuestionOpen && selectedProjectForQuestions && (
          <DesignerQuestionModal
            project={selectedProjectForQuestions}    // 질문 대상 프로젝트
            isOpen={isDesignerQuestionOpen}          // 모달 열림 상태
            onClose={() => {                        // 모달 닫기 핸들러
              setIsDesignerQuestionOpen(false);      // 모달 상태 false로 변경
              setSelectedProjectForQuestions(null);  // 선택된 프로젝트 초기화
            }}
            onSubmit={handleQuestionSubmit}          // 질문 제출 핸들러
            designer={user}                         // 질문하는 디자이너 정보
          />
        )}

        {/* 프로젝트 수락/거절 모달 - 디자이너가 프로젝트를 수락하거나 거절하는 모달 */}
        {isProjectAcceptRejectOpen && selectedProjectForDecision && (
          <ProjectAcceptRejectModal
            project={selectedProjectForDecision}     // 결정할 프로젝트
            isOpen={isProjectAcceptRejectOpen}       // 모달 열림 상태
            onClose={() => {                        // 모달 닫기 핸들러
              setIsProjectAcceptRejectOpen(false);   // 모달 상태 false로 변경
              setSelectedProjectForDecision(null);   // 선택된 프로젝트 초기화
            }}
            onAccept={(projectId, message) =>        // 프로젝트 수락 핸들러
              handleProjectAccept(projectId, message)
            }
            onReject={(projectId, reason) =>         // 프로젝트 거절 핸들러
              handleProjectReject(projectId, reason)
            }
            designer={user}                         // 결정하는 디자이너 정보
          />
        )}

        {/* 커스텀 폼 생성 모달 - 디자이너가 맞춤형 요청 양식을 만드는 모달 */}
        {isCustomFormCreatorOpen && (
          <CustomFormCreatorModal
            isOpen={isCustomFormCreatorOpen}         // 모달 열림 상태
            onClose={() => setIsCustomFormCreatorOpen(false)} // ���달 닫기 핸들러
            onSubmit={handleCustomFormCreate}        // 커스텀 �� 생성 핸들러
            designer={user}                         // 폼 제작자 디자이너 정보
          />
        )}

        {/* 향상된 프로젝트 요청 모달 - 급한 마감, 추가 옵션 등을 포함한 프로젝트 의뢰 모달 */}
        {isEnhancedProjectRequestOpen && (
          <EnhancedProjectRequestModal
            isOpen={isEnhancedProjectRequestOpen}    // 모달 열림 상태
            onClose={() => setIsEnhancedProjectRequestOpen(false)} // 모달 닫기 핸들러
            onSubmit={handleEnhancedProjectRequest}  // 향상된 프로젝트 요청 제출 핸들러
            customForms={customForms}               // 사용 가능한 커스텀 폼들
            user={user}                             // 요청하는 사용자 정보
          />
        )}

        {/* 공개 프로젝트 게시판 모달 - 모든 디자이너가 볼 수 있는 프로젝트 게시판 */}
        {isPublicProjectBoardOpen && (
          <PublicProjectBoardModal
            isOpen={isPublicProjectBoardOpen}        // 모달 열림 상태
            onClose={() => setIsPublicProjectBoardOpen(false)} // 모달 닫기 핸들러
            projects={publicProjects}               // 공개 프로젝트 목록
            onCreateProject={handlePublicProjectCreate} // 새 프로젝트 생성 핸들러
            onProposeProject={handleProjectPropose}  // 프로젝트 제안 핸들러
            user={user}                             // 현재 사용자 정보
            isLoggedIn={isLoggedIn}                 // 로그인 상태
          />
        )}

      </motion.div>
    </TransitionProvider>
  );
}
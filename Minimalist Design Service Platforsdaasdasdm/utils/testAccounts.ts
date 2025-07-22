// AVIRESS 테스트 계정 시스템
// 개발 및 데모 목적으로 사용할 수 있는 미리 설정된 계정들

export interface TestAccount {
  email: string;
  password: string;
  role: 'customer' | 'designer' | 'admin';
  displayName: string;
  description: string;
  features: string[];
}

export const TEST_ACCOUNTS: TestAccount[] = [
  {
    email: 'demo@aviress.com',
    password: 'demo123456',
    role: 'customer',
    displayName: '일반 고객 (Demo User)',
    description: '제품 구매, 즐겨찾기, 디자이너 포트폴리오 탐색 가능',
    features: [
      '모든 제품 브라우징',
      '즐겨찾기 기능',
      '구매 프로세스 체험',
      '디자이너 포트폴리오 탐색',
      '주문 내역 확인'
    ]
  },
  {
    email: 'designer@aviress.com',
    password: 'design123456',
    role: 'designer',
    displayName: '김민준 (Senior Designer)',
    description: '로고 디자인 전문가 (5년 경력)\n주요 분야: 브랜드 아이덴티티, 로고 디자인\n완료 프로젝트: 50+개\n월 평균 수익: $3,500',
    features: [
      '포트폴리오 관리',
      '작품 업로드',
      '고객 메시지 확인',
      '수익 대시보드',
      '프로필 편집'
    ]
  },
  {
    email: 'designer2@aviress.com',
    password: 'design123456',
    role: 'designer',
    displayName: '박지은 (Typography Expert)',
    description: '타이포그래피 전문가 (7년 경력)\n주요 분야: 폰트 디자인, 타이포그래피\n완료 프로젝트: 80+개\n월 평균 수익: $4,200',
    features: [
      '폰트 디자인 전문',
      '타이포그래피 컨설팅',
      '커스텀 폰트 제작',
      '브랜드 타이포그래피',
      '웹폰트 최적화'
    ]
  },
  {
    email: 'designer3@aviress.com',
    password: 'design123456',
    role: 'designer',
    displayName: '이현우 (Brand Specialist)',
    description: '브랜드 아이덴티티 전문가 (6년 경력)\n주요 분야: 브랜드 디자인, 명함 디자인\n완료 프로젝트: 65+개\n월 평균 수익: $3,800',
    features: [
      '브랜드 아이덴티티 구축',
      '명함 디자인',
      '기업 브랜딩',
      '브랜드 가이드라인',
      '브랜드 컨설팅'
    ]
  },
  {
    email: 'premium@aviress.com',
    password: 'premium123456',
    role: 'customer',
    displayName: '프리미엄 고객 (Premium User)',
    description: 'AVIRESS Pro 구독중인 프리미엄 고객 계정',
    features: [
      '무제한 다운로드',
      '프리미엄 디자이너 접근',
      '우선 고객 지원',
      '신작 우선 접근',
      '상업용 라이선스 포함'
    ]
  },
  {
    email: 'admin@aviress.com',
    password: 'admin123456',
    role: 'admin',
    displayName: '관리자 (Admin)',
    description: '플랫폼 관리 및 모든 기능에 접근 가능한 관리자 계정',
    features: [
      '플랫폼 전체 관리',
      '사용자 관리',
      '디자이너 승인',
      '수익 분석',
      '컨텐츠 관리'
    ]
  }
];

// 빠른 테스트를 위한 기본 계정
export const DEFAULT_TEST_ACCOUNT = TEST_ACCOUNTS[0];

// 계정 역할별 필터링
export const getAccountsByRole = (role: TestAccount['role']): TestAccount[] => {
  return TEST_ACCOUNTS.filter(account => account.role === role);
};

// 이메일로 테스트 계정 찾기
export const getTestAccountByEmail = (email: string): TestAccount | null => {
  return TEST_ACCOUNTS.find(account => account.email === email) || null;
};

// 테스트 계정 검증
export const isTestAccount = (email: string): boolean => {
  return TEST_ACCOUNTS.some(account => account.email === email);
};

// 테스트용 사용자 데이터 생성
export const generateTestUserData = (account: TestAccount) => {
  const nameParts = account.displayName.split(' ');
  return {
    firstName: nameParts[0] || 'Test',
    lastName: nameParts[1] || 'User',
    email: account.email,
    password: account.password,
    acceptTerms: true,
    marketingEmails: true,
    role: account.role,
    displayName: account.displayName,
    isTestAccount: true
  };
};

// 개발 환경 체크
export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === 'development' || 
         window.location.hostname === 'localhost' ||
         window.location.hostname.includes('127.0.0.1');
};

// 테스트 계정 사용 가능 여부 체크
export const canUseTestAccounts = (): boolean => {
  return isDevelopment() || window.location.hostname.includes('demo') || window.location.hostname.includes('test');
};

export default {
  TEST_ACCOUNTS,
  DEFAULT_TEST_ACCOUNT,
  getAccountsByRole,
  getTestAccountByEmail,
  isTestAccount,
  generateTestUserData,
  isDevelopment,
  canUseTestAccounts
};
"use client";

import { getTestAccountByEmail } from '../../utils/testAccounts';
import DesignerDashboard from './DesignerDashboard';
import CustomerDashboard from './CustomerDashboard';

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

interface OrderItem {
  id: string;
  title: string;
  designer: string;
  category: string;
  imageUrl: string;
  price: number;
  purchaseDate: string;
  status: 'completed' | 'processing' | 'cancelled' | 'in-revision' | 'pending-approval' | 'pending-designer' | 'designer-questions';
  downloadUrl?: string;
  orderNumber: string;
  downloadCount?: number;
  downloadLimit?: number;
  expiryDate?: string;
  selectedStyles?: string[];
  revisionCount?: number;
  maxRevisions?: number;
  rushFee?: number;
  additionalConcepts?: number;
  additionalRevisions?: number;
  designerQuestions?: DesignerQuestion[];
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  status: 'active' | 'cancelled' | 'pending';
  nextBillingDate?: string;
  renewalDate?: string;
}

interface RevisionRequest {
  id: string;
  title: string;
  description: string;
  requestDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  response?: string;
  responseDate?: string;
}

interface ProjectRequest {
  id: string;
  title: string;
  category: string;
  description: string;
  budget: {
    min: number;
    max: number;
  };
  deadline: string;
  requirements: string[];
  attachments: File[];
  status: 'open' | 'in-progress' | 'completed' | 'cancelled' | 'pending-designer' | 'designer-questions';
  createdDate: string;
  proposals: ProjectProposal[];
  rushRequest?: boolean;
  additionalConcepts?: number;
  additionalRevisions?: number;
  totalPrice?: number;
  customFormData?: { [key: string]: any };
  assignedDesigner?: string;
  designerQuestions?: DesignerQuestion[];
}

interface ProjectProposal {
  id: string;
  designerId: string;
  designerName: string;
  designerAvatar: string;
  proposedPrice: number;
  estimatedDays: number;
  message: string;
  portfolio: string[];
  proposalDate: string;
  status: 'pending' | 'accepted' | 'rejected';
}

interface DesignerQuestion {
  id: string;
  projectId: string;
  designerId: string;
  designerName: string;
  question: string;
  questionDate: string;
  clientResponse?: string;
  responseDate?: string;
  status: 'pending' | 'answered';
}

interface CustomForm {
  id: string;
  designerId: string;
  designerName: string;
  title: string;
  description: string;
  fields: CustomFormField[];
  createdDate: string;
  isActive: boolean;
}

interface CustomFormField {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  order: number;
}

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

interface DashboardPagesProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
  orders: OrderItem[];
  subscriptions: SubscriptionPlan[];
  favoriteItems: PortfolioItem[];
  user: SupabaseUser | null;
  onItemClick: (product: PortfolioItem) => void;
  onDesignerClick: (designerName: string) => void;
  onLike: (itemId: string) => void;
  onDownload: (order: OrderItem) => void;
  onRevisionRequest: (order: OrderItem) => void;
  revisionRequests: { [orderId: string]: RevisionRequest[] };
  projectRequests: ProjectRequest[];
  designerQuestions: { [projectId: string]: DesignerQuestion[] };
  customForms: CustomForm[];
  onDesignerQuestion: (projectId: string) => void;
  onProjectDecision: (projectId: string) => void;
}

export default function DashboardPages({ 
  currentSection, 
  onSectionChange,
  orders, 
  subscriptions, 
  favoriteItems,
  user, 
  onItemClick,
  onDesignerClick,
  onLike, 
  onDownload,
  onRevisionRequest,
  revisionRequests,
  projectRequests,
  designerQuestions,
  customForms,
  onDesignerQuestion,
  onProjectDecision
}: DashboardPagesProps) {
  // 사용자가 디자이너인지 확인
  const testAccount = user?.email ? getTestAccountByEmail(user.email) : null;
  const isDesigner = testAccount?.role === 'designer';
  const isAdmin = testAccount?.role === 'admin';

  console.log('🎯 DashboardPages - User role:', testAccount?.role, 'isDesigner:', isDesigner);

  // 역할에 따라 다른 대시보드 렌더링
  if (isDesigner || isAdmin) {
    return (
      <DesignerDashboard
        currentSection={currentSection}
        onSectionChange={onSectionChange}
        projectRequests={projectRequests}
        customForms={customForms}
        designerQuestions={designerQuestions}
        onDesignerQuestion={onDesignerQuestion}
        onProjectDecision={onProjectDecision}
        user={user}
      />
    );
  }

  // 고객 대시보드
  return (
    <CustomerDashboard
      currentSection={currentSection}
      onSectionChange={onSectionChange}
      orders={orders}
      subscriptions={subscriptions}
      favoriteItems={favoriteItems}
      user={user}
      onItemClick={onItemClick}
      onDesignerClick={onDesignerClick}
      onLike={onLike}
      onDownload={onDownload}
      onRevisionRequest={onRevisionRequest}
      revisionRequests={revisionRequests}
      projectRequests={projectRequests}
      designerQuestions={designerQuestions}
    />
  );
}
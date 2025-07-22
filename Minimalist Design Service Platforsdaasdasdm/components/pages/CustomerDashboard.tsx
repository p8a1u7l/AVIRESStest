"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, Heart, User, Settings, Download, RefreshCw, CheckCircle, Clock,
  MessageCircle, HelpCircle, CreditCard, Package, Calendar, AlertCircle,
  Search, Filter, Star, TrendingUp
} from 'lucide-react';
import { Badge } from '../ui/badge';
import PortfolioGrid from '../PortfolioGrid';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface CustomerDashboardProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
  orders: any[];
  subscriptions: any[];
  favoriteItems: any[];
  user: any;
  onItemClick: (product: any) => void;
  onDesignerClick: (designerName: string) => void;
  onLike: (itemId: string) => void;
  onDownload: (order: any) => void;
  onRevisionRequest: (order: any) => void;
  revisionRequests: any;
  projectRequests: any[];
  designerQuestions: any;
}

export default function CustomerDashboard({
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
  designerQuestions
}: CustomerDashboardProps) {
  const [activeTab, setActiveTab] = useState('orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // 고객 통계 계산
  const stats = {
    totalOrders: orders.length,
    completedOrders: orders.filter(o => o.status === 'completed').length,
    totalSpent: orders.reduce((sum, o) => sum + o.price, 0),
    activeProjects: projectRequests.filter(p => p.status === 'in-progress' || p.status === 'open').length,
    favoriteCount: favoriteItems.length,
    activeSubscriptions: subscriptions.filter(s => s.status === 'active').length
  };

  const renderOrdersTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3>주문 관리</h3>
        <div className="flex items-center gap-4">
          <div className="search-bar-clean">
            <div className="liquid-glass-bg-hover"></div>
            <div className="relative z-10 flex items-center">
              <Search className="w-4 h-4 mr-3 text-tertiary" />
              <input
                type="text"
                placeholder="주문 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-white placeholder-gray-medium w-48"
              />
            </div>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="standard-button appearance-none bg-transparent pr-8"
          >
            <option value="all">모든 상태</option>
            <option value="processing">진행중</option>
            <option value="completed">완료</option>
            <option value="in-revision">수정중</option>
          </select>
        </div>
      </div>

      {orders.length > 0 ? (
        orders
          .filter(order => statusFilter === 'all' || order.status === statusFilter)
          .filter(order => searchQuery === '' || 
            order.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            order.designer.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((order, index) => (
            <motion.div 
              key={order.id} 
              className="simple-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="liquid-glass-bg-hover"></div>
              <div className="relative z-10 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src={order.imageUrl}
                      alt={order.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="mb-1">{order.title}</h4>
                        <p className="text-secondary text-sm mb-2">by {order.designer}</p>
                        <p className="text-secondary text-sm">주문번호 #{order.orderNumber}</p>
                        <p className="text-secondary text-sm">주문일: {new Date(order.purchaseDate).toLocaleDateString('ko-KR')}</p>
                        
                        {order.selectedStyles && order.selectedStyles.length > 0 && (
                          <p className="text-tertiary text-xs mt-1">
                            선택된 스타일: {order.selectedStyles.length}개
                          </p>
                        )}
                        {order.revisionCount !== undefined && (
                          <p className="text-tertiary text-xs">
                            수정 요청: {order.revisionCount}/{order.maxRevisions || 3}회
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="mb-2">
                          <span className="text-lg font-medium">${order.price}</span>
                          {order.rushFee && (
                            <span className="text-xs text-orange-400 block">+${order.rushFee} 급한마감</span>
                          )}
                        </div>
                        <Badge 
                          variant={
                            order.status === 'completed' ? 'default' : 
                            order.status === 'processing' ? 'secondary' : 
                            order.status === 'in-revision' ? 'outline' :
                            order.status === 'designer-questions' ? 'outline' :
                            'destructive'
                          }
                          className="flex items-center gap-1"
                        >
                          {order.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                          {order.status === 'processing' && <Clock className="w-3 h-3" />}
                          {order.status === 'in-revision' && <RefreshCw className="w-3 h-3" />}
                          {order.status === 'designer-questions' && <HelpCircle className="w-3 h-3" />}
                          {order.status === 'completed' ? '완료' : 
                           order.status === 'processing' ? '진행중' : 
                           order.status === 'in-revision' ? '수정중' :
                           order.status === 'designer-questions' ? '질문 대기' :
                           order.status === 'cancelled' ? '취소됨' : '대기중'}
                        </Badge>
                      </div>
                    </div>
                    
                    {order.designerQuestions && order.designerQuestions.length > 0 && (
                      <div className="mb-4 p-3 bg-blue-400/10 rounded-lg border border-blue-400/20">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageCircle className="w-4 h-4 text-blue-400" />
                          <span className="text-sm font-medium text-blue-400">디자이너 질문</span>
                        </div>
                        {order.designerQuestions.slice(-1).map(q => (
                          <div key={q.id} className="text-sm">
                            <p className="text-secondary">{q.question}</p>
                            {q.clientResponse && (
                              <p className="text-white mt-2 pl-4 border-l-2 border-green-400">
                                답변: {q.clientResponse}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      {order.status === 'completed' && order.downloadUrl && (
                        <motion.button
                          onClick={() => onDownload(order)}
                          className="primary-button-hover flex items-center gap-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="liquid-glass-bg-hover"></div>
                          <div className="relative z-10 flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            다운로드 ({order.downloadCount || 0}/{order.downloadLimit || 3})
                          </div>
                        </motion.button>
                      )}
                      
                      {order.status === 'completed' && (order.revisionCount || 0) < (order.maxRevisions || 3) && (
                        <motion.button
                          onClick={() => onRevisionRequest(order)}
                          className="standard-button flex items-center gap-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="liquid-glass-bg-hover"></div>
                          <div className="relative z-10 flex items-center gap-2">
                            <RefreshCw className="w-4 h-4" />
                            수정 요청
                          </div>
                        </motion.button>
                      )}
                      
                      <motion.button
                        className="standard-button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="liquid-glass-bg-hover"></div>
                        <span className="relative z-10">상세보기</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
      ) : (
        <div className="section-clean text-center">
          <div className="liquid-glass-bg-hover"></div>
          <div className="relative z-10 py-20">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-secondary" />
            <h3 className="mb-2">아직 주문이 없습니다</h3>
            <p className="text-secondary mb-6">
              디자인 컬렉션을 둘러보고 첫 구매를 시작해보세요
            </p>
            <motion.button
              onClick={() => onSectionChange('products')}
              className="primary-button-hover"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="liquid-glass-bg-hover"></div>
              <span className="relative z-10">제품 둘러보기</span>
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );

  const renderProjectsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3>프로젝트 요청</h3>
        <motion.button
          onClick={() => onSectionChange('project-request')}
          className="primary-button-hover flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="liquid-glass-bg-hover"></div>
          <div className="relative z-10 flex items-center gap-2">
            <Package className="w-4 h-4" />
            새 프로젝트 요청
          </div>
        </motion.button>
      </div>

      {projectRequests.length > 0 ? (
        projectRequests.map((project, index) => (
          <motion.div 
            key={project.id} 
            className="simple-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="liquid-glass-bg-hover"></div>
            <div className="relative z-10 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Package className="w-5 h-5 text-blue-400" />
                    <h4>{project.title}</h4>
                  </div>
                  <p className="text-secondary text-sm mb-2">{project.category}</p>
                  <p className="text-secondary text-sm mb-3 line-clamp-2">{project.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="text-tertiary text-xs">예산</span>
                      <p className="text-sm">${project.budget.min} - ${project.budget.max}</p>
                    </div>
                    <div>
                      <span className="text-tertiary text-xs">마감일</span>
                      <p className="text-sm">{new Date(project.deadline).toLocaleDateString('ko-KR')}</p>
                    </div>
                  </div>

                  {designerQuestions[project.id] && designerQuestions[project.id].length > 0 && (
                    <div className="mb-4 p-3 bg-blue-400/10 rounded-lg border border-blue-400/20">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageCircle className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-medium text-blue-400">
                          디자이너 질문 ({designerQuestions[project.id].length}개)
                        </span>
                      </div>
                      {designerQuestions[project.id].slice(-1).map(q => (
                        <div key={q.id} className="text-sm">
                          <p className="text-secondary">{q.question}</p>
                          {q.clientResponse && (
                            <p className="text-white mt-2 pl-4 border-l-2 border-green-400">
                              답변: {q.clientResponse}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="text-right ml-6">
                  <div className="mb-2">
                    <span className="text-lg font-medium">
                      ${project.totalPrice || project.budget.max}
                    </span>
                  </div>
                  <Badge 
                    variant={
                      project.status === 'completed' ? 'default' : 
                      project.status === 'in-progress' ? 'secondary' : 
                      project.status === 'designer-questions' ? 'outline' :
                      'outline'
                    }
                    className="mb-2"
                  >
                    {project.status === 'completed' ? '완료' : 
                     project.status === 'in-progress' ? '진행중' : 
                     project.status === 'designer-questions' ? '질문 대기' :
                     '대기중'}
                  </Badge>
                  
                  {project.assignedDesigner && (
                    <p className="text-green-400 text-xs">담당: {project.assignedDesigner}</p>
                  )}
                  
                  {project.proposals && project.proposals.length > 0 && (
                    <p className="text-blue-400 text-xs">{project.proposals.length}개 제안 받음</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <motion.button
                  className="standard-button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="liquid-glass-bg-hover"></div>
                  <span className="relative z-10">상세보기</span>
                </motion.button>
                
                {project.proposals && project.proposals.length > 0 && (
                  <motion.button
                    className="primary-button-hover"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="liquid-glass-bg-hover"></div>
                    <span className="relative z-10">제안서 보기</span>
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        ))
      ) : (
        <div className="section-clean text-center">
          <div className="liquid-glass-bg-hover"></div>
          <div className="relative z-10 py-20">
            <Package className="w-16 h-16 mx-auto mb-4 text-secondary" />
            <h3 className="mb-2">프로젝트 요청이 없습니다</h3>
            <p className="text-secondary mb-6">
              커스텀 디자인 프로젝트를 시작해보세요
            </p>
            <motion.button
              onClick={() => onSectionChange('project-request')}
              className="primary-button-hover"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="liquid-glass-bg-hover"></div>
              <span className="relative z-10">프로젝트 요청하기</span>
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );

  const renderFavoritesTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3>찜한 디자인</h3>
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-400" />
          <span className="text-secondary">{favoriteItems.length}개</span>
        </div>
      </div>

      {favoriteItems.length > 0 ? (
        <PortfolioGrid
          items={favoriteItems}
          categories={[]}
          selectedCategory="All"
          onCategoryChange={() => {}}
          onItemClick={onItemClick}
          onDesignerClick={onDesignerClick}
          onLike={onLike}
          searchQuery=""
          onSearchChange={() => {}}
          showSearch={false}
          showFilters={false}
        />
      ) : (
        <div className="section-clean text-center">
          <div className="liquid-glass-bg-hover"></div>
          <div className="relative z-10 py-20">
            <Heart className="w-16 h-16 mx-auto mb-4 text-secondary" />
            <h3 className="mb-2">찜한 디자인이 없습니다</h3>
            <p className="text-secondary mb-6">
              마음에 드는 디자인에 하트를 눌러보세요
            </p>
            <motion.button
              onClick={() => onSectionChange('products')}
              className="primary-button-hover"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="liquid-glass-bg-hover"></div>
              <span className="relative z-10">디자인 둘러보기</span>
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );

  const renderSubscriptionsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3>구독 관리</h3>
        <Badge variant="outline">
          활성 구독 {stats.activeSubscriptions}개
        </Badge>
      </div>

      {subscriptions.length > 0 ? (
        subscriptions.map((subscription, index) => (
          <motion.div
            key={subscription.id}
            className="simple-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="liquid-glass-bg-hover"></div>
            <div className="relative z-10 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CreditCard className="w-5 h-5 text-purple-400" />
                    <h4>{subscription.name}</h4>
                    <Badge variant={subscription.status === 'active' ? 'default' : 'outline'}>
                      {subscription.status === 'active' ? '활성' : 
                       subscription.status === 'cancelled' ? '취소됨' : '대기중'}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="text-tertiary text-xs">요금</span>
                      <p className="text-sm">${subscription.price}/{subscription.interval === 'monthly' ? '월' : '년'}</p>
                    </div>
                    {subscription.nextBillingDate && (
                      <div>
                        <span className="text-tertiary text-xs">다음 결제일</span>
                        <p className="text-sm">{new Date(subscription.nextBillingDate).toLocaleDateString('ko-KR')}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <span className="text-tertiary text-xs">포함 기능</span>
                    {subscription.features.map((feature, idx) => (
                      <p key={idx} className="text-sm text-secondary">• {feature}</p>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <motion.button
                    className="standard-button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="liquid-glass-bg-hover"></div>
                    <span className="relative z-10">관리</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))
      ) : (
        <div className="section-clean text-center">
          <div className="liquid-glass-bg-hover"></div>
          <div className="relative z-10 py-20">
            <CreditCard className="w-16 h-16 mx-auto mb-4 text-secondary" />
            <h3 className="mb-2">구독 중인 플랜이 없습니다</h3>
            <p className="text-secondary mb-6">
              구독으로 더 많은 혜택을 받아보세요
            </p>
            <motion.button
              className="primary-button-hover"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="liquid-glass-bg-hover"></div>
              <span className="relative z-10">구독 플랜 보기</span>
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );

  const renderOverviewTab = () => (
    <div className="space-y-8">
      {/* 통계 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          className="simple-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="liquid-glass-bg-hover"></div>
          <div className="relative z-10 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-blue-400/20">
                <ShoppingBag className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-sm text-tertiary">총 주문</span>
            </div>
            <div className="text-3xl font-semibold mb-1">{stats.totalOrders}</div>
            <div className="text-sm text-secondary">전체 주문</div>
          </div>
        </motion.div>

        <motion.div 
          className="simple-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="liquid-glass-bg-hover"></div>
          <div className="relative z-10 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-green-400/20">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-sm text-tertiary">총 지출</span>
            </div>
            <div className="text-3xl font-semibold mb-1">${stats.totalSpent}</div>
            <div className="text-sm text-secondary">누적 지출</div>
          </div>
        </motion.div>

        <motion.div 
          className="simple-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="liquid-glass-bg-hover"></div>
          <div className="relative z-10 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-red-400/20">
                <Heart className="w-6 h-6 text-red-400" />
              </div>
              <span className="text-sm text-tertiary">찜한 디자인</span>
            </div>
            <div className="text-3xl font-semibold mb-1">{stats.favoriteCount}</div>
            <div className="text-sm text-secondary">관심 항목</div>
          </div>
        </motion.div>

        <motion.div 
          className="simple-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="liquid-glass-bg-hover"></div>
          <div className="relative z-10 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-purple-400/20">
                <Package className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-sm text-tertiary">진행중 프로젝트</span>
            </div>
            <div className="text-3xl font-semibold mb-1">{stats.activeProjects}</div>
            <div className="text-sm text-secondary">활성 프로젝트</div>
          </div>
        </motion.div>
      </div>

      {/* 최근 주문 */}
      <div className="simple-card">
        <div className="liquid-glass-bg-hover"></div>
        <div className="relative z-10 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3>최근 주문</h3>
            <motion.button
              onClick={() => setActiveTab('orders')}
              className="standard-button text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="liquid-glass-bg-hover"></div>
              <span className="relative z-10">전체 보기</span>
            </motion.button>
          </div>

          {orders.slice(0, 3).map((order, index) => (
            <motion.div
              key={order.id}
              className="flex items-center justify-between p-4 rounded-lg border border-white/10 mb-4 last:mb-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={order.imageUrl}
                    alt={order.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h5 className="mb-1">{order.title}</h5>
                  <p className="text-secondary text-sm">by {order.designer}</p>
                  <p className="text-tertiary text-xs">
                    {new Date(order.purchaseDate).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-medium mb-1">${order.price}</div>
                <Badge 
                  variant={
                    order.status === 'completed' ? 'default' : 
                    order.status === 'processing' ? 'secondary' : 
                    'outline'
                  }
                >
                  {order.status === 'completed' ? '완료' : 
                   order.status === 'processing' ? '진행중' : 
                   '대기중'}
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      className="pt-20 min-h-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <section className="py-20">
        <div className="container mx-auto px-8">
          <motion.div
            className="max-w-7xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* 헤더 */}
            <div className="flex items-center gap-4 mb-12">
              <ShoppingBag className="w-8 h-8" />
              <div>
                <h1>내 대시보드</h1>
                <p className="text-secondary">
                  주문 관리와 프로젝트 현황을 한눈에 확인하세요
                </p>
              </div>
            </div>

            {/* 탭 네비게이션 */}
            <div className="flex items-center gap-2 mb-8">
              {[
                { id: 'overview', label: '개요', icon: TrendingUp },
                { id: 'orders', label: '주문', icon: ShoppingBag },
                { id: 'projects', label: '프로젝트', icon: Package },
                { id: 'favorites', label: '찜', icon: Heart },
                { id: 'subscriptions', label: '구독', icon: CreditCard }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`filter-tab-clean ${activeTab === tab.id ? 'active' : ''}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="liquid-glass-bg-hover"></div>
                    <div className="relative z-10 flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* 탭 콘텐츠 */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'overview' && renderOverviewTab()}
              {activeTab === 'orders' && renderOrdersTab()}
              {activeTab === 'projects' && renderProjectsTab()}
              {activeTab === 'favorites' && renderFavoritesTab()}
              {activeTab === 'subscriptions' && renderSubscriptionsTab()}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
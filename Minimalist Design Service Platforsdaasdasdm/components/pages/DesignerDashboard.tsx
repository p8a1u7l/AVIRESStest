"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Users, DollarSign, Calendar, MessageCircle, ClipboardList, 
  CheckCircle, X, AlertCircle, Plus, FileText, Upload, Settings, Eye, Edit, Trash2,
  Star, Package, CreditCard, Download, BarChart3, User
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface DesignerDashboardProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
  projectRequests: any[];
  customForms: any[];
  designerQuestions: any;
  onDesignerQuestion: (projectId: string) => void;
  onProjectDecision: (projectId: string) => void;
  user: any;
}

export default function DesignerDashboard({
  currentSection,
  onSectionChange,
  projectRequests,
  customForms,
  designerQuestions,
  onDesignerQuestion,
  onProjectDecision,
  user
}: DesignerDashboardProps) {
  // currentSection을 기반으로 activeTab 설정
  const getActiveTabFromSection = (section: string) => {
    switch (section) {
      case 'designer-analytics':
        return 'analytics';
      case 'designer-projects':
        return 'projects';
      case 'designer-forms':
        return 'forms';
      case 'designer-earnings':
        return 'analytics'; // earnings는 analytics 탭에 포함
      case 'designer-profile':
        return 'profile';
      default:
        return 'overview';
    }
  };

  const [activeTab, setActiveTab] = useState(getActiveTabFromSection(currentSection));

  // currentSection이 변경될 때마다 activeTab 업데이트
  useEffect(() => {
    setActiveTab(getActiveTabFromSection(currentSection));
  }, [currentSection]);

  // 디자이너 통계 계산
  const stats = {
    totalProjects: projectRequests.length,
    activeProjects: projectRequests.filter(p => p.status === 'in-progress').length,
    completedProjects: projectRequests.filter(p => p.status === 'completed').length,
    totalEarnings: projectRequests
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + (p.totalPrice || p.budget.max), 0),
    averageRating: 4.8,
    totalClients: new Set(projectRequests.map(p => p.clientName)).size
  };

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
                <ClipboardList className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-sm text-tertiary">총 프로젝트</span>
            </div>
            <div className="text-3xl font-semibold mb-1">{stats.totalProjects}</div>
            <div className="text-sm text-secondary">전체 프로젝트</div>
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
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-sm text-tertiary">총 수익</span>
            </div>
            <div className="text-3xl font-semibold mb-1">${stats.totalEarnings}</div>
            <div className="text-sm text-secondary">누적 수익</div>
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
              <div className="p-3 rounded-lg bg-orange-400/20">
                <Users className="w-6 h-6 text-orange-400" />
              </div>
              <span className="text-sm text-tertiary">고객 수</span>
            </div>
            <div className="text-3xl font-semibold mb-1">{stats.totalClients}</div>
            <div className="text-sm text-secondary">총 고객</div>
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
                <Star className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-sm text-tertiary">평균 평점</span>
            </div>
            <div className="text-3xl font-semibold mb-1">{stats.averageRating}</div>
            <div className="text-sm text-secondary">고객 만족도</div>
          </div>
        </motion.div>
      </div>

      {/* 최근 프로젝트 */}
      <div className="simple-card">
        <div className="liquid-glass-bg-hover"></div>
        <div className="relative z-10 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3>최근 프로젝트</h3>
            <motion.button
              onClick={() => setActiveTab('projects')}
              className="standard-button text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="liquid-glass-bg-hover"></div>
              <span className="relative z-10">전체 보기</span>
            </motion.button>
          </div>

          {projectRequests.slice(0, 3).map((project, index) => (
            <motion.div
              key={project.id}
              className="flex items-center justify-between p-4 rounded-lg border border-white/10 mb-4 last:mb-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex-1">
                <h4 className="mb-1">{project.title}</h4>
                <p className="text-secondary text-sm">{project.category}</p>
                <p className="text-tertiary text-xs">
                  {new Date(project.createdDate).toLocaleDateString('ko-KR')}
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-medium mb-1">
                  ${project.totalPrice || project.budget.max}
                </div>
                <Badge 
                  variant={
                    project.status === 'completed' ? 'default' : 
                    project.status === 'in-progress' ? 'secondary' : 
                    'outline'
                  }
                >
                  {project.status === 'completed' ? '완료' : 
                   project.status === 'in-progress' ? '진행중' : 
                   '대기중'}
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProjectsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3>프로젝트 관리</h3>
        <div className="flex items-center gap-3">
          <Badge variant="outline">
            진행중 {stats.activeProjects}개
          </Badge>
          <Badge variant="default">
            완료 {stats.completedProjects}개
          </Badge>
        </div>
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
                    <ClipboardList className="w-5 h-5 text-blue-400" />
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
                          내 질문 ({designerQuestions[project.id].length}개)
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
                  
                  {project.assignedDesigner === user?.user_metadata?.full_name && (
                    <p className="text-green-400 text-xs">내가 담당중</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {project.status === 'open' && (
                  <>
                    <motion.button
                      onClick={() => onProjectDecision(project.id)}
                      className="primary-button-hover flex items-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="liquid-glass-bg-hover"></div>
                      <div className="relative z-10 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        수락/거절
                      </div>
                    </motion.button>
                    <motion.button
                      onClick={() => onDesignerQuestion(project.id)}
                      className="standard-button flex items-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="liquid-glass-bg-hover"></div>
                      <div className="relative z-10 flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        질문하기
                      </div>
                    </motion.button>
                  </>
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
          </motion.div>
        ))
      ) : (
        <div className="section-clean text-center">
          <div className="liquid-glass-bg-hover"></div>
          <div className="relative z-10 py-20">
            <ClipboardList className="w-16 h-16 mx-auto mb-4 text-secondary" />
            <h3 className="mb-2">아직 프로젝트가 없습니다</h3>
            <p className="text-secondary">
              고객들의 프로젝트 요청을 기다리고 있습니다
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const renderFormsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3>커스텀 폼 관리</h3>
        <motion.button
          onClick={() => onSectionChange('custom-form-creator')}
          className="primary-button-hover flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="liquid-glass-bg-hover"></div>
          <div className="relative z-10 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            새 폼 만들기
          </div>
        </motion.button>
      </div>

      {customForms.length > 0 ? (
        customForms.map((form, index) => (
          <motion.div
            key={form.id}
            className="simple-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="liquid-glass-bg-hover"></div>
            <div className="relative z-10 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-5 h-5 text-purple-400" />
                    <h4>{form.title}</h4>
                    <Badge variant={form.isActive ? 'default' : 'outline'}>
                      {form.isActive ? '활성' : '비활성'}
                    </Badge>
                  </div>
                  <p className="text-secondary text-sm mb-3">{form.description}</p>
                  <p className="text-tertiary text-sm">
                    {form.fields.length}개 필드 • {new Date(form.createdDate).toLocaleDateString('ko-KR')}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <motion.button
                    className="standard-button p-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="liquid-glass-bg-hover"></div>
                    <Eye className="w-4 h-4 relative z-10" />
                  </motion.button>
                  <motion.button
                    className="standard-button p-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="liquid-glass-bg-hover"></div>
                    <Edit className="w-4 h-4 relative z-10" />
                  </motion.button>
                  <motion.button
                    className="standard-button p-2 text-red-400"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="liquid-glass-bg-hover"></div>
                    <Trash2 className="w-4 h-4 relative z-10" />
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
            <FileText className="w-16 h-16 mx-auto mb-4 text-secondary" />
            <h3 className="mb-2">커스텀 폼이 없습니다</h3>
            <p className="text-secondary mb-6">
              고객 요청을 더 효율적으로 받기 위한 폼을 만들어보세요
            </p>
            <motion.button
              onClick={() => onSectionChange('custom-form-creator')}
              className="primary-button-hover"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="liquid-glass-bg-hover"></div>
              <span className="relative z-10">첫 폼 만들기</span>
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-8">
      <h3>수익 분석</h3>
      
      {/* 수익 차트 영역 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="simple-card">
          <div className="liquid-glass-bg-hover"></div>
          <div className="relative z-10 p-6">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              <h4>월별 수익</h4>
            </div>
            <div className="h-48 flex items-center justify-center text-secondary">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-3 text-tertiary" />
                <p>차트가 곧 추가됩니다</p>
              </div>
            </div>
          </div>
        </div>

        <div className="simple-card">
          <div className="liquid-glass-bg-hover"></div>
          <div className="relative z-10 p-6">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <h4>프로젝트 카테고리</h4>
            </div>
            <div className="h-48 flex items-center justify-center text-secondary">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 mx-auto mb-3 text-tertiary" />
                <p>분석 데이터를 준비중입니다</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 최고 수익 프로젝트 */}
      <div className="simple-card">
        <div className="liquid-glass-bg-hover"></div>
        <div className="relative z-10 p-6">
          <h4 className="mb-6">최고 수익 ���로젝트</h4>
          {projectRequests
            .filter(p => p.status === 'completed')
            .sort((a, b) => (b.totalPrice || b.budget.max) - (a.totalPrice || a.budget.max))
            .slice(0, 5)
            .map((project, index) => (
              <div key={project.id} className="flex items-center justify-between p-4 rounded-lg border border-white/10 mb-4 last:mb-0">
                <div>
                  <h5 className="mb-1">{project.title}</h5>
                  <p className="text-secondary text-sm">{project.category}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-medium text-green-400">
                    ${project.totalPrice || project.budget.max}
                  </div>
                  <p className="text-tertiary text-xs">
                    {new Date(project.createdDate).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  const renderProfileTab = () => (
    <div className="space-y-8">
      <h3>디자이너 프로필 관리</h3>
      
      {/* 프로필 정보 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="simple-card">
          <div className="liquid-glass-bg-hover"></div>
          <div className="relative z-10 p-6 text-center">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            <h4 className="mb-2">{user?.user_metadata?.full_name || 'Designer'}</h4>
            <p className="text-secondary text-sm">{user?.email}</p>
            <motion.button
              className="primary-button-hover mt-4"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="liquid-glass-bg-hover"></div>
              <span className="relative z-10">프로필 사진 변경</span>
            </motion.button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="simple-card">
            <div className="liquid-glass-bg-hover"></div>
            <div className="relative z-10 p-6">
              <h4 className="mb-6">기본 정보</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">이름</label>
                  <input
                    type="text"
                    defaultValue={user?.user_metadata?.full_name || ''}
                    className="w-full px-3 py-2 bg-transparent border border-white/10 rounded-lg focus:border-gray-medium outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">이메일</label>
                  <input
                    type="email"
                    defaultValue={user?.email || ''}
                    className="w-full px-3 py-2 bg-transparent border border-white/10 rounded-lg focus:border-gray-medium outline-none"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">전문 분야</label>
                  <input
                    type="text"
                    defaultValue="로고 디자인, 브랜드 아이덴티티"
                    className="w-full px-3 py-2 bg-transparent border border-white/10 rounded-lg focus:border-gray-medium outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">경력</label>
                  <input
                    type="text"
                    defaultValue="5년"
                    className="w-full px-3 py-2 bg-transparent border border-white/10 rounded-lg focus:border-gray-medium outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">자기소개</label>
                  <textarea
                    defaultValue="로고 디자인 전문가로 5년간 다양한 브랜드 아이덴티티 프로젝트를 진행했습니다. 미니멀하고 강력한 디자인으로 브랜드의 본질을 표현하는 것을 중요하게 생각합니다."
                    className="w-full px-3 py-2 bg-transparent border border-white/10 rounded-lg focus:border-gray-medium outline-none"
                    rows={4}
                  />
                </div>
              </div>
              <motion.button
                className="primary-button-hover mt-6"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="liquid-glass-bg-hover"></div>
                <span className="relative z-10">프로필 저장</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* 포트폴리오 설정 */}
      <div className="simple-card">
        <div className="liquid-glass-bg-hover"></div>
        <div className="relative z-10 p-6">
          <div className="flex items-center justify-between mb-6">
            <h4>포트폴리오 설정</h4>
            <motion.button
              onClick={() => onSectionChange('portfolio-upload')}
              className="primary-button-hover"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="liquid-glass-bg-hover"></div>
              <span className="relative z-10">작품 업로드</span>
            </motion.button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">포트폴리오 공개 여부</label>
              <select className="w-full px-3 py-2 bg-transparent border border-white/10 rounded-lg focus:border-gray-medium outline-none">
                <option value="public">공개</option>
                <option value="private">비공개</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">신규 프로젝트 수주</label>
              <select className="w-full px-3 py-2 bg-transparent border border-white/10 rounded-lg focus:border-gray-medium outline-none">
                <option value="open">수주 가능</option>
                <option value="closed">수주 중단</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 알림 설정 */}
      <div className="simple-card">
        <div className="liquid-glass-bg-hover"></div>
        <div className="relative z-10 p-6">
          <h4 className="mb-6">알림 설정</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium">새 프로젝트 알림</h5>
                <p className="text-secondary text-sm">새로운 프로젝트 요청이 있을 때 알림</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium">결제 알림</h5>
                <p className="text-secondary text-sm">수익 발생 시 알림</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium">마케팅 알림</h5>
                <p className="text-secondary text-sm">프로모션 및 마케팅 정보</p>
              </div>
              <input type="checkbox" className="w-5 h-5" />
            </div>
          </div>
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
              <TrendingUp className="w-8 h-8" />
              <div>
                <h1>디자이너 대시보드</h1>
                <p className="text-secondary">
                  프로젝트 관리와 수익 분석을 한눈에 확인하세요
                </p>
              </div>
            </div>

            {/* 탭 네비게이션 */}
            <div className="flex items-center gap-2 mb-8">
              {[
                { id: 'overview', label: '개요', icon: TrendingUp },
                { id: 'projects', label: '프로젝트', icon: ClipboardList },
                { id: 'forms', label: '커스텀 폼', icon: FileText },
                { id: 'analytics', label: '분석', icon: BarChart3 },
                { id: 'profile', label: '프로필', icon: User }
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
              {activeTab === 'projects' && renderProjectsTab()}
              {activeTab === 'forms' && renderFormsTab()}
              {activeTab === 'analytics' && renderAnalyticsTab()}
              {activeTab === 'profile' && renderProfileTab()}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, DollarSign, Calendar, User, MessageCircle, CheckCircle, X } from 'lucide-react';

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
  status: 'open' | 'in-progress' | 'completed' | 'cancelled' | 'pending-designer' | 'designer-questions';
  createdDate: string;
  proposals: ProjectProposal[];
  rushRequest?: boolean;
  additionalConcepts?: number;
  additionalRevisions?: number;
  totalPrice?: number;
  clientName: string;
  clientAvatar?: string;
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

interface PublicProjectBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: () => void;
  onPropose: (projectId: string, proposal: Omit<ProjectProposal, 'id' | 'proposalDate' | 'status'>) => void;
  publicProjects: ProjectRequest[];
  currentUser: any;
  isDesigner?: boolean;
}

export default function PublicProjectBoardModal({
  isOpen,
  onClose,
  onCreateProject,
  onPropose,
  publicProjects,
  currentUser,
  isDesigner = false
}: PublicProjectBoardModalProps) {
  const [selectedProject, setSelectedProject] = useState<ProjectRequest | null>(null);
  const [isProposalMode, setIsProposalMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('open');
  
  // 제안서 작성
  const [proposedPrice, setProposedPrice] = useState(0);
  const [estimatedDays, setEstimatedDays] = useState(7);
  const [proposalMessage, setProposalMessage] = useState('');

  const categories = ['All', 'Logo Design', 'Font Design', 'Business Card Design', 'Website Design', 'Branding Package'];

  const filteredProjects = publicProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || project.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const badges = {
      'open': { color: 'bg-green-400/20 text-green-400 border-green-400/30', text: '모집중' },
      'in-progress': { color: 'bg-blue-400/20 text-blue-400 border-blue-400/30', text: '진행중' },
      'completed': { color: 'bg-gray-500/20 text-gray-500 border-gray-500/30', text: '완료됨' },
      'cancelled': { color: 'bg-red-400/20 text-red-400 border-red-400/30', text: '취소됨' }
    };
    
    return badges[status] || badges['open'];
  };

  const handlePropose = () => {
    if (!selectedProject || !currentUser) return;
    
    const proposal: Omit<ProjectProposal, 'id' | 'proposalDate' | 'status'> = {
      designerId: currentUser.id,
      designerName: currentUser.user_metadata?.full_name || currentUser.email,
      designerAvatar: currentUser.user_metadata?.avatar_url || '',
      proposedPrice,
      estimatedDays,
      message: proposalMessage,
      portfolio: [] // 실제로는 디자이너의 포트폴리오에서 선택
    };

    onPropose(selectedProject.id, proposal);
    
    // 초기화
    setProposedPrice(0);
    setEstimatedDays(7);
    setProposalMessage('');
    setIsProposalMode(false);
    setSelectedProject(null);
    
    alert('✅ 제안서가 제출되었습니다!\n\n고객이 검토 후 연락드릴 예정입니다.');
  };

  const getDaysLeft = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* 배경 오버레이 */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* 모달 콘텐츠 */}
          <motion.div
            className="relative z-10 w-full max-w-7xl mx-4 max-h-[90vh] overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="simple-card h-full">
              <div className="liquid-glass-bg-hover"></div>
              <div className="relative z-10 p-8">
                {/* 헤더 */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="mb-2">🌍 공개 의뢰 게시판</h2>
                    <p className="text-secondary">
                      {isDesigner ? '마음에 드는 프로젝트를 찾아 제안해보세요' : '공개적으로 프로젝트를 올리고 디자이너들의 제안을 받아보세요'}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    {!isDesigner && (
                      <motion.button
                        onClick={() => {
                          onClose();
                          onCreateProject();
                        }}
                        className="primary-button-hover px-4 py-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="liquid-glass-bg-hover"></div>
                        <span className="relative z-10">+ 새 의뢰 올리기</span>
                      </motion.button>
                    )}
                    <motion.button
                      onClick={onClose}
                      className="standard-button p-3"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="liquid-glass-bg-hover"></div>
                      <X className="w-6 h-6 relative z-10" />
                    </motion.button>
                  </div>
                </div>

                {selectedProject ? (
                  /* 프로젝트 상세보기 */
                  <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <motion.button
                        onClick={() => {
                          setSelectedProject(null);
                          setIsProposalMode(false);
                        }}
                        className="standard-button p-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="liquid-glass-bg-hover"></div>
                        <span className="relative z-10">←</span>
                      </motion.button>
                      <h3>{selectedProject.title}</h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* 프로젝트 정보 */}
                      <div className="lg:col-span-2 space-y-6">
                        <div className="simple-card p-6">
                          <div className="liquid-glass-bg-hover"></div>
                          <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                                  <User className="w-5 h-5" />
                                </div>
                                <div>
                                  <div className="font-medium">{selectedProject.clientName}</div>
                                  <div className="text-sm text-secondary">{selectedProject.category}</div>
                                </div>
                              </div>
                              <div className={`px-3 py-1 rounded-full text-sm border ${getStatusBadge(selectedProject.status).color}`}>
                                {getStatusBadge(selectedProject.status).text}
                              </div>
                            </div>

                            <p className="text-secondary mb-6">{selectedProject.description}</p>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-green-400" />
                                <span className="text-sm">예산: ${selectedProject.budget.min} - ${selectedProject.budget.max}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-blue-400" />
                                <span className="text-sm">마감: {getDaysLeft(selectedProject.deadline)}일 후</span>
                              </div>
                            </div>

                            {selectedProject.requirements.length > 0 && (
                              <div>
                                <h4 className="mb-3">📋 요구사항</h4>
                                <ul className="space-y-2">
                                  {selectedProject.requirements.map((req, index) => (
                                    <li key={index} className="text-sm text-secondary flex items-start gap-2">
                                      <span className="text-green-400 mt-1">•</span>
                                      {req}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 받은 제안들 */}
                        <div className="simple-card p-6">
                          <div className="liquid-glass-bg-hover"></div>
                          <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-4">
                              <MessageCircle className="w-5 h-5" />
                              <h4>받은 제안 ({selectedProject.proposals.length}개)</h4>
                            </div>

                            {selectedProject.proposals.length > 0 ? (
                              <div className="space-y-4">
                                {selectedProject.proposals.map((proposal) => (
                                  <div key={proposal.id} className="border border-white/10 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                                          <User className="w-4 h-4" />
                                        </div>
                                        <div>
                                          <div className="font-medium">{proposal.designerName}</div>
                                          <div className="text-xs text-secondary">{proposal.estimatedDays}일 소요 예상</div>
                                        </div>
                                      </div>
                                      <div className="text-lg font-semibold text-green-400">${proposal.proposedPrice}</div>
                                    </div>
                                    <p className="text-sm text-secondary">{proposal.message}</p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-8">
                                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-tertiary" />
                                <p className="text-secondary">아직 제안이 없습니다</p>
                                <p className="text-tertiary text-sm">첫 번째 제안자가 되어보세요!</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* 제안하기 (디자이너만) */}
                      {isDesigner && selectedProject.status === 'open' && (
                        <div className="simple-card p-6">
                          <div className="liquid-glass-bg-hover"></div>
                          <div className="relative z-10">
                            {!isProposalMode ? (
                              <div>
                                <h4 className="mb-4">💡 이 프로젝트에 제안하기</h4>
                                <p className="text-secondary text-sm mb-6">
                                  고객의 요구사항을 충족할 수 있다면 제안서를 작성해보세요.
                                </p>
                                <motion.button
                                  onClick={() => setIsProposalMode(true)}
                                  className="primary-button-hover w-full py-3"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <div className="liquid-glass-bg-hover"></div>
                                  <span className="relative z-10">제안서 작성하기</span>
                                </motion.button>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                <h4 className="mb-4">📝 제안서 작성</h4>
                                
                                <div>
                                  <label className="block text-sm font-medium mb-2">제안 가격</label>
                                  <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-tertiary">$</span>
                                    <input
                                      type="number"
                                      value={proposedPrice}
                                      onChange={(e) => setProposedPrice(Number(e.target.value))}
                                      min={selectedProject.budget.min}
                                      max={selectedProject.budget.max}
                                      className="w-full pl-8 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-gray-medium/50"
                                    />
                                  </div>
                                  <div className="text-xs text-secondary mt-1">
                                    예산 범위: ${selectedProject.budget.min} - ${selectedProject.budget.max}
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium mb-2">예상 소요 기간</label>
                                  <select
                                    value={estimatedDays}
                                    onChange={(e) => setEstimatedDays(Number(e.target.value))}
                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-gray-medium/50"
                                  >
                                    <option value={3}>3일</option>
                                    <option value={5}>5일</option>
                                    <option value={7}>7일</option>
                                    <option value={10}>10일</option>
                                    <option value={14}>14일</option>
                                    <option value={21}>3주</option>
                                    <option value={30}>1개월</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium mb-2">제안 메시지</label>
                                  <textarea
                                    value={proposalMessage}
                                    onChange={(e) => setProposalMessage(e.target.value)}
                                    placeholder="고객에게 보낼 메시지를 작성해주세요. 왜 이 프로젝트에 적합한지, 어떤 과정으로 진행할 것인지 설명해주세요."
                                    className="w-full h-24 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-medium resize-none focus:outline-none focus:border-gray-medium/50"
                                    maxLength={500}
                                  />
                                  <div className="text-right text-xs text-tertiary mt-1">
                                    {proposalMessage.length}/500
                                  </div>
                                </div>

                                <div className="flex gap-3">
                                  <motion.button
                                    onClick={() => setIsProposalMode(false)}
                                    className="standard-button px-4 py-2 flex-1"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    <div className="liquid-glass-bg-hover"></div>
                                    <span className="relative z-10">취소</span>
                                  </motion.button>
                                  <motion.button
                                    onClick={handlePropose}
                                    disabled={!proposedPrice || !proposalMessage.trim()}
                                    className={`primary-button-hover px-4 py-2 flex-1 ${!proposedPrice || !proposalMessage.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    whileHover={proposedPrice && proposalMessage.trim() ? { scale: 1.02 } : {}}
                                    whileTap={proposedPrice && proposalMessage.trim() ? { scale: 0.98 } : {}}
                                  >
                                    <div className="liquid-glass-bg-hover"></div>
                                    <span className="relative z-10">제안하기</span>
                                  </motion.button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  /* 프로젝트 목록 */
                  <div className="space-y-6">
                    {/* 필터 및 검색 */}
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <div className="search-bar-clean">
                          <div className="liquid-glass-bg-hover"></div>
                          <div className="relative z-10 flex items-center">
                            <svg className="w-4 h-4 mr-3 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                              type="text"
                              placeholder="프로젝트 검색..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="bg-transparent border-none outline-none text-white placeholder-gray-medium flex-1"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-4">
                        <select
                          value={categoryFilter}
                          onChange={(e) => setCategoryFilter(e.target.value)}
                          className="standard-button appearance-none bg-transparent pr-8"
                        >
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="standard-button appearance-none bg-transparent pr-8"
                        >
                          <option value="open">모집중</option>
                          <option value="all">전체</option>
                          <option value="in-progress">진행중</option>
                          <option value="completed">완료됨</option>
                        </select>
                      </div>
                    </div>

                    {/* 프로젝트 목록 */}
                    <div className="max-h-[60vh] overflow-y-auto">
                      {filteredProjects.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {filteredProjects.map((project, index) => (
                            <motion.div
                              key={project.id}
                              className="simple-card p-6 cursor-pointer"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              onClick={() => setSelectedProject(project)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="liquid-glass-bg-hover"></div>
                              <div className="relative z-10">
                                <div className="flex items-start justify-between mb-4">
                                  <div className="flex-1">
                                    <h3 className="mb-2 line-clamp-1">{project.title}</h3>
                                    <p className="text-secondary text-sm mb-3 line-clamp-2">{project.description}</p>
                                  </div>
                                  <div className={`px-2 py-1 rounded-full text-xs border ml-4 ${getStatusBadge(project.status).color}`}>
                                    {getStatusBadge(project.status).text}
                                  </div>
                                </div>

                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-green-400" />
                                    <span className="text-sm font-medium">${project.budget.min} - ${project.budget.max}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-blue-400" />
                                    <span className="text-sm">{getDaysLeft(project.deadline)}일 후</span>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center">
                                      <User className="w-3 h-3" />
                                    </div>
                                    <span className="text-sm text-secondary">{project.clientName}</span>
                                  </div>
                                  <div className="flex items-center gap-1 text-sm text-tertiary">
                                    <MessageCircle className="w-4 h-4" />
                                    <span>{project.proposals.length}</span>
                                  </div>
                                </div>

                                {project.rushRequest && (
                                  <div className="mt-3 px-2 py-1 bg-orange-400/20 rounded text-xs text-orange-400 inline-block">
                                    ⚡ 급한 마감
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-20">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                            <MessageCircle className="w-8 h-8 text-tertiary" />
                          </div>
                          <h3 className="mb-2">프로젝트가 없습니다</h3>
                          <p className="text-secondary mb-6">
                            {searchQuery || categoryFilter !== 'All' ? '검색 조건을 변경해보세요' : '첫 번째 프로젝트를 올려보세요'}
                          </p>
                          {!isDesigner && (
                            <motion.button
                              onClick={() => {
                                onClose();
                                onCreateProject();
                              }}
                              className="primary-button-hover px-6 py-3"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="liquid-glass-bg-hover"></div>
                              <span className="relative z-10">첫 프로젝트 올리기</span>
                            </motion.button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
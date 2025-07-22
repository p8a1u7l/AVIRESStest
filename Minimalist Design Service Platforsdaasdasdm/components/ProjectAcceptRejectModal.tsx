"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// App.tsx에서 사용하는 ProjectRequest 타입과 일치하도록 수정
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

interface ProjectAcceptRejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: (projectId: string, message?: string) => void;
  onReject: (projectId: string, reason: string) => void;
  project: ProjectRequest;
  designer?: any; // 선택적으로 디자이너 정보
}

export default function ProjectAcceptRejectModal({
  isOpen,
  onClose,
  onAccept,
  onReject,
  project,
  designer
}: ProjectAcceptRejectModalProps) {
  const [decision, setDecision] = useState<'accept' | 'reject' | null>(null);
  const [message, setMessage] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!decision) return;
    
    if (decision === 'reject' && !rejectReason.trim()) {
      alert('거절 사유를 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      
      if (decision === 'accept') {
        onAccept(project.id, message.trim() || undefined);
      } else {
        onReject(project.id, rejectReason.trim());
      }
      
      handleClose();
    } catch (error) {
      console.error('Decision submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setDecision(null);
    setMessage('');
    setRejectReason('');
    onClose();
  };

  // 일반적인 거절 사유 템플릿
  const rejectReasons = [
    "현재 일정이 가득 차서 품질 높은 작업을 보장하기 어렵습니다.",
    "해당 분야가 제 전문 영역과 맞지 않습니다.",
    "요청하신 마감일이 너무 촉박합니다.",
    "프로젝트 예산이 제 작업 수준과 맞지 않습니다.",
    "현재 비슷한 프로젝트를 진행 중이어서 이해충돌이 있을 수 있습니다.",
    "요청 사항이 제 디자인 철학과 맞지 않습니다."
  ];

  const daysUntilDeadline = Math.ceil((new Date(project.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

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
            onClick={handleClose}
          />

          {/* 모달 콘텐츠 */}
          <motion.div
            className="relative z-10 w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden"
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
                    <h2 className="mb-2">🤝 프로젝트 검토하기</h2>
                    <p className="text-secondary">
                      "{project.title}" 프로젝트를 수락하거나 거절하세요
                    </p>
                  </div>
                  <motion.button
                    onClick={handleClose}
                    className="standard-button p-3"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="liquid-glass-bg-hover"></div>
                    <svg className="w-6 h-6 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* 왼쪽: 프로젝트 정보 */}
                  <div className="space-y-6">
                    <div className="simple-card p-6">
                      <div className="liquid-glass-bg-hover"></div>
                      <div className="relative z-10">
                        <h3 className="mb-4">📋 프로젝트 상세정보</h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-white">{project.title}</h4>
                            <p className="text-secondary text-sm mt-2">{project.description}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-tertiary text-xs">예산</p>
                              <p className="text-white font-medium">${project.budget}</p>
                            </div>
                            <div>
                              <p className="text-tertiary text-xs">마감일</p>
                              <p className="text-white font-medium">
                                {new Date(project.deadline).toLocaleDateString('ko-KR')}
                              </p>
                              {daysUntilDeadline <= 7 && (
                                <span className="text-red-400 text-xs">
                                  ({daysUntilDeadline}일 남음)
                                </span>
                              )}
                            </div>
                          </div>

                          {project.isRush && (
                            <div className="bg-yellow-400/10 p-3 rounded-lg border border-yellow-400/20">
                              <p className="text-yellow-400 text-sm">
                                🚀 급한 프로젝트 (+${project.rushFee || 0} 추가)
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="simple-card p-6">
                      <div className="liquid-glass-bg-hover"></div>
                      <div className="relative z-10">
                        <h3 className="mb-4">💰 예상 수익</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-secondary">기본 프로젝트</span>
                            <span className="text-white">${project.budget}</span>
                          </div>
                          {project.rushFee && (
                            <div className="flex justify-between">
                              <span className="text-secondary">급한 작업 추가</span>
                              <span className="text-yellow-400">+${project.rushFee}</span>
                            </div>
                          )}
                          <div className="border-t border-white/10 pt-3">
                            <div className="flex justify-between font-medium">
                              <span className="text-white">총 예상 수익</span>
                              <span className="text-green-400">${project.budget + (project.rushFee || 0)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 오른쪽: 결정 인터페이스 */}
                  <div className="space-y-6">
                    {!decision && (
                      <div className="space-y-4">
                        <h3 className="mb-4">🎯 어떻게 하시겠습니까?</h3>
                        
                        <div className="space-y-3">
                          <motion.button
                            onClick={() => setDecision('accept')}
                            className="w-full p-6 bg-green-400/10 border border-green-400/20 rounded-lg hover:bg-green-400/20 transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center justify-center space-x-3">
                              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <div className="text-center">
                                <h4 className="text-green-400 font-semibold">✅ 프로젝트 수락하기</h4>
                                <p className="text-green-400/80 text-sm mt-1">이 프로젝트를 맡아 작업하겠습니다</p>
                              </div>
                            </div>
                          </motion.button>

                          <motion.button
                            onClick={() => setDecision('reject')}
                            className="w-full p-6 bg-red-400/10 border border-red-400/20 rounded-lg hover:bg-red-400/20 transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center justify-center space-x-3">
                              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <div className="text-center">
                                <h4 className="text-red-400 font-semibold">❌ 프로젝트 거절하기</h4>
                                <p className="text-red-400/80 text-sm mt-1">이번 프로젝트는 맡을 수 없습니다</p>
                              </div>
                            </div>
                          </motion.button>
                        </div>
                      </div>
                    )}

                    {decision === 'accept' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <h3 className="text-green-400 mb-4">✅ 프로젝트 수락</h3>
                        <div className="simple-card p-6">
                          <div className="liquid-glass-bg-hover"></div>
                          <div className="relative z-10 space-y-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                고객에게 보낼 메시지 (선택사항)
                              </label>
                              <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="안녕하세요! 이 프로젝트를 맡게 되어 기쁩니다. 최선을 다해 작업하겠습니다..."
                                className="w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-medium resize-none focus:outline-none focus:border-green-400/50"
                                maxLength={500}
                              />
                            </div>

                            <div className="p-4 bg-green-400/10 rounded-lg border border-green-400/20">
                              <h4 className="text-green-400 font-medium mb-2">🎉 수락 시 다음과 같이 진행됩니다:</h4>
                              <ul className="space-y-1 text-sm text-green-400/80">
                                <li>• 프로젝트가 진행 중 상태로 변경됩니다</li>
                                <li>• 고객에게 알림이 전송됩니다</li>
                                <li>• 대시보드에서 프로젝트를 관리할 수 있습니다</li>
                                <li>• 작업 완료 후 파일을 업로드할 수 있습니다</li>
                              </ul>
                            </div>

                            <div className="flex space-x-3">
                              <motion.button
                                onClick={() => setDecision(null)}
                                className="standard-button flex-1 py-3"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <div className="liquid-glass-bg-hover"></div>
                                <span className="relative z-10">뒤로가기</span>
                              </motion.button>
                              <motion.button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="primary-button-hover flex-1 py-3"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <div className="liquid-glass-bg-hover"></div>
                                <span className="relative z-10">
                                  {isSubmitting ? '수락 처리 중...' : '🚀 확정하기'}
                                </span>
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {decision === 'reject' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <h3 className="text-red-400 mb-4">❌ 프로젝트 거절</h3>
                        <div className="simple-card p-6">
                          <div className="liquid-glass-bg-hover"></div>
                          <div className="relative z-10 space-y-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                거절 사유 <span className="text-red-400">*</span>
                              </label>
                              <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="정중한 거절 사유를 입력해주세요..."
                                className="w-full h-24 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-medium resize-none focus:outline-none focus:border-red-400/50"
                                maxLength={300}
                              />
                              <div className="text-right text-xs text-tertiary mt-1">
                                {rejectReason.length}/300
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-3">
                                💡 빠른 사유 선택 (클릭하면 자동 입력)
                              </label>
                              <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                                {rejectReasons.map((reason, index) => (
                                  <motion.button
                                    key={index}
                                    onClick={() => setRejectReason(reason)}
                                    className="text-left p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-sm"
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                  >
                                    {reason}
                                  </motion.button>
                                ))}
                              </div>
                            </div>

                            <div className="p-4 bg-red-400/10 rounded-lg border border-red-400/20">
                              <h4 className="text-red-400 font-medium mb-2">ℹ️ 거절 시 안내사항:</h4>
                              <ul className="space-y-1 text-sm text-red-400/80">
                                <li>• 정중하고 건설적인 피드백을 제공해주세요</li>
                                <li>• 다른 디자이너가 이 프로젝트를 볼 수 있습니다</li>
                                <li>• 향후 비슷한 프로젝트를 추천하지 않을 수 있습니다</li>
                              </ul>
                            </div>

                            <div className="flex space-x-3">
                              <motion.button
                                onClick={() => setDecision(null)}
                                className="standard-button flex-1 py-3"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <div className="liquid-glass-bg-hover"></div>
                                <span className="relative z-10">뒤로가기</span>
                              </motion.button>
                              <motion.button
                                onClick={handleSubmit}
                                disabled={!rejectReason.trim() || isSubmitting}
                                className={`primary-button-hover flex-1 py-3 ${
                                  !rejectReason.trim() || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                whileHover={rejectReason.trim() && !isSubmitting ? { scale: 1.02 } : {}}
                                whileTap={rejectReason.trim() && !isSubmitting ? { scale: 0.98 } : {}}
                              >
                                <div className="liquid-glass-bg-hover"></div>
                                <span className="relative z-10">
                                  {isSubmitting ? '거절 처리 중...' : '거절하기'}
                                </span>
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

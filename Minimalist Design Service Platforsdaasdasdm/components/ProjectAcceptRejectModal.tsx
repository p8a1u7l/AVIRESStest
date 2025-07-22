"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  rushRequest?: boolean;
  additionalConcepts?: number;
  additionalRevisions?: number;
  totalPrice?: number;
}

interface ProjectAcceptRejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: (projectId: string, message?: string) => void;
  onReject: (projectId: string, reason: string) => void;
  project: ProjectRequest;
}

export default function ProjectAcceptRejectModal({
  isOpen,
  onClose,
  onAccept,
  onReject,
  project
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
                    <div>
                      <h3 className="mb-4">📋 프로젝트 상세 정보</h3>
                      <div className="simple-card p-6">
                        <div className="liquid-glass-bg-hover"></div>
                        <div className="relative z-10 space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-tertiary text-sm">카테고리</span>
                              <p className="font-medium">{project.category}</p>
                            </div>
                            <div>
                              <span className="text-tertiary text-sm">마감일</span>
                              <p className={`font-medium ${daysUntilDeadline <= 3 ? 'text-red-400' : daysUntilDeadline <= 7 ? 'text-yellow-400' : 'text-green-400'}`}>
                                {new Date(project.deadline).toLocaleDateString('ko-KR')}
                                <span className="text-xs text-tertiary ml-2">
                                  ({daysUntilDeadline}일 남음)
                                </span>
                              </p>
                            </div>
                          </div>

                          <div>
                            <span className="text-tertiary text-sm">예산 범위</span>
                            <div className="flex items-center space-x-2">
                              <p className="text-lg font-semibold">${project.budget.min} - ${project.budget.max}</p>
                              {project.totalPrice && project.totalPrice > project.budget.max && (
                                <span className="text-xs bg-green-400/20 text-green-400 px-2 py-1 rounded-full">
                                  +추가 옵션: ${project.totalPrice}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* 추가 옵션들 */}
                          {(project.rushRequest || project.additionalConcepts || project.additionalRevisions) && (
                            <div>
                              <span className="text-tertiary text-sm">추가 요청 사항</span>
                              <div className="space-y-2 mt-2">
                                {project.rushRequest && (
                                  <div className="flex items-center space-x-2 p-2 bg-orange-400/10 rounded-lg border border-orange-400/20">
                                    <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-sm text-orange-400">급한 마감 (+50% 추가 요금)</span>
                                  </div>
                                )}
                                {project.additionalConcepts && project.additionalConcepts > 0 && (
                                  <div className="flex items-center space-x-2 p-2 bg-blue-400/10 rounded-lg border border-blue-400/20">
                                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                    <span className="text-sm text-blue-400">추가 시안 {project.additionalConcepts}개 (+${project.additionalConcepts * 50})</span>
                                  </div>
                                )}
                                {project.additionalRevisions && project.additionalRevisions > 0 && (
                                  <div className="flex items-center space-x-2 p-2 bg-purple-400/10 rounded-lg border border-purple-400/20">
                                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    <span className="text-sm text-purple-400">추가 수정 {project.additionalRevisions}회 (+${project.additionalRevisions * 25})</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          <div>
                            <span className="text-tertiary text-sm">프로젝트 설명</span>
                            <p className="text-secondary text-sm mt-1 leading-relaxed">{project.description}</p>
                          </div>

                          {project.requirements.length > 0 && (
                            <div>
                              <span className="text-tertiary text-sm">요구사항</span>
                              <ul className="space-y-1 mt-2">
                                {project.requirements.map((req, index) => (
                                  <li key={index} className="flex items-start space-x-2 text-sm text-secondary">
                                    <span className="text-green-400 mt-1">•</span>
                                    <span>{req}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {project.attachments.length > 0 && (
                            <div>
                              <span className="text-tertiary text-sm">첨부 파일</span>
                              <div className="space-y-2 mt-2">
                                {project.attachments.map((file, index) => (
                                  <div key={index} className="flex items-center space-x-2 p-2 bg-white/5 rounded-lg">
                                    <svg className="w-4 h-4 text-gray-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                    </svg>
                                    <span className="text-sm text-secondary">{file.name}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 오른쪽: 의사 결정 */}
                  <div className="space-y-6">
                    {!decision && (
                      <div>
                        <h3 className="mb-4">🤔 결정해주세요</h3>
                        <div className="space-y-4">
                          <motion.button
                            onClick={() => setDecision('accept')}
                            className="w-full p-6 border-2 border-green-400/30 bg-green-400/10 rounded-xl hover:bg-green-400/20 transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center justify-center space-x-3">
                              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <div className="text-center">
                                <h4 className="text-green-400 font-semibold">✅ 프로젝트 수락하기</h4>
                                <p className="text-green-400/80 text-sm mt-1">이 프로젝트를 맡아서 진행하겠습니다</p>
                              </div>
                            </div>
                          </motion.button>

                          <motion.button
                            onClick={() => setDecision('reject')}
                            className="w-full p-6 border-2 border-red-400/30 bg-red-400/10 rounded-xl hover:bg-red-400/20 transition-colors"
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
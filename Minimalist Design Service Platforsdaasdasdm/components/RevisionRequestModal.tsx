"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

interface RevisionRequest {
  id: string;
  orderId: string;
  requestText: string;
  status: 'pending' | 'completed' | 'in-progress';
  createdAt: string;
  response?: string;
}

interface RevisionRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (orderId: string, requestText: string) => void;
  order: Order | null;
  revisionRequests?: RevisionRequest[];
}

export default function RevisionRequestModal({
  isOpen,
  onClose,
  onSubmit,
  order,
  revisionRequests = []
}: RevisionRequestModalProps) {
  const [requestText, setRequestText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!order) return null;

  // 현재 주문에 대한 수정 요청들만 필터링
  const currentRevisions = revisionRequests.filter(req => req.orderId === order.id);
  const remainingRevisions = order.remainingRevisions;
  const canSubmit = remainingRevisions > 0 && requestText.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !order) return;

    setIsSubmitting(true);
    
    try {
      await onSubmit(order.id, requestText.trim());
      setRequestText('');
      onClose();
    } catch (error) {
      console.error('수정 요청 제출 실패:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRequestText('');
    onClose();
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
                    <h2 className="mb-2">📝 수정 요청서</h2>
                    <p className="text-secondary">
                      {order.productTitle} | {order.designer}
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
                  {/* 왼쪽: 수정 요청 폼 */}
                  <div>
                    {/* 수정 횟수 상태 */}
                    <div className="simple-card mb-6">
                      <div className="liquid-glass-bg-hover"></div>
                      <div className="relative z-10 p-4">
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-medium">수정 요청 현황</span>
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            remainingRevisions > 0 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {remainingRevisions}회 남음
                          </span>
                        </div>
                        
                        {/* 진행률 바 */}
                        <div className="w-full bg-white/10 rounded-full h-2 mb-4">
                          <motion.div
                            className={`h-2 rounded-full ${
                              remainingRevisions > 0 
                                ? 'bg-gradient-to-r from-green-500 to-green-400' 
                                : 'bg-gradient-to-r from-red-500 to-red-400'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${((3 - remainingRevisions) / 3) * 100}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>

                        <p className="text-secondary text-sm">
                          {remainingRevisions > 0 
                            ? `앞으로 ${remainingRevisions}회 더 수정 요청이 가능합니다.`
                            : '모든 수정 요청 횟수를 사용했습니다.'
                          }
                        </p>
                      </div>
                    </div>

                    {/* 수정 요청 폼 */}
                    {remainingRevisions > 0 ? (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                          <label htmlFor="revision-request" className="block mb-2">
                            수정 요청 내용 *
                          </label>
                          <textarea
                            id="revision-request"
                            value={requestText}
                            onChange={(e) => setRequestText(e.target.value)}
                            placeholder="어떤 부분을 수정하고 싶으신지 구체적으로 설명해주세요.&#10;예: 로고의 색상을 파란색으로 변경하고, 폰트를 좀 더 굵게 만들어주세요."
                            className="w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:border-green-400/50"
                            maxLength={500}
                            required
                          />
                          <div className="text-right text-xs text-tertiary mt-1">
                            {requestText.length}/500
                          </div>
                        </div>

                        <div className="bg-blue-400/10 p-4 rounded-lg border border-blue-400/20">
                          <h4 className="text-blue-400 font-medium mb-2">💡 수정 요청 팁</h4>
                          <ul className="space-y-1 text-sm text-blue-400/80">
                            <li>• 구체적이고 명확한 설명을 제공해주세요</li>
                            <li>• 색상, 크기, 위치 등을 정확히 명시해주세요</li>
                            <li>• 참고 이미지가 있다면 별도로 전달해주세요</li>
                            <li>• 수정 요청은 제한이 있으니 신중히 작성해주세요</li>
                          </ul>
                        </div>

                        <div className="flex space-x-3">
                          <motion.button
                            type="button"
                            onClick={handleClose}
                            className="standard-button flex-1 py-3"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="liquid-glass-bg-hover"></div>
                            <span className="relative z-10">취소</span>
                          </motion.button>
                          <motion.button
                            type="submit"
                            disabled={!canSubmit || isSubmitting}
                            className={`primary-button-hover flex-1 py-3 ${
                              !canSubmit || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            whileHover={canSubmit && !isSubmitting ? { scale: 1.02 } : {}}
                            whileTap={canSubmit && !isSubmitting ? { scale: 0.98 } : {}}
                          >
                            <div className="liquid-glass-bg-hover"></div>
                            <span className="relative z-10">
                              {isSubmitting ? '제출 중...' : '수정 요청 제출'}
                            </span>
                          </motion.button>
                        </div>
                      </form>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                        </div>
                        <h4 className="mb-2">수정 요청 한도 초과</h4>
                        <p className="text-secondary">
                          이 주문에 대한 모든 수정 요청 횟수를 사용했습니다.
                          추가 수정이 필요하다면 새로운 주문을 진행해주세요.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* 오른쪽: 이전 수정 요청 내역 */}
                  <div>
                    <h3 className="mb-4">이전 수정 요청 내역</h3>
                    
                    {currentRevisions.length > 0 ? (
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {currentRevisions.map((revision, index) => (
                          <div key={revision.id} className="simple-card">
                            <div className="liquid-glass-bg-hover"></div>
                            <div className="relative z-10 p-4">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-medium">
                                  {index + 1}차 수정 요청
                                </h4>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  revision.status === 'completed' 
                                    ? 'bg-green-500/20 text-green-400'
                                    : revision.status === 'in-progress'
                                      ? 'bg-yellow-500/20 text-yellow-400'
                                      : 'bg-gray-500/20 text-gray-400'
                                }`}>
                                  {revision.status === 'completed' 
                                    ? '완료' 
                                    : revision.status === 'in-progress'
                                      ? '진행중'
                                      : '대기중'
                                  }
                                </span>
                              </div>
                              
                              <p className="text-secondary text-sm mb-3">
                                {revision.requestText}
                              </p>
                              
                              {revision.response && (
                                <div className="bg-white/5 p-3 rounded border-l-2 border-green-400/50">
                                  <p className="text-xs text-green-400 mb-1">디자이너 응답:</p>
                                  <p className="text-secondary text-sm">{revision.response}</p>
                                </div>
                              )}
                              
                              <div className="text-xs text-tertiary mt-2">
                                {new Date(revision.createdAt).toLocaleDateString('ko-KR', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                          <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <p className="text-secondary">
                          아직 수정 요청 내역이 없습니다.
                        </p>
                      </div>
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

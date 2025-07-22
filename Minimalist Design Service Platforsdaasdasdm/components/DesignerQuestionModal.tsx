"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
}

interface DesignerQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (question: string) => void;
  project: ProjectRequest;
  currentQuestions: DesignerQuestion[];
}

export default function DesignerQuestionModal({
  isOpen,
  onClose,
  onSubmit,
  project,
  currentQuestions
}: DesignerQuestionModalProps) {
  const [question, setQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!question.trim()) return;

    try {
      setIsSubmitting(true);
      onSubmit(question.trim());
      setQuestion('');
      onClose();
    } catch (error) {
      console.error('Question submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setQuestion('');
    onClose();
  };

  // Quick question templates for convenience
  const questionTemplates = [
    "혹시 색깔은 어떤 걸 좋아하시나요?",
    "타겟 고객층의 연령대는 어떻게 되나요?",
    "기존에 사용하시던 로고나 브랜딩이 있나요?",
    "어떤 느낌의 디자인을 원하시나요? (모던, 클래식, 미니멀 등)",
    "특별히 포함하고 싶은 요소나 피하고 싶은 요소가 있나요?",
    "이 프로젝트의 가장 중요한 목표는 무엇인가요?",
    "참고하고 싶은 디자인이나 브랜드가 있나요?",
    "사용할 매체는 어떻게 되나요? (웹, 인쇄, 간판 등)"
  ];

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
                    <h2 className="mb-2">🎨 디자이너 질문하기</h2>
                    <p className="text-secondary">
                      "{project.title}" 프로젝트에 대해 고객에게 질문하세요
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
                  {/* 왼쪽: 질문 작성 */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="mb-4">✍️ 질문 작성하기</h3>
                      <div className="simple-card p-6">
                        <div className="liquid-glass-bg-hover"></div>
                        <div className="relative z-10 space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              고객에게 궁금한 점을 질문해보세요
                            </label>
                            <textarea
                              value={question}
                              onChange={(e) => setQuestion(e.target.value)}
                              placeholder="예: 혹시 선호하시는 색깔이나 스타일이 있나요?"
                              className="w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-medium resize-none focus:outline-none focus:border-gray-medium/50"
                              maxLength={500}
                            />
                            <div className="text-right text-xs text-tertiary mt-1">
                              {question.length}/500
                            </div>
                          </div>

                          {/* 빠른 질문 템플릿 */}
                          <div>
                            <label className="block text-sm font-medium mb-3">
                              💡 빠른 질문 템플릿 (클릭하면 자동 입력)
                            </label>
                            <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                              {questionTemplates.map((template, index) => (
                                <motion.button
                                  key={index}
                                  onClick={() => setQuestion(template)}
                                  className="text-left p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-sm"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  {template}
                                </motion.button>
                              ))}
                            </div>
                          </div>

                          {/* 제출 버튼 */}
                          <motion.button
                            onClick={handleSubmit}
                            disabled={!question.trim() || isSubmitting}
                            className={`primary-button-hover w-full py-3 ${
                              !question.trim() || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            whileHover={question.trim() && !isSubmitting ? { scale: 1.02 } : {}}
                            whileTap={question.trim() && !isSubmitting ? { scale: 0.98 } : {}}
                          >
                            <div className="liquid-glass-bg-hover"></div>
                            <span className="relative z-10">
                              {isSubmitting ? '전송 중...' : '🚀 질문 보내기'}
                            </span>
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 오른쪽: 프로젝트 정보 & 기존 질문들 */}
                  <div className="space-y-6">
                    {/* 프로젝트 정보 */}
                    <div>
                      <h3 className="mb-4">📋 프로젝트 정보</h3>
                      <div className="simple-card p-6">
                        <div className="liquid-glass-bg-hover"></div>
                        <div className="relative z-10 space-y-3">
                          <div>
                            <span className="text-tertiary text-sm">제목</span>
                            <p className="font-medium">{project.title}</p>
                          </div>
                          <div>
                            <span className="text-tertiary text-sm">카테고리</span>
                            <p className="text-secondary">{project.category}</p>
                          </div>
                          <div>
                            <span className="text-tertiary text-sm">예산</span>
                            <p className="text-secondary">${project.budget.min} - ${project.budget.max}</p>
                          </div>
                          <div>
                            <span className="text-tertiary text-sm">마감일</span>
                            <p className="text-secondary">{new Date(project.deadline).toLocaleDateString('ko-KR')}</p>
                          </div>
                          <div>
                            <span className="text-tertiary text-sm">설명</span>
                            <p className="text-secondary text-sm line-clamp-3">{project.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 기존 질문들 */}
                    {currentQuestions.length > 0 && (
                      <div>
                        <h3 className="mb-4">💬 이전 질문들 ({currentQuestions.length}개)</h3>
                        <div className="space-y-3 max-h-80 overflow-y-auto">
                          {currentQuestions.map((q) => (
                            <div key={q.id} className="simple-card p-4">
                              <div className="liquid-glass-bg-hover"></div>
                              <div className="relative z-10">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center space-x-2">
                                    <div className={`w-2 h-2 rounded-full ${
                                      q.status === 'answered' ? 'bg-green-400' : 'bg-yellow-400'
                                    }`}></div>
                                    <span className="text-xs text-tertiary">
                                      {new Date(q.questionDate).toLocaleDateString('ko-KR')}
                                    </span>
                                  </div>
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    q.status === 'answered' 
                                      ? 'bg-green-400/20 text-green-400' 
                                      : 'bg-yellow-400/20 text-yellow-400'
                                  }`}>
                                    {q.status === 'answered' ? '답변 완료' : '답변 대기'}
                                  </span>
                                </div>
                                <p className="text-sm text-secondary mb-2">{q.question}</p>
                                {q.clientResponse && (
                                  <div className="mt-3 p-3 bg-white/5 rounded-lg border-l-2 border-green-400">
                                    <p className="text-xs text-tertiary mb-1">고객 답변:</p>
                                    <p className="text-sm">{q.clientResponse}</p>
                                    <p className="text-xs text-tertiary mt-1">
                                      {new Date(q.responseDate!).toLocaleDateString('ko-KR')}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {currentQuestions.length === 0 && (
                      <div className="simple-card p-8 text-center">
                        <div className="liquid-glass-bg-hover"></div>
                        <div className="relative z-10">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                            <svg className="w-8 h-8 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <h4 className="mb-2">아직 질문이 없습니다</h4>
                          <p className="text-secondary text-sm">
                            첫 번째 질문을 보내서 프로젝트를 더 잘 이해해보세요!
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 하단 도움말 */}
                <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">💡 효과적인 질문 팁</h4>
                      <ul className="text-xs text-secondary space-y-1">
                        <li>• 구체적이고 명확한 질문을 하세요 (예: "어떤 색깔?" → "메인 컬러로 파란색과 초록색 중 어떤 것을 선호하시나요?")</li>
                        <li>• 선택지를 제공하면 고객이 답변하기 쉬워집니다</li>
                        <li>• 디자인의 목적과 타겟에 대해 질문하면 더 좋은 결과를 만들 수 있습니다</li>
                        <li>• 참고 자료나 영감을 얻을 수 있는 질문도 도움이 됩니다</li>
                      </ul>
                    </div>
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
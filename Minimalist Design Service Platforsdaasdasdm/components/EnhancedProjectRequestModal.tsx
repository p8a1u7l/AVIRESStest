"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  customFormData?: { [key: string]: any };
}

interface EnhancedProjectRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: Omit<ProjectRequest, 'id' | 'createdDate' | 'status' | 'proposals'>) => void;
  availableForms: CustomForm[];
}

export default function EnhancedProjectRequestModal({
  isOpen,
  onClose,
  onSubmit,
  availableForms
}: EnhancedProjectRequestModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 기본 정보
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState<string[]>(['']);
  const [attachments, setAttachments] = useState<File[]>([]);
  
  // 예산 및 마감일
  const [budgetMin, setBudgetMin] = useState(100);
  const [budgetMax, setBudgetMax] = useState(500);
  const [deadline, setDeadline] = useState('');

  // 추가 옵션
  const [rushRequest, setRushRequest] = useState(false);
  const [additionalConcepts, setAdditionalConcepts] = useState(0);
  const [additionalRevisions, setAdditionalRevisions] = useState(0);

  // 커스텀 양식
  const [selectedFormId, setSelectedFormId] = useState('');
  const [customFormData, setCustomFormData] = useState<{ [key: string]: any }>({});

  const categories = [
    'Logo Design',
    'Font Design', 
    'Business Card Design',
    'Website Design',
    'Branding Package',
    'Print Design',
    'Social Media Design',
    'Package Design'
  ];

  // 가격 계산
  const basePrice = budgetMax;
  const rushFee = rushRequest ? basePrice * 0.5 : 0;
  const conceptFee = additionalConcepts * 50;
  const revisionFee = additionalRevisions * 25;
  const totalPrice = basePrice + rushFee + conceptFee + revisionFee;

  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...requirements];
    newRequirements[index] = value;
    setRequirements(newRequirements);
  };

  const addRequirement = () => {
    setRequirements([...requirements, '']);
  };

  const removeRequirement = (index: number) => {
    if (requirements.length > 1) {
      setRequirements(requirements.filter((_, i) => i !== index));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments([...attachments, ...files]);
  };

  const removeFile = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleCustomFormChange = (fieldId: string, value: any) => {
    setCustomFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const selectedForm = availableForms.find(form => form.id === selectedFormId);

  const handleSubmit = async () => {
    if (!title.trim() || !category || !description.trim() || !deadline) {
      alert('필수 정보를 모두 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);

      const request: Omit<ProjectRequest, 'id' | 'createdDate' | 'status' | 'proposals'> = {
        title: title.trim(),
        category,
        description: description.trim(),
        budget: { min: budgetMin, max: budgetMax },
        deadline,
        requirements: requirements.filter(req => req.trim()),
        attachments,
        rushRequest,
        additionalConcepts,
        additionalRevisions,
        totalPrice,
        customFormData: Object.keys(customFormData).length > 0 ? customFormData : undefined
      };

      onSubmit(request);
      handleClose();
    } catch (error) {
      console.error('Enhanced project request error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setTitle('');
    setCategory('');
    setDescription('');
    setRequirements(['']);
    setAttachments([]);
    setBudgetMin(100);
    setBudgetMax(500);
    setDeadline('');
    setRushRequest(false);
    setAdditionalConcepts(0);
    setAdditionalRevisions(0);
    setSelectedFormId('');
    setCustomFormData({});
    onClose();
  };

  // 마감일 최소값 (오늘부터)
  const today = new Date().toISOString().split('T')[0];

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
            className="relative z-10 w-full max-w-6xl mx-4 max-h-[90vh] overflow-hidden"
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
                    <h2 className="mb-2">🚀 프로젝트 의뢰하기</h2>
                    <p className="text-secondary">
                      상세한 요구사항과 함께 프로젝트를 의뢰하세요
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

                {/* 단계 표시 */}
                <div className="flex items-center justify-center mb-8">
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-gray-medium text-white' : 'bg-white/10 text-tertiary'}`}>
                      1
                    </div>
                    <div className={`w-12 h-0.5 ${currentStep > 1 ? 'bg-gray-medium' : 'bg-white/10'}`}></div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-gray-medium text-white' : 'bg-white/10 text-tertiary'}`}>
                      2
                    </div>
                    <div className={`w-12 h-0.5 ${currentStep > 2 ? 'bg-gray-medium' : 'bg-white/10'}`}></div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-gray-medium text-white' : 'bg-white/10 text-tertiary'}`}>
                      3
                    </div>
                    <div className={`w-12 h-0.5 ${currentStep > 3 ? 'bg-gray-medium' : 'bg-white/10'}`}></div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 4 ? 'bg-gray-medium text-white' : 'bg-white/10 text-tertiary'}`}>
                      4
                    </div>
                  </div>
                </div>

                <div className="max-h-[60vh] overflow-y-auto">
                  {/* 단계 1: 기본 정보 */}
                  {currentStep === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div className="text-center mb-8">
                        <h3 className="mb-4">1️⃣ 기본 정보</h3>
                        <p className="text-secondary">프로젝트의 기본 정보를 입력해주세요</p>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="simple-card p-6">
                          <div className="liquid-glass-bg-hover"></div>
                          <div className="relative z-10 space-y-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">프로젝트 제목 *</label>
                              <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="예: 카페 로고 디자인"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-medium focus:outline-none focus:border-gray-medium/50"
                                maxLength={100}
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-2">카테고리 *</label>
                              <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-gray-medium/50"
                              >
                                <option value="">선택해주세요</option>
                                {categories.map((cat) => (
                                  <option key={cat} value={cat}>{cat}</option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-2">프로젝트 설명 *</label>
                              <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="프로젝트에 대해 자세히 설명해주세요. 어떤 디자인을 원하시는지, 용도는 무엇인지 등을 포함해주세요."
                                className="w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-medium resize-none focus:outline-none focus:border-gray-medium/50"
                                maxLength={1000}
                              />
                              <div className="text-right text-xs text-tertiary mt-1">
                                {description.length}/1000
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="simple-card p-6">
                          <div className="liquid-glass-bg-hover"></div>
                          <div className="relative z-10 space-y-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">예산 범위 *</label>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs text-tertiary mb-1">최소 예산</label>
                                  <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-tertiary">$</span>
                                    <input
                                      type="number"
                                      value={budgetMin}
                                      onChange={(e) => setBudgetMin(Number(e.target.value))}
                                      min="50"
                                      max="10000"
                                      className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-gray-medium/50"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-xs text-tertiary mb-1">최대 예산</label>
                                  <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-tertiary">$</span>
                                    <input
                                      type="number"
                                      value={budgetMax}
                                      onChange={(e) => setBudgetMax(Number(e.target.value))}
                                      min={budgetMin}
                                      max="10000"
                                      className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-gray-medium/50"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="mt-2 p-3 bg-white/5 rounded-lg">
                                <p className="text-xs text-secondary">
                                  💡 예산 범위가 넓을수록 더 많은 디자이너가 제안할 가능성이 높아집니다.
                                </p>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-2">희망 마감일 *</label>
                              <input
                                type="date"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                min={today}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-gray-medium/50"
                              />
                              {deadline && (
                                <div className="mt-2 text-xs text-secondary">
                                  마감까지 {Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}일 남음
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <motion.button
                          onClick={() => setCurrentStep(2)}
                          disabled={!title.trim() || !category || !description.trim() || !deadline}
                          className={`primary-button-hover px-6 py-3 ${!title.trim() || !category || !description.trim() || !deadline ? 'opacity-50 cursor-not-allowed' : ''}`}
                          whileHover={title.trim() && category && description.trim() && deadline ? { scale: 1.02 } : {}}
                          whileTap={title.trim() && category && description.trim() && deadline ? { scale: 0.98 } : {}}
                        >
                          <div className="liquid-glass-bg-hover"></div>
                          <span className="relative z-10">다음 단계</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {/* 단계 2: 요구사항 및 첨부파일 */}
                  {currentStep === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div className="text-center mb-8">
                        <h3 className="mb-4">2️⃣ 상세 요구사항</h3>
                        <p className="text-secondary">프로젝트 요구사항과 참고 자료를 추가해주세요</p>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="simple-card p-6">
                          <div className="liquid-glass-bg-hover"></div>
                          <div className="relative z-10">
                            <h4 className="mb-4">📋 요구사항</h4>
                            <div className="space-y-3">
                              {requirements.map((req, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <input
                                    type="text"
                                    value={req}
                                    onChange={(e) => handleRequirementChange(index, e.target.value)}
                                    placeholder={`요구사항 ${index + 1}`}
                                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-medium focus:outline-none focus:border-gray-medium/50"
                                  />
                                  {requirements.length > 1 && (
                                    <button
                                      onClick={() => removeRequirement(index)}
                                      className="standard-button p-2 text-red-400"
                                    >
                                      <div className="liquid-glass-bg-hover"></div>
                                      <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </button>
                                  )}
                                </div>
                              ))}
                              <button
                                onClick={addRequirement}
                                className="standard-button text-sm px-3 py-2 w-full"
                              >
                                <div className="liquid-glass-bg-hover"></div>
                                <span className="relative z-10">+ 요구사항 추가</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="simple-card p-6">
                          <div className="liquid-glass-bg-hover"></div>
                          <div className="relative z-10">
                            <h4 className="mb-4">📎 첨부파일</h4>
                            
                            <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center mb-4">
                              <input
                                type="file"
                                multiple
                                onChange={handleFileUpload}
                                className="hidden"
                                id="file-upload"
                                accept="image/*,.pdf,.doc,.docx"
                              />
                              <label htmlFor="file-upload" className="cursor-pointer">
                                <div className="text-4xl mb-2">📁</div>
                                <p className="text-sm text-secondary mb-1">클릭해서 파일 선택</p>
                                <p className="text-xs text-tertiary">이미지, PDF, 문서 파일 지원</p>
                              </label>
                            </div>

                            {attachments.length > 0 && (
                              <div className="space-y-2">
                                {attachments.map((file, index) => (
                                  <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                                    <div className="flex items-center space-x-2">
                                      <svg className="w-4 h-4 text-gray-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                      </svg>
                                      <span className="text-sm text-secondary truncate">{file.name}</span>
                                    </div>
                                    <button
                                      onClick={() => removeFile(index)}
                                      className="text-red-400 hover:text-red-300"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <motion.button
                          onClick={() => setCurrentStep(1)}
                          className="standard-button px-6 py-3"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="liquid-glass-bg-hover"></div>
                          <span className="relative z-10">이전 단계</span>
                        </motion.button>
                        <motion.button
                          onClick={() => setCurrentStep(3)}
                          className="primary-button-hover px-6 py-3"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="liquid-glass-bg-hover"></div>
                          <span className="relative z-10">다음 단계</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {/* 단계 3: 추가 옵션 및 가격 */}
                  {currentStep === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div className="text-center mb-8">
                        <h3 className="mb-4">3️⃣ 추가 옵션</h3>
                        <p className="text-secondary">프리미엄 옵션으로 더 빠르고 다양한 결과를 받아보세요</p>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-6">
                          {/* 급한 마감 옵션 */}
                          <div className="simple-card p-6">
                            <div className="liquid-glass-bg-hover"></div>
                            <div className="relative z-10">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                  <div className="text-2xl">⚡</div>
                                  <div>
                                    <h4 className="text-lg">급한 마감</h4>
                                    <p className="text-secondary text-sm">우선순위 처리로 더 빠른 결과</p>
                                  </div>
                                </div>
                                <label className="flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={rushRequest}
                                    onChange={(e) => setRushRequest(e.target.checked)}
                                    className="sr-only"
                                  />
                                  <div className={`w-12 h-6 rounded-full transition-colors ${rushRequest ? 'bg-gray-medium' : 'bg-white/20'}`}>
                                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${rushRequest ? 'translate-x-6' : 'translate-x-0.5'} mt-0.5`}></div>
                                  </div>
                                </label>
                              </div>
                              {rushRequest && (
                                <div className="p-3 bg-orange-400/10 rounded-lg border border-orange-400/20">
                                  <p className="text-sm text-orange-400">
                                    +${rushFee} (기본 가격의 50% 추가)
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* 추가 시안 옵션 */}
                          <div className="simple-card p-6">
                            <div className="liquid-glass-bg-hover"></div>
                            <div className="relative z-10">
                              <div className="flex items-center space-x-3 mb-4">
                                <div className="text-2xl">💡</div>
                                <div>
                                  <h4 className="text-lg">추가 시안</h4>
                                  <p className="text-secondary text-sm">더 많은 아이디어와 선택권</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                <button
                                  onClick={() => setAdditionalConcepts(Math.max(0, additionalConcepts - 1))}
                                  className="standard-button p-2"
                                >
                                  <div className="liquid-glass-bg-hover"></div>
                                  <span className="relative z-10">-</span>
                                </button>
                                <div className="flex-1 text-center">
                                  <div className="text-2xl font-semibold">{additionalConcepts}</div>
                                  <div className="text-xs text-tertiary">개 추가</div>
                                </div>
                                <button
                                  onClick={() => setAdditionalConcepts(Math.min(10, additionalConcepts + 1))}
                                  className="standard-button p-2"
                                >
                                  <div className="liquid-glass-bg-hover"></div>
                                  <span className="relative z-10">+</span>
                                </button>
                              </div>
                              {additionalConcepts > 0 && (
                                <div className="mt-3 p-3 bg-blue-400/10 rounded-lg border border-blue-400/20">
                                  <p className="text-sm text-blue-400">
                                    +${conceptFee} (시안 1개당 $50)
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* 추가 수정 옵션 */}
                          <div className="simple-card p-6">
                            <div className="liquid-glass-bg-hover"></div>
                            <div className="relative z-10">
                              <div className="flex items-center space-x-3 mb-4">
                                <div className="text-2xl">🔄</div>
                                <div>
                                  <h4 className="text-lg">추가 수정</h4>
                                  <p className="text-secondary text-sm">더 많은 수정 기회</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                <button
                                  onClick={() => setAdditionalRevisions(Math.max(0, additionalRevisions - 1))}
                                  className="standard-button p-2"
                                >
                                  <div className="liquid-glass-bg-hover"></div>
                                  <span className="relative z-10">-</span>
                                </button>
                                <div className="flex-1 text-center">
                                  <div className="text-2xl font-semibold">{additionalRevisions}</div>
                                  <div className="text-xs text-tertiary">회 추가</div>
                                </div>
                                <button
                                  onClick={() => setAdditionalRevisions(Math.min(10, additionalRevisions + 1))}
                                  className="standard-button p-2"
                                >
                                  <div className="liquid-glass-bg-hover"></div>
                                  <span className="relative z-10">+</span>
                                </button>
                              </div>
                              {additionalRevisions > 0 && (
                                <div className="mt-3 p-3 bg-purple-400/10 rounded-lg border border-purple-400/20">
                                  <p className="text-sm text-purple-400">
                                    +${revisionFee} (수정 1회당 $25)
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* 가격 요약 */}
                        <div className="simple-card p-6">
                          <div className="liquid-glass-bg-hover"></div>
                          <div className="relative z-10">
                            <h4 className="mb-6">💰 가격 요약</h4>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <span>기본 가격</span>
                                <span className="font-semibold">${basePrice}</span>
                              </div>
                              
                              {rushRequest && (
                                <div className="flex items-center justify-between text-orange-400">
                                  <span>급한 마감 (+50%)</span>
                                  <span>+${rushFee}</span>
                                </div>
                              )}
                              
                              {additionalConcepts > 0 && (
                                <div className="flex items-center justify-between text-blue-400">
                                  <span>추가 시안 ({additionalConcepts}개)</span>
                                  <span>+${conceptFee}</span>
                                </div>
                              )}
                              
                              {additionalRevisions > 0 && (
                                <div className="flex items-center justify-between text-purple-400">
                                  <span>추가 수정 ({additionalRevisions}회)</span>
                                  <span>+${revisionFee}</span>
                                </div>
                              )}
                              
                              <div className="border-t border-white/10 pt-4">
                                <div className="flex items-center justify-between text-lg font-semibold">
                                  <span>총 예상 가격</span>
                                  <span className="text-gray-medium">${totalPrice}</span>
                                </div>
                              </div>
                            </div>

                            <div className="mt-6 p-4 bg-white/5 rounded-lg">
                              <p className="text-xs text-secondary">
                                💡 최종 가격은 디자이너와의 협의에 따라 달라질 수 있습니다.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <motion.button
                          onClick={() => setCurrentStep(2)}
                          className="standard-button px-6 py-3"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="liquid-glass-bg-hover"></div>
                          <span className="relative z-10">이전 단계</span>
                        </motion.button>
                        <motion.button
                          onClick={() => setCurrentStep(4)}
                          className="primary-button-hover px-6 py-3"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="liquid-glass-bg-hover"></div>
                          <span className="relative z-10">다음 단계</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {/* 단계 4: 커스텀 양식 (옵션) */}
                  {currentStep === 4 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div className="text-center mb-8">
                        <h3 className="mb-4">4️⃣ 추가 정보 (선택사항)</h3>
                        <p className="text-secondary">디자이너별 커스텀 양식이 있다면 작성해보세요</p>
                      </div>

                      {availableForms.length > 0 ? (
                        <div className="space-y-6">
                          <div className="simple-card p-6">
                            <div className="liquid-glass-bg-hover"></div>
                            <div className="relative z-10">
                              <h4 className="mb-4">📝 디자이너 양식 선택</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div
                                  className={`simple-card p-4 cursor-pointer transition-colors ${!selectedFormId ? 'ring-2 ring-gray-medium' : ''}`}
                                  onClick={() => {
                                    setSelectedFormId('');
                                    setCustomFormData({});
                                  }}
                                >
                                  <div className="liquid-glass-bg-hover"></div>
                                  <div className="relative z-10">
                                    <h5 className="font-medium">기본 양식</h5>
                                    <p className="text-secondary text-sm">추가 정보 없이 진행</p>
                                  </div>
                                </div>
                                
                                {availableForms.map((form) => (
                                  <div
                                    key={form.id}
                                    className={`simple-card p-4 cursor-pointer transition-colors ${selectedFormId === form.id ? 'ring-2 ring-gray-medium' : ''}`}
                                    onClick={() => setSelectedFormId(form.id)}
                                  >
                                    <div className="liquid-glass-bg-hover"></div>
                                    <div className="relative z-10">
                                      <h5 className="font-medium">{form.title}</h5>
                                      <p className="text-secondary text-sm">{form.description}</p>
                                      <div className="text-xs text-tertiary mt-2">
                                        by {form.designerName} • {form.fields.length}개 필드
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {selectedForm && (
                            <div className="simple-card p-6">
                              <div className="liquid-glass-bg-hover"></div>
                              <div className="relative z-10">
                                <h4 className="mb-4">{selectedForm.title}</h4>
                                <div className="space-y-4">
                                  {selectedForm.fields.map((field) => (
                                    <div key={field.id}>
                                      <label className="block text-sm font-medium mb-2">
                                        {field.label}
                                        {field.required && <span className="text-red-400 ml-1">*</span>}
                                      </label>
                                      
                                      {field.type === 'text' && (
                                        <input
                                          type="text"
                                          placeholder={field.placeholder}
                                          value={customFormData[field.id] || ''}
                                          onChange={(e) => handleCustomFormChange(field.id, e.target.value)}
                                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-medium focus:outline-none focus:border-gray-medium/50"
                                        />
                                      )}
                                      
                                      {field.type === 'textarea' && (
                                        <textarea
                                          placeholder={field.placeholder}
                                          value={customFormData[field.id] || ''}
                                          onChange={(e) => handleCustomFormChange(field.id, e.target.value)}
                                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-medium focus:outline-none focus:border-gray-medium/50 h-20 resize-none"
                                        />
                                      )}
                                      
                                      {field.type === 'select' && (
                                        <select
                                          value={customFormData[field.id] || ''}
                                          onChange={(e) => handleCustomFormChange(field.id, e.target.value)}
                                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-gray-medium/50"
                                        >
                                          <option value="">선택해주세요</option>
                                          {field.options?.map((option, index) => (
                                            <option key={index} value={option}>{option}</option>
                                          ))}
                                        </select>
                                      )}
                                      
                                      {field.type === 'radio' && (
                                        <div className="space-y-2">
                                          {field.options?.map((option, index) => (
                                            <label key={index} className="flex items-center space-x-2 text-sm">
                                              <input
                                                type="radio"
                                                name={field.id}
                                                value={option}
                                                checked={customFormData[field.id] === option}
                                                onChange={(e) => handleCustomFormChange(field.id, e.target.value)}
                                                className="accent-gray-medium"
                                              />
                                              <span>{option}</span>
                                            </label>
                                          ))}
                                        </div>
                                      )}
                                      
                                      {field.type === 'checkbox' && (
                                        <div className="space-y-2">
                                          {field.options?.map((option, index) => (
                                            <label key={index} className="flex items-center space-x-2 text-sm">
                                              <input
                                                type="checkbox"
                                                value={option}
                                                checked={(customFormData[field.id] || []).includes(option)}
                                                onChange={(e) => {
                                                  const currentValues = customFormData[field.id] || [];
                                                  if (e.target.checked) {
                                                    handleCustomFormChange(field.id, [...currentValues, option]);
                                                  } else {
                                                    handleCustomFormChange(field.id, currentValues.filter((v: string) => v !== option));
                                                  }
                                                }}
                                                className="accent-gray-medium"
                                              />
                                              <span>{option}</span>
                                            </label>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                            <svg className="w-8 h-8 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <h4 className="mb-2">사용 가능한 커스텀 양식이 없습니다</h4>
                          <p className="text-secondary">기본 정보로 프로젝트를 진행하겠습니다</p>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <motion.button
                          onClick={() => setCurrentStep(3)}
                          className="standard-button px-6 py-3"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="liquid-glass-bg-hover"></div>
                          <span className="relative z-10">이전 단계</span>
                        </motion.button>
                        <motion.button
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                          className="primary-button-hover px-6 py-3"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="liquid-glass-bg-hover"></div>
                          <span className="relative z-10">
                            {isSubmitting ? '제출 중...' : `🚀 프로젝트 의뢰하기 ($${totalPrice})`}
                          </span>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
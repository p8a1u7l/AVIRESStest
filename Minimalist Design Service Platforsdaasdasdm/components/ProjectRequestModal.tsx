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
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
  createdDate: string;
  proposals: ProjectProposal[];
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

interface ProjectRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: Omit<ProjectRequest, 'id' | 'createdDate' | 'status' | 'proposals'>) => void;
}

export default function ProjectRequestModal({
  isOpen,
  onClose,
  onSubmit
}: ProjectRequestModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    budgetMin: '',
    budgetMax: '',
    deadline: '',
    requirements: [''],
    attachments: [] as File[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Logo Design',
    'Font Design', 
    'Business Card Design',
    'Brand Identity',
    'Web Design',
    'App Design',
    'Packaging Design',
    'Illustration'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRequirementChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.map((req, i) => i === index ? value : req)
    }));
  };

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }));
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files].slice(0, 5) // 최대 5개 파일
    }));
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setIsSubmitting(true);
    
    try {
      await onSubmit({
        title: formData.title.trim(),
        category: formData.category,
        description: formData.description.trim(),
        budget: {
          min: parseInt(formData.budgetMin),
          max: parseInt(formData.budgetMax)
        },
        deadline: formData.deadline,
        requirements: formData.requirements.filter(req => req.trim()),
        attachments: formData.attachments
      });
      
      resetForm();
      onClose();
    } catch (error) {
      console.error('의뢰글 제출 실패:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      description: '',
      budgetMin: '',
      budgetMax: '',
      deadline: '',
      requirements: [''],
      attachments: []
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const isFormValid = () => {
    return formData.title.trim() && 
           formData.category && 
           formData.description.trim() && 
           formData.budgetMin && 
           formData.budgetMax && 
           formData.deadline &&
           parseInt(formData.budgetMin) <= parseInt(formData.budgetMax);
  };

  // 내일 날짜 (최소 마감일)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

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
                    <h2 className="mb-2">프로젝트 의뢰하기</h2>
                    <p className="text-secondary">
                      디자이너들에게 프로젝트를 의뢰하고 제안을 받아보세요.
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

                <form onSubmit={handleSubmit} className="space-y-6 max-h-96 overflow-y-auto">
                  {/* 기본 정보 */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="form-card">
                      <div className="liquid-glass-bg-hover"></div>
                      <div className="relative z-10">
                        <label htmlFor="project-title" className="block mb-2">
                          프로젝트 제목 *
                        </label>
                        <input
                          id="project-title"
                          type="text"
                          value={formData.title}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                          placeholder="예: 카페 브랜드 로고 디자인"
                          className="w-full p-3 bg-transparent border border-white/20 rounded-lg focus:border-gray-medium/50 focus:outline-none transition-colors"
                          maxLength={100}
                          required
                        />
                        <div className="text-right text-xs text-tertiary mt-1">
                          {formData.title.length}/100
                        </div>
                      </div>
                    </div>

                    <div className="form-card">
                      <div className="liquid-glass-bg-hover"></div>
                      <div className="relative z-10">
                        <label htmlFor="project-category" className="block mb-2">
                          카테고리 *
                        </label>
                        <select
                          id="project-category"
                          value={formData.category}
                          onChange={(e) => handleInputChange('category', e.target.value)}
                          className="w-full p-3 bg-transparent border border-white/20 rounded-lg focus:border-gray-medium/50 focus:outline-none transition-colors"
                          required
                        >
                          <option value="" className="bg-gray-900">카테고리 선택</option>
                          {categories.map(category => (
                            <option key={category} value={category} className="bg-gray-900">
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* 프로젝트 설명 */}
                  <div className="form-card">
                    <div className="liquid-glass-bg-hover"></div>
                    <div className="relative z-10">
                      <label htmlFor="project-description" className="block mb-2">
                        프로젝트 상세 설명 *
                      </label>
                      <textarea
                        id="project-description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="프로젝트에 대한 자세한 설명을 작성해주세요.&#10;&#10;예시:&#10;- 브랜드 컨셉과 스타일&#10;- 타겟 고객층&#10;- 원하는 느낌이나 분위기&#10;- 참고할 만한 사례나 색상"
                        rows={6}
                        className="w-full p-3 bg-transparent border border-white/20 rounded-lg focus:border-gray-medium/50 focus:outline-none transition-colors resize-none"
                        maxLength={2000}
                        required
                      />
                      <div className="text-right text-xs text-tertiary mt-1">
                        {formData.description.length}/2000
                      </div>
                    </div>
                  </div>

                  {/* 예산과 마감일 */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="form-card">
                      <div className="liquid-glass-bg-hover"></div>
                      <div className="relative z-10">
                        <label htmlFor="budget-min" className="block mb-2">
                          최소 예산 ($) *
                        </label>
                        <input
                          id="budget-min"
                          type="number"
                          value={formData.budgetMin}
                          onChange={(e) => handleInputChange('budgetMin', e.target.value)}
                          placeholder="100"
                          min="50"
                          max="10000"
                          className="w-full p-3 bg-transparent border border-white/20 rounded-lg focus:border-gray-medium/50 focus:outline-none transition-colors"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-card">
                      <div className="liquid-glass-bg-hover"></div>
                      <div className="relative z-10">
                        <label htmlFor="budget-max" className="block mb-2">
                          최대 예산 ($) *
                        </label>
                        <input
                          id="budget-max"
                          type="number"
                          value={formData.budgetMax}
                          onChange={(e) => handleInputChange('budgetMax', e.target.value)}
                          placeholder="500"
                          min="50"
                          max="10000"
                          className="w-full p-3 bg-transparent border border-white/20 rounded-lg focus:border-gray-medium/50 focus:outline-none transition-colors"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-card">
                      <div className="liquid-glass-bg-hover"></div>
                      <div className="relative z-10">
                        <label htmlFor="deadline" className="block mb-2">
                          희망 마감일 *
                        </label>
                        <input
                          id="deadline"
                          type="date"
                          value={formData.deadline}
                          onChange={(e) => handleInputChange('deadline', e.target.value)}
                          min={minDate}
                          className="w-full p-3 bg-transparent border border-white/20 rounded-lg focus:border-gray-medium/50 focus:outline-none transition-colors"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* 세부 요구사항 */}
                  <div className="form-card">
                    <div className="liquid-glass-bg-hover"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <label className="block">세부 요구사항</label>
                        <motion.button
                          type="button"
                          onClick={addRequirement}
                          className="text-sm text-gray-light hover:text-white transition-colors"
                          whileHover={{ scale: 1.05 }}
                        >
                          + 항목 추가
                        </motion.button>
                      </div>
                      
                      <div className="space-y-3">
                        {formData.requirements.map((requirement, index) => (
                          <div key={index} className="flex gap-3">
                            <input
                              type="text"
                              value={requirement}
                              onChange={(e) => handleRequirementChange(index, e.target.value)}
                              placeholder={`요구사항 ${index + 1}`}
                              className="flex-1 p-2 bg-transparent border border-white/20 rounded-lg focus:border-gray-medium/50 focus:outline-none transition-colors"
                              maxLength={200}
                            />
                            {formData.requirements.length > 1 && (
                              <motion.button
                                type="button"
                                onClick={() => removeRequirement(index)}
                                className="p-2 text-red-400 hover:text-red-300 transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </motion.button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 파일 첨부 */}
                  <div className="form-card">
                    <div className="liquid-glass-bg-hover"></div>
                    <div className="relative z-10">
                      <label className="block mb-4">
                        참고 파일 (최대 5개, 각 10MB 이하)
                      </label>
                      
                      <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                        <input
                          type="file"
                          multiple
                          accept="image/*,.pdf,.doc,.docx"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                            <svg className="w-6 h-6 text-gray-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                          </div>
                          <p className="text-gray-light mb-2">클릭하여 파일 업로드</p>
                          <p className="text-tertiary text-sm">
                            이미지, PDF, Word 문서 지원
                          </p>
                        </label>
                      </div>

                      {/* 업로드된 파일 목록 */}
                      {formData.attachments.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {formData.attachments.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                              <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-gray-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="text-sm">{file.name}</span>
                                <span className="text-xs text-tertiary">
                                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                </span>
                              </div>
                              <motion.button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="text-red-400 hover:text-red-300 transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </motion.button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 제출 버튼 */}
                  <div className="flex gap-4 pt-6">
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
                      disabled={!isFormValid() || isSubmitting}
                      className={`primary-button-hover flex-1 py-3 ${
                        !isFormValid() || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      whileHover={isFormValid() && !isSubmitting ? { scale: 1.02 } : {}}
                      whileTap={isFormValid() && !isSubmitting ? { scale: 0.98 } : {}}
                    >
                      <div className="liquid-glass-bg-hover"></div>
                      <span className="relative z-10">
                        {isSubmitting ? '의뢰 등록 중...' : '프로젝트 의뢰하기'}
                      </span>
                    </motion.button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
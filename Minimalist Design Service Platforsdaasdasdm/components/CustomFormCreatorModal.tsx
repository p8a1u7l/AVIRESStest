"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CustomFormField {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  order: number;
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

interface CustomFormCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (form: Omit<CustomForm, 'id' | 'createdDate'>) => void;
  currentUser: SupabaseUser | null;
}

export default function CustomFormCreatorModal({
  isOpen,
  onClose,
  onSubmit,
  currentUser
}: CustomFormCreatorModalProps) {
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [fields, setFields] = useState<CustomFormField[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // 필드 추가
  const addField = (type: CustomFormField['type']) => {
    const newField: CustomFormField = {
      id: Date.now().toString(),
      type,
      label: '',
      placeholder: '',
      required: false,
      options: type === 'select' || type === 'radio' ? [''] : undefined,
      order: fields.length
    };
    setFields([...fields, newField]);
  };

  // 필드 업데이트
  const updateField = (fieldId: string, updates: Partial<CustomFormField>) => {
    setFields(fields.map(field => 
      field.id === fieldId ? { ...field, ...updates } : field
    ));
  };

  // 필드 삭제
  const removeField = (fieldId: string) => {
    setFields(fields.filter(field => field.id !== fieldId));
  };

  // 필드 순서 변경
  const moveField = (fieldId: string, direction: 'up' | 'down') => {
    const fieldIndex = fields.findIndex(field => field.id === fieldId);
    if (fieldIndex === -1) return;

    const newFields = [...fields];
    if (direction === 'up' && fieldIndex > 0) {
      [newFields[fieldIndex], newFields[fieldIndex - 1]] = [newFields[fieldIndex - 1], newFields[fieldIndex]];
    } else if (direction === 'down' && fieldIndex < fields.length - 1) {
      [newFields[fieldIndex], newFields[fieldIndex + 1]] = [newFields[fieldIndex + 1], newFields[fieldIndex]];
    }

    // 순서 업데이트
    newFields.forEach((field, index) => {
      field.order = index;
    });

    setFields(newFields);
  };

  // 옵션 추가/제거 (select, radio용)
  const updateFieldOptions = (fieldId: string, options: string[]) => {
    updateField(fieldId, { options });
  };

  const handleSubmit = async () => {
    if (!formTitle.trim() || fields.length === 0 || !currentUser) {
      alert('양식 제목과 최소 1개의 필드가 필요합니다.');
      return;
    }

    // 필드 검증
    for (const field of fields) {
      if (!field.label.trim()) {
        alert('모든 필드에 라벨을 입력해주세요.');
        return;
      }
      if ((field.type === 'select' || field.type === 'radio') && (!field.options || field.options.length === 0 || field.options.some(opt => !opt.trim()))) {
        alert('선택형 필드에는 최소 1개의 옵션이 필요합니다.');
        return;
      }
    }

    try {
      setIsSubmitting(true);
      
      const form: Omit<CustomForm, 'id' | 'createdDate'> = {
        designerId: currentUser.id,
        designerName: currentUser.user_metadata.full_name,
        title: formTitle.trim(),
        description: formDescription.trim(),
        fields: fields,
        isActive: true
      };

      onSubmit(form);
      handleClose();
    } catch (error) {
      console.error('Form creation error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormTitle('');
    setFormDescription('');
    setFields([]);
    setCurrentStep(1);
    onClose();
  };

  // 미리 만들어진 템플릿
  const templates = [
    {
      name: '로고 디자인 양식',
      description: '로고 디자인에 필요한 기본 정보를 수집합니다',
      fields: [
        { type: 'text' as const, label: '회사/브랜드명', required: true },
        { type: 'textarea' as const, label: '회사/브랜드 설명', required: true },
        { type: 'select' as const, label: '선호하는 스타일', required: true, options: ['모던', '클래식', '미니멀', '빈티지', '플레이풀'] },
        { type: 'select' as const, label: '선호하는 색상', required: false, options: ['빨강', '파랑', '초록', '노랑', '검정', '흰색', '상관없음'] },
        { type: 'textarea' as const, label: '피하고 싶은 요소', required: false },
        { type: 'file' as const, label: '참고 이미지 첨부', required: false }
      ]
    },
    {
      name: '명함 디자인 양식',
      description: '명함 디자인을 위한 필수 정보를 수집합니다',
      fields: [
        { type: 'text' as const, label: '이름', required: true },
        { type: 'text' as const, label: '직책', required: true },
        { type: 'text' as const, label: '회사명', required: true },
        { type: 'textarea' as const, label: '연락처 정보', required: true },
        { type: 'select' as const, label: '명함 크기', required: true, options: ['표준 (90x50mm)', '정사각형 (85x85mm)', '세로형 (50x90mm)'] },
        { type: 'radio' as const, label: '인쇄 방식', required: true, options: ['일반 인쇄', '고급 인쇄 (박)', '양면 인쇄'] }
      ]
    },
    {
      name: '웹사이트 디자인 양식',
      description: '웹사이트 디자인 프로젝트를 위한 상세 정보를 수집합니다',
      fields: [
        { type: 'text' as const, label: '웹사이트 목적', required: true },
        { type: 'textarea' as const, label: '타겟 고객', required: true },
        { type: 'select' as const, label: '페이지 수', required: true, options: ['1-5페이지', '6-10페이지', '11-20페이지', '20페이지 이상'] },
        { type: 'checkbox' as const, label: '필요한 기능', required: false, options: ['쇼핑몰', '예약 시스템', '블로그', '갤러리', '연락처 양식'] },
        { type: 'text' as const, label: '참고 웹사이트 URL', required: false },
        { type: 'textarea' as const, label: '특별한 요구사항', required: false }
      ]
    }
  ];

  const applyTemplate = (template: typeof templates[0]) => {
    setFormTitle(template.name);
    setFormDescription(template.description);
    
    const templateFields: CustomFormField[] = template.fields.map((field, index) => ({
      id: `template-${Date.now()}-${index}`,
      type: field.type,
      label: field.label,
      placeholder: '',
      required: field.required,
      options: field.options,
      order: index
    }));
    
    setFields(templateFields);
    setCurrentStep(2);
  };

  const fieldTypeIcons = {
    text: '📝',
    textarea: '📄',
    select: '📋',
    checkbox: '☑️',
    radio: '🔘',
    file: '📎'
  };

  const fieldTypeNames = {
    text: '단답형',
    textarea: '장문형',
    select: '드롭다운',
    checkbox: '체크박스',
    radio: '라디오버튼',
    file: '파일 첨부'
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
                    <h2 className="mb-2">🎨 커스텀 양식 만들기</h2>
                    <p className="text-secondary">
                      고객이 작성할 맞춤형 요청서 양식을 만들어보세요
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
                  </div>
                </div>

                {/* 단계별 콘텐츠 */}
                <div className="max-h-[60vh] overflow-y-auto">
                  {currentStep === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div className="text-center mb-8">
                        <h3 className="mb-4">1️⃣ 양식 설정</h3>
                        <p className="text-secondary">양식의 기본 정보를 설정하거나 템플릿을 선택하세요</p>
                      </div>

                      {/* 기본 정보 입력 */}
                      <div className="simple-card p-6 mb-8">
                        <div className="liquid-glass-bg-hover"></div>
                        <div className="relative z-10 space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">양식 제목 *</label>
                            <input
                              type="text"
                              value={formTitle}
                              onChange={(e) => setFormTitle(e.target.value)}
                              placeholder="예: 로고 디자인 요청 양식"
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-medium focus:outline-none focus:border-gray-medium/50"
                              maxLength={100}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">양식 설명</label>
                            <textarea
                              value={formDescription}
                              onChange={(e) => setFormDescription(e.target.value)}
                              placeholder="이 양식의 목적과 작성 방법을 간단히 설명해주세요"
                              className="w-full h-24 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-medium resize-none focus:outline-none focus:border-gray-medium/50"
                              maxLength={300}
                            />
                          </div>
                        </div>
                      </div>

                      {/* 템플릿 선택 */}
                      <div>
                        <h4 className="mb-4">💡 빠른 시작 템플릿</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {templates.map((template, index) => (
                            <motion.button
                              key={index}
                              onClick={() => applyTemplate(template)}
                              className="simple-card p-6 text-left"
                              whileHover={{ scale: 1.02, y: -2 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="liquid-glass-bg-hover"></div>
                              <div className="relative z-10">
                                <h5 className="font-medium mb-2">{template.name}</h5>
                                <p className="text-secondary text-sm mb-3">{template.description}</p>
                                <div className="text-xs text-tertiary">
                                  {template.fields.length}개 필드 포함
                                </div>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between mt-8">
                        <div></div>
                        <motion.button
                          onClick={() => setCurrentStep(2)}
                          disabled={!formTitle.trim()}
                          className={`primary-button-hover px-6 py-3 ${!formTitle.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                          whileHover={formTitle.trim() ? { scale: 1.02 } : {}}
                          whileTap={formTitle.trim() ? { scale: 0.98 } : {}}
                        >
                          <div className="liquid-glass-bg-hover"></div>
                          <span className="relative z-10">다음 단계</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div className="text-center mb-8">
                        <h3 className="mb-4">2️⃣ 필드 추가</h3>
                        <p className="text-secondary">고객에게 필요한 정보를 수집할 필드를 추가하세요</p>
                      </div>

                      {/* 필드 타입 선택 */}
                      <div className="simple-card p-6">
                        <div className="liquid-glass-bg-hover"></div>
                        <div className="relative z-10">
                          <h4 className="mb-4">✨ 필드 추가하기</h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                            {Object.entries(fieldTypeIcons).map(([type, icon]) => (
                              <motion.button
                                key={type}
                                onClick={() => addField(type as CustomFormField['type'])}
                                className="standard-button p-4 flex flex-col items-center text-center"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <div className="liquid-glass-bg-hover"></div>
                                <div className="relative z-10">
                                  <div className="text-2xl mb-2">{icon}</div>
                                  <div className="text-xs">{fieldTypeNames[type as keyof typeof fieldTypeNames]}</div>
                                </div>
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* 필드 목록 */}
                      <div className="space-y-4">
                        {fields.map((field, index) => (
                          <motion.div
                            key={field.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="simple-card p-6"
                          >
                            <div className="liquid-glass-bg-hover"></div>
                            <div className="relative z-10">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                  <span className="text-2xl">{fieldTypeIcons[field.type]}</span>
                                  <span className="font-medium">{fieldTypeNames[field.type]}</span>
                                  <span className="text-xs text-tertiary">#{index + 1}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => moveField(field.id, 'up')}
                                    disabled={index === 0}
                                    className={`standard-button p-2 ${index === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                  >
                                    <div className="liquid-glass-bg-hover"></div>
                                    <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => moveField(field.id, 'down')}
                                    disabled={index === fields.length - 1}
                                    className={`standard-button p-2 ${index === fields.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                  >
                                    <div className="liquid-glass-bg-hover"></div>
                                    <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => removeField(field.id)}
                                    className="standard-button p-2 text-red-400"
                                  >
                                    <div className="liquid-glass-bg-hover"></div>
                                    <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium mb-2">라벨 *</label>
                                  <input
                                    type="text"
                                    value={field.label}
                                    onChange={(e) => updateField(field.id, { label: e.target.value })}
                                    placeholder="필드 라벨을 입력하세요"
                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-medium focus:outline-none focus:border-gray-medium/50"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-2">플레이스홀더</label>
                                  <input
                                    type="text"
                                    value={field.placeholder}
                                    onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                                    placeholder="예시 텍스트를 입력하세요"
                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-medium focus:outline-none focus:border-gray-medium/50"
                                  />
                                </div>
                              </div>

                              <div className="mt-4 flex items-center">
                                <input
                                  type="checkbox"
                                  checked={field.required}
                                  onChange={(e) => updateField(field.id, { required: e.target.checked })}
                                  className="w-4 h-4 accent-gray-medium"
                                />
                                <label className="ml-2 text-sm">필수 입력</label>
                              </div>

                              {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
                                <div className="mt-4">
                                  <label className="block text-sm font-medium mb-2">옵션 설정</label>
                                  <div className="space-y-2">
                                    {(field.options || []).map((option, optionIndex) => (
                                      <div key={optionIndex} className="flex items-center space-x-2">
                                        <input
                                          type="text"
                                          value={option}
                                          onChange={(e) => {
                                            const newOptions = [...(field.options || [])];
                                            newOptions[optionIndex] = e.target.value;
                                            updateFieldOptions(field.id, newOptions);
                                          }}
                                          placeholder={`옵션 ${optionIndex + 1}`}
                                          className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-medium focus:outline-none focus:border-gray-medium/50"
                                        />
                                        <button
                                          onClick={() => {
                                            const newOptions = field.options?.filter((_, i) => i !== optionIndex) || [];
                                            updateFieldOptions(field.id, newOptions);
                                          }}
                                          className="standard-button p-2 text-red-400"
                                        >
                                          <div className="liquid-glass-bg-hover"></div>
                                          <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                          </svg>
                                        </button>
                                      </div>
                                    ))}
                                    <button
                                      onClick={() => {
                                        const newOptions = [...(field.options || []), ''];
                                        updateFieldOptions(field.id, newOptions);
                                      }}
                                      className="standard-button text-sm px-3 py-2"
                                    >
                                      <div className="liquid-glass-bg-hover"></div>
                                      <span className="relative z-10">+ 옵션 추가</span>
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}

                        {fields.length === 0 && (
                          <div className="text-center py-12">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                              <svg className="w-8 h-8 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </div>
                            <h4 className="mb-2">필드를 추가해보세요</h4>
                            <p className="text-secondary">위의 버튼을 클릭해서 첫 번째 필드를 추가하세요</p>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between mt-8">
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
                          disabled={fields.length === 0}
                          className={`primary-button-hover px-6 py-3 ${fields.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                          whileHover={fields.length > 0 ? { scale: 1.02 } : {}}
                          whileTap={fields.length > 0 ? { scale: 0.98 } : {}}
                        >
                          <div className="liquid-glass-bg-hover"></div>
                          <span className="relative z-10">미리보기</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div className="text-center mb-8">
                        <h3 className="mb-4">3️⃣ 미리보기 및 완료</h3>
                        <p className="text-secondary">양식이 어떻게 보일지 확인하고 저장하세요</p>
                      </div>

                      {/* 양식 미리보기 */}
                      <div className="simple-card p-6">
                        <div className="liquid-glass-bg-hover"></div>
                        <div className="relative z-10">
                          <div className="mb-6">
                            <h4 className="mb-2">{formTitle}</h4>
                            {formDescription && (
                              <p className="text-secondary text-sm">{formDescription}</p>
                            )}
                          </div>

                          <div className="space-y-4">
                            {fields.map((field) => (
                              <div key={field.id} className="space-y-2">
                                <label className="block text-sm font-medium">
                                  {field.label}
                                  {field.required && <span className="text-red-400 ml-1">*</span>}
                                </label>
                                
                                {field.type === 'text' && (
                                  <input
                                    type="text"
                                    placeholder={field.placeholder}
                                    disabled
                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-medium opacity-70"
                                  />
                                )}
                                
                                {field.type === 'textarea' && (
                                  <textarea
                                    placeholder={field.placeholder}
                                    disabled
                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-medium opacity-70 h-20 resize-none"
                                  />
                                )}
                                
                                {field.type === 'select' && (
                                  <select disabled className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white opacity-70">
                                    <option>선택해주세요</option>
                                    {field.options?.map((option, index) => (
                                      <option key={index}>{option}</option>
                                    ))}
                                  </select>
                                )}
                                
                                {field.type === 'radio' && (
                                  <div className="space-y-2">
                                    {field.options?.map((option, index) => (
                                      <label key={index} className="flex items-center space-x-2 text-sm">
                                        <input type="radio" name={field.id} disabled className="opacity-70" />
                                        <span>{option}</span>
                                      </label>
                                    ))}
                                  </div>
                                )}
                                
                                {field.type === 'checkbox' && (
                                  <div className="space-y-2">
                                    {field.options?.map((option, index) => (
                                      <label key={index} className="flex items-center space-x-2 text-sm">
                                        <input type="checkbox" disabled className="opacity-70" />
                                        <span>{option}</span>
                                      </label>
                                    ))}
                                  </div>
                                )}
                                
                                {field.type === 'file' && (
                                  <div className="border-2 border-dashed border-white/20 rounded-lg p-4 text-center opacity-70">
                                    <div className="text-tertiary text-sm">파일을 선택하거나 드래그하여 업로드</div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between mt-8">
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
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                          className="primary-button-hover px-6 py-3"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="liquid-glass-bg-hover"></div>
                          <span className="relative z-10">
                            {isSubmitting ? '저장 중...' : '🎉 양식 저장하기'}
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
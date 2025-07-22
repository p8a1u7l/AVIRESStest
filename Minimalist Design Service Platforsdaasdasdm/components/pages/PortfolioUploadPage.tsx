"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface PortfolioUpload {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  images: File[];
  price: number;
  features: string[];
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  uploadDate: string;
}

interface PortfolioUploadPageProps {
  onBack: () => void;
  currentUser: {
    firstName: string;
    lastName: string;
    email: string;
  } | null;
}

export default function PortfolioUploadPage({
  onBack,
  currentUser
}: PortfolioUploadPageProps) {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    tags: [''],
    images: [] as File[],
    price: '',
    features: ['']
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedPortfolios, setUploadedPortfolios] = useState<PortfolioUpload[]>([]);
  const [activeTab, setActiveTab] = useState<'upload' | 'manage'>('upload');

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

  const handleTagChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.map((tag, i) => i === index ? value : tag)
    }));
  };

  const addTag = () => {
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, '']
    }));
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files].slice(0, 10) // 최대 10개 이미지
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setIsUploading(true);
    
    try {
      // 시뮬레이션된 업로드
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newPortfolio: PortfolioUpload = {
        id: Date.now().toString(),
        title: formData.title.trim(),
        category: formData.category,
        description: formData.description.trim(),
        tags: formData.tags.filter(tag => tag.trim()),
        images: formData.images,
        price: parseInt(formData.price),
        features: formData.features.filter(feature => feature.trim()),
        status: 'pending',
        uploadDate: new Date().toISOString()
      };
      
      setUploadedPortfolios(prev => [newPortfolio, ...prev]);
      resetForm();
      setActiveTab('manage');
      
      alert('✅ 포트폴리오가 성공적으로 업로드되었습니다!\n\n검토 후 승인되면 포트폴리오에 표시됩니다.');
    } catch (error) {
      console.error('포트폴리오 업로드 실패:', error);
      alert('❌ 업로드 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      description: '',
      tags: [''],
      images: [],
      price: '',
      features: ['']
    });
  };

  const isFormValid = () => {
    return formData.title.trim() && 
           formData.category && 
           formData.description.trim() && 
           formData.images.length > 0 && 
           formData.price && 
           parseInt(formData.price) > 0;
  };

  const getStatusBadge = (status: PortfolioUpload['status']) => {
    const statusConfig = {
      draft: { text: '임시저장', color: 'bg-gray-500/20 text-gray-400' },
      pending: { text: '검토중', color: 'bg-yellow-500/20 text-yellow-400' },
      approved: { text: '승인됨', color: 'bg-green-500/20 text-green-400' },
      rejected: { text: '거부됨', color: 'bg-red-500/20 text-red-400' }
    };
    
    return statusConfig[status];
  };

  return (
    <motion.div
      className="pt-20 min-h-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="container mx-auto px-8 py-12">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <motion.button
              onClick={onBack}
              className="standard-button mb-6"
              whileHover={{ x: -3 }}
            >
              <div className="liquid-glass-bg-hover"></div>
              <div className="relative z-10 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                대시보드로 돌아가기
              </div>
            </motion.button>
            <h1 className="mb-2">포트폴리오 관리</h1>
            <p className="text-secondary">
              포트폴리오를 업로드하고 관리하세요.
            </p>
          </div>

          {/* 탭 스위처 */}
          <div className="flex bg-white/5 rounded-xl p-1">
            <motion.button
              onClick={() => setActiveTab('upload')}
              className={`px-6 py-2 rounded-lg transition-all ${
                activeTab === 'upload' 
                  ? 'bg-gray-medium/30 text-white' 
                  : 'text-secondary hover:text-white'
              }`}
              whileHover={{ scale: 1.02 }}
            >
              업로드
            </motion.button>
            <motion.button
              onClick={() => setActiveTab('manage')}
              className={`px-6 py-2 rounded-lg transition-all ${
                activeTab === 'manage' 
                  ? 'bg-gray-medium/30 text-white' 
                  : 'text-secondary hover:text-white'
              }`}
              whileHover={{ scale: 1.02 }}
            >
              관리 ({uploadedPortfolios.length})
            </motion.button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'upload' ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* 업로드 폼 */}
              <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* 기본 정보 */}
                  <div className="section-clean">
                    <div className="liquid-glass-bg-hover"></div>
                    <div className="relative z-10">
                      <h3 className="mb-6">기본 정보</h3>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="portfolio-title" className="block mb-2">
                            포트폴리오 제목 *
                          </label>
                          <input
                            id="portfolio-title"
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            placeholder="예: 미니멀 카페 브랜드 아이덴티티"
                            className="w-full p-3 bg-transparent border border-white/20 rounded-lg focus:border-gray-medium/50 focus:outline-none transition-colors"
                            maxLength={100}
                            required
                          />
                          <div className="text-right text-xs text-tertiary mt-1">
                            {formData.title.length}/100
                          </div>
                        </div>

                        <div>
                          <label htmlFor="portfolio-category" className="block mb-2">
                            카테고리 *
                          </label>
                          <select
                            id="portfolio-category"
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

                      <div className="mt-6">
                        <label htmlFor="portfolio-description" className="block mb-2">
                          프로젝트 설명 *
                        </label>
                        <textarea
                          id="portfolio-description"
                          value={formData.description}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          placeholder="이 프로젝트에 대해 자세히 설명해주세요.&#10;&#10;예시:&#10;- 클라이언트 요구사항&#10;- 디자인 컨셉과 접근법&#10;- 사용된 도구와 기법&#10;- 프로젝트의 특별한 점"
                          rows={6}
                          className="w-full p-3 bg-transparent border border-white/20 rounded-lg focus:border-gray-medium/50 focus:outline-none transition-colors resize-none"
                          maxLength={1500}
                          required
                        />
                        <div className="text-right text-xs text-tertiary mt-1">
                          {formData.description.length}/1500
                        </div>
                      </div>

                      <div className="mt-6">
                        <label className="block mb-2">가격 ($) *</label>
                        <input
                          type="number"
                          value={formData.price}
                          onChange={(e) => handleInputChange('price', e.target.value)}
                          placeholder="299"
                          min="10"
                          max="10000"
                          className="w-full p-3 bg-transparent border border-white/20 rounded-lg focus:border-gray-medium/50 focus:outline-none transition-colors"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* 이미지 업로드 */}
                  <div className="section-clean">
                    <div className="liquid-glass-bg-hover"></div>
                    <div className="relative z-10">
                      <h3 className="mb-6">이미지 업로드 *</h3>
                      
                      <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center mb-6">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <label htmlFor="image-upload" className="cursor-pointer">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <p className="text-gray-light mb-2">클릭하여 이미지 업로드</p>
                          <p className="text-tertiary text-sm">
                            최대 10개, 각 5MB 이하 (JPG, PNG, WebP)
                          </p>
                        </label>
                      </div>

                      {/* 업로드된 이미지 미리보기 */}
                      {formData.images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {formData.images.map((image, index) => (
                            <div key={index} className="relative group simple-card">
                              <div className="liquid-glass-bg-hover"></div>
                              <div className="relative z-10 p-2">
                                <div className="aspect-square bg-white/5 rounded-lg overflow-hidden mb-2">
                                  <img
                                    src={URL.createObjectURL(image)}
                                    alt={`Upload ${index + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <p className="text-xs text-center line-clamp-1">
                                  {image.name}
                                </p>
                                <motion.button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute top-1 right-1 w-6 h-6 bg-red-500/80 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </motion.button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 태그 */}
                  <div className="section-clean">
                    <div className="liquid-glass-bg-hover"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <h3>태그</h3>
                        <motion.button
                          type="button"
                          onClick={addTag}
                          className="text-sm text-gray-light hover:text-white transition-colors"
                          whileHover={{ scale: 1.05 }}
                        >
                          + 태그 추가
                        </motion.button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {formData.tags.map((tag, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={tag}
                              onChange={(e) => handleTagChange(index, e.target.value)}
                              placeholder={`태그 ${index + 1}`}
                              className="flex-1 p-2 bg-transparent border border-white/20 rounded-lg focus:border-gray-medium/50 focus:outline-none transition-colors"
                              maxLength={20}
                            />
                            {formData.tags.length > 1 && (
                              <motion.button
                                type="button"
                                onClick={() => removeTag(index)}
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

                  {/* 제공 사항 */}
                  <div className="section-clean">
                    <div className="liquid-glass-bg-hover"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <h3>제공 사항</h3>
                        <motion.button
                          type="button"
                          onClick={addFeature}
                          className="text-sm text-gray-light hover:text-white transition-colors"
                          whileHover={{ scale: 1.05 }}
                        >
                          + 항목 추가
                        </motion.button>
                      </div>
                      
                      <div className="space-y-3">
                        {formData.features.map((feature, index) => (
                          <div key={index} className="flex gap-3">
                            <input
                              type="text"
                              value={feature}
                              onChange={(e) => handleFeatureChange(index, e.target.value)}
                              placeholder={`예: Vector files (AI, EPS, SVG)`}
                              className="flex-1 p-3 bg-transparent border border-white/20 rounded-lg focus:border-gray-medium/50 focus:outline-none transition-colors"
                              maxLength={100}
                            />
                            {formData.features.length > 1 && (
                              <motion.button
                                type="button"
                                onClick={() => removeFeature(index)}
                                className="p-3 text-red-400 hover:text-red-300 transition-colors"
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

                  {/* 제출 버튼 */}
                  <div className="flex gap-4">
                    <motion.button
                      type="button"
                      onClick={resetForm}
                      className="standard-button flex-1 py-4"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="liquid-glass-bg-hover"></div>
                      <span className="relative z-10">초기화</span>
                    </motion.button>

                    <motion.button
                      type="submit"
                      disabled={!isFormValid() || isUploading}
                      className={`primary-button-hover flex-1 py-4 ${
                        !isFormValid() || isUploading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      whileHover={isFormValid() && !isUploading ? { scale: 1.02 } : {}}
                      whileTap={isFormValid() && !isUploading ? { scale: 0.98 } : {}}
                    >
                      <div className="liquid-glass-bg-hover"></div>
                      <span className="relative z-10">
                        {isUploading ? '업로드 중...' : '포트폴리오 업로드'}
                      </span>
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="manage"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* 포트폴리오 관리 */}
              <div>
                <h3 className="mb-6">업로드된 포트폴리오</h3>
                
                {uploadedPortfolios.length > 0 ? (
                  <div className="space-y-6">
                    {uploadedPortfolios.map((portfolio) => {
                      const statusConfig = getStatusBadge(portfolio.status);
                      
                      return (
                        <div key={portfolio.id} className="simple-card">
                          <div className="liquid-glass-bg-hover"></div>
                          <div className="relative z-10 p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h4>{portfolio.title}</h4>
                                  <span className={`px-2 py-1 rounded-full text-xs ${statusConfig.color}`}>
                                    {statusConfig.text}
                                  </span>
                                </div>
                                <p className="text-secondary text-sm mb-2">{portfolio.category} | ${portfolio.price}</p>
                                <p className="text-tertiary text-sm line-clamp-2">
                                  {portfolio.description}
                                </p>
                              </div>
                              
                              {portfolio.images.length > 0 && (
                                <div className="w-20 h-20 bg-white/5 rounded-lg overflow-hidden ml-6">
                                  <img
                                    src={URL.createObjectURL(portfolio.images[0])}
                                    alt={portfolio.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-4">
                                <span className="text-tertiary">
                                  업로드: {new Date(portfolio.uploadDate).toLocaleDateString('ko-KR')}
                                </span>
                                <span className="text-tertiary">
                                  이미지: {portfolio.images.length}개
                                </span>
                                {portfolio.tags.filter(tag => tag.trim()).length > 0 && (
                                  <div className="flex gap-1">
                                    {portfolio.tags.filter(tag => tag.trim()).slice(0, 3).map((tag, index) => (
                                      <span key={index} className="px-1 py-0.5 bg-white/10 rounded text-xs">
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <motion.button
                                  className="text-tertiary hover:text-secondary transition-colors"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </motion.button>
                                <motion.button
                                  className="text-red-400 hover:text-red-300 transition-colors"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                      <svg className="w-8 h-8 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h4 className="mb-2">업로드된 포트폴리오가 없습니다</h4>
                    <p className="text-secondary mb-6">
                      첫 번째 포트폴리오를 업로드해보세요.
                    </p>
                    <motion.button
                      onClick={() => setActiveTab('upload')}
                      className="primary-button-hover px-6 py-3"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="liquid-glass-bg-hover"></div>
                      <span className="relative z-10">포트폴리오 업로드</span>
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
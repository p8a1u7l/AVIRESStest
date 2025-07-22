"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PortfolioItem {
  id: string;
  title: string;
  designer: string;
  category: string;
  imageUrl: string;
  isLiked?: boolean;
  description?: string;
  price?: number;
  tags?: string[];
  features?: string[];
}

interface StyleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedStyles: string[]) => void;
  portfolioItems: PortfolioItem[];
  currentProduct: PortfolioItem | null;
  maxSelection?: number;
}

export default function StyleSelectionModal({
  isOpen,
  onClose,
  onConfirm,
  portfolioItems,
  currentProduct,
  maxSelection = 3
}: StyleSelectionModalProps) {
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);

  // Early return if currentProduct is null
  if (!currentProduct) {
    return null;
  }

  // 현재 제품과 같은 카테고리의 다른 아이템들 필터링
  const availableStyles = portfolioItems.filter(item => 
    item.category === currentProduct.category && item.id !== currentProduct.id
  );

  const handleStyleToggle = (itemId: string) => {
    setSelectedStyles(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else if (prev.length < maxSelection) {
        return [...prev, itemId];
      }
      return prev;
    });
  };

  const handleConfirm = () => {
    onConfirm(selectedStyles);
    setSelectedStyles([]);
    onClose();
  };

  const handleClose = () => {
    setSelectedStyles([]);
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
                    <h2 className="mb-2">스타일 선택</h2>
                    <p className="text-secondary">
                      "{currentProduct.title}"와 비슷한 스타일을 최대 {maxSelection}개까지 선택해주세요.
                      선택한 스타일은 디자이너에게 참고 자료로 전달됩니다.
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

                {/* 선택 상태 표시 */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium">
                      선택됨: {selectedStyles.length}/{maxSelection}
                    </span>
                    {selectedStyles.length > 0 && (
                      <motion.button
                        onClick={() => setSelectedStyles([])}
                        className="text-tertiary hover:text-secondary text-sm"
                        whileHover={{ scale: 1.05 }}
                      >
                        모두 해제
                      </motion.button>
                    )}
                  </div>
                  
                  {/* 선택 진행률 바 */}
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-gray-medium to-gray-light h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(selectedStyles.length / maxSelection) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                {/* 스타일 그리드 */}
                <div className="max-h-96 overflow-y-auto mb-8">
                  {availableStyles.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {availableStyles.map((item) => {
                        const isSelected = selectedStyles.includes(item.id);
                        const isDisabled = !isSelected && selectedStyles.length >= maxSelection;

                        return (
                          <motion.div
                            key={item.id}
                            className={`simple-card cursor-pointer transition-all duration-300 ${
                              isSelected 
                                ? 'ring-2 ring-gray-medium' 
                                : isDisabled 
                                  ? 'opacity-50 cursor-not-allowed' 
                                  : ''
                            }`}
                            onClick={() => !isDisabled && handleStyleToggle(item.id)}
                            whileHover={!isDisabled ? { scale: 1.02, y: -2 } : {}}
                            whileTap={!isDisabled ? { scale: 0.98 } : {}}
                          >
                            <div className="liquid-glass-bg-hover"></div>
                            <div className="relative z-10 p-4">
                              {/* 이미지 */}
                              <div className="relative aspect-[4/5] mb-3 rounded-lg overflow-hidden">
                                <ImageWithFallback
                                  src={item.imageUrl}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                />
                                
                                {/* 선택 체크박스 */}
                                <div className="absolute top-2 right-2">
                                  <motion.div
                                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                      isSelected
                                        ? 'bg-gray-medium border-gray-medium'
                                        : 'bg-black/50 border-white/30'
                                    }`}
                                    animate={{
                                      scale: isSelected ? 1.1 : 1,
                                      backgroundColor: isSelected ? '#808080' : 'rgba(0,0,0,0.5)'
                                    }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    {isSelected && (
                                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                    )}
                                  </motion.div>
                                </div>

                                {/* 선택 오버레이 */}
                                {isSelected && (
                                  <motion.div
                                    className="absolute inset-0 bg-gray-medium/20 backdrop-blur-sm"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                  />
                                )}
                              </div>

                              {/* 제품 정보 */}
                              <div className="text-center">
                                <h4 className="text-sm font-medium mb-1 line-clamp-1">{item.title}</h4>
                                <p className="text-tertiary text-xs line-clamp-1">{item.designer}</p>
                              </div>
                            </div>
                          </motion.div>
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
                      <h4 className="mb-2">사용 가능한 스타일이 없습니다</h4>
                      <p className="text-secondary">
                        이 카테고리에는 다른 참고 스타일이 없습니다.
                      </p>
                    </div>
                  )}
                </div>

                {/* 하단 액션 버튼 */}
                <div className="flex items-center justify-between">
                  <motion.button
                    onClick={handleClose}
                    className="standard-button px-6 py-3"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="liquid-glass-bg-hover"></div>
                    <span className="relative z-10">취소</span>
                  </motion.button>

                  <motion.button
                    onClick={handleConfirm}
                    disabled={selectedStyles.length === 0}
                    className={`primary-button-hover px-6 py-3 ${
                      selectedStyles.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    whileHover={selectedStyles.length > 0 ? { scale: 1.02 } : {}}
                    whileTap={selectedStyles.length > 0 ? { scale: 0.98 } : {}}
                  >
                    <div className="liquid-glass-bg-hover"></div>
                    <span className="relative z-10">
                      선택 완료 ({selectedStyles.length}개)
                    </span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
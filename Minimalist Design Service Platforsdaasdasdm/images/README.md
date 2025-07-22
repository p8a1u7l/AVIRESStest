# AVIRESS Images Directory

이 폴더는 AVIRESS 플랫폼의 모든 이미지 에셋을 관리합니다.

## 폴더 구조

### `/hero/`
히어로 슬라이더에 사용되는 고해상도 이미지들
- 권장 크기: 1920x1080px
- 형식: JPG, PNG, WebP
- 파일명 예시: `hero-logo-design.jpg`, `hero-typography.jpg`

### `/portfolio/`
포트폴리오 그리드에 표시되는 작품 이미지들
- 권장 크기: 400x300px ~ 800x1200px (세로비율 다양)
- 형식: JPG, PNG, WebP
- 파일명 예시: `logo-minimal-brand.jpg`, `font-modern-sans.jpg`

### `/designers/`
디자이너 프로필 이미지들
- 권장 크기: 200x200px (정사각형)
- 형식: JPG, PNG
- 파일명 예시: `designer-sarah-chen.jpg`, `designer-alex-rivera.jpg`

### `/products/`
제품 및 서비스 관련 이미지들
- 권장 크기: 400x400px ~ 800x600px
- 형식: JPG, PNG, WebP
- 파일명 예시: `business-cards-premium.jpg`, `font-collection.jpg`

### `/ui/`
UI 요소 및 아이콘 이미지들
- 권장 크기: 다양 (용도에 따라)
- 형식: PNG, SVG
- 파일명 예시: `icon-logo-design.png`, `pattern-background.png`

## 이미지 최적화 가이드

1. **압축**: 품질을 유지하면서 파일 크기 최소화
2. **형식**: WebP > JPG > PNG (용도에 따라)
3. **반응형**: 여러 크기 버전 준비 (@1x, @2x, @3x)
4. **ALT 텍스트**: 접근성을 위한 설명 추가

## 현재 교체가 필요한 Unsplash 이미지들

### Hero Slider (4개)
- hero-logo-design.jpg
- hero-designer-profile.jpg  
- hero-business-cards.jpg
- hero-typography.jpg

### Portfolio Items (12개)
- portfolio-logo-minimal.jpg
- portfolio-font-modern.jpg
- portfolio-business-elegant.jpg
- portfolio-logo-architectural.jpg
- portfolio-font-serif.jpg
- portfolio-logo-restaurant.jpg
- portfolio-business-creative.jpg
- portfolio-logo-tech.jpg
- portfolio-font-luxury.jpg
- portfolio-logo-corporate.jpg
- portfolio-business-boutique.jpg
- portfolio-font-display.jpg

### Designer Avatars (4개)
- designer-sarah-chen.jpg
- designer-alex-rivera.jpg
- designer-maria-santos.jpg
- designer-david-kim.jpg

이 폴더에 이미지를 업로드한 후, App.tsx의 imageUrl들을 업데이트하면 됩니다.
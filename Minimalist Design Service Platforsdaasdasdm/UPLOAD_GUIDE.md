# 🖼️ AVIRESS 이미지 업로드 가이드

AVIRESS 프로젝트에 개인 이미지를 추가하는 방법입니다.

## 📁 폴더 구조

```
/images/
├── hero/          # 히어로 슬라이더 이미지 (1920x1080px)
├── portfolio/     # 포트폴리오 작품 이미지 (세로 비율 다양)
├── designers/     # 디자이너 프로필 이미지 (200x200px)
├── products/      # 제품/서비스 이미지 (400x400px ~ 800x600px)
└── ui/           # UI 요소 및 아이콘
```

## 🎯 업로드해야 할 이미지들

### 1. Hero Slider Images (4개)
**크기**: 1920x1080px (16:9 비율)  
**형식**: JPG, PNG, WebP  
**용도**: 메인 페이지 히어로 슬라이더

- `hero-logo-design.jpg` - 로고 디자인 관련 이미지
- `hero-designer-profile.jpg` - 디자이너 작업 모습
- `hero-business-cards.jpg` - 명함 디자인 샘플
- `hero-typography.jpg` - 타이포그래피/폰트 관련

### 2. Portfolio Images (12개 이상)
**크기**: 400px 너비 기준, 높이는 자유 (Pinterest 스타일)  
**형식**: JPG, PNG, WebP  
**용도**: 디자이너별 포트폴리오 그리드

#### Logo Design (6개)
- `portfolio-logo-minimal.jpg` - 미니멀 로고
- `portfolio-logo-architectural.jpg` - 건축 관련 로고
- `portfolio-logo-restaurant.jpg` - 레스토랑 로고
- `portfolio-logo-tech.jpg` - 테크 스타트업 로고
- `portfolio-logo-corporate.jpg` - 기업 로고
- `portfolio-logo-variations.jpg` - 로고 베리에이션

#### Font Design (4개)
- `portfolio-font-modern.jpg` - 모던 폰트
- `portfolio-font-serif.jpg` - 세리프 폰트
- `portfolio-font-luxury.jpg` - 럭셔리 폰트
- `portfolio-font-display.jpg` - 디스플레이 폰트

#### Business Cards (3개)
- `portfolio-business-elegant.jpg` - 엘레강트 명함
- `portfolio-business-creative.jpg` - 크리에이티브 명함
- `portfolio-business-boutique.jpg` - 부티크 명함

### 3. Designer Profile Images (6개)
**크기**: 200x200px (정사각형)  
**형식**: JPG, PNG  
**용도**: 디자이너 프로필 아바타

- `designer-sarah-chen.jpg` - Sarah Chen
- `designer-alex-rivera.jpg` - Alex Rivera  
- `designer-maria-santos.jpg` - Maria Santos
- `designer-david-kim.jpg` - David Kim
- `designer-emma-johnson.jpg` - Emma Johnson
- `designer-carlos-rodriguez.jpg` - Carlos Rodriguez

## 📋 업로드 체크리스트

### ✅ 이미지 준비
- [ ] 모든 이미지가 권장 크기에 맞는지 확인
- [ ] 파일명이 정확한지 확인 (대소문자, 하이픈 주의)
- [ ] 이미지 품질이 좋은지 확인 (흐림, 노이즈 없음)
- [ ] 브랜드 컨셉에 맞는 이미지인지 확인

### ✅ 폴더별 업로드
1. **Hero 이미지** → `/images/hero/` 폴더에 업로드
2. **Portfolio 이미지** → `/images/portfolio/` 폴더에 업로드  
3. **Designer 이미지** → `/images/designers/` 폴더에 업로드
4. **Product 이미지** → `/images/products/` 폴더에 업로드

### ✅ 코드 업데이트
이미지 업로드 후에는 코드 수정이 필요하지 않습니다!  
`/utils/images.ts`에 이미 모든 경로가 설정되어 있어서,  
파일명만 맞으면 자동으로 적용됩니다.

## 🎨 이미지 스타일 가이드

### 색상 테마
- **다크 테마**: 어두운 배경에 잘 어울리는 이미지
- **브랜드 컬러**: 화이트(#e5e5e5)와 잘 조화되는 톤

### 디자인 방향
- **미니멀리즘**: 깔끔하고 모던한 느낌
- **프로페셔널**: 고급스럽고 전문적인 이미지
- **일관성**: 전체적으로 통일된 스타일

## 🔧 이미지 최적화 팁

### 1. 파일 크기 최적화
- **Hero 이미지**: 500KB 이하 권장
- **Portfolio 이미지**: 200KB 이하 권장
- **Profile 이미지**: 100KB 이하 권장

### 2. 형식 선택
- **사진**: JPG (압축률 좋음)
- **그래픽**: PNG (투명도 지원)
- **최신 브라우저**: WebP (최고 압축률)

### 3. 반응형 대응
선택사항: 고해상도 화면용 @2x, @3x 버전도 준비 가능
- `hero-logo-design.jpg` (기본)
- `hero-logo-design@2x.jpg` (레티나)
- `hero-logo-design@3x.jpg` (고해상도)

## ❗ 주의사항

1. **저작권**: 본인이 만든 작품이거나 사용 권한이 있는 이미지만 사용
2. **파일명**: 정확한 파일명 사용 (스펠링, 하이픈 확인)
3. **크기**: 권장 크기 준수 (로딩 성능에 영향)
4. **품질**: 픽셀레이션이나 압축 아티팩트 없는 깨끗한 이미지

## 📞 도움이 필요하시면

이미지 업로드나 설정에 문제가 있으시면 언제든 말씀해 주세요!  
파일명이나 크기 조정도 도와드릴 수 있습니다.
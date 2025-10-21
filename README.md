# 🍒 Cherryz WebShare

Berryz WebShare의 정신적 계승작인 현대적인 파일 공유 서버

## 소개

Cherryz WebShare는 간편한 파일 공유와 관리를 위한 웹 서버입니다. 관리자는 파일을 업로드하고 관리할 수 있으며, 사용자는 파일을 조회하고 다운로드할 수 있습니다.

## 주요 기능

### 관리자 기능
- ✅ 파일 업로드
- ✅ 파일/디렉토리 이동
- ✅ 파일/디렉토리 삭제
- ✅ 디렉토리 생성
- ✅ 파일 조회 및 다운로드

### 사용자 기능
- ✅ 파일 및 디렉토리 목록 조회
- ✅ 파일 다운로드

### 보안 기능
- 🔐 JWT 기반 인증
- 🔑 역할 기반 권한 관리 (Admin/User)
- 🛡️ 경로 탐색 공격(Path Traversal) 방지
- 🔒 파일 크기 제한

## 기술 스택

### Backend (API)
- **Runtime**: Node.js 22+
- **Framework**: Express.js
- **Language**: TypeScript (ES Modules)
- **Authentication**: JWT (jsonwebtoken)
- **File Upload**: Multer
- **Security**: Helmet, bcryptjs
- **Dev Tools**: tsx

### Frontend (Manager & Viewer)
- **Build Tool**: Vite
- **Framework**: React 18
- **Language**: TypeScript
- **Routing**: React Router v7
- **State Management**: TanStack React Query
- **Styling**: Emotion (CSS-in-JS)
- **UI Components**: Radix UI
- **Icons**: FontAwesome
- **Date/Time**: dayjs

### Infrastructure
- **Package Manager**: pnpm 9+
- **Architecture**: Monorepo (pnpm workspaces)
- **Dependency Updates**: npm-check-updates

## 설치 및 실행

### 전제 조건
- Node.js >= 22.0.0
- pnpm >= 9.0.0

### 1. 의존성 설치
```bash
pnpm install
```

### 2. 환경 변수 설정

#### API 서버
```bash
cp packages/api/.env.example packages/api/.env
# 필요에 따라 .env 파일 수정
```

#### Manager 웹 (이미 설정되어 있음)
```bash
# packages/manager/.env
VITE_API_BASE_URL=http://localhost:3000/api
```

#### Viewer 웹 (이미 설정되어 있음)
```bash
# packages/viewer/.env
VITE_API_BASE_URL=http://localhost:3000/api
```

### 3. 개발 모드로 실행

#### API 서버만 실행
```bash
pnpm dev
```

#### Manager 웹만 실행 (관리자용)
```bash
pnpm dev:manager
# http://localhost:5173 에서 접근
```

#### Viewer 웹만 실행 (사용자용)
```bash
pnpm dev:viewer
# http://localhost:5173 에서 접근
```

#### 모든 애플리케이션 동시 실행
```bash
pnpm dev:all
# API: http://localhost:3000
# Manager: http://localhost:5173
# Viewer: http://localhost:5174
```

### 4. 프로덕션 빌드

#### 모든 패키지 빌드
```bash
pnpm build:all
```

#### 개별 빌드
```bash
pnpm build              # API만
pnpm build:manager      # Manager만
pnpm build:viewer       # Viewer만
```

### 5. 프로덕션 실행
```bash
pnpm start  # API 서버 시작
```

### 6. 의존성 최신화
```bash
pnpm update-deps
```

## API 문서

자세한 API 문서는 [API.md](./API.md)를 참조하세요.

### 주요 엔드포인트

#### 인증
- `POST /api/authentication/login` - 로그인
- `POST /api/authentication/register` - 사용자 등록

#### 파일 관리
- `GET /api/files` - 파일 목록 조회 (인증 필요)
- `GET /api/files/download` - 파일 다운로드 (인증 필요)
- `POST /api/files/upload` - 파일 업로드 (관리자 전용)
- `POST /api/files/directory` - 디렉토리 생성 (관리자 전용)
- `PUT /api/files/move` - 파일 이동 (관리자 전용)
- `DELETE /api/files` - 파일 삭제 (관리자 전용)

## 기본 관리자 계정

서버 시작 시 자동으로 생성되는 기본 관리자 계정:
- **Username**: `admin` (환경 변수에서 변경 가능)
- **Password**: `admin123` (환경 변수에서 변경 가능)

⚠️ **프로덕션 환경에서는 반드시 비밀번호를 변경하세요!**

## 프로젝트 구조 (Monorepo)

```
cherryz-webshare/
├── packages/
│   ├── api/                    # API 서버 패키지
│   │   ├── sources/            # 소스 코드
│   │   │   ├── settings/       # 설정 파일
│   │   │   ├── controllers/    # API 컨트롤러
│   │   │   ├── middlewares/    # 미들웨어 (인증, 권한)
│   │   │   ├── routes/         # API 라우트
│   │   │   ├── services/       # 비즈니스 로직
│   │   │   ├── types/          # TypeScript 타입
│   │   │   ├── application.ts  # Express 앱
│   │   │   └── server.ts       # 서버 진입점
│   │   ├── uploads/            # 업로드된 파일
│   │   ├── .env.example
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── manager/                # 관리자용 웹 (Admin)
│   │   ├── sources/            # React 소스 코드
│   │   │   ├── components/     # React 컴포넌트
│   │   │   ├── pages/          # 페이지 컴포넌트
│   │   │   ├── hooks/          # Custom hooks
│   │   │   ├── api/            # API 클라이언트
│   │   │   ├── settings/       # 설정 및 테마
│   │   │   ├── types/          # TypeScript 타입
│   │   │   ├── main.tsx        # 진입점
│   │   │   └── Application.tsx # 루트 컴포넌트
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── viewer/                 # 사용자용 웹 (User)
│       ├── sources/            # React 소스 코드
│       │   ├── components/     # React 컴포넌트
│       │   ├── pages/          # 페이지 컴포넌트
│       │   ├── hooks/          # Custom hooks
│       │   ├── api/            # API 클라이언트
│       │   ├── settings/       # 설정
│       │   ├── types/          # TypeScript 타입
│       │   ├── main.tsx        # 진입점
│       │   └── Application.tsx # 루트 컴포넌트
│       ├── index.html
│       ├── vite.config.ts
│       ├── package.json
│       └── tsconfig.json
│
├── pnpm-workspace.yaml         # pnpm workspace 설정
├── .ncurc.json                 # npm-check-updates 설정
├── package.json                # 루트 package.json
├── API.md                      # API 문서
└── README.md
```

## 애플리케이션 설명

### 📦 API (Backend)
- Express.js 기반 REST API 서버
- JWT 인증 및 권한 관리
- 파일 업로드/다운로드/관리 기능
- 포트: 3000

### 🔧 Manager (Admin Web)
- 관리자용 웹 애플리케이션
- 파일 업로드, 삭제, 이동, 디렉토리 생성 가능
- 다크/라이트 모드 지원
- 포트: 5173 (개발 시)

### 👁️ Viewer (User Web)
- 사용자용 웹 애플리케이션
- 파일 조회 및 다운로드만 가능 (읽기 전용)
- 검색 및 정렬 기능
- 포트: 5174 (개발 시)

## 보안 고려사항

1. **JWT Secret**: 프로덕션에서는 강력한 랜덤 문자열 사용
2. **관리자 비밀번호**: 기본 비밀번호 반드시 변경
3. **파일 크기 제한**: 서버 리소스에 맞게 조정
4. **경로 검증**: 모든 파일 경로는 업로드 디렉토리 내부로 제한
5. **HTTPS**: 프로덕션에서는 HTTPS 사용 권장

## 향후 계획

- [ ] 데이터베이스 연동 (PostgreSQL/MongoDB)
- [ ] 파일 미리보기 기능
- [ ] 폴더 압축/해제 기능
- [ ] 파일 검색 기능
- [ ] 업로드 진행률 표시
- [ ] 웹 UI 프론트엔드
- [ ] 파일 공유 링크 생성
- [ ] 사용자 그룹 및 세밀한 권한 관리

## 라이선스

MIT License

## 기여

이슈 및 풀 리퀘스트는 언제나 환영합니다!
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

- **Runtime**: Node.js 22+
- **Package Manager**: pnpm 9+
- **Architecture**: Monorepo
- **Framework**: Express.js
- **Language**: TypeScript (ES Modules)
- **Authentication**: JWT (jsonwebtoken)
- **File Upload**: Multer
- **Security**: Helmet, bcryptjs
- **Dev Tools**: tsx, npm-check-updates

## 설치 및 실행

### 전제 조건
- Node.js >= 22.0.0
- pnpm >= 9.0.0

### 1. 의존성 설치
```bash
pnpm install
```

### 2. 환경 변수 설정
`packages/api/.env.example` 파일을 복사하여 `.env` 파일을 생성하고 필요한 값을 설정합니다:

```bash
cp packages/api/.env.example packages/api/.env
```

`.env` 파일 예시:
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-key-change-this-in-production
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-this-password
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=104857600
```

### 3. 개발 모드로 실행
```bash
pnpm dev
```

### 4. 프로덕션 빌드 및 실행
```bash
pnpm build
pnpm start
```

### 5. 의존성 최신화
```bash
pnpm update-deps
```

서버가 실행되면 기본적으로 `http://localhost:3000`에서 접근할 수 있습니다.

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
│   └── api/                    # API 서버 패키지
│       ├── sources/            # 소스 코드 (src → sources)
│       │   ├── settings/       # 설정 파일 (config → settings)
│       │   ├── controllers/    # API 컨트롤러
│       │   ├── middlewares/    # 미들웨어 (인증, 권한)
│       │   ├── models/         # 데이터 모델
│       │   ├── routes/         # API 라우트
│       │   ├── services/       # 비즈니스 로직
│       │   ├── types/          # TypeScript 타입 정의
│       │   ├── application.ts  # Express 앱 설정 (app → application)
│       │   └── server.ts       # 서버 진입점
│       ├── uploads/            # 업로드된 파일 저장 디렉토리
│       ├── .env                # 환경 변수 (git에서 제외)
│       ├── .env.example        # 환경 변수 예시
│       ├── package.json
│       └── tsconfig.json
├── pnpm-workspace.yaml         # pnpm workspace 설정
├── .ncurc.json                 # npm-check-updates 설정
├── package.json                # 루트 package.json
├── API.md                      # API 문서
└── README.md
```

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
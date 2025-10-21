# Cherryz WebShare API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
대부분의 엔드포인트는 JWT 인증이 필요합니다. 로그인 후 받은 토큰을 요청 헤더에 포함시켜야 합니다.

```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### 인증 (Authentication)

#### 1. 로그인
- **URL**: `/auth/login`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
```json
{
  "username": "admin",
  "password": "admin123"
}
```
- **Success Response** (200):
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "1",
      "username": "admin",
      "role": "admin"
    }
  }
}
```

#### 2. 사용자 등록
- **URL**: `/auth/register`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
```json
{
  "username": "newuser",
  "password": "password123"
}
```
- **Success Response** (201):
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "2",
    "username": "newuser",
    "role": "user"
  }
}
```

---

### 파일 관리 (File Management)

#### 1. 파일 목록 조회
- **URL**: `/files`
- **Method**: `GET`
- **Auth Required**: Yes
- **Permissions**: Admin, User
- **Query Parameters**:
  - `path` (optional): 조회할 경로 (기본값: 루트)
- **Example**: `/files?path=documents/2024`
- **Success Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "name": "folder1",
      "path": "folder1",
      "size": 0,
      "type": "directory",
      "modifiedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "name": "file.txt",
      "path": "file.txt",
      "size": 1024,
      "type": "file",
      "modifiedAt": "2024-01-15T11:30:00.000Z"
    }
  ]
}
```

#### 2. 파일 다운로드
- **URL**: `/files/download`
- **Method**: `GET`
- **Auth Required**: Yes
- **Permissions**: Admin, User
- **Query Parameters**:
  - `path` (required): 다운로드할 파일 경로
- **Example**: `/files/download?path=documents/report.pdf`
- **Success Response**: 파일 다운로드

#### 3. 파일 업로드
- **URL**: `/files/upload`
- **Method**: `POST`
- **Auth Required**: Yes
- **Permissions**: Admin only
- **Content-Type**: `multipart/form-data`
- **Form Data**:
  - `file`: 업로드할 파일
  - `path` (optional): 저장할 경로
- **Success Response** (201):
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "name": "document.pdf",
    "path": "documents/document.pdf",
    "size": 2048,
    "type": "file",
    "modifiedAt": "2024-01-15T12:00:00.000Z"
  }
}
```

#### 4. 디렉토리 생성
- **URL**: `/files/directory`
- **Method**: `POST`
- **Auth Required**: Yes
- **Permissions**: Admin only
- **Request Body**:
```json
{
  "path": "documents/2024/reports"
}
```
- **Success Response** (201):
```json
{
  "success": true,
  "message": "Directory created successfully",
  "data": {
    "name": "reports",
    "path": "documents/2024/reports",
    "size": 0,
    "type": "directory",
    "modifiedAt": "2024-01-15T12:30:00.000Z"
  }
}
```

#### 5. 파일/디렉토리 이동
- **URL**: `/files/move`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Permissions**: Admin only
- **Request Body**:
```json
{
  "sourcePath": "old/path/file.txt",
  "destPath": "new/path/file.txt"
}
```
- **Success Response** (200):
```json
{
  "success": true,
  "message": "File moved successfully"
}
```

#### 6. 파일/디렉토리 삭제
- **URL**: `/files`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Permissions**: Admin only
- **Query Parameters**:
  - `path` (required): 삭제할 파일/디렉토리 경로
- **Example**: `/files?path=documents/old_file.txt`
- **Success Response** (200):
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

---

## Error Responses

모든 에러 응답은 다음 형식을 따릅니다:

```json
{
  "success": false,
  "error": "Error message description"
}
```

### 일반적인 에러 코드:
- **400 Bad Request**: 잘못된 요청 (필수 파라미터 누락 등)
- **401 Unauthorized**: 인증 실패 (토큰 없음 또는 유효하지 않음)
- **403 Forbidden**: 권한 없음 (관리자 전용 기능을 일반 사용자가 호출)
- **404 Not Found**: 리소스를 찾을 수 없음
- **500 Internal Server Error**: 서버 내부 오류

---

## 권한 시스템

### 역할 (Roles)
1. **admin**: 모든 기능 접근 가능
   - 파일 업로드
   - 파일/디렉토리 이동
   - 파일/디렉토리 삭제
   - 디렉토리 생성
   - 파일 조회 및 다운로드

2. **user**: 읽기 전용
   - 파일 조회
   - 파일 다운로드

---

## 예제 사용법

### cURL 예제

#### 1. 로그인
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

#### 2. 파일 목록 조회
```bash
curl http://localhost:3000/api/files \
  -H "Authorization: Bearer <your-token>"
```

#### 3. 파일 업로드
```bash
curl -X POST http://localhost:3000/api/files/upload \
  -H "Authorization: Bearer <your-token>" \
  -F "file=@/path/to/local/file.txt" \
  -F "path=documents"
```

#### 4. 파일 다운로드
```bash
curl http://localhost:3000/api/files/download?path=documents/file.txt \
  -H "Authorization: Bearer <your-token>" \
  -O
```

#### 5. 파일 삭제
```bash
curl -X DELETE "http://localhost:3000/api/files?path=documents/file.txt" \
  -H "Authorization: Bearer <your-token>"
```

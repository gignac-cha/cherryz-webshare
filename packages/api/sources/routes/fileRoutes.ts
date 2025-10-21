import { Router } from 'express';
import multer from 'multer';
import { fileController } from '../controllers/fileController.js';
import { authenticate, requireAdmin } from '../middlewares/authentication.js';
import { settings } from '../settings/index.js';

const router = Router();

// Multer 설정 (임시 저장소)
const upload = multer({
  dest: '/tmp/uploads/',
  limits: {
    fileSize: settings.maxFileSize,
  },
});

/**
 * GET /api/files
 * 파일 목록 조회 (모든 인증된 사용자)
 */
router.get('/', authenticate, fileController.listFiles);

/**
 * GET /api/files/download
 * 파일 다운로드 (모든 인증된 사용자)
 */
router.get('/download', authenticate, fileController.downloadFile);

/**
 * POST /api/files/upload
 * 파일 업로드 (관리자 전용)
 */
router.post('/upload', authenticate, requireAdmin, upload.single('file'), fileController.uploadFile);

/**
 * POST /api/files/directory
 * 디렉토리 생성 (관리자 전용)
 */
router.post('/directory', authenticate, requireAdmin, fileController.createDirectory);

/**
 * PUT /api/files/move
 * 파일/디렉토리 이동 (관리자 전용)
 */
router.put('/move', authenticate, requireAdmin, fileController.moveFile);

/**
 * DELETE /api/files
 * 파일/디렉토리 삭제 (관리자 전용)
 */
router.delete('/', authenticate, requireAdmin, fileController.deleteFile);

export default router;

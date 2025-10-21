import { Router, type Router as RouterType, type Request, type Response, type NextFunction } from 'express';
import multer from 'multer';
import { fileController } from '../controllers/fileController.js';
import { authenticate, requireAdmin } from '../middlewares/authentication.js';
import { settings } from '../settings/index.js';

const router: RouterType = Router();

// Multer 설정 (임시 저장소)
const upload = multer({
  dest: '/tmp/uploads/',
  limits: {
    fileSize: settings.maxFileSize,
  },
});

/**
 * Multer 에러 처리 미들웨어
 */
const handleMulterError = (err: any, req: Request, res: Response, next: NextFunction): void => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      const maxSizeMB = Math.round(settings.maxFileSize / (1024 * 1024));
      res.status(413).json({
        success: false,
        error: `파일 크기가 너무 큽니다. 최대 ${maxSizeMB}MB까지 업로드 가능합니다.`,
      });
      return;
    }
    res.status(400).json({
      success: false,
      error: `파일 업로드 오류: ${err.message}`,
    });
    return;
  }
  next(err);
};

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
router.post('/upload', authenticate, requireAdmin, upload.single('file'), handleMulterError, fileController.uploadFile);

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

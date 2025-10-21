import { Router } from 'express';
import { authController } from '../controllers/authController';

const router = Router();

/**
 * POST /api/auth/login
 * 로그인
 */
router.post('/login', authController.login);

/**
 * POST /api/auth/register
 * 사용자 등록
 */
router.post('/register', authController.register);

export default router;

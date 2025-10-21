import { Router, type Router as RouterType } from 'express';
import { authenticationController } from '../controllers/authenticationController.js';

const router: RouterType = Router();

/**
 * POST /api/authentication/login
 * 로그인
 */
router.post('/login', authenticationController.login);

/**
 * POST /api/authentication/register
 * 사용자 등록
 */
router.post('/register', authenticationController.register);

export default router;

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { settings } from '../settings/index.js';
import { AuthRequest } from '../types/index.js';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided',
      });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, settings.jwtSecret) as {
      id: string;
      username: string;
      role: 'admin' | 'user';
    };

    (req as AuthRequest).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid token',
    });
  }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthRequest;

  if (!authReq.user || authReq.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Admin access required',
    });
  }

  next();
};

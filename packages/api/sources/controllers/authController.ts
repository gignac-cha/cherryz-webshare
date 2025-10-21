import { Request, Response } from 'express';
import { authService } from '../services/authService.js';
import { ApiResponse } from '../types/index.js';

export const authController = {
  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          error: 'Username and password are required',
        } as ApiResponse);
      }

      const result = await authService.login(username, password);

      res.json({
        success: true,
        data: result,
      } as ApiResponse);
    } catch (error) {
      res.status(401).json({
        success: false,
        error: error instanceof Error ? error.message : 'Login failed',
      } as ApiResponse);
    }
  },

  async register(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          error: 'Username and password are required',
        } as ApiResponse);
      }

      const user = await authService.createUser(username, password, 'user');

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user,
      } as ApiResponse);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      } as ApiResponse);
    }
  },
};

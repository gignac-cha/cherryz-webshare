import { Request, Response } from 'express';
import { fileService } from '../services/fileService';
import { ApiResponse } from '../types';

export const fileController = {
  /**
   * 파일/디렉토리 목록 조회 (모든 사용자)
   */
  async listFiles(req: Request, res: Response) {
    try {
      const relativePath = (req.query.path as string) || '';
      const files = await fileService.listFiles(relativePath);

      res.json({
        success: true,
        data: files,
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to list files',
      } as ApiResponse);
    }
  },

  /**
   * 파일 업로드 (관리자 전용)
   */
  async uploadFile(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file provided',
        } as ApiResponse);
      }

      const relativePath = (req.body.path as string) || '';
      const fileInfo = await fileService.uploadFile(req.file, relativePath);

      res.status(201).json({
        success: true,
        message: 'File uploaded successfully',
        data: fileInfo,
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload file',
      } as ApiResponse);
    }
  },

  /**
   * 파일 다운로드 (모든 사용자)
   */
  async downloadFile(req: Request, res: Response) {
    try {
      const relativePath = req.query.path as string;

      if (!relativePath) {
        return res.status(400).json({
          success: false,
          error: 'Path is required',
        } as ApiResponse);
      }

      const fullPath = fileService.getFullPath(relativePath);
      res.download(fullPath);
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error instanceof Error ? error.message : 'File not found',
      } as ApiResponse);
    }
  },

  /**
   * 파일/디렉토리 이동 (관리자 전용)
   */
  async moveFile(req: Request, res: Response) {
    try {
      const { sourcePath, destPath } = req.body;

      if (!sourcePath || !destPath) {
        return res.status(400).json({
          success: false,
          error: 'Source and destination paths are required',
        } as ApiResponse);
      }

      await fileService.moveFile(sourcePath, destPath);

      res.json({
        success: true,
        message: 'File moved successfully',
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to move file',
      } as ApiResponse);
    }
  },

  /**
   * 파일/디렉토리 삭제 (관리자 전용)
   */
  async deleteFile(req: Request, res: Response) {
    try {
      const relativePath = req.query.path as string;

      if (!relativePath) {
        return res.status(400).json({
          success: false,
          error: 'Path is required',
        } as ApiResponse);
      }

      await fileService.deleteFile(relativePath);

      res.json({
        success: true,
        message: 'File deleted successfully',
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete file',
      } as ApiResponse);
    }
  },

  /**
   * 디렉토리 생성 (관리자 전용)
   */
  async createDirectory(req: Request, res: Response) {
    try {
      const { path } = req.body;

      if (!path) {
        return res.status(400).json({
          success: false,
          error: 'Path is required',
        } as ApiResponse);
      }

      const dirInfo = await fileService.createDirectory(path);

      res.status(201).json({
        success: true,
        message: 'Directory created successfully',
        data: dirInfo,
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create directory',
      } as ApiResponse);
    }
  },
};

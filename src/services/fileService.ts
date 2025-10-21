import fs from 'fs/promises';
import path from 'path';
import { config } from '../config';
import { FileInfo } from '../types';

export const fileService = {
  /**
   * 파일/디렉토리 목록 조회
   */
  async listFiles(relativePath: string = ''): Promise<FileInfo[]> {
    const fullPath = path.join(config.uploadDir, relativePath);

    // 보안: 경로 탐색 공격 방지
    if (!fullPath.startsWith(config.uploadDir)) {
      throw new Error('Invalid path');
    }

    try {
      await fs.access(fullPath);
    } catch {
      // 디렉토리가 없으면 생성
      await fs.mkdir(fullPath, { recursive: true });
      return [];
    }

    const entries = await fs.readdir(fullPath, { withFileTypes: true });
    const fileInfos: FileInfo[] = [];

    for (const entry of entries) {
      const entryPath = path.join(fullPath, entry.name);
      const stats = await fs.stat(entryPath);

      fileInfos.push({
        name: entry.name,
        path: path.join(relativePath, entry.name),
        size: stats.size,
        type: entry.isDirectory() ? 'directory' : 'file',
        modifiedAt: stats.mtime,
      });
    }

    return fileInfos.sort((a, b) => {
      // 디렉토리를 먼저 표시
      if (a.type !== b.type) {
        return a.type === 'directory' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
  },

  /**
   * 파일 업로드 (관리자 전용)
   */
  async uploadFile(file: Express.Multer.File, relativePath: string = ''): Promise<FileInfo> {
    const targetDir = path.join(config.uploadDir, relativePath);

    // 보안: 경로 탐색 공격 방지
    if (!targetDir.startsWith(config.uploadDir)) {
      throw new Error('Invalid path');
    }

    // 디렉토리가 없으면 생성
    await fs.mkdir(targetDir, { recursive: true });

    const targetPath = path.join(targetDir, file.originalname);

    // 파일 이동
    await fs.rename(file.path, targetPath);

    const stats = await fs.stat(targetPath);

    return {
      name: file.originalname,
      path: path.join(relativePath, file.originalname),
      size: stats.size,
      type: 'file',
      modifiedAt: stats.mtime,
    };
  },

  /**
   * 파일/디렉토리 이동 (관리자 전용)
   */
  async moveFile(sourcePath: string, destPath: string): Promise<void> {
    const fullSourcePath = path.join(config.uploadDir, sourcePath);
    const fullDestPath = path.join(config.uploadDir, destPath);

    // 보안: 경로 탐색 공격 방지
    if (!fullSourcePath.startsWith(config.uploadDir) || !fullDestPath.startsWith(config.uploadDir)) {
      throw new Error('Invalid path');
    }

    // 소스 파일 존재 확인
    await fs.access(fullSourcePath);

    // 대상 디렉토리 생성
    const destDir = path.dirname(fullDestPath);
    await fs.mkdir(destDir, { recursive: true });

    // 파일 이동
    await fs.rename(fullSourcePath, fullDestPath);
  },

  /**
   * 파일/디렉토리 삭제 (관리자 전용)
   */
  async deleteFile(relativePath: string): Promise<void> {
    const fullPath = path.join(config.uploadDir, relativePath);

    // 보안: 경로 탐색 공격 방지
    if (!fullPath.startsWith(config.uploadDir)) {
      throw new Error('Invalid path');
    }

    // 파일 존재 확인
    await fs.access(fullPath);

    const stats = await fs.stat(fullPath);

    if (stats.isDirectory()) {
      await fs.rm(fullPath, { recursive: true, force: true });
    } else {
      await fs.unlink(fullPath);
    }
  },

  /**
   * 디렉토리 생성 (관리자 전용)
   */
  async createDirectory(relativePath: string): Promise<FileInfo> {
    const fullPath = path.join(config.uploadDir, relativePath);

    // 보안: 경로 탐색 공격 방지
    if (!fullPath.startsWith(config.uploadDir)) {
      throw new Error('Invalid path');
    }

    await fs.mkdir(fullPath, { recursive: true });

    const stats = await fs.stat(fullPath);

    return {
      name: path.basename(relativePath),
      path: relativePath,
      size: 0,
      type: 'directory',
      modifiedAt: stats.mtime,
    };
  },

  /**
   * 파일 다운로드를 위한 전체 경로 반환
   */
  getFullPath(relativePath: string): string {
    const fullPath = path.join(config.uploadDir, relativePath);

    // 보안: 경로 탐색 공격 방지
    if (!fullPath.startsWith(config.uploadDir)) {
      throw new Error('Invalid path');
    }

    return fullPath;
  },
};

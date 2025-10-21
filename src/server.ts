import app from './app';
import { config } from './config';
import fs from 'fs';

// uploads 디렉토리 생성
if (!fs.existsSync(config.uploadDir)) {
  fs.mkdirSync(config.uploadDir, { recursive: true });
  console.log(`Created upload directory: ${config.uploadDir}`);
}

// /tmp/uploads 디렉토리 생성 (multer 임시 저장소)
if (!fs.existsSync('/tmp/uploads')) {
  fs.mkdirSync('/tmp/uploads', { recursive: true });
}

app.listen(config.port, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🍒 Cherryz WebShare Server                          ║
║                                                       ║
║   Server is running on port ${config.port}                   ║
║   Environment: ${config.nodeEnv}                       ║
║                                                       ║
║   API Endpoints:                                      ║
║   - POST   /api/auth/login                            ║
║   - POST   /api/auth/register                         ║
║   - GET    /api/files                                 ║
║   - GET    /api/files/download                        ║
║   - POST   /api/files/upload      (Admin only)        ║
║   - POST   /api/files/directory   (Admin only)        ║
║   - PUT    /api/files/move        (Admin only)        ║
║   - DELETE /api/files             (Admin only)        ║
║                                                       ║
║   Default Admin Credentials:                          ║
║   Username: ${config.adminUsername}                           ║
║   Password: ${config.adminPassword}                       ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});

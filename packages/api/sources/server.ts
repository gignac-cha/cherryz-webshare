import app from './application.js';
import { settings } from './settings/index.js';
import fs from 'node:fs';

// uploads 디렉토리 생성
if (!fs.existsSync(settings.uploadDir)) {
  fs.mkdirSync(settings.uploadDir, { recursive: true });
  console.log(`Created upload directory: ${settings.uploadDir}`);
}

// /tmp/uploads 디렉토리 생성 (multer 임시 저장소)
if (!fs.existsSync('/tmp/uploads')) {
  fs.mkdirSync('/tmp/uploads', { recursive: true });
}

app.listen(settings.port, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🍒 Cherryz WebShare Server                          ║
║                                                       ║
║   Server is running on port ${settings.port}                   ║
║   Environment: ${settings.nodeEnv}                       ║
║                                                       ║
║   API Endpoints:                                      ║
║   - POST   /api/authentication/login                  ║
║   - POST   /api/authentication/register               ║
║   - GET    /api/files                                 ║
║   - GET    /api/files/download                        ║
║   - POST   /api/files/upload      (Admin only)        ║
║   - POST   /api/files/directory   (Admin only)        ║
║   - PUT    /api/files/move        (Admin only)        ║
║   - DELETE /api/files             (Admin only)        ║
║                                                       ║
║   Default Admin Credentials:                          ║
║   Username: ${settings.adminUsername}                           ║
║   Password: ${settings.adminPassword}                       ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});

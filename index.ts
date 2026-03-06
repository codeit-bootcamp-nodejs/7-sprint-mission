// 알림 서버 메인 진입점
// Express + Socket.IO를 사용한 실시간 알림 서버

import express from 'express';
import http from 'http';
import { Server as IOServer } from 'socket.io';
import notificationRoutes from './src/routes/notification.routes';
import { initializeSocketHandlers } from './src/socket/notification.socket';
import { setIOInstance } from './src/controllers/notification.controller';

const app = express();
const server = http.createServer(app);
const io = new IOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS 설정
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// 헬스 체크 엔드포인트
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Notification server is running' });
});

// 알림 API 라우트 등록
app.use('/', notificationRoutes);

// Socket.IO 초기화
setIOInstance(io);
initializeSocketHandlers(io);

// 에러 핸들링
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
});

// 404 핸들링
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

const PORT = Number(process.env.PORT || 3000);

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`✨ Notification server listening on port ${PORT}`);
    console.log(`📡 WebSocket endpoint: http://localhost:${PORT}`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  });
}

export default server;
export { io };

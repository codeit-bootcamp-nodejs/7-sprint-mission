import { PORT } from './lib/constants';
import app from './app';
import socketService from './services/socketService';
import { createServer } from 'http';

const server = createServer(app);
socketService.initialize(server);

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

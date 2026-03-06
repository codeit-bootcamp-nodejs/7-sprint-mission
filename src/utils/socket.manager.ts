// Socket.IO 사용자 연결 관리

export class SocketManager {
  private userSockets = new Map<string, Set<string>>();

  // 사용자 소켓 등록
  addSocket(userId: string, socketId: string): void {
    if (!userId) return;
    
    let sockets = this.userSockets.get(userId);
    if (!sockets) {
      sockets = new Set();
      this.userSockets.set(userId, sockets);
    }
    sockets.add(socketId);
  }

  // 사용자 소켓 제거
  removeSocket(socketId: string): string | null {
    for (const [userId, sockets] of this.userSockets.entries()) {
      if (sockets.has(socketId)) {
        sockets.delete(socketId);
        if (sockets.size === 0) {
          this.userSockets.delete(userId);
        }
        return userId;
      }
    }
    return null;
  }

  // 사용자의 모든 소켓 ID 조회
  getUserSockets(userId: string): string[] {
    const sockets = this.userSockets.get(userId);
    return sockets ? Array.from(sockets) : [];
  }

  // 사용자가 연결되어 있는지 확인
  isUserConnected(userId: string): boolean {
    const sockets = this.userSockets.get(userId);
    return sockets !== undefined && sockets.size > 0;
  }

  // 연결된 모든 사용자 조회
  getConnectedUsers(): string[] {
    return Array.from(this.userSockets.keys());
  }

  // 저장소 초기화 (테스트용)
  clear(): void {
    this.userSockets.clear();
  }
}

export const socketManager = new SocketManager();

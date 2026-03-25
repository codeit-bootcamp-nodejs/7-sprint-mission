module.exports = {
  apps: [{
    name: 'pandamarket-api',
    script: 'build/server.js',
    env: {
      NODE_ENV: "production",
    },
    instances: 0, // CPU 코어 수만큼 프로세스 생성
    exec_mode: 'cluster' // 여러 대를 띄우는 클러스터 모드
  }],
};
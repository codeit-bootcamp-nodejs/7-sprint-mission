module.exports = {
  apps: [
    {
      name: 'panda-server', // PM2에서 사용할 프로세스 이름
      script: './dist/src/server.js', // 실행할 파일 경로 (빌드된 경로)
      instances: 1, // 실행할 프로세스 개수
      exec_mode: 'fork',
      watch: false, // 파일 변경 시 자동 재시작 여부
      env: {
        // 기본 환경 변수
        NODE_ENV: 'production',
      },
      // 로그 설정
      out_file: './logs/out.log', // 일반 로그 경로
      error_file: './logs/error.log', // 에러 로그 경로
      time: true, // 로그에 시간 출력 여부
    },
  ],
};

module.exports = {
    apps: [
        {
            name: 'spirnt-mission-server', // 프로세스 이름
            script: './src/server.ts', // 실행 파일 경로
            interpreter: 'bun', // 사용할 런타임
            watch: false, // 파일 변경 시 자동 재시작 여부
            env: {
                // 환경 변수 설정
                NODE_ENV: 'production',
                PORT: 3000,
            },
        },
    ],
};

# 1. PM2 설치
npm install pm2 -g

# 2. PM2 설정 파일 생성
pm2 init

# 3. 설정 파일 편집
nano ecosystem.config.js

# 4. 설정 파일을 읽어서 서버 실행
pm2 start ecosystem.config.js

# 5. 서버 재부팅 시 PM2가 자동 실행되도록 OS 등록 스크립트 생성
pm2 startup

# 6. 나오는 sudo 명령어 복사해서 실행

# 7. 현재 실행 중인 프로세스 상태를 저장
pm2 save
# 패키지 목록 업데이트 및 unzip 설치
sudo apt update
sudo apt install unzip -y

# Bun 런타임 설치
curl -fsSL https://bun.sh/install | bash

# 환경 변수 즉시 적용
source ~/.bashrc

# PM2 전역 설치
npm install pm2 -g

# 프로젝트 폴더로 이동 (사용자 환경에 맞게 수정)
cd ~/7-sprint-mission/src

# Bun을 사용하여 서버 실행
pm2 start server.ts --interpreter bun --name "spirnt-mission-server"

# 실행 상태 및 실시간 로그 확인
pm2 list
pm2 logs mission-server

# 서버 재부팅 시 PM2 자동 시작 설정 (출력되는 sudo 명령어를 반드시 실행해야 함)
pm2 startup

# 현재 실행 중인 프로세스 목록을 '부팅 시 실행 목록'에 저장
pm2 save
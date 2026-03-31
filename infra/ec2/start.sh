#!/bin/bash

# 에러 발생시 즉시 중단
set -e

echo "서버 배포를 시작합니다"

# npm 설치
npm install

# 컴파일 진행(TS -> JS)
echo "컴파일 진행 중..."
npm run build

# 서버 시작
# 이미 서버가 목록에 있다면 재시작 목록에 없다면 시작
if pm2 list | grep -q "panda-server"; then
    echo "기존 프로세스를 재시작 합니다."
    pm2 restart ecosystem.config.js
else
    echo "프로세스를 새로 시작합니다."
    pm2 start ecosystem.config.js
fi

# 상태 저장
pm2 save

echo "배포가 완료되었습니다."
pm2 status

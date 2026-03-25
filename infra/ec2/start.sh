#!/bin/bash

# 1. 의존성 설치 (필요한 경우)
npm install

# 2. 빌드 (TS -> JS 변환)
npm run build

# 3. 기존에 실행 중인 프로세스가 있다면 지우고 새로 시작 (깔끔하게)
pm2 delete pandamarket-api || true 

# 4. 설정 파일을 이용해 클러스터 모드로 실행
pm2 start ecosystem.config.js

# 5. 서버 재시작 시 자동 실행되도록 저장
pm2 save
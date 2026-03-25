#pm2 설치 
npm install pm2 -g

#기본실행
pm2 start ./dist/server.js --name "알아보기 쉬운 이름"

#설정파일 생성 및 수정
pm2 ecosystem
nano ecosystem.config.js

#실행 명령어
pm2 start ecosystem.config.js

#현재 프로세스 리스트 저장
pm2 save

#스타트업 스크립트 명령어 생성
pm2 startup

#출력된 명령어 복사하여 실행  ->successfully generated 뜨면 성공
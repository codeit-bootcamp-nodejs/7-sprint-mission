## 구현 내용

판다마켓 서비스를 AWS 환경에 배포했습니다.

- AWS S3를 적용하여 업로드 파일을 외부에서 접근 가능하도록 구성했습니다.
- AWS RDS(PostgreSQL)를 생성하고 Prisma를 통해 연결되도록 설정했습니다.
- AWS EC2에 Express 서버를 배포했습니다.
- pm2를 적용해 애플리케이션이 백그라운드에서 계속 실행되도록 설정했습니다.
- nginx를 리버스 프록시로 설정하여 80번 포트로 서비스되도록 구성했습니다.

## 배포 주소
- http://3.38.251.70

## 첨부 파일
- `/infra/s3/policy.png`
- `/infra/rds/secure-group-inbound.png`
- `/infra/rds/secure-group-outbound.png`
- `/infra/ec2/secure-group-inbound.png`
- `/infra/ec2/secure-group-outbound.png`
- `/infra/ec2/start.sh`
- `/infra/ec2/ecosystem.config.js`
- `/infra/ec2/nginx.conf`


- 인증 정보 및 민감 정보는 저장소에 포함하지 않았습니다.
- 운영 환경 변수는 서버 내부에서만 설정했습니다.

## 소감 
이번 레슨을 통해 단순히 서버를 실행하는 것을 넘어서, 실제 운영 환경에서 파일 저장소(S3), 데이터베이스(RDS), 서버(EC2), 프로세스 관리(pm2), 리버스 프록시(nginx)가 각각 어떤 역할을 하는지 이해할 수 있었습니다. 특히 환경 변수 관리와 보안 그룹 설정이 배포에서 얼마나 중요한지 직접 체감할 수 있었습니다.
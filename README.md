# 🐼 판다마켓 백엔드 스프린트 미션 10

이번 스프린트에서는 **AWS**를 활용하여 판다마켓 백엔드 서비스를 프로덕션 환경에 배포했습니다.  
S3를 통한 파일 업로드, RDS를 통한 데이터베이스 운영, EC2를 통한 서버 배포를 구현했습니다.

---

## 🛠️ 기술 스택

- **Server:** Node.js, Express, TypeScript
- **Database:** PostgreSQL (AWS RDS)
- **File Storage:** AWS S3
- **Deployment:** AWS EC2 (Ubuntu 24.04 LTS)
- **Process Manager:** pm2
- **Reverse Proxy:** nginx

---

## ✅ 요구사항 이행 현황

### 1. 기본 요구사항

- [x] **환경변수 설정:** 프로덕션 배포를 위한 환경변수 분리 구성
- [x] **AWS S3 적용:** S3 버킷 생성 및 퍼블릭 액세스 허용
- [x] **S3 버킷 정책 설정:** 일반 사용자가 업로드 파일에 접근 가능하도록 설정
- [x] **AWS IAM 액세스 키 발급:** EC2에서 S3 사용을 위한 키 발급
- [x] **프로덕션 S3 업로드:** `NODE_ENV=production` 환경에서 S3 업로드로 전환
- [x] **AWS RDS 적용:** PostgreSQL 프리티어 인스턴스 생성 및 보안 그룹 설정
- [x] **AWS EC2 배포:** Ubuntu 프리티어 인스턴스에 Express 서버 배포

### 2. 심화 요구사항

- [x] **pm2 프로세스 매니저:** pm2를 활용한 애플리케이션 실행 및 자동 재시작 설정
- [x] **nginx 리버스 프록시:** nginx를 통해 80번 포트로 서비스 제공

---

## 🌐 배포 정보

- **API 엔드포인트:** `http://13.239.116.195`
- **예시:** `http://13.239.116.195/products`

---

## ☁️ AWS 인프라 구성

| 서비스  | 내용                                      |
| ------- | ----------------------------------------- |
| **EC2** | Ubuntu 24.04 LTS, t2.micro (프리티어)     |
| **RDS** | PostgreSQL, db.t3.micro (프리티어)        |
| **S3**  | ap-northeast-2 (서울), 퍼블릭 액세스 허용 |
| **IAM** | S3FullAccess 권한의 전용 사용자 생성      |

---

## 💡 주요 구현 사항 및 트러블슈팅

### 1. 환경별 파일 업로드 분기 처리

- `NODE_ENV` 값에 따라 개발 환경에서는 로컬 디스크(`multer.diskStorage`), 프로덕션 환경에서는 AWS S3(`multer-s3`)를 사용하도록 분기 처리했습니다.

### 2. EC2 보안 그룹 충돌 해결

- EC2 인스턴스 생성 시 default 보안 그룹과 새로 생성한 보안 그룹이 중복 적용되어 인바운드 규칙 충돌이 발생했습니다. default 보안 그룹을 제거하여 해결했습니다.

### 3. nginx default 설정 충돌 해결

- nginx 설치 후 기본 `default` 설정 파일이 80포트를 선점하여 리버스 프록시가 동작하지 않는 문제가 발생했습니다. `sites-enabled/default`를 제거하여 해결했습니다.

### 4. pm2 자동 시작 설정

- EC2 인스턴스 재시작 시 서버가 자동으로 실행되도록 `pm2 startup` 및 `pm2 save`를 통해 systemd 서비스로 등록했습니다.

---

## 📁 infra 파일 구조

```
infra/
├── s3/
│   └── policy.png                    # S3 버킷 정책 스크린샷
├── rds/
│   ├── secure-group-inbound.png      # RDS 보안그룹 인바운드
│   └── secure-group-outbound.png     # RDS 보안그룹 아웃바운드
└── ec2/
    ├── secure-group-inbound.png      # EC2 보안그룹 인바운드
    ├── secure-group-outbound.png     # EC2 보안그룹 아웃바운드
    ├── start.sh                      # pm2 실행 명령어
    ├── ecosystem.config.js           # pm2 설정 파일
    └── nginx.conf                    # nginx 설정 파일
```

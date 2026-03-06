판다마켓 실시간 알람 스프린트 미션 8 

기능 : 사용자 알람 관리 (조회 ㅡ 읽음 처리)
      실시간 알람 전송 (가격변동 , 댓글 )
아키텍처 및 설계 
전체 구조도 : 클라이언트 ㅡ Express 서버 ㅡ 데이터베이스 
계층구조 : 
Routes Layer (Rest API)
Controller Layer (비지니스 로직)
Socket.IO Layer (실시간)
Data Layer (저장소 관리)

프로젝트 구조 :
scr/
     type/ 데이터 타입 정의
     schemas/ 유효성 검사 및 헬퍼
     controllers/ 비지니스 로직
     routes/ Rest API 엔드포인트
     socket/ webSocket 이벤트 
     utils/ 저장소 및 연결 관리
     client/ 클라이언트 라이브러리 


데이터 흐름 
알림 조회 : Rest API 로 HTTP 요청
실시간 수신 : Socket.IO로 Websocket 양방향 통신
읽음 처리 : Socket.IO 또는 Rest Api 선택 가능

GET    /api/notifications               # 알림 목록
GET    /api/notifications/unread-count  # 읽지 않은 개수
POST   /api/notifications/:id/read      # 읽음 처리
POST   /api/notifications/price-change  # 가격 변동 알림
POST   /api/notifications/new-comment   # 댓글 알림

websocket 이벤트 

클라이언트 → 서버:
join
mark-as-read
mark-all-as-read

서버 → 클라이언트:
 unread-count
 unread-notifications
 notification

판다마켓 계속 하던건 컴퓨터 용량이 부족하여서 날아간거 같습니다 . 그래서 따로 socket io 부분만 진행 했습니다 . 
처음이라서 막히는 부분이 많아 제미나이 학습 가이드 모드로 설명을 들어가면서 하나하나 구현해봤습니다 ... 


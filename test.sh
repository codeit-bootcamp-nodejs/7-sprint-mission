#!/bin/bash
set -euo pipefail

############################
# Config
############################
BASE_URL="${BASE_URL:-http://localhost:3000}"
UNIQUE_ID=$(date +%s)
EMAIL="user-$UNIQUE_ID@example.com"
PASSWORD="password123"
NEW_PASSWORD="newpassword567"
NICKNAME="tester"

PASSED=0
FAILED=0

############################
# Utils
############################
log() { echo -e "\n\033[1;34m▶ $1\033[0m"; }
success() { echo -e "\033[1;32m✔ SUCCESS\033[0m"; ((PASSED++)) || true; }
fail() { echo -e "\033[1;31m✘ FAIL: $1\033[0m"; ((FAILED++)) || true; }

api_call() {
  local method=$1
  local endpoint=$2
  local data=${3:-}
  local token=${4:-}
  
  if [[ -n "$data" ]]; then
    curl -s -w "\n%{http_code}" -X "$method" \
      -H "Content-Type: application/json" \
      ${token:+-H "Authorization: Bearer $token"} \
      -d "$data" "$BASE_URL$endpoint"
  else
    curl -s -w "\n%{http_code}" -X "$method" \
      ${token:+-H "Authorization: Bearer $token"} \
      "$BASE_URL$endpoint"
  fi
}

check_status() {
  local response=$1
  local expected=$2
  local status=$(echo "$response" | tail -1)
  local body=$(echo "$response" | sed '$d')

  if [[ "$status" == "$expected" ]]; then
    success
    echo "Response: $body"
  else
    fail "Expected $expected, got $status"
    echo "Response: $body"
  fi
}

########################################################
# 1. 인증 (Authentication) 및 심화(Refresh Token)
########################################################
log "1-1. Signup: Success [미션: 회원가입 API & 비밀번호 해싱]"
RES=$(api_call POST "/users/signup" "{\"email\":\"$EMAIL\",\"nickname\":\"$NICKNAME\",\"password\":\"$PASSWORD\"}")
check_status "$RES" "201"

log "1-2. Signin: Success [미션: Access Token 발급]"
RES=$(api_call POST "/users/signin" "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")
check_status "$RES" "200"
BODY=$(echo "$RES" | sed '$d')
ACCESS_TOKEN=$(echo "$BODY" | jq -r '.accessToken')
REFRESH_TOKEN=$(echo "$BODY" | jq -r '.refreshToken')

log "1-3. Token Refresh [심화: Refresh Token으로 토큰 갱신]"
RES=$(api_call POST "/users/refresh" "{\"refreshToken\":\"$REFRESH_TOKEN\"}")
check_status "$RES" "200"
ACCESS_TOKEN=$(echo "$RES" | sed '$d' | jq -r '.accessToken')

########################################################
# 2. 유저 정보 (User Info)
########################################################
log "2-1. Get My Profile [미션: 정보 조회 & 비밀번호 노출 금지]"
RES=$(api_call GET "/users/me" "" "$ACCESS_TOKEN")
check_status "$RES" "200"
if echo "$RES" | grep -q '"password"'; then fail "비밀번호 필드가 응답에 포함됨!"; fi

log "2-2. Update My Profile [미션: 정보 수정]"
RES=$(api_call PATCH "/users/me" "{\"nickname\":\"updated_nick\"}" "$ACCESS_TOKEN")
check_status "$RES" "200"

log "2-3. Change Password [미션: 비밀번호 변경]"
RES=$(api_call PATCH "/users/me/password" "{\"currentPassword\":\"$PASSWORD\",\"newPassword\":\"$NEW_PASSWORD\"}" "$ACCESS_TOKEN")
check_status "$RES" "204"
PASSWORD=$NEW_PASSWORD

########################################################
# 3. 상품/게시글/댓글 인가 (Authorization)
########################################################
log "3-1. Create Product [미션: 로그인 유저만 상품 등록]"
RES=$(api_call POST "/products" "{\"name\":\"아이패드\",\"description\":\"M4\",\"price\":1500000,\"tags\":[\"애플\"],\"images\":[]}" "$ACCESS_TOKEN")
check_status "$RES" "201"
PRODUCT_ID=$(echo "$RES" | sed '$d' | jq -r '.id')

log "3-2. Create Article [미션: 로그인 유저만 게시글 등록]"
RES=$(api_call POST "/articles" "{\"title\":\"공지\",\"content\":\"내용\",\"image\":\"\"}" "$ACCESS_TOKEN")
check_status "$RES" "201"
ARTICLE_ID=$(echo "$RES" | sed '$d' | jq -r '.id')

log "3-3. Create Comment on Product [미션: 상품에 댓글 등록]"
RES=$(api_call POST "/products/$PRODUCT_ID/comments" "{\"content\":\"좋은 물건이네요\"}" "$ACCESS_TOKEN")
check_status "$RES" "201"

log "3-4. Create Comment on Article [미션: 게시글에 댓글 등록]"
RES=$(api_call POST "/articles/$ARTICLE_ID/comments" "{\"content\":\"동의합니다\"}" "$ACCESS_TOKEN")
check_status "$RES" "201"
COMMENT_ID=$(echo "$RES" | sed '$d' | jq -r '.id')

########################################################
# 4. 좋아요 기능 (Likes - 심화)
########################################################
log "4-1. Product Like/Unlike [심화: 상품 좋아요/취소]"
RES=$(api_call POST "/products/$PRODUCT_ID/like" "" "$ACCESS_TOKEN")
check_status "$RES" "200"

log "4-2. Article Like/Unlike [심화: 게시글 좋아요/취소]"
RES=$(api_call POST "/articles/$ARTICLE_ID/like" "" "$ACCESS_TOKEN")
check_status "$RES" "200"

log "4-3. Check isLiked [심화: 상세 조회 시 isLiked 필드 확인]"
RES=$(api_call GET "/articles/$ARTICLE_ID" "" "$ACCESS_TOKEN")
if echo "$RES" | grep -q '"isLiked":true'; then success; else fail "isLiked 필드 누락"; fi

log "4-4. My Liked Products [심화: 좋아요 한 상품 목록 조회]"
RES=$(api_call GET "/users/me/liked-products" "" "$ACCESS_TOKEN")
check_status "$RES" "200"

log "4-5. My Products [미션: 내가 등록한 상품 목록 조회]"
RES=$(api_call GET "/users/me/products" "" "$ACCESS_TOKEN")
check_status "$RES" "200"

########################################################
# 5. 삭제 및 권한 마무리 (Cleanup)
########################################################
log "5-1. Delete Comment [미션: 댓글 삭제 권한]"
RES=$(api_call DELETE "/comments/$COMMENT_ID" "" "$ACCESS_TOKEN")
check_status "$RES" "204"

log "5-2. Delete Article [미션: 게시글 삭제 권한]"
RES=$(api_call DELETE "/articles/$ARTICLE_ID" "" "$ACCESS_TOKEN")
check_status "$RES" "204"

############################
# Summary
############################
echo -e "\n========================================="
echo -e "\033[1;36m판다마켓 전 항목 검증 요약\033[0m"
echo -e "========================================="
echo -e "총 테스트: $((PASSED + FAILED))"
echo -e "\033[1;32m성공: $PASSED\033[0m"
echo -e "\033[1;31m실패: $FAILED\033[0m"
echo -e "=========================================\n"

if [[ $FAILED -eq 0 ]]; then
  echo -e "\033[1;32m🎉 모든 요구사항(기본+심화)이 완벽히 통과되었습니다!\033[0m"
  exit 0
else
  exit 1
fi
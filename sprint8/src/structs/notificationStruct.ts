import { coerce, number, object, string,  optional }from 'superstruct';

//알림 목록 조회 쿼리 
export const GetNotificationsQuery = object({
  // 문자열로 들어온 값을 숫자로 변환
  cursor: optional(coerce(number(), string(), (value) => Number(value))),
  limit: optional(coerce(number(), string(), (value) => Number(value))),
});

// 알림 읽음 처리 파라미터 
export const NotificationIdParams = object({
  id: coerce(number(), string(), (value) => Number(value)),
});
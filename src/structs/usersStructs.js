import { nonempty, object, string, optional, size } from 'superstruct';

// 내 정보 수정 (닉네임, 이미지)
export const UpdateMeStruct = object({
  nickname: optional(nonempty(string())),
  image: optional(string()),
});

// 비밀번호 변경
export const ChangePasswordStruct = object({
  currentPassword: nonempty(string()),
  newPassword: size(string(), 8, 100), // 최소 8자 이상
});
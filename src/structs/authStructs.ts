import { coerce, object, string, nonempty, optional } from 'superstruct';

export const LoginBodyStruct = object({
    // 이메일: 공백을 제거하고, 비어있지 않은 문자열인지 확인
    email: coerce(nonempty(string()), string(), (value) => value.trim()),

    // 비밀번호: 비어있지 않은 문자열인지 확인
    password: nonempty(string()),
});

// 회원가입용도 필요하다면 아래처럼 구성할 수 있습니다.
export const RegisterBodyStruct = object({
    email: coerce(nonempty(string()), string(), (value) => value.trim()),
    nickname: coerce(nonempty(string()), string(), (value) => value.trim()),
    password: nonempty(string()),
});

export const UpdateMeBodyStruct = object({
    nickname: optional(string()),
    email: optional(string()),
});

export const ChangePasswordBodyStruct = object({
    currentPassword: string(),
    newPassword: string(),
});

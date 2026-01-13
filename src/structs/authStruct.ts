import { nonempty, object, string, Infer } from 'superstruct';

export const registerBodyStruct = object({
    email: nonempty(string()),
    nickname: nonempty(string()),
    password: nonempty(string()),
});

export const loginBodyStruct = object({
    email: nonempty(string()),
    password: nonempty(string()),
});

export type RegisterBody = Infer<typeof registerBodyStruct>;
export type LoginBody = Infer<typeof loginBodyStruct>;
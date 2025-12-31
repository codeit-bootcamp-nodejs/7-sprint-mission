import { coerce, nonempty, nullable, object, partial, string } from 'superstruct';
import { PageParamsStruct } from './commonStructs.js';

export const registerBodyStruct = object({
    email: nonempty(string()),
    nickname: nonempty(string()),
    password: nonempty(string()),
});

export const loginBodyStruct = object({
    email: nonempty(string()),
    password: nonempty(string()),
});
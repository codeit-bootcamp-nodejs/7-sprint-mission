import { coerce, defaulted, enums, integer, nonempty, object, optional, string } from 'superstruct';

/** Convert string to integer then validate it */
const integerString = coerce(integer(), string(), (value) => parseInt(value));

export const IdIntegerParamsStruct = object({
    id: integerString,
});

export const IdParamsStruct = object({
    id: nonempty(string()),
});

export const CommentParamsStruct = object({
    id: nonempty(string()),
    targetId: nonempty(string()),
});

export const PageParamsStruct = object({
    page: defaulted(integerString, 1),
    pageSize: defaulted(integerString, 10),
    orderBy: optional(enums(['recent'])),
    keyword: optional(nonempty(string())),
});

export const CursorParamsStruct = object({
    //cursor: defaulted(integerString, 0),
    cursor: defaulted(string(), ''),
    limit: defaulted(integerString, 10),
    orderBy: optional(enums(['recent'])),
    keyword: optional(nonempty(string())),
});

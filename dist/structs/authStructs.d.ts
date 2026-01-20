export declare const RegisterBodyStruct: import("superstruct").Struct<{
    password: string;
    email: string;
    nickname: string;
}, {
    email: import("superstruct").Struct<string, null>;
    nickname: import("superstruct").Struct<string, null>;
    password: import("superstruct").Struct<string, null>;
}>;
export declare const LoginBodyStruct: import("superstruct").Struct<{
    password: string;
    email: string;
}, {
    email: import("superstruct").Struct<string, null>;
    password: import("superstruct").Struct<string, null>;
}>;
//# sourceMappingURL=authStructs.d.ts.map
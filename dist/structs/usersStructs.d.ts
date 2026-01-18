export declare const UpdateMeBodyStruct: import("superstruct").Struct<{
    image?: string | null | undefined;
    email?: string | undefined;
    nickname?: string | undefined;
}, import("superstruct/dist/utils.js").PartialObjectSchema<{
    email: import("superstruct").Struct<string, null>;
    nickname: import("superstruct").Struct<string, null>;
    image: import("superstruct").Struct<string | null, null>;
}>>;
export declare const UpdatePasswordBodyStruct: import("superstruct").Struct<{
    password: string;
    newPassword: string;
}, {
    password: import("superstruct").Struct<string, null>;
    newPassword: import("superstruct").Struct<string, null>;
}>;
export declare const GetMyProductListParamsStruct: import("superstruct").Struct<{
    page: number;
    pageSize: number;
    orderBy?: "recent" | undefined;
    keyword?: string | undefined;
}, {
    page: import("superstruct").Struct<number, null>;
    pageSize: import("superstruct").Struct<number, null>;
    orderBy: import("superstruct").Struct<"recent" | undefined, {
        recent: "recent";
    }>;
    keyword: import("superstruct").Struct<string | undefined, null>;
}>;
export declare const GetMyFavoriteListParamsStruct: import("superstruct").Struct<{
    page: number;
    pageSize: number;
    orderBy?: "recent" | undefined;
    keyword?: string | undefined;
}, {
    page: import("superstruct").Struct<number, null>;
    pageSize: import("superstruct").Struct<number, null>;
    orderBy: import("superstruct").Struct<"recent" | undefined, {
        recent: "recent";
    }>;
    keyword: import("superstruct").Struct<string | undefined, null>;
}>;
//# sourceMappingURL=usersStructs.d.ts.map
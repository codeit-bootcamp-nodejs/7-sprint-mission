export declare const IdParamsStruct: import("superstruct").Struct<{
    id: number;
}, {
    id: import("superstruct").Struct<number, null>;
}>;
export declare const PageParamsStruct: import("superstruct").Struct<{
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
export declare const CursorParamsStruct: import("superstruct").Struct<{
    cursor: number;
    limit: number;
    orderBy?: "recent" | undefined;
    keyword?: string | undefined;
}, {
    cursor: import("superstruct").Struct<number, null>;
    limit: import("superstruct").Struct<number, null>;
    orderBy: import("superstruct").Struct<"recent" | undefined, {
        recent: "recent";
    }>;
    keyword: import("superstruct").Struct<string | undefined, null>;
}>;
//# sourceMappingURL=commonStructs.d.ts.map
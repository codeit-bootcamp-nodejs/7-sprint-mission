export declare const CreateCommentBodyStruct: import("superstruct").Struct<{
    content: string;
}, {
    content: import("superstruct").Struct<string, null>;
}>;
export declare const GetCommentListParamsStruct: import("superstruct").Struct<{
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
export declare const UpdateCommentBodyStruct: import("superstruct").Struct<{
    content?: string | undefined;
}, import("superstruct/dist/utils.js").PartialObjectSchema<{
    content: import("superstruct").Struct<string, null>;
}>>;
//# sourceMappingURL=commentsStruct.d.ts.map
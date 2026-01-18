export declare const GetArticleListParamsStruct: import("superstruct").Struct<{
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
export declare const CreateArticleBodyStruct: import("superstruct").Struct<{
    title: string;
    content: string;
    image: string | null;
}, {
    title: import("superstruct").Struct<string, null>;
    content: import("superstruct").Struct<string, null>;
    image: import("superstruct").Struct<string | null, null>;
}>;
export declare const UpdateArticleBodyStruct: import("superstruct").Struct<{
    title?: string | undefined;
    content?: string | undefined;
    image?: string | null | undefined;
}, import("superstruct/dist/utils.js").PartialObjectSchema<{
    title: import("superstruct").Struct<string, null>;
    content: import("superstruct").Struct<string, null>;
    image: import("superstruct").Struct<string | null, null>;
}>>;
//# sourceMappingURL=articlesStructs.d.ts.map
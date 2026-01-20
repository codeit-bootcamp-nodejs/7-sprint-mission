export declare const CreateProductBodyStruct: import("superstruct").Struct<{
    name: string;
    description: string;
    price: number;
    tags: string[];
    images: string[];
}, {
    name: import("superstruct").Struct<string, null>;
    description: import("superstruct").Struct<string, null>;
    price: import("superstruct").Struct<number, null>;
    tags: import("superstruct").Struct<string[], import("superstruct").Struct<string, null>>;
    images: import("superstruct").Struct<string[], import("superstruct").Struct<string, null>>;
}>;
export declare const GetProductListParamsStruct: import("superstruct").Struct<{
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
export declare const UpdateProductBodyStruct: import("superstruct").Struct<{
    name?: string | undefined;
    description?: string | undefined;
    price?: number | undefined;
    tags?: string[] | undefined;
    images?: string[] | undefined;
}, import("superstruct/dist/utils.js").PartialObjectSchema<{
    name: import("superstruct").Struct<string, null>;
    description: import("superstruct").Struct<string, null>;
    price: import("superstruct").Struct<number, null>;
    tags: import("superstruct").Struct<string[], import("superstruct").Struct<string, null>>;
    images: import("superstruct").Struct<string[], import("superstruct").Struct<string, null>>;
}>>;
//# sourceMappingURL=productsStruct.d.ts.map
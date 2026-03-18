import { z } from "zod";
export declare const CreateArticle: z.ZodObject<{
    title: z.ZodString;
    content: z.ZodString;
    image: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString>>>;
}, z.core.$strip>;
export declare const GetArticleList: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    pageSize: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    orderBy: z.ZodOptional<z.ZodEnum<{
        recent: "recent";
    }>>;
    keyword: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const UpdateArticle: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
    image: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString>>>>;
}, z.core.$strip>;
//# sourceMappingURL=articles.d.ts.map
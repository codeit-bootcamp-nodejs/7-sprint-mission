import { z } from "zod";
export declare const CreateComment: z.ZodObject<{
    content: z.ZodString;
}, z.core.$strip>;
export declare const GetCommentListParams: z.ZodObject<{
    cursor: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>>;
    limit: z.ZodDefault<z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>>;
    orderBy: z.ZodOptional<z.ZodEnum<{
        recent: "recent";
    }>>;
    keyword: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const UpdateComment: z.ZodObject<{
    content: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
//# sourceMappingURL=comments.d.ts.map
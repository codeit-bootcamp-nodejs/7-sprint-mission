import { z } from "zod";
export declare const IdParams: z.ZodObject<{
    id: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>;
export declare const PageParams: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    pageSize: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    orderBy: z.ZodOptional<z.ZodEnum<{
        recent: "recent";
    }>>;
    keyword: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const CursorParams: z.ZodObject<{
    cursor: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>>;
    limit: z.ZodDefault<z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>>;
    orderBy: z.ZodOptional<z.ZodEnum<{
        recent: "recent";
    }>>;
    keyword: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
//# sourceMappingURL=commons.d.ts.map
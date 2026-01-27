import { z } from "zod";
export declare const GetproductParams: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    pageSize: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    orderBy: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        recent: "recent";
        old: "old";
    }>>>;
}, z.core.$strip>;
export declare const UpdateMe: z.ZodObject<{
    nickname: z.ZodOptional<z.ZodString>;
    image: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const ChangePassword: z.ZodObject<{
    currentPassword: z.ZodString;
    newPassword: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=user.d.ts.map
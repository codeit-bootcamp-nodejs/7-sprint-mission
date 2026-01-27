import { z } from "zod";
export declare const RegisterBody: z.ZodObject<{
    email: z.ZodString;
    nickname: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const LoginBody: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=auth.d.ts.map
import { z } from "zod";
export declare const CreateProduct: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    price: z.ZodCoercedNumber<unknown>;
    tags: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    images: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString>>>;
}, z.core.$strip>;
export declare const GetProductList: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    pageSize: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    orderBy: z.ZodOptional<z.ZodEnum<{
        recent: "recent";
    }>>;
    keyword: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const UpdateProduct: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    price: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    tags: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString>>>>;
    images: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString>>>>;
}, z.core.$strip>;
//# sourceMappingURL=products.d.ts.map
import { z } from "zod";
import { PageParams } from "./commons.js";

export const CreateProduct = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.coerce.number().int().min(0),
  tags: z.array(z.string()).optional().default([]),
  images: z.array(z.string()).optional().default([]),
});

export const GetProductList = PageParams;

export const UpdateProduct = CreateProduct.partial();

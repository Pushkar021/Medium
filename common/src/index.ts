import z from "zod";

export const validatrUserSchema = z.object({
  email: z.string(),
  name: z.string(),
  password: z.string().min(5, "enter at least 5 chars password"),
});

export const validatrUserSchema2 = z.object({
  email: z.string(),
  password: z.string(),
});

export const createBlogSchema = z.object({
  title: z.string(),
  content: z.string(),
});

export const updateBlogSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
});


export type ValidatrUser = z.infer<typeof validatrUserSchema>;
export type ValidatrUser2 = z.infer<typeof validatrUserSchema2>;
export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;

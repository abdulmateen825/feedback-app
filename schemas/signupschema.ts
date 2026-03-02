import { z } from "zod";

export const signupSchema = z.object({
  username: z
    .string()
    .min(2, "Username must contain at least 2 characters")
    .max(20, "Username cannot exceed 20 characters")
    .regex(/^[a-zA-Z0-9]+$/, "Username must contain only letters and numbers"),

  email: z
    .string()
    .email("Email must be valid"),

  password: z
    .string()
    .min(6, "Password must contain at least 6 characters"),
});

import * as z from "zod";
import { Gender } from "../../enum/user.enum.js";

export const registerSchema = z
  .object({
    name: z
      .string({ error: "Name is required" })
      .min(3, { message: "Name must be at least 3 characters" })
      .max(50, { message: "Name must be at most 50 characters" })
      .trim(),

    phone: z
      .string({ error: "Phone is required" })
      .trim()
      .min(10, { message: "Invalid phone number" }),

    email: z
      .email({ message: "Invalid email format" })
      .toLowerCase()
      .trim()
      .optional(),

    password: z
      .string({ error: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters" }),

    rePassword: z
      .string({ error: "Confirmation password is required" })
      .min(1, { message: "Confirmation password is required" }),

    dateOfBirth: z.coerce.date({
      error: "Date of birth is required",
    }),

    gender: z.enum(Gender, {
      error: "Gender is required",
    }),
  })
  .strict()
  .refine((data) => data.password === data.rePassword, {
    message: "Passwords do not match",
    path: ["rePassword"],
  });

export const loginSchema = z
  .object({
    phone: z
      .string({ error: "Phone is required" })
      .trim()
      .min(10, { message: "Invalid phone number" }),

    password: z
      .string({ error: "Password is required" })
      .min(1, { message: "Password is required" }),

    fcmToken: z.string().trim().optional(),
  })
  .strict();

export const changePasswordSchema = z
  .object({
    oldPassword: z
      .string({ error: "Old password is required" })
      .min(1, { message: "Old password is required" }),

    newPassword: z
      .string({ error: "New password is required" })
      .min(8, { message: "New password must be at least 8 characters" }),
  })
  .strict()
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "New password must be different from the old password",
    path: ["newPassword"],
  });

export type RegisterI = z.infer<typeof registerSchema>;
export type LoginI = z.infer<typeof loginSchema>;
export type ChangePasswordI = z.infer<typeof changePasswordSchema>;

import * as z from "zod";

export const registerSchema = z
  .object({
    name: z
      .string({ required_error: "Name is required" })
      .min(3, { message: "Name must be at least 3 characters" })
      .max(50, { message: "Name must be at most 50 characters" })
      .trim(),

    phone: z
      .string({ required_error: "Phone is required" })
      .trim()
      .regex(/^01[0125][0-9]{8}$/, {
        message: "Invalid Egyptian phone number",
      }),

    email: z
      .string()
      .email({ message: "Invalid email format" })
      .toLowerCase()
      .trim()
      .optional()
      .or(z.literal(""))
      .transform((val) => (val === "" || !val ? undefined : val)),

    password: z
      .string({ required_error: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters" }),

    rePassword: z
      .string({ required_error: "Confirmation password is required" })
      .min(1, { message: "Confirmation password is required" }),

    dateOfBirth: z.coerce.date({
      required_error: "Date of birth is required",
      invalid_type_error: "Date of birth is required",
    }),

    gender: z.enum(["MALE", "FEMALE"], {
      required_error: "Gender is required",
      message: "Gender is required",
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
      .string({ required_error: "Phone is required" })
      .trim()
      .min(10, { message: "Invalid phone number" }),

    password: z
      .string({ required_error: "Password is required" })
      .min(1, { message: "Password is required" }),

    fcmToken: z.string().trim().optional(),
  })
  .strict();

export const changePasswordSchema = z
  .object({
    oldPassword: z
      .string({ required_error: "Old password is required" })
      .min(1, { message: "Old password is required" }),

    newPassword: z
      .string({ required_error: "New password is required" })
      .min(8, { message: "New password must be at least 8 characters" }),
  })
  .strict()
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "New password must be different from the old password",
    path: ["newPassword"],
  });

export type RegisterType = z.infer<typeof registerSchema>;
export type LoginType = z.infer<typeof loginSchema>;
export type ChangePasswordType = z.infer<typeof changePasswordSchema>;

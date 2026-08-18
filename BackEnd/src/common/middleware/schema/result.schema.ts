import * as z from "zod";

const resultParameterSchema = z
  .object({
    parameter: z
      .string({ error: "Parameter name is required" })
      .trim()
      .min(1, { message: "Parameter name cannot be empty" }),

    value: z.union([
      z.number(),
      z.string().trim().min(1, { message: "Parameter value cannot be empty" }),
    ]),
  })
  .strict();

export const createResultSchema = z
  .object({
    parameters: z
      .array(resultParameterSchema)
      .min(1, { message: "At least one parameter is required" }),

    note: z.string().trim().optional(),
  })
  .strict();

export type CreateResultI = z.infer<typeof createResultSchema>;

const updateParameterSchema = z
  .object({
    parameter: z
      .string({ error: "Parameter name is required" })
      .trim()
      .min(1, { message: "Parameter name cannot be empty" }),

    value: z.union([
      z.number(),
      z.string().trim().min(1, { message: "Parameter value cannot be empty" }),
    ]),
  })
  .strict();

export const updateResultSchema = z
  .object({
    parameters: z
      .array(updateParameterSchema)
      .min(1, { message: "At least one parameter is required" })
      .optional(),

    note: z.string().trim().optional(),
  })
  .strict();

export type UpdateResultI = z.infer<typeof updateResultSchema>;

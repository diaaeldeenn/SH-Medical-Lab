import * as z from "zod";
import {
  EvaluationType,
  ParameterType,
  SampleType,
} from "../../enum/test.enum.js";
import { Gender } from "../../enum/user.enum.js";

const referenceRangeSchema = z
  .object({
    gender: z.enum(Gender).optional(),

    minAge: z
      .number()
      .min(0, { message: "Minimum age cannot be negative" })
      .optional(),

    maxAge: z
      .number()
      .min(0, { message: "Maximum age cannot be negative" })
      .optional(),

    min: z.number().optional(),

    max: z.number().optional(),
  })
  .strict()
  .refine(
    (data) =>
      (data.min !== undefined && data.max !== undefined) ||
      (data.min === undefined && data.max === undefined),
    {
      message: "Min and max must be provided together",
      path: ["min"],
    },
  );

const evaluationLogicSchema = z
  .object({
    type: z.enum(EvaluationType),

    normalValues: z.array(z.string().trim()).optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (
      data.type === EvaluationType.NORMAL_VALUES &&
      !data.normalValues?.length
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["normalValues"],
        message: "Normal values are required for normal-values evaluation",
      });
    }

    if (data.type === EvaluationType.RANGE && data.normalValues) {
      ctx.addIssue({
        code: "custom",
        path: ["normalValues"],
        message: "Normal values are not allowed for range evaluation",
      });
    }
  });

const parameterSchema = z
  .object({
    name: z
      .string({ error: "Parameter name is required" })
      .trim()
      .min(1, "Parameter name is required"),

    type: z.enum(ParameterType),

    unit: z.string().trim().optional(),

    options: z
      .array(z.string().trim())
      .min(1, "Options cannot be empty")
      .optional(),

    referenceRanges: z
      .array(referenceRangeSchema)
      .min(1, "Reference ranges cannot be empty")
      .optional(),

    evaluationLogic: evaluationLogicSchema.optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.type === ParameterType.SELECT) {
      if (!data.options?.length) {
        ctx.addIssue({
          code: "custom",
          path: ["options"],
          message: "Options are required for select parameters",
        });
      }
    }

    if (data.type === ParameterType.POSITIVE_NEGATIVE) {
      if (!data.options?.length) {
        ctx.addIssue({
          code: "custom",
          path: ["options"],
          message: "Options are required for positive-negative parameters",
        });
      }
    }

    if (data.type === ParameterType.NUMBER) {
      if (!data.evaluationLogic) {
        ctx.addIssue({
          code: "custom",
          path: ["evaluationLogic"],
          message: "Evaluation logic is required for number parameters",
        });
      }

      if (
        data.evaluationLogic?.type === EvaluationType.RANGE &&
        !data.referenceRanges?.length
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["referenceRanges"],
          message: "Reference ranges are required for range evaluation",
        });
      }
    }

    if (data.type === ParameterType.TEXT) {
      if (data.options?.length) {
        ctx.addIssue({
          code: "custom",
          path: ["options"],
          message: "Text parameters cannot have options",
        });
      }

      if (data.referenceRanges?.length) {
        ctx.addIssue({
          code: "custom",
          path: ["referenceRanges"],
          message: "Text parameters cannot have reference ranges",
        });
      }
    }
  });

export const createTestSchema = z
  .object({
    nameAr: z
      .string({ error: "Arabic name is required" })
      .trim()
      .min(2, "Arabic name must be at least 2 characters"),

    medicalName: z
      .string({ error: "Medical name is required" })
      .trim()
      .min(2, "Medical name must be at least 2 characters"),

    code: z
      .string({ error: "Test code is required" })
      .trim()
      .toUpperCase()
      .min(2, "Test code is required"),

    category: z.string({ error: "Category is required" }).trim(),

    price: z
      .number({ error: "Price is required" })
      .min(0, "Price cannot be negative"),

    sampleType: z.enum(SampleType),

    parameters: z
      .array(parameterSchema)
      .min(1, "Test must contain at least one parameter"),
  })
  .strict();

export const updateTestSchema = createTestSchema.partial().strict();

export type CreateTestI = z.infer<typeof createTestSchema>;
export type UpdateTestI = z.infer<typeof updateTestSchema>;

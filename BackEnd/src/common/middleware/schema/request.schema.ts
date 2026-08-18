import * as z from "zod";
import { RequestStatus, TestStatus } from "../../enum/request.enum.js";
import { SampleType } from "../../enum/test.enum.js";

export const createLabRequestSchema = z
  .object({
    tests: z
      .array(
        z
          .string({ error: "Test ID is required" })
          .trim()
          .min(1, { message: "Invalid Test ID" }),
      )
      .min(1, { message: "At least one test is required" }),

    appointment: z
      .object({
        appointmentDate: z.coerce.date({
          error: "Appointment date is required",
        }),

        appointmentTime: z
          .string({ error: "Appointment time is required" })
          .trim()
          .min(1, { message: "Appointment time is required" }),
      })
      .strict(),
  })
  .strict();

export type CreateLabRequestI = z.infer<typeof createLabRequestSchema>;

export const updateAppointmentSchema = z
  .object({
    appointmentDate: z.coerce.date().optional(),

    appointmentTime: z
      .string()
      .trim()
      .min(1, { message: "Appointment time cannot be empty" })
      .optional(),
  })
  .strict();

export type UpdateAppointmentI = z.infer<typeof updateAppointmentSchema>;

export const updateRequestStatusSchema = z
  .object({
    status: z.enum(RequestStatus, {
      error: "Invalid request status",
    }),
  })
  .strict();

export type UpdateRequestStatusI = z.infer<typeof updateRequestStatusSchema>;

export const updateTestStatusSchema = z
  .object({
    status: z.enum(TestStatus, {
      error: "Invalid test status",
    }),
  })
  .strict();


export type UpdateTestStatusI = z.infer<typeof updateTestStatusSchema>;

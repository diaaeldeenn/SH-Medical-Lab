import { Router } from "express";
import LabRequestService from "./request.service.js";
import { schema } from "../../common/middleware/schema/schema.js";
import {
  createLabRequestSchema,
  updateAppointmentSchema,
  updateTestStatusSchema,
} from "../../common/middleware/schema/request.schema.js";
import {
  authentication,
  authorization,
} from "../../common/middleware/auth.middleware.js";
import { UserRole } from "../../common/enum/user.enum.js";

const requestRouter = Router({
  caseSensitive: true,
  strict: true,
});

requestRouter.get(
  "/",
  authentication,
  authorization([UserRole.SPECIALIST]),
  LabRequestService.getAllRequests,
);

requestRouter.post(
  "/",
  authentication,
  authorization([UserRole.PATIENT]),
  schema(createLabRequestSchema),
  LabRequestService.createRequest,
);

requestRouter.get(
  "/my",
  authentication,
  authorization([UserRole.PATIENT]),
  LabRequestService.getMyRequests,
);

requestRouter.get(
  "/:requestId",
  authentication,
  LabRequestService.getRequestById,
);

requestRouter.patch(
  "/:requestId/appointment",
  authentication,
  authorization([UserRole.PATIENT]),
  schema(updateAppointmentSchema),
  LabRequestService.updateAppointment,
);

requestRouter.patch(
  "/:requestId/cancel",
  authentication,
  authorization([UserRole.PATIENT]),
  LabRequestService.cancelRequest,
);

requestRouter.patch(
  "/:requestId/attend",
  authentication,
  authorization([UserRole.SPECIALIST]),
  LabRequestService.attendRequest,
);

requestRouter.patch(
  "/:requestId/sample",
  authentication,
  authorization([UserRole.SPECIALIST]),
  LabRequestService.collectSample,
);

requestRouter.patch(
  "/:requestId/start",
  authentication,
  authorization([UserRole.SPECIALIST]),
  LabRequestService.startProcessing,
);

requestRouter.patch(
  "/:requestId/tests/:testId/status",
  authentication,
  authorization([UserRole.SPECIALIST]),
  schema(updateTestStatusSchema),
  LabRequestService.updateTestStatus,
);

requestRouter.patch(
  "/:requestId/complete",
  authentication,
  authorization([UserRole.SPECIALIST]),
  LabRequestService.completeRequest,
);

export default requestRouter;

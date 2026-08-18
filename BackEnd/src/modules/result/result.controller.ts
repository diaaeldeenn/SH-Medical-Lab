import { Router } from "express";
import ResultService from "./result.service.js";
import { schema } from "../../common/middleware/schema/schema.js";
import {
  createResultSchema,
  updateResultSchema,
} from "../../common/middleware/schema/result.schema.js";
import {
  authentication,
  authorization,
} from "../../common/middleware/auth.middleware.js";
import { UserRole } from "../../common/enum/user.enum.js";

const resultRouter = Router({
  caseSensitive: true,
  strict: true,
});

resultRouter.get(
  "/",
  authentication,
  authorization([UserRole.SPECIALIST]),
  ResultService.getResults,
);

resultRouter.get(
  "/requests/:requestId",
  authentication,
  ResultService.getResultsByRequest,
);

resultRouter.get(
  "/requests/:requestId/tests/:testId/pdf",
  authentication,
  ResultService.downloadResultPDF,
);

resultRouter.post(
  "/requests/:requestId/tests/:testId",
  authentication,
  authorization([UserRole.SPECIALIST]),
  schema(createResultSchema),
  ResultService.createResult,
);

resultRouter.patch(
  "/:resultId/lock",
  authentication,
  authorization([UserRole.SPECIALIST]),
  ResultService.lockResult,
);

resultRouter.get("/:resultId", authentication, ResultService.getResultById);

resultRouter.patch(
  "/:resultId",
  authentication,
  authorization([UserRole.SPECIALIST]),
  schema(updateResultSchema),
  ResultService.updateResult,
);

resultRouter.delete(
  "/:resultId",
  authentication,
  authorization([UserRole.SPECIALIST]),
  ResultService.deleteResult,
);

export default resultRouter;

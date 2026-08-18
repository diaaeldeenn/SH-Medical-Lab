import { Router } from "express";

import testService from "./test.service.js";
import { schema } from "../../common/middleware/schema/schema.js";
import {
  createTestSchema,
  updateTestSchema,
} from "../../common/middleware/schema/test.schema.js";
import {
  authentication,
  authorization,
} from "../../common/middleware/auth.middleware.js";
import { UserRole } from "../../common/enum/user.enum.js";

const testRouter = Router({
  caseSensitive: true,
  strict: true,
});

testRouter.post(
  "/",
  authentication,
  authorization([UserRole.SPECIALIST]),
  schema(createTestSchema),
  testService.createTest,
);

testRouter.get(
  "/",
  authentication,
  testService.getTests,
);

testRouter.get(
  "/:testId",
  authentication,
  testService.getTestById,
);

testRouter.patch(
  "/:testId",
  authentication,
  authorization([UserRole.SPECIALIST]),
  schema(updateTestSchema),
  testService.updateTest,
);

testRouter.delete(
  "/:testId",
  authentication,
  authorization([UserRole.SPECIALIST]),
  testService.deleteTest,
);

export default testRouter;
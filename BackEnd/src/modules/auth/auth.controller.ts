import { Router } from "express";
import authService from "./auth.service.js";
import { schema } from "../../common/middleware/schema/schema.js";
import {
  changePasswordSchema,
  loginSchema,
  registerSchema,
} from "../../common/middleware/schema/auth.schema.js";
import { authentication } from "../../common/middleware/auth.middleware.js";

const authRouter = Router({
  caseSensitive: true,
  strict: true,
});

authRouter.post("/register", schema(registerSchema), authService.register);
authRouter.post("/login", schema(loginSchema), authService.login);
authRouter.get("/refresh-token", authService.refreshToken);
authRouter.get("/profile", authentication, authService.getProfile);
authRouter.patch("/change-password",authentication,schema(changePasswordSchema),authService.changePassword);

export default authRouter;

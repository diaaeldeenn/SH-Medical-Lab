import type { NextFunction, Request, Response } from "express";
import { randomUUID } from "node:crypto";
import jwt from "jsonwebtoken";
import UserRepository from "../../DB/repository/user.repository.js";
import { AppError } from "../../common/utils/global/response.error.js";
import { successResponse } from "../../common/utils/global/response.success.js";
import {
  CompareHash,
  Hash,
} from "../../common/utils/security/hash.security.js";
import type {
  ChangePasswordI,
  LoginI,
  RegisterI,
} from "../../common/middleware/schema/auth.schema.js";

class AuthService {
  private readonly userRepo = new UserRepository();

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { rePassword, ...data }: RegisterI & { rePassword: string } = req.body;
      const phoneExist = await this.userRepo.findOne({
        filter: {
          phone: data.phone,
        },
      });

      if (phoneExist) {
        throw new AppError("Phone Number Already Exist", 409);
      }

      if (data.email) {
        const emailExist = await this.userRepo.findOne({
          filter: {
            email: data.email,
          },
        });

        if (emailExist) {
          throw new AppError("Email Already Exist", 409);
        }
      }

      const user = await this.userRepo.create({
        ...data,
        password: Hash({
          plainText: data.password,
        }),
      });
      return successResponse({
        res,
        status: 201,
        message: "Registration Successful",
        data: {
          id: user._id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          dateOfBirth: user.dateOfBirth,
          gender: user.gender,
          role: user.role,
        },
      });
    } catch (error) {
      return next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { phone, password, fcmToken }: LoginI = req.body;

      const user = await this.userRepo.findOne({
        filter: {
          phone,
        },
      });

      if (!user) {
        throw new AppError("Invalid Phone Number Or Password", 401);
      }

      const isPasswordValid = CompareHash({
        plainText: password,
        cipherText: user.password,
      });

      if (!isPasswordValid) {
        throw new AppError("Invalid Phone Number Or Password", 401);
      }

      if (fcmToken) {
        await this.userRepo.findByIdAndUpdate({
          id: user._id,
          update: {
            $addToSet: {
              fcmTokens: fcmToken,
            },
          },
        });
      }

      const token = jwt.sign(
        {
          userId: user._id,
        },
        process.env.JWT_TOKEN!,
        {
          expiresIn: "1h",
          jwtid: randomUUID(),
        },
      );

      const refreshToken = jwt.sign(
        {
          userId: user._id,
        },
        process.env.JWT_REFRESH_TOKEN!,
        {
          expiresIn: "1y",
          jwtid: randomUUID(),
        },
      );

      return successResponse({
        res,
        message: "Login Successfully",
        data: {
          token,
          refreshToken,
        },
      });
    } catch (error) {
      return next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshtoken } = req.headers;

      if (!refreshtoken || typeof refreshtoken !== "string") {
        throw new AppError("Refresh Token Not Provided", 401);
      }

      const decoded = jwt.verify(refreshtoken, process.env.JWT_REFRESH_TOKEN!);

      if (typeof decoded === "string") {
        throw new AppError("Invalid Refresh Token", 401);
      }

      const userId = decoded.userId;

      const user = await this.userRepo.findById(userId);

      if (!user) {
        throw new AppError("User Not Found", 404);
      }

      const token = jwt.sign(
        {
          userId: user._id,
        },
        process.env.JWT_TOKEN!,
        {
          expiresIn: "1h",
          jwtid: randomUUID(),
        },
      );

      return successResponse({
        res,
        message: "Token Refreshed Successfully",
        data: {
          token,
        },
      });
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return next(new AppError("Refresh Token Expired", 401));
      }

      if (error instanceof jwt.JsonWebTokenError) {
        return next(new AppError("Invalid Refresh Token", 401));
      }

      return next(error);
    }
  };

  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!._id;

      const user = await this.userRepo.findById(userId);

      if (!user) {
        throw new AppError("User Not Found", 404);
      }

      return successResponse({
        res,
        message: "Profile Fetched Successfully",
        data: {
          id: user._id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          dateOfBirth: user.dateOfBirth,
          gender: user.gender,
          role: user.role,
        },
      });
    } catch (error) {
      return next(error);
    }
  };

  changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!._id;
      const { oldPassword, newPassword }: ChangePasswordI = req.body;

      const user = await this.userRepo.findById(userId);

      if (!user) {
        throw new AppError("User Not Found", 404);
      }

      const isMatch = CompareHash({
        plainText: oldPassword,
        cipherText: user.password,
      });

      if (!isMatch) {
        throw new AppError("Incorrect Old Password", 400);
      }

      const hashedNewPassword = Hash({ plainText: newPassword });

      await this.userRepo.findByIdAndUpdate({
        id: user._id,
        update: { password: hashedNewPassword },
      });

      return successResponse({
        res,
        message: "Password Changed Successfully",
        data: null,
      });
    } catch (error) {
      return next(error);
    }
  };
}

export default new AuthService();

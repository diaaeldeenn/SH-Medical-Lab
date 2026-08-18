import type { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";

import TestRepository from "../../DB/repository/test.repository.js";
import { AppError } from "../../common/utils/global/response.error.js";
import { successResponse } from "../../common/utils/global/response.success.js";
import type {
  CreateTestI,
  UpdateTestI,
} from "../../common/middleware/schema/test.schema.js";

class TestService {
  private readonly testRepo = new TestRepository();

  createTest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: CreateTestI = req.body;

      const existingTest = await this.testRepo.findOne({
        filter: {
          $or: [
            { code: data.code },
            { nameAr: data.nameAr },
            { medicalName: data.medicalName },
          ],
        },
      });

      if (existingTest) {
        throw new AppError("Test With Same Code Or Name Already Exists", 409);
      }

      const test = await this.testRepo.create(data);

      return successResponse({
        res,
        status: 201,
        message: "Test Created Successfully",
        data: test,
      });
    } catch (error) {
      return next(error);
    }
  };

  getTests = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const search = req.query.search?.toString().trim();
      const category = req.query.category?.toString().trim();

      const filter: Record<string, any> = { isDeleted: { $ne: true } };

      if (search) {
        filter.$or = [
          { nameAr: { $regex: search, $options: "i" } },
          { medicalName: { $regex: search, $options: "i" } },
          { code: { $regex: search, $options: "i" } },
        ];
      }

      if (category) {
        filter.category = category;
      }

      const result = await this.testRepo.pagination({
        page,
        limit,
        search: filter,
        sort: {
          createdAt: -1,
        },
      });

      return successResponse({
        res,
        message: "Tests Fetched Successfully",
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  };

  getTestById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { testId } = req.params;

      if (
        !testId ||
        typeof testId !== "string" ||
        !Types.ObjectId.isValid(testId)
      ) {
        throw new AppError("Invalid Test ID", 400);
      }

      const test = await this.testRepo.findOne({
        filter: {
          _id: new Types.ObjectId(testId),
          isDeleted: { $ne: true },
        },
      });

      if (!test) {
        throw new AppError("Test Not Found", 404);
      }

      return successResponse({
        res,
        message: "Test Fetched Successfully",
        data: test,
      });
    } catch (error) {
      return next(error);
    }
  };

  updateTest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { testId } = req.params;

      if (
        !testId ||
        typeof testId !== "string" ||
        !Types.ObjectId.isValid(testId)
      ) {
        throw new AppError("Invalid Test ID", 400);
      }
      const data: UpdateTestI = req.body;

      if (data.code || data.nameAr || data.medicalName) {
        const duplicateTest = await this.testRepo.findOne({
          filter: {
            isDeleted: { $ne: true },
            $and: [
              {
                _id: {
                  $ne: new Types.ObjectId(testId),
                },
              },
              {
                $or: [
                  ...(data.code ? [{ code: data.code }] : []),
                  ...(data.nameAr ? [{ nameAr: data.nameAr }] : []),
                  ...(data.medicalName
                    ? [{ medicalName: data.medicalName }]
                    : []),
                ],
              },
            ],
          },
        });

        if (duplicateTest) {
          throw new AppError(
            "Another Test With Same Code Or Name Already Exists",
            409,
          );
        }
      }

      const test = await this.testRepo.findOneAndUpdate({
        filter: {
          _id: new Types.ObjectId(testId),
          isDeleted: { $ne: true },
        },
        update: data,
        options: {
          runValidators: true,
        },
      });

      if (!test) {
        throw new AppError("Test Not Found", 404);
      }

      return successResponse({
        res,
        message: "Test Updated Successfully",
        data: test,
      });
    } catch (error) {
      return next(error);
    }
  };

  deleteTest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { testId } = req.params;

      if (
        !testId ||
        typeof testId !== "string" ||
        !Types.ObjectId.isValid(testId)
      ) {
        throw new AppError("Invalid Test ID", 400);
      }

      const test = await this.testRepo.findOneAndUpdate({
        filter: {
          _id: new Types.ObjectId(testId),
          isDeleted: { $ne: true },
        },
        update: {
          isDeleted: true,
        },
      });

      if (!test) {
        throw new AppError("Test Not Found", 404);
      }

      return successResponse({
        res,
        message: "Test Deleted Successfully",
      });
    } catch (error) {
      return next(error);
    }
  };
}

export default new TestService();

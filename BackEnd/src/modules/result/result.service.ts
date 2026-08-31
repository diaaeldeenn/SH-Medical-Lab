import type { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import ResultRepository from "../../DB/repository/result.repository.js";
import LabRequestRepository from "../../DB/repository/labRequest.Repository.js";
import TestRepository from "../../DB/repository/test.repository.js";
import { AppError } from "../../common/utils/global/response.error.js";
import { successResponse } from "../../common/utils/global/response.success.js";
import { RequestStatus, TestStatus } from "../../common/enum/request.enum.js";
import { EvaluationType, ParameterType } from "../../common/enum/test.enum.js";
import { ResultStatus } from "../../common/enum/result.enum.js";
import type {
  CreateResultI,
  UpdateResultI,
} from "../../common/middleware/schema/result.schema.js";
import {
  buildResultPDF,
  safeFileName,
  type CreatorI,
  type RequestWithPatientI,
} from "../../common/service/pdf.builder.js";
import type { TestParameterI } from "../../DB/models/test.model.js";
import { UserRole } from "../../common/enum/user.enum.js";
import { NotificationType } from "../../common/enum/notification.enum.js";
import NotificationConfig from "../../common/service/notification.js";

class ResultService {
  private readonly resultRepo = new ResultRepository();
  private readonly requestRepo = new LabRequestRepository();
  private readonly testRepo = new TestRepository();

  private validateObjectId(id: string, message = "Invalid ID"): void {
    if (!id || typeof id !== "string" || !Types.ObjectId.isValid(id)) {
      throw new AppError(message, 400);
    }
  }

  private getNormalRange(parameter: TestParameterI): string | undefined {
    if (parameter.evaluationLogic?.type === EvaluationType.NORMAL_VALUES) {
      return parameter.evaluationLogic.normalValues?.join(" / ");
    }

    if (parameter.evaluationLogic?.type !== EvaluationType.RANGE) {
      return undefined;
    }

    const range = parameter.referenceRanges?.[0];

    if (!range) return undefined;

    if (range.min !== undefined && range.max !== undefined) {
      return `${range.min} - ${range.max}`;
    }

    if (range.min !== undefined) return `≥ ${range.min}`;
    if (range.max !== undefined) return `≤ ${range.max}`;

    return undefined;
  }

  private calculateStatus(
    value: string | number,
    parameter: TestParameterI,
  ): ResultStatus | undefined {
    const evaluationType = parameter.evaluationLogic?.type;

    if (evaluationType === EvaluationType.NORMAL_VALUES) {
      const normalValues = parameter.evaluationLogic?.normalValues ?? [];
      return typeof value === "string" && normalValues.includes(value)
        ? ResultStatus.NORMAL
        : ResultStatus.HIGH;
    }

    if (evaluationType !== EvaluationType.RANGE || typeof value !== "number") {
      return undefined;
    }

    const range = parameter.referenceRanges?.[0];
    if (!range) return undefined;

    if (range.min !== undefined && value < range.min) return ResultStatus.LOW;
    if (range.max !== undefined && value > range.max) return ResultStatus.HIGH;

    return ResultStatus.NORMAL;
  }

  createResult = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestId = req.params.requestId as string;
      const testId = req.params.testId as string;
      const data: CreateResultI = req.body;
      const createdBy = req.user!._id;

      this.validateObjectId(requestId, "Invalid Request ID");
      this.validateObjectId(testId, "Invalid Test ID");

      const request = await this.requestRepo.findOne({
        filter: {
          _id: new Types.ObjectId(requestId),
          status: RequestStatus.IN_PROGRESS,
        },
      });

      if (!request) {
        throw new AppError("Lab Request Not Found Or Is Not In Progress", 404);
      }

      const requestTest = request.tests.find(
        (item) => item.testId.toString() === testId,
      );

      if (!requestTest) {
        throw new AppError("Test Does Not Belong To This Request", 404);
      }

      if (requestTest.status !== TestStatus.COMPLETED) {
        throw new AppError(
          "Test Must Be Completed Before Creating Result",
          400,
        );
      }

      const test = await this.testRepo.findOne({
        filter: {
          _id: new Types.ObjectId(testId),
          isDeleted: { $ne: true },
        },
      });

      if (!test) {
        throw new AppError("Test Not Found Or No Longer Available", 404);
      }

      const existingResult = await this.resultRepo.findOne({
        filter: {
          request: request._id,
          test: test._id,
        },
      });

      if (existingResult) {
        throw new AppError("Result Already Exists For This Test", 409);
      }

      const resultParameters = data.parameters.map((inputParameter) => {
        const parameter = test.parameters.find(
          (item) => item.name === inputParameter.parameter,
        );

        if (!parameter) {
          throw new AppError(
            `Parameter "${inputParameter.parameter}" Does Not Belong To This Test`,
            400,
          );
        }

        if (
          parameter.type === ParameterType.NUMBER &&
          typeof inputParameter.value !== "number"
        ) {
          throw new AppError(
            `Parameter "${parameter.name}" Must Be A Number`,
            400,
          );
        }

        if (
          parameter.type !== ParameterType.NUMBER &&
          typeof inputParameter.value !== "string"
        ) {
          throw new AppError(
            `Parameter "${parameter.name}" Must Be A String`,
            400,
          );
        }

        return {
          parameter: parameter.name,
          value: inputParameter.value,
          unit: parameter.unit,
          normalRange: this.getNormalRange(parameter),
          status: this.calculateStatus(inputParameter.value, parameter),
        };
      });

      const result = await this.resultRepo.create({
        request: request._id,
        test: test._id,
        testName: test.nameAr,
        parameters: resultParameters,
        note: data.note,
        createdBy,
        isLocked: false,
      });

      const allTestsCompleted = request.tests.every(
        (item) => item.status === TestStatus.COMPLETED,
      );

      request.status = allTestsCompleted
        ? RequestStatus.COMPLETED
        : RequestStatus.IN_PROGRESS;

      await request.save();

      const patientId = request.patient;

      await NotificationConfig.createAndSend({
        userId: patientId,
        type: NotificationType.TEST_RESULT,
        title: "نتيجة تحليل جديدة",
        message: `تم ظهور نتيجة تحليل (${test.nameAr}) الخاصة بك.`,
      });

      const totalTestsInRequest = request.tests.length;
      const totalResultsCreated = await this.resultRepo.countDocuments({
        request: request._id,
        isDeleted: { $ne: true },
      });

      if (totalResultsCreated === totalTestsInRequest) {
        await NotificationConfig.createAndSend({
          userId: patientId,
          type: NotificationType.ALL_RESULTS_COMPLETED,
          title: "اكتمال جميع نتائج التحاليل",
          message: `تم إصدار جميع نتائج التحاليل الخاصة بالطلب رقم (${request.requestNumber}) بنجاح.`,
        });
      }

      return successResponse({
        res,
        status: 201,
        message: "Test Result Created Successfully",
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  };

  getResults = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit, testId, requestId } = req.query;

      const search: any = {};
      if (testId) search.test = new Types.ObjectId(testId as string);
      if (requestId) search.request = new Types.ObjectId(requestId as string);

      const result = await this.resultRepo.pagination({
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10,
        sort: { createdAt: -1 },
        search,
        populate: [
          {
            path: "request",
            select: "requestNumber patient",
          },
          {
            path: "createdBy",
            select: "name email",
          },
        ],
      });

      return successResponse({
        res,
        message: "Results Fetched Successfully",
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  };

  updateResult = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resultId = req.params.resultId as string;
      this.validateObjectId(resultId, "Invalid Result ID");

      const existingResult = await this.resultRepo.findById(
        new Types.ObjectId(resultId),
      );
      if (!existingResult) {
        throw new AppError("Result Not Found", 404);
      }

      if (existingResult.isLocked) {
        throw new AppError("Cannot update a locked result", 403);
      }

      const body = req.body as UpdateResultI;

      let updatedParameters = existingResult.parameters;

      if (body.parameters) {
        const test = await this.testRepo.findOne({
          filter: {
            _id: existingResult.test,
            isDeleted: { $ne: true },
          },
        });

        if (!test) {
          throw new AppError(
            "Associated Test Not Found Or No Longer Available",
            404,
          );
        }

        updatedParameters = body.parameters.map((inputParameter) => {
          const parameter = test.parameters.find(
            (item) => item.name === inputParameter.parameter,
          );

          if (!parameter) {
            throw new AppError(
              `Parameter "${inputParameter.parameter}" Does Not Belong To This Test`,
              400,
            );
          }

          if (
            parameter.type === ParameterType.NUMBER &&
            typeof inputParameter.value !== "number"
          ) {
            throw new AppError(
              `Parameter "${parameter.name}" Must Be A Number`,
              400,
            );
          }

          if (
            parameter.type !== ParameterType.NUMBER &&
            typeof inputParameter.value !== "string"
          ) {
            throw new AppError(
              `Parameter "${parameter.name}" Must Be A String`,
              400,
            );
          }

          return {
            parameter: parameter.name,
            value: inputParameter.value,
            unit: parameter.unit,
            normalRange: this.getNormalRange(parameter),
            status: this.calculateStatus(inputParameter.value, parameter),
          };
        });
      }

      const updatedResult = await this.resultRepo.findByIdAndUpdate({
        id: new Types.ObjectId(resultId),
        update: {
          parameters: updatedParameters,
          note: body.note !== undefined ? body.note : existingResult.note,
        },
      });

      return successResponse({
        res,
        message: "Result Updated Successfully",
        data: updatedResult,
      });
    } catch (error) {
      return next(error);
    }
  };

  deleteResult = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resultId = req.params.resultId as string;
      this.validateObjectId(resultId, "Invalid Result ID");

      const existingResult = await this.resultRepo.findById(
        new Types.ObjectId(resultId),
      );
      if (!existingResult) {
        throw new AppError("Result Not Found", 404);
      }

      if (existingResult.isLocked) {
        throw new AppError("Cannot delete a locked result", 403);
      }

      const deletedResult = await this.resultRepo.findByIdAndUpdate({
        id: new Types.ObjectId(resultId),
        update: { isDeleted: true },
      });

      return successResponse({
        res,
        message: "Result Deleted Successfully",
        data: deletedResult,
      });
    } catch (error) {
      return next(error);
    }
  };
  getResultById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resultId = req.params.resultId as string;

      this.validateObjectId(resultId, "Invalid Result ID");

      const result = await this.resultRepo.findOne({
        filter: { _id: new Types.ObjectId(resultId) },
        options: {
          populate: [
            {
              path: "request",
              select: "requestNumber appointment patient",
              populate: {
                path: "patient",
                select: "_id name phone dateOfBirth gender",
              },
            },
            {
              path: "createdBy",
              select: "name email",
            },
          ],
        },
      });

      if (!result) {
        throw new AppError("Result Not Found", 404);
      }

      if (req.user!.role === UserRole.PATIENT) {
        const request = result.request as unknown as {
          patient: {
            _id: Types.ObjectId;
          };
        };

        if (request.patient._id.toString() !== req.user!._id.toString()) {
          throw new AppError("Result Not Found", 404);
        }
      }

      return successResponse({
        res,
        message: "Result Fetched Successfully",
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  };

  getResultsByRequest = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const requestId = req.params.requestId as string;

      this.validateObjectId(requestId, "Invalid Request ID");

      const requestFilter: Record<string, any> = {
        _id: new Types.ObjectId(requestId),
      };

      if (req.user!.role === UserRole.PATIENT) {
        requestFilter.patient = req.user!._id;
      }

      const requestExists = await this.requestRepo.findOne({
        filter: requestFilter,
      });

      if (!requestExists) {
        throw new AppError("Lab Request Not Found", 404);
      }

      const results = await this.resultRepo.find({
        filter: {
          request: requestExists._id,
        },
      });

      return successResponse({
        res,
        message: "Results Fetched Successfully",
        data: results,
      });
    } catch (error) {
      return next(error);
    }
  };

  lockResult = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resultId = req.params.resultId as string;
      this.validateObjectId(resultId, "Invalid Result ID");

      const existingResult = await this.resultRepo.findById(
        new Types.ObjectId(resultId),
      );
      if (!existingResult) {
        throw new AppError("Result Not Found", 404);
      }

      if (existingResult.isLocked) {
        throw new AppError("Result is already locked", 400);
      }

      const lockedResult = await this.resultRepo.findByIdAndUpdate({
        id: new Types.ObjectId(resultId),
        update: { isLocked: true },
      });

      return successResponse({
        res,
        message: "Result Locked Successfully",
        data: lockedResult,
      });
    } catch (error) {
      return next(error);
    }
  };

  downloadResultPDF = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { requestId, testId } = req.params;
      if (typeof requestId !== "string" || typeof testId !== "string") {
        throw new AppError("Invalid ID parameters", 400);
      }
      this.validateObjectId(requestId, "Invalid Request ID");
      this.validateObjectId(testId, "Invalid Test ID");

      const result = await this.resultRepo.findOne({
        filter: {
          request: new Types.ObjectId(requestId),
          test: new Types.ObjectId(testId),
        },
        options: {
          populate: [
            {
              path: "request",
              select: "requestNumber appointment patient",
              populate: {
                path: "patient",
                select: "_id name phone dateOfBirth gender",
              },
            },
            {
              path: "createdBy",
              select: "name",
            },
          ],
        },
      });

      if (!result) {
        throw new AppError("Result Not Found", 404);
      }

      const request = result.request as unknown as RequestWithPatientI;
      const patient = request?.patient;

      if (!patient) {
        throw new AppError("Patient Data Not Found", 500);
      }

      if (
        req.user!.role === UserRole.PATIENT &&
        patient._id.toString() !== req.user!._id.toString()
      ) {
        throw new AppError("Result Not Found", 404);
      }

      if (!result.isLocked) {
        throw new AppError("Result Must Be Locked Before Generating PDF", 400);
      }

      const fileName = safeFileName(result.testName, request.requestNumber);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`,
      );

      const creator = result.createdBy as unknown as CreatorI;

      const doc = buildResultPDF({
        requestNumber: request.requestNumber,
        collectionDate: request.appointment?.appointmentDate ?? new Date(),
        reportedBy: creator?.name ?? "SH Medical Labs",
        patient: {
          name: patient.name,
          phone: patient.phone,
          dateOfBirth: patient.dateOfBirth,
          gender: patient.gender,
        },
        testName: result.testName,
        parameters: result.parameters,
        note: result.note,
        printedAt: new Date(),
      });

      doc.pipe(res);
    } catch (error) {
      return next(error);
    }
  };
}

export default new ResultService();

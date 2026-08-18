import type { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import TestRepository from "../../DB/repository/test.repository.js";
import { AppError } from "../../common/utils/global/response.error.js";
import { successResponse } from "../../common/utils/global/response.success.js";
import { RequestStatus, TestStatus } from "../../common/enum/request.enum.js";
import { SampleType } from "../../common/enum/test.enum.js";
import { UserRole } from "../../common/enum/user.enum.js";
import type {
  CreateLabRequestI,
  UpdateAppointmentI,
  UpdateTestStatusI,
} from "../../common/middleware/schema/request.schema.js";
import LabRequestRepository from "../../DB/repository/labRequest.Repository.js";
import ResultRepository from "../../DB/repository/result.repository.js";

class LabRequestService {
  private readonly requestRepo = new LabRequestRepository();
  private readonly testRepo = new TestRepository();
  private readonly resultRepo = new ResultRepository();

  createRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: CreateLabRequestI = req.body;
      const patientId = req.user!._id;
      const uniqueTestIds = [...new Set(data.tests)];
      if (uniqueTestIds.length !== data.tests.length) {
        throw new AppError("Duplicate Tests Are Not Allowed", 400);
      }
      const invalidTestId = uniqueTestIds.find(
        (testId) => !Types.ObjectId.isValid(testId),
      );
      if (invalidTestId) {
        throw new AppError("Invalid Test ID", 400);
      }
      const testObjectIds = uniqueTestIds.map(
        (testId) => new Types.ObjectId(testId),
      );

      const tests = await this.testRepo.find({
        filter: {
          _id: { $in: testObjectIds },
          isDeleted: { $ne: true },
        },
      });

      if (tests.length !== testObjectIds.length) {
        throw new AppError(
          "One Or More Tests Not Found Or No Longer Available",
          404,
        );
      }

      const requestTests = tests.map((test) => ({
        testId: test._id,
        testName: test.nameAr,
        status: TestStatus.PENDING,
      }));

      const requestNumber = `REQ-${Date.now()}-${Math.floor(
        1000 + Math.random() * 9000,
      )}`;

      const request = await this.requestRepo.create({
        requestNumber,
        patient: patientId,
        tests: requestTests,
        appointment: data.appointment,
        status: RequestStatus.PENDING,
        samples: [],
      });

      return successResponse({
        res,
        status: 201,
        message: "Lab Request Created Successfully",
        data: request,
      });
    } catch (error) {
      return next(error);
    }
  };

  getAllRequests = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const { status, searchKey, startDate, endDate } = req.query;

      const filter: Record<string, any> = {};

      if (
        status &&
        Object.values(RequestStatus).includes(status as RequestStatus)
      ) {
        filter.status = status;
      }

      if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) {
          filter.createdAt.$gte = new Date(startDate as string);
        }
        if (endDate) {
          const endDateTime = new Date(endDate as string);
          endDateTime.setHours(23, 59, 59, 999);
          filter.createdAt.$lte = endDateTime;
        }
      }

      if (searchKey) {
        filter.requestNumber = { $regex: searchKey, $options: "i" };
      }

      const result = await this.requestRepo.pagination({
        page,
        limit,
        search: filter,
        sort: { createdAt: -1 },
        populate: [
          {
            path: "patient",
            select: "name phone email",
          },
        ],
      });

      return successResponse({
        res,
        message: "All Lab Requests Fetched Successfully",
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  };

  getMyRequests = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await this.requestRepo.pagination({
        page,
        limit,
        search: {
          patient: req.user!._id,
        },
        sort: {
          createdAt: -1,
        },
      });

      return successResponse({
        res,
        message: "Lab Requests Fetched Successfully",
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  };

  getRequestById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { requestId } = req.params;

      if (
        !requestId ||
        typeof requestId !== "string" ||
        !Types.ObjectId.isValid(requestId)
      ) {
        throw new AppError("Invalid Request ID", 400);
      }

      const filter: Record<string, any> = {
        _id: new Types.ObjectId(requestId),
      };

      if (req.user?.role === UserRole.PATIENT) {
        filter.patient = req.user._id;
      }

      const request = await this.requestRepo.findOne({
        filter,
        options: {
          populate: [
            {
              path: "patient",
              select: "name phone email",
            },
          ],
        },
      });

      if (!request) {
        throw new AppError("Lab Request Not Found", 404);
      }

      return successResponse({
        res,
        message: "Lab Request Fetched Successfully",
        data: request,
      });
    } catch (error) {
      return next(error);
    }
  };

  updateAppointment = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { requestId } = req.params;
      const data: UpdateAppointmentI = req.body;

      if (
        !requestId ||
        typeof requestId !== "string" ||
        !Types.ObjectId.isValid(requestId)
      ) {
        throw new AppError("Invalid Request ID", 400);
      }

      if (!req.user) {
        throw new AppError("User Not Authenticated", 401);
      }

      const request = await this.requestRepo.findOne({
        filter: {
          _id: new Types.ObjectId(requestId),
          patient: req.user._id,
        },
      });

      if (!request) {
        throw new AppError("Lab Request Not Found", 404);
      }

      if (request.status !== RequestStatus.PENDING) {
        throw new AppError(
          "Appointment Can Only Be Updated While Request Is Pending",
          400,
        );
      }

      const updatedRequest = await this.requestRepo.findOneAndUpdate({
        filter: {
          _id: request._id,
          patient: req.user._id,
        },
        update: {
          appointment: {
            ...request.appointment,
            ...data,
          },
        },
      });

      return successResponse({
        res,
        message: "Appointment Updated Successfully",
        data: updatedRequest,
      });
    } catch (error) {
      return next(error);
    }
  };

  attendRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { requestId } = req.params;

      if (
        !requestId ||
        typeof requestId !== "string" ||
        !Types.ObjectId.isValid(requestId)
      ) {
        throw new AppError("Invalid Request ID", 400);
      }

      const request = await this.requestRepo.findOneAndUpdate({
        filter: {
          _id: new Types.ObjectId(requestId),
          status: RequestStatus.PENDING,
        },
        update: {
          status: RequestStatus.ATTENDED,
        },
      });

      if (!request) {
        throw new AppError(
          "Request Not Found Or Cannot Be Attended In Its Current Status",
          400,
        );
      }

      return successResponse({
        res,
        message: "Request Attended Successfully",
        data: request,
      });
    } catch (error) {
      return next(error);
    }
  };

  collectSample = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { requestId } = req.params;

      if (
        !requestId ||
        typeof requestId !== "string" ||
        !Types.ObjectId.isValid(requestId)
      ) {
        throw new AppError("Invalid Request ID", 400);
      }

      const request = await this.requestRepo.findOne({
        filter: {
          _id: new Types.ObjectId(requestId),
        },
      });

      if (!request) {
        throw new AppError("Lab Request Not Found", 404);
      }

      if (request.status !== RequestStatus.ATTENDED) {
        throw new AppError(
          "Sample Can Only Be Collected After Patient Is Attended",
          400,
        );
      }

      const tests = await this.testRepo.find({
        filter: {
          _id: {
            $in: request.tests.map((item) => item.testId),
          },
          isDeleted: { $ne: true },
        },
      });

      if (tests.length !== request.tests.length) {
        throw new AppError("One Or More Tests Are No Longer Available", 404);
      }

      const sampleTypes = new Set<SampleType>();

      for (const test of tests) {
        sampleTypes.add(test.sampleType);
      }

      const samples = [...sampleTypes].map((sampleType) => ({
        sampleType,
        collectedAt: new Date(),
      }));

      const updatedRequest = await this.requestRepo.findOneAndUpdate({
        filter: {
          _id: request._id,
          status: RequestStatus.ATTENDED,
        },
        update: {
          status: RequestStatus.SAMPLE_COLLECTED,
          samples,
        },
      });

      if (!updatedRequest) {
        throw new AppError(
          "Request Cannot Be Updated In Its Current Status",
          400,
        );
      }

      return successResponse({
        res,
        message: "Sample Collected Successfully",
        data: updatedRequest,
      });
    } catch (error) {
      return next(error);
    }
  };

  startProcessing = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { requestId } = req.params;

      if (
        !requestId ||
        typeof requestId !== "string" ||
        !Types.ObjectId.isValid(requestId)
      ) {
        throw new AppError("Invalid Request ID", 400);
      }

      const request = await this.requestRepo.findOneAndUpdate({
        filter: {
          _id: new Types.ObjectId(requestId),
          status: RequestStatus.SAMPLE_COLLECTED,
        },
        update: {
          status: RequestStatus.IN_PROGRESS,
        },
      });

      if (!request) {
        throw new AppError("Request Not Found Or Cannot Start Processing", 400);
      }

      return successResponse({
        res,
        message: "Request Processing Started Successfully",
        data: request,
      });
    } catch (error) {
      return next(error);
    }
  };

  updateTestStatus = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { requestId, testId } = req.params;
      const data: UpdateTestStatusI = req.body;

      if (
        !requestId ||
        typeof requestId !== "string" ||
        !Types.ObjectId.isValid(requestId)
      ) {
        throw new AppError("Invalid Request ID", 400);
      }

      if (
        !testId ||
        typeof testId !== "string" ||
        !Types.ObjectId.isValid(testId)
      ) {
        throw new AppError("Invalid Test ID", 400);
      }

      const request = await this.requestRepo.findOne({
        filter: {
          _id: new Types.ObjectId(requestId),
          status: RequestStatus.IN_PROGRESS,
        },
      });

      if (!request) {
        throw new AppError("Request Not Found Or Is Not In Progress", 400);
      }

      const testIndex = request.tests.findIndex(
        (item) => item.testId.toString() === testId,
      );

      if (testIndex === -1) {
        throw new AppError("Test Does Not Belong To This Request", 404);
      }

      const currentStatus = request.tests[testIndex]!.status;
      if (
        currentStatus === TestStatus.PENDING &&
        data.status !== TestStatus.IN_PROGRESS
      ) {
        throw new AppError(
          "Test Can Only Move From Pending To In Progress",
          400,
        );
      }

      if (
        currentStatus === TestStatus.IN_PROGRESS &&
        data.status !== TestStatus.COMPLETED
      ) {
        throw new AppError(
          "Test Can Only Move From In Progress To Completed",
          400,
        );
      }

      if (currentStatus === TestStatus.COMPLETED) {
        throw new AppError("Completed Test Status Cannot Be Changed", 400);
      }

      request.tests[testIndex]!.status = data.status;

      const updatedRequest = await this.requestRepo.findOneAndUpdate({
        filter: {
          _id: request._id,
          status: RequestStatus.IN_PROGRESS,
        },
        update: {
          tests: request.tests,
        },
      });

      return successResponse({
        res,
        message: "Test Status Updated Successfully",
        data: updatedRequest,
      });
    } catch (error) {
      return next(error);
    }
  };

  completeRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { requestId } = req.params;

      if (
        !requestId ||
        typeof requestId !== "string" ||
        !Types.ObjectId.isValid(requestId)
      ) {
        throw new AppError("Invalid Request ID", 400);
      }

      const request = await this.requestRepo.findOne({
        filter: {
          _id: new Types.ObjectId(requestId),
          status: RequestStatus.IN_PROGRESS,
        },
      });

      if (!request) {
        throw new AppError("Request Not Found Or Is Not In Progress", 400);
      }

      const allTestsCompleted = request.tests.every(
        (test) => test.status === TestStatus.COMPLETED,
      );

      if (!allTestsCompleted) {
        throw new AppError(
          "All Tests Must Be Completed Before Completing The Request",
          400,
        );
      }

      const results = await this.resultRepo.find({
        filter: {
          request: request._id,
        },
      });

      if (results.length !== request.tests.length) {
        throw new AppError(
          "All Test Results Must Be Created Before Completing The Request",
          400,
        );
      }

      const updatedRequest = await this.requestRepo.findOneAndUpdate({
        filter: {
          _id: request._id,
          status: RequestStatus.IN_PROGRESS,
        },
        update: {
          status: RequestStatus.COMPLETED,
        },
      });

      return successResponse({
        res,
        message: "Lab Request Completed Successfully",
        data: updatedRequest,
      });
    } catch (error) {
      return next(error);
    }
  };

  cancelRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { requestId } = req.params;

      if (
        !requestId ||
        typeof requestId !== "string" ||
        !Types.ObjectId.isValid(requestId)
      ) {
        throw new AppError("Invalid Request ID", 400);
      }

      const request = await this.requestRepo.findOneAndUpdate({
        filter: {
          _id: new Types.ObjectId(requestId),
          patient: req.user!._id,
          status: {
            $in: [RequestStatus.PENDING, RequestStatus.ATTENDED],
          },
        },
        update: {
          status: RequestStatus.CANCELLED,
        },
      });

      if (!request) {
        throw new AppError("Request Not Found Or Cannot Be Cancelled", 400);
      }

      return successResponse({
        res,
        message: "Lab Request Cancelled Successfully",
        data: request,
      });
    } catch (error) {
      return next(error);
    }
  };
}

export default new LabRequestService();

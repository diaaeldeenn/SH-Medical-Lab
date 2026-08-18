import { Schema, model, Types } from "mongoose";
import { RequestStatus, TestStatus } from "../../common/enum/request.enum.js";
import mongoose from "mongoose";
import { SampleType } from "../../common/enum/test.enum.js";

interface RequestTestI {
  testId: Types.ObjectId;
  testName: string;
  status: TestStatus;
}

interface AppointmentI {
  appointmentDate: Date;
  appointmentTime: string;
}

interface SampleI {
  sampleType: SampleType;
  collectedAt?: Date;
}

export interface LabRequestI {
  requestNumber: string;
  patient: Types.ObjectId;
  tests: RequestTestI[];
  appointment: AppointmentI;
  status: RequestStatus;
  samples: SampleI[];
}

const requestTestSchema = new Schema<RequestTestI>(
  {
    testId: {
      type: Schema.Types.ObjectId,
      ref: "Test",
      required: true,
    },

    testName: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: Object.values(TestStatus),
      default: TestStatus.PENDING,
      required: true,
    },
  },
  { _id: false },
);

const appointmentSchema = new Schema<AppointmentI>(
  {
    appointmentDate: {
      type: Date,
      required: true,
    },

    appointmentTime: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false },
);

const sampleSchema = new Schema<SampleI>(
  {
    sampleType: {
      type: String,
      enum: Object.values(SampleType),
      required: true,
    },

    collectedAt: {
      type: Date,
    },
  },
  { _id: false },
);

const labRequestSchema = new Schema<LabRequestI>(
  {
    requestNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    patient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tests: {
      type: [requestTestSchema],
      required: true,
      validate: {
        validator: (tests: RequestTestI[]) => tests.length > 0,
        message: "Lab request must contain at least one test",
      },
    },

    appointment: {
      type: appointmentSchema,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(RequestStatus),
      default: RequestStatus.PENDING,
      required: true,
    },

    samples: {
      type: [sampleSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const LabRequestModel =
  mongoose.models.LabRequest ||
  model<LabRequestI>("LabRequest", labRequestSchema);
export default LabRequestModel;

import mongoose, { Schema, model, Types } from "mongoose";
import { ResultStatus } from "../../common/enum/result.enum.js";

export interface ResultParameterI {
  parameter: string;
  value: string | number;
  unit?: string;
  normalRange?: string;
  status?: ResultStatus;
}

export interface ResultI {
  request: Types.ObjectId;
  test: Types.ObjectId;
  testName: string;
  parameters: ResultParameterI[];
  note?: string;
  createdBy: Types.ObjectId;
  isLocked: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const resultParameterSchema = new Schema<ResultParameterI>(
  {
    parameter: {
      type: String,
      required: true,
      trim: true,
    },

    value: {
      type: Schema.Types.Mixed,
      required: true,
    },

    unit: {
      type: String,
      trim: true,
    },

    normalRange: {
      type: String,
    },

    status: {
      type: String,
      enum: Object.values(ResultStatus),
    },
  },
  { _id: false },
);

const resultSchema = new Schema<ResultI>(
  {
    request: {
      type: Schema.Types.ObjectId,
      ref: "LabRequest",
      required: true,
    },

    test: {
      type: Schema.Types.ObjectId,
      ref: "Test",
      required: true,
    },

    testName: {
      type: String,
      required: true,
      trim: true,
    },

    parameters: {
      type: [resultParameterSchema],
      required: true,
      validate: {
        validator: (parameters: ResultParameterI[]) => parameters.length > 0,
        message: "Result must contain at least one parameter",
      },
    },

    note: {
      type: String,
      trim: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isLocked: {
      type: Boolean,
      default: false,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

resultSchema.index({ request: 1, test: 1 }, { unique: true });

resultSchema.pre("find", async function () {
  this.where({ isDeleted: { $ne: true } });
});

resultSchema.pre("findOne", async function () {
  this.where({ isDeleted: { $ne: true } });
});

resultSchema.pre("findOneAndUpdate", async function () {
  this.where({ isDeleted: { $ne: true } });
});

const resultModel =
  mongoose.models.Result || model<ResultI>("Result", resultSchema);
export default resultModel;

import mongoose, { Schema, model } from "mongoose";
import {
  EvaluationType,
  ParameterType,
  SampleType,
} from "../../common/enum/test.enum.js";
import { Gender } from "../../common/enum/user.enum.js";

interface ReferenceRangeI {
  gender?: Gender;
  minAge?: number;
  maxAge?: number;
  min?: number;
  max?: number;
}

interface EvaluationLogicI {
  type: EvaluationType;
  normalValues?: string[];
}

export interface TestParameterI {
  name: string;
  type: ParameterType;
  unit?: string;
  options?: string[];
  referenceRanges?: ReferenceRangeI[];
  evaluationLogic?: EvaluationLogicI;
}

export interface TestI {
  nameAr: string;
  medicalName: string;
  code: string;
  category: string;
  price: number;
  sampleType: SampleType;
  parameters: TestParameterI[];
  isDeleted: boolean;
}

const referenceRangeSchema = new Schema<ReferenceRangeI>(
  {
    gender: {
      type: String,
      enum: Object.values(Gender),
    },

    minAge: {
      type: Number,
      min: 0,
    },

    maxAge: {
      type: Number,
      min: 0,
    },

    min: {
      type: Number,
    },

    max: {
      type: Number,
    },
  },
  { _id: false },
);

const evaluationLogicSchema = new Schema<EvaluationLogicI>(
  {
    type: {
      type: String,
      enum: Object.values(EvaluationType),
      required: true,
    },

    normalValues: {
      type: [String],
      default: undefined,
    },
  },
  { _id: false },
);

const parameterSchema = new Schema<TestParameterI>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: Object.values(ParameterType),
      required: true,
    },

    unit: {
      type: String,
      trim: true,
    },

    options: {
      type: [String],
      default: undefined,
    },

    referenceRanges: {
      type: [referenceRangeSchema],
      default: undefined,
    },

    evaluationLogic: {
      type: evaluationLogicSchema,
      default: undefined,
    },
  },
  { _id: false },
);

const testSchema = new Schema<TestI>(
  {
    nameAr: {
      type: String,
      required: true,
      trim: true,
    },

    medicalName: {
      type: String,
      required: true,
      trim: true,
    },

    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    sampleType: {
      type: String,
      enum: Object.values(SampleType),
      required: true,
    },

    parameters: {
      type: [parameterSchema],
      required: true,
      validate: {
        validator: (parameters: TestParameterI[]) => parameters.length > 0,
        message: "Test must contain at least one parameter",
      },
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

const testModel = mongoose.models.Test || model<TestI>("Test", testSchema);
export default testModel;

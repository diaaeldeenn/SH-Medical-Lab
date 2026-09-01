import {
  EvaluationType,
  ParameterType,
  SampleType,
} from "@/constants/test.enum";
import { Gender } from "@/constants/user.enum";

export interface TestI {
  _id: string;
  nameAr: string;
  medicalName: string;
  code: string;
  category: string;
  price: number;
  sampleType: SampleType;
  parameters: ParameterI[];
  isDeleted: boolean;
}

export interface ParameterI {
  name: string;
  type: ParameterType;
  unit?: string;
  referenceRanges?: ReferenceRangeI[];
  evaluationLogic: EvaluationLogicI;
  options?: string[];
}

export interface ReferenceRangeI {
  minAge?: number;
  maxAge?: number;
  min: number;
  max: number;
  gender?: Gender;
}

export interface EvaluationLogicI {
  type: EvaluationType;
  normalValues?: string[];
}

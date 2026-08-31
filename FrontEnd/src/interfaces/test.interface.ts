export interface TestI {
  _id: string;
  nameAr: string;
  medicalName: string;
  code: string;
  category: string;
  price: number;
  sampleType: string;
  parameters: ParameterI[];
  isDeleted: boolean;
}

export interface ParameterI {
  name: string;
  type: string;
  unit?: string;
  referenceRanges?: ReferenceRangeI[];
  evaluationLogic: EvaluationLogicI;
  options?: string[];
}

export interface ReferenceRangeI {
  minAge?: number;
  min: number;
  max: number;
  gender?: string;
}

export interface EvaluationLogicI {
  type: string;
  normalValues?: string[];
}

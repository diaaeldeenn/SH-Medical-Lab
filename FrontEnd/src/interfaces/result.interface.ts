export interface ResultParameterI {
  parameter: string;
  value: string | number;
  unit?: string;
  normalRange?: string;
  status?: string;
}

export interface ResultI {
  _id: string;
  request: string;
  test: string;
  testName: string;
  parameters: ResultParameterI[];
  note?: string;
  createdBy: string;
  isLocked: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

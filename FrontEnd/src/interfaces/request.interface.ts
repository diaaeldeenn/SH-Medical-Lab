export interface RequestI {
  _id: string
  requestNumber: string
  patient: PatientI
  tests: RequestTestI[]
  appointment: AppointmentI
  status: string
  samples: any[]
  createdAt: string
  updatedAt: string
  __v: number
}

export interface PatientI {
  _id: string
  name: string
  phone: string
}

export interface RequestTestI {
  testId: string
  testName: string
  status: string
}

export interface AppointmentI {
  appointmentDate: string
  appointmentTime: string
}
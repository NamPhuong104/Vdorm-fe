export {};

declare global {
  interface IViolation {
    _id: string
    reason: string
    dateOfViolation: string
    level: string
    status: string
    note?: string
    studentList: IStudent[]
    handler: IUser
    branch: IBranch
  }

  interface IViolations {
    statusCode?: number;
    message?: string;
    data: {
      metadata?: {
        current?: number;
        pageSize?: number;
        pages?: number;
        total?: number;
      };
      result: IViolation[];
    };
  }
}

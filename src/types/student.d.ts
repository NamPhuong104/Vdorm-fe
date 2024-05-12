export {};

declare global {
  interface IStudent {
    _id: string;
    code: string;
    fullName: string;
    dateOfBirth: string;
    gender: string;
    course: number;
    major: { _id: string; name: string };
    email: string;
    phone: string;
    homeTown: string;
    hobbyList: string[];
    status: string;
  }

  interface IStudentOption {
    _id: string;
    code: string;
    fullName: string;
  }

  interface IStudents {
    statusCode?: number;
    message?: string;
    data: {
      metadata?: {
        current?: number;
        pageSize?: number;
        pages?: number;
        total?: number;
      };
      result: IStudent[];
    };
  }
}

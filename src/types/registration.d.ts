export {};

declare global {
  interface IRegistration {
    _id: string;
    studentCode: string;
    fullName: string;
    dateOfBirth: string;
    gender: string;
    email: string;
    phone: string;
    homeTown: string;
    hobbyList: string[];
    course: number;
    status: string;
    criteria?: number[];
    major: { _id: string; name: string };
    branch: { _id: string; name: string };
    roomType: { _id: string; name: string };
    room?: { _id: string; code: string };
  }

  interface IRegistrations {
    statusCode?: number;
    message?: string;
    data: {
      metadata?: {
        current?: number;
        pageSize?: number;
        pages?: number;
        total?: number;
      };
      result: IRegistration[];
    };
  }
}

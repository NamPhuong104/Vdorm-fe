export {};

declare global {
  interface IStudentProfile {
    _id: string;
    startTime: string;
    endTime?: string;
    status: string;
    student: {
      _id: string;
      code: string;
      fullName: string;
      dateOfBirth?: string;
      gender?: string;
      course?: number;
      major?: { _id: string; name: string };
      email?: string;
      phone?: string;
      homeTown?: string;
      hobbyList?: string[];
      status?: string;
    };
    branch: { _id: string; name: string };
    roomType: { _id: string; name: string };
    room: { _id: string; code: string };
  }

  interface IStudentProfiles {
    statusCode?: number;
    message?: string;
    data: {
      metadata?: {
        current?: number;
        pageSize?: number;
        pages?: number;
        total?: number;
      };
      result: IStudentProfile[];
    };
  }
}

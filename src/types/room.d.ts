export {};

declare global {
  interface IRoom {
    _id: string;
    code: string;
    gender: string;
    studentRemaining: number;
    hasContract: boolean;
    roomOwner: { _id: string; code: string; fullName: string }[];
    studentList: { _id: string; code: string; fullName: string }[];
    roomType: { _id: string; name: string; numberOfStudents: number };
    serviceTypeList: { _id: string; name: string }[];
    branch: { _id: string; name: string };
  }

  interface IRoomOption {
    _id: string;
    code: string;
  }

  interface IRooms {
    statusCode?: number;
    message?: string;
    data: {
      metadata?: {
        current?: number;
        pageSize?: number;
        pages?: number;
        total?: number;
      };
      result: IRoom[];
    };
  }
}

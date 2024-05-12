export {};

declare global {
  interface IInOut {
    _id: string;
    type: string;
    student: { _id: string; fullName: stirng; code: string };
    branch: { _id: string; name: string };
    room: { _id: string; code: stirng };
    createdAt: string;
  }

  interface IInOutes {
    statusCode?: number;
    message?: string;
    data: {
      metadata?: {
        current?: number;
        pageSize?: number;
        pages?: number;
        total?: number;
      };
      result: IInOut[];
    };
  }
}

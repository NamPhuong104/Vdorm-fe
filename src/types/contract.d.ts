export {};

declare global {
  interface IContract {
    _id: string;
    code: string;
    createdDate: string;
    startDate: string;
    endDate: string;
    duration: string;
    status: string;
    student: IStudent;
    branch: IBranch;
    roomType: IRoomType;
    room: IRoom;
  }

  interface IContracts {
    statusCode?: number;
    message?: string;
    data: {
      metadata?: {
        current?: number;
        pageSize?: number;
        pages?: number;
        total?: number;
      };
      result: IContract[];
    };
  }
}

export {};

declare global {
  interface IRoomType {
    _id: string;
    code: string;
    name: string;
    numberOfStudents: number;
    numberOfRooms: number;
    price: string;
    priceInWords: string;
    roomTypeRemaining: number;
    infrastructureList: { _id: string; name: string }[];
    branch: { _id: string; name: string };
  }

  interface IRoomTypeOption {
    _id: string;
    name: string;
  }

  interface IRoomTypes {
    statusCode?: number;
    message?: string;
    data: {
      metadata?: {
        current?: number;
        pageSize?: number;
        pages?: number;
        total?: number;
      };
      result: IRoomType[];
    };
  }
}

export {};

declare global {
  interface IServiceType {
    _id: string;
    code: string;
    name: string;
    amountOfMoney: string;
    unit: string;
    branch: { _id: string; name: string };
  }

  interface IServiceTypeOption {
    _id: string;
    name: string;
  }

  interface IServiceTypes {
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

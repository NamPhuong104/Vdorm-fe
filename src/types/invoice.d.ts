export {};

declare global {
  interface IInvoice {
    _id: string;
    status: string;
    room: { _id: string; code: string };
    branch: { _id: string; name: string };
  }

  interface IInvoices {
    statusCode?: number;
    message?: string;
    data: {
      metadata?: {
        current?: number;
        pageSize?: number;
        pages?: number;
        total?: number;
      };
      result: IInvoice[];
    };
  }
}

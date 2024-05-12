export {};

declare global {
  interface IInvoiceDetail {
    _id: string;
    month: string;
    year: string;
    serviceInfo: any[];
    serviceFee: string;
    roomFee: string;
    totalAmount: string;
    electricityNumber: boolean;
    status: string;
  }

  interface IInvoiceDetails {
    statusCode?: number;
    message?: string;
    data: {
      metadata?: {
        current?: number;
        pageSize?: number;
        pages?: number;
        total?: number;
      };
      result: IInvoiceDetail[];
    };
  }

  interface IServiceInfo {
    name: string;
    quantity: string;
    amountOfMoney: string;
    unit: string;
  }
}

export {};

declare global {
  interface IMaintenance {
    _id: string;
    code: string;
    reason: string;
    amountOfMoney: string | number;
    company: string;
    infrastructureQrCode: IInfrastructureQRCode;
    room: { _id: string; code: string };
    branch: { _id: string; name: string };
    createdAt: Date | string;
  }

  interface IMaintenances {
    statusCode?: number;
    message?: string;
    data: {
      metadata?: {
        current?: number;
        pageSize?: number;
        pages?: number;
        total?: number;
      };
      result: IMaintenance[];
    };
  }
}

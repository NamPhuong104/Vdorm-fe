export {};

declare global {
  interface IInfrastructureQRCode {
    _id: string;
    code: string;
    name: string;
    model?: string;
    qrCode: string;
    infrastructure: { _id: string; name: string };
  }

  interface IInfrastructureQRCodeOption {
    _id: string;
    code: string;
  }

  interface IInfrastructureQRCodes {
    statusCode?: number;
    message?: string;
    data: {
      metadata?: {
        current?: number;
        pageSize?: number;
        pages?: number;
        total?: number;
      };
      result: IInfrastructureQRCode[];
    };
  }
}

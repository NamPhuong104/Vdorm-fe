export {};

declare global {
  interface IInfrastructure {
    _id: string;
    code: string;
    name: string;
    model?: string;
    quantity: number;
    infrastructureRemaining: number;
    price: string;
    importDate: string;
    expirationDate: string;
    status: string;
    infrastructureType: IInfrastructureType;
    branch: IBranch;
  }

  interface IInfrastructureOption {
    _id: string;
    name: string;
  }

  interface IInfrastructures {
    statusCode?: number;
    message?: string;
    data: {
      metadata?: {
        current?: number;
        pageSize?: number;
        pages?: number;
        total?: number;
      };
      result: IInfrastructure[];
    };
  }
}

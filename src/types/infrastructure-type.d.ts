export {};

declare global {
  interface IInfrastructureType {
    _id: string;
    code: string;
    name: string;
    branch: { _id: string; name: string };
  }

  interface IInfrastructureTypeOption {
    _id: string;
    name: string;
  }

  interface IInfrastructureTypes {
    statusCode?: number;
    message?: string;
    data: {
      metadata?: {
        current?: number;
        pageSize?: number;
        pages?: number;
        total?: number;
      };
      result: IInfrastructureType[];
    };
  }
}

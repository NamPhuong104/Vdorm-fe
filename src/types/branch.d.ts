export {};

declare global {
  interface IBranch {
    _id: string;
    name: string;
    address: string;
    email: string;
    phone: string;
  }

  interface IBranchOption {
    _id: string;
    name: string;
  }

  interface IBranches {
    statusCode?: number;
    message?: string;
    data: {
      metadata?: {
        current?: number;
        pageSize?: number;
        pages?: number;
        total?: number;
      };
      result: IBranch[];
    };
  }
}

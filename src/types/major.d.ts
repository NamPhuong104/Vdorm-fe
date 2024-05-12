export {};

declare global {
  interface IMajor {
    _id: string;
    code: string;
    name: string;
  }

  interface IMajorOption {
    _id: string;
    name: string;
  }

  interface IMajors {
    statusCode?: number;
    message?: string;
    data: {
      metadata?: {
        current?: number;
        pageSize?: number;
        pages?: number;
        total?: number;
      };
      result: IMajor[];
    };
  }
}

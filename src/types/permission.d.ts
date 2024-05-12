export {};

declare global {
  interface IPermission {
    _id: string;
    name: string;
    apiPath: string;
    method: string;
    module: string;
  }

  interface IPermissions {
    statusCode?: number;
    message?: string;
    data: {
      metadata?: {
        current?: number;
        pageSize?: number;
        pages?: number;
        total?: number;
      };
      result: IPermission[];
    };
  }
}

export {};

declare global {
  interface IRole {
    _id: string;
    name: string;
    description: string;
    isActive: string;
    permissionList: {}[];
  }

  interface IRoleOption {
    _id: string;
    name: string;
  }

  interface IRoles {
    statusCode?: number;
    message?: string;
    data: {
      metadata?: {
        current?: number;
        pageSize?: number;
        pages?: number;
        total?: number;
      };
      result: IRole[];
    };
  }
}

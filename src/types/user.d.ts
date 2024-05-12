export {};

declare global {
  interface IUser {
    _id: string;
    code: string;
    fullName: string;
    dateOfBirth: string;
    email: string;
    phone: string;
    role: { _id: string; name: string };
    isActive: boolean;
  }

  interface IUserOption {
    _id: string;
    code: string;
    fullName: string;
  }

  interface IUsers {
    statusCode?: number;
    message?: string;
    data: {
      metadata?: {
        current?: number;
        pageSize?: number;
        pages?: number;
        total?: number;
      };
      result: IUser[];
    };
  }
}

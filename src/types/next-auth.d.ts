import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';

interface IAccount {
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
  hasInfo: boolean;
  role: { _id: string; name: string };
  permissionList: IPermission[];
}

declare module 'next-auth/jwt' {
  interface JWT {
    access_token: string;
    refresh_token: string;
    account: IAccount;
  }
}

declare module 'next-auth' {
  interface Session {
    access_token: string;
    refresh_token: string;
    account: IAccount;
  }
}

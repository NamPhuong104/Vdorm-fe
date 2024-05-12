import { IAccount } from '@/types/next-auth';
import { sendRequest } from '@/util/api';
import { AuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import AzureADProvider from 'next-auth/providers/azure-ad';

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID,
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === 'signIn') {
        await sendRequest<IResponseAuthentication<JWT>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`,
          method: 'POST',
          body: { name: user.name, email: user.email },
        });

        const res = await sendRequest<IResponseAuthentication<JWT>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
          method: 'POST',
          body: { username: user.email, password: user.name },
        });

        if (res.data) {
          token.access_token = res?.data?.access_token;
          token.refresh_token = res?.data?.refresh_token;
          token.account = res?.data?.user as IAccount;
        }
      }

      if (trigger === 'update') {
        return { ...token, ...session };
      }

      return token;
    },
    async session({ session, token, user }) {
      if (token) {
        session.access_token = token.access_token;
        session.refresh_token = token.refresh_token;
        session.account = token.account;
      }
      return session;
    },
  },
};

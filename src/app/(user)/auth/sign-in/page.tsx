import SignIn from '@/components/auth/SignIn';
import { authOptions } from '@/util/authOptions';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

const SignInPage = async () => {
  const session = await getServerSession(authOptions);

  if (session) redirect('/admin/dashboard');

  return <SignIn />;
};

export default SignInPage;

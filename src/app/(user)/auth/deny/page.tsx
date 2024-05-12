import Deny from '@/components/auth/Deny';
import { authOptions } from '@/util/authOptions';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

const DenyPage = async () => {
  const session = await getServerSession(authOptions);

  if (session?.account?.hasInfo && session?.account?.isActive)
    redirect('/admin/dashboard');

  return <Deny />;
};

export default DenyPage;

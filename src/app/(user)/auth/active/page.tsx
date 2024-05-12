import Active from '@/components/auth/Active';
import { authOptions } from '@/util/authOptions';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

const ActivePage = async () => {
  const session = await getServerSession(authOptions);

  if (session?.account?.isActive) redirect('/admin/dashboard');

  return <Active />;
};

export default ActivePage;

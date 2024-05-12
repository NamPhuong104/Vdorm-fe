import Information from '@/components/auth/Information';
import { authOptions } from '@/util/authOptions';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

const InformationPage = async () => {
  const session = await getServerSession(authOptions);

  if (session?.account?.hasInfo) redirect('/admin/dashboard');

  return <Information />;
};

export default InformationPage;

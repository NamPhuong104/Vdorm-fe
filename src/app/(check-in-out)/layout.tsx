'use client';

import NavigationBar from '@/components/admin/global/NavigationBar';
import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

const QrCodeLayout = ({ children }: React.PropsWithChildren) => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') redirect('/auth/sign-in');

    if (status === 'authenticated') {
      const { role } = session.account;

      if (role.name === 'Sinh viên') {
        redirect('admin/check-in-out');
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <>
      {status === 'authenticated' ? (
        <Layout>
          <NavigationBar />
          <Content className="qr-code-layout">{children}</Content>
        </Layout>
      ) : (
        <></>
      )}
    </>
  );
};

export default QrCodeLayout;

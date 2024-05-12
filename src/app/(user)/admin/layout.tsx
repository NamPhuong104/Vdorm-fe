'use client';

import NavigationBar from '@/components/admin/global/NavigationBar';
import SideBar from '@/components/admin/global/SideBar';
import { IAccount } from '@/types/next-auth';
import { useAxiosAuth, useHasMounted } from '@/util/customHook';
import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';

const AdminLayout = ({ children }: React.PropsWithChildren) => {
  const { data: session, status } = useSession();
  const axiosAuth = useAxiosAuth();
  const hasMounted = useHasMounted();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [permissionList, setPermissionList] = useState<IPermission[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') redirect('/auth/sign-in');

    if (status === 'authenticated') {
      const { email, hasInfo, isActive, role } = session.account;

      if (role.name !== 'Sinh viên') {
        if (hasInfo && isActive) {
          handleGetAccountInfo();
        } else if (!hasInfo && !isActive) {
          redirect('/auth/information');
        } else if (hasInfo && !isActive) {
          redirect('/auth/active');
        }
      } else {
        handleGetAccountInfo();
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleGetAccountInfo = async () => {
    try {
      const res: IAxios<IResponsePaginate<IAccount>> = await axiosAuth.get(
        `/auth/account`,
      );

      if (res.data && res.data.message === 'success') {
        setPermissionList(res?.data?.data?.permissionList as IPermission[]);
      }
    } catch (error: any) {
      setPermissionList([]);
    }
  };

  if (!hasMounted) return <></>;

  return (
    <>
      {status === 'authenticated' ? (
        <Layout>
          <SideBar
            open={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            permissionList={permissionList}
            role={session?.account?.role?.name ?? ''}
          />
          <Layout className="main-content">
            <NavigationBar setIsDrawerOpen={() => setIsDrawerOpen(true)} />
            <Content className="admin-layout">{children}</Content>
          </Layout>
        </Layout>
      ) : (
        <></>
      )}
    </>
  );
};

export default AdminLayout;

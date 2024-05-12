'use client';

import { IAccount } from '@/types/next-auth';
import { useAxiosAuth } from '@/util/customHook';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Staff from './staff/Staff';
import Student from './student/Student';

const Notification = () => {
  const { status, data: session } = useSession();
  const axiosAuth = useAxiosAuth();
  const [permissionList, setPermissionList] = useState<IPermission[]>([]);
  const [role, setRole] = useState<string>('');

  useEffect(() => {
    if (status === 'authenticated') {
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

      handleGetAccountInfo();
      setRole(session?.account?.role?.name);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  if (!permissionList.length) return <></>;

  return role !== 'Sinh viên' ? (
    <Staff permissionList={permissionList} />
  ) : (
    <Student permissionList={permissionList} />
  );
};

export default Notification;

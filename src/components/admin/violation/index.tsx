'use client';

import { IAccount } from '@/types/next-auth';
import { useAxiosAuth } from '@/util/customHook';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Staff from './staff/Staff';
import Student from './student/Student';

const violationLevelOptions = [
  {
    value: 'Khiển trách',
    label: 'Khiển trách',
  },
  {
    value: 'Cảnh cáo',
    label: 'Cảnh cáo',
  },
  {
    value: 'Buộc rời khỏi KTX',
    label: 'Buộc rời khỏi KTX',
  },
];

const violationStatusOptions = [
  {
    value: 'Đang chờ xử lý',
    label: 'Đang chờ xử lý',
  },
  {
    value: 'Đã xử lý',
    label: 'Đã xử lý',
  },
];

const Violation = () => {
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
    <Staff
      permissionList={permissionList}
      violationLevelOptions={violationLevelOptions}
      violationStatusOptions={violationStatusOptions}
    />
  ) : (
    <Student permissionList={permissionList} />
  );
};

export default Violation;

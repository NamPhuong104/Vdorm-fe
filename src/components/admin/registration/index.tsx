'use client';

import { IAccount } from '@/types/next-auth';
import { useAxiosAuth } from '@/util/customHook';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Staff from './staff/Staff';
import Student from './student/Student';

const registrationStatusOptions: { value: string; label: string }[] = [
  {
    value: 'Đang chờ xử lý',
    label: 'Đang chờ xử lý',
  },
  {
    value: 'Đang xử lý',
    label: 'Đang xử lý',
  },
  {
    value: 'Đã xử lý',
    label: 'Đã xử lý',
  },
];

const genderOptions: { value: string; label: string }[] = [
  {
    value: 'Nam',
    label: 'Nam',
  },
  {
    value: 'Nữ',
    label: 'Nữ',
  },
];

const hobbyOptions: { value: string; label: string }[] = [
  {
    value: 'Sách',
    label: 'Sách',
  },
  {
    value: 'Âm nhạc',
    label: 'Âm nhạc',
  },
  {
    value: 'Nghệ thuật',
    label: 'Nghệ thuật',
  },
  {
    value: 'Công nghệ',
    label: 'Công nghệ',
  },
  {
    value: 'Thể thao',
    label: 'Thể thao',
  },
  {
    value: 'Du lịch',
    label: 'Du lịch',
  },
  {
    value: 'Trò chơi',
    label: 'Trò chơi',
  },
  {
    value: 'Nhiếp ảnh',
    label: 'Nhiếp ảnh',
  },
  {
    value: 'Khiêu vũ',
    label: 'Khiêu vũ',
  },
  {
    value: 'Nấu ăn',
    label: 'Nấu ăn',
  },
];

const Registration = () => {
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
      registrationStatusOptions={registrationStatusOptions}
      genderOptions={genderOptions}
      hobbyOptions={hobbyOptions}
    />
  ) : (
    <Student permissionList={permissionList} />
  );
};

export default Registration;

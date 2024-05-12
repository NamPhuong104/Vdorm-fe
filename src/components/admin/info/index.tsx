'use client';

import AppTitle from '@/components/admin/global/Title';
import { useAxiosAuth } from '@/util/customHook';
import { Descriptions } from 'antd';
import { DescriptionsProps } from 'antd/lib';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import HashLoader from 'react-spinners/HashLoader';

const Info = () => {
  const { status, data: session } = useSession();
  const axiosAuth = useAxiosAuth();
  const [studentInfo, setStudentInfo] = useState<IStudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [basicInfo, setBasicInfo] = useState<string[]>([]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchStudentInfo();
      setBasicInfo(session.user?.name?.split(' - ') ?? []);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const fetchStudentInfo = async () => {
    try {
      setIsLoading(true);
      const res = await axiosAuth.get(
        `/student-profiles/${session?.account?._id}`,
      );
      setStudentInfo(res?.data?.data as IStudentProfile);
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      setStudentInfo(null);
    }
  };

  const items: DescriptionsProps['items'] = [
    {
      label: 'Mã số sinh viên',
      span: { xxl: 2 },
      children: basicInfo[0] ?? '',
    },
    {
      label: 'Họ và tên',
      span: { xxl: 2 },
      children: basicInfo[1] ?? '',
    },
    {
      label: 'Giới tính',
      span: { xxl: 2 },
      children: studentInfo?.student?.gender ?? '',
    },
    {
      label: 'Ngày sinh',
      span: { xxl: 2 },
      children: studentInfo?.student?.dateOfBirth
        ? dayjs(studentInfo?.student?.dateOfBirth).format('DD/MM/YYYY')
        : '',
    },
    {
      label: 'Email',
      span: { xxl: 2 },
      children: session?.user?.email,
    },
    {
      label: 'Số điện thoại',
      span: { xxl: 2 },
      children: studentInfo?.student?.phone ?? '',
    },
    {
      label: 'Quê quán',
      span: { xxl: 2 },
      children: studentInfo?.student?.homeTown ?? '',
    },
    {
      label: 'Sở thích',
      span: { xxl: 2 },
      children: studentInfo?.student?.hobbyList?.join(', ') ?? '',
    },
    {
      label: 'Khóa',
      span: { xxl: 2 },
      children: studentInfo?.student?.course ?? '',
    },
    {
      label: 'Ngành',
      span: { xxl: 2 },
      children: studentInfo?.student?.major?.name ?? '',
    },
    {
      label: 'Chi nhánh',
      span: { xxl: 2 },
      children: studentInfo?.branch?.name ?? '',
    },
    {
      label: 'Phòng',
      span: { xxl: 2 },
      children: studentInfo?.room?.code ?? '',
    },
  ];

  return (
    <div className="info-page">
      {isLoading && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <HashLoader color="#d72134" />
        </div>
      )}
      {!isLoading && (
        <>
          <AppTitle moduleName="Thông Tin Cá Nhân" />
          <Descriptions
            bordered
            column={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 4 }}
            items={items}
            style={{ marginTop: '10px' }}
          />
        </>
      )}
    </div>
  );
};

export default Info;

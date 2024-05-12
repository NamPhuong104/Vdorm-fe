'use client';

import AppTitle from '@/components/admin/global/Title';
import { IAccount } from '@/types/next-auth';
import { useAxiosAuth } from '@/util/customHook';
import { Tabs } from 'antd';
import { TabsProps } from 'antd/lib';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import HashLoader from 'react-spinners/HashLoader';
import HomeAboutUsCard from './card/about-us';
import HomeCommonQuestionCard from './card/common-question';
import HomeRoomTypeCard from './card/room-type';
import HomeServiceTypeCard from './card/service-type';

const Home = () => {
  const { status, data: session } = useSession();
  const axiosAuth = useAxiosAuth();
  const [permissionList, setPermissionList] = useState<IPermission[]>([]);
  const [contentList, setContentList] = useState<IContent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (
      status === 'authenticated' &&
      session.account.role.name === 'Sinh viên'
    ) {
      redirect('/admin/info');
    }
  }, [status, session]);

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
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    if (status === 'authenticated' && permissionList.length) {
      fetchContentList();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, permissionList]);

  const fetchContentList = async () => {
    try {
      setIsLoading(true);
      const res = await axiosAuth.get(`/contents?`);
      setContentList(res?.data?.data?.result as IContent[]);
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      setContentList([]);
    }
  };

  const handleFilterContentData = (category: string, subCategory: string) => {
    if (contentList.length > 0) {
      return contentList.filter((item) => {
        return item.category === category && item.subCategory === subCategory;
      })[0];
    }
  };

  const mainItems: TabsProps['items'] = [
    {
      key: '1',
      label: 'Về chúng tôi',
      children: (
        <HomeAboutUsCard
          data={
            handleFilterContentData('Home', 'About Us') as IContentHomeAboutUs
          }
        />
      ),
    },
    {
      key: '2',
      label: 'Loại phòng',
      children: (
        <HomeRoomTypeCard
          data={
            handleFilterContentData('Home', 'Room Type') as IContentHomeRoomType
          }
        />
      ),
    },
    {
      key: '3',
      label: 'Dịch vụ & Tiện ích',
      children: (
        <HomeServiceTypeCard
          data={
            handleFilterContentData(
              'Home',
              'Service Type',
            ) as IContentHomeServiceType
          }
        />
      ),
    },
    {
      key: '4',
      label: 'Câu hỏi thường gặp',
      children: (
        <HomeCommonQuestionCard
          data={
            handleFilterContentData(
              'Home',
              'Common Question',
            ) as IContentHomeCommonQuestion
          }
        />
      ),
    },
  ];

  return (
    <div className="home-page">
      {isLoading && (
        <div style={{ width: '100%' }}>
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
        </div>
      )}
      {!isLoading && contentList.length > 0 && (
        <>
          <AppTitle moduleName="Trang Chủ" />
          <Tabs
            defaultActiveKey="1"
            type={'card'}
            items={mainItems}
            style={{ marginTop: '20px' }}
          />
        </>
      )}
    </div>
  );
};

export default Home;

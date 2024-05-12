'use client';

import { sheliaFont } from '@/app/fonts/fonts';
import { useAxiosAuth } from '@/util/customHook';
import { Button, Flex, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import Title from 'antd/es/typography/Title';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Section1 from './section-1';
import Section2 from './section-2';
import Section3 from './section-3';
import Section4 from './section-4';
import Section5 from './section-5';

const Home = () => {
  const { status } = useSession();
  const axiosAuth = useAxiosAuth();
  const [data, setData] = useState<IContent[]>([]);
  const [newsList, setNewsList] = useState<INew[]>([]);

  useEffect(() => {
    fetchData();
    fetchNewsList();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      const res = await axiosAuth.get(`/contents`);
      setData(res?.data?.data?.result);
    } catch (error) {
      setData([]);
    }
  };

  const fetchNewsList = async () => {
    try {
      const res = await axiosAuth.get(
        `/news?current=1&pageSize=9&sort=createdAt`,
      );
      setNewsList(res?.data?.data?.result);
    } catch (error) {
      setNewsList([]);
    }
  };

  const handleFilterContentData = (
    data: IContent[],
    category: string,
    subCategory: string,
  ) => {
    if (data.length > 0) {
      return data.filter((item) => {
        return item.category === category && item.subCategory === subCategory;
      })[0];
    }
  };

  if (!data.length || !newsList.length)
    return (
      <div style={{ height: '100vh', width: '100vw' }}>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Image
            quality={100}
            width={100}
            height={100}
            src="/logo.svg"
            alt="logo"
          />
        </div>
      </div>
    );

  return (
    <div className={`client-homepage ${sheliaFont.variable}`}>
      <Content>
        <div className="client-homepage-content">
          <div className="client-homepage-video-container">
            <Flex className="video-overlay-btn" align="center" justify="center">
              <Typography>Nâng Tầm Trải Nghiệm</Typography>
              <Title level={1}>KÝ TÚC XÁ ĐẠI HỌC VĂN LANG</Title>
              <p>
                Ngôi nhà chung ấm cúng, tiện nghi, không gian sống lý tưởng dành
                cho sinh viên Văn Lang
              </p>
              {status === 'authenticated' ? (
                <Link href={'/room-register'}>
                  <Button>ĐĂNG KÝ NGAY</Button>
                </Link>
              ) : (
                <Button
                  onClick={() =>
                    signIn('azure-ad', {
                      callbackUrl: '/room-register',
                    })
                  }
                >
                  ĐĂNG KÝ NGAY
                </Button>
              )}
            </Flex>
            <div className="video-overlay"></div>
            <video
              autoPlay
              muted
              loop
              playsInline
              src="/home/video.mp4"
              poster="/home/poster.jpg"
            ></video>
          </div>
          <div className="client-homepage-main-content">
            <Section1
              data={
                handleFilterContentData(
                  data,
                  'Home',
                  'About Us',
                ) as IContentHomeAboutUs
              }
            />
            <Section2
              data={
                handleFilterContentData(
                  data,
                  'Home',
                  'Room Type',
                ) as IContentHomeRoomType
              }
            />
            <Section3
              data={
                handleFilterContentData(
                  data,
                  'Home',
                  'Service Type',
                ) as IContentHomeServiceType
              }
            />
            <Section4 newsList={newsList} />
            <Section5
              data={
                handleFilterContentData(
                  data,
                  'Home',
                  'Common Question',
                ) as IContentHomeCommonQuestion
              }
            />
          </div>
        </div>
      </Content>
    </div>
  );
};

export default Home;

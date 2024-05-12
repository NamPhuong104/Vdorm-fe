'use client';

import { useHasMounted } from '@/util/customHook';
import { Button, Card, Flex, Typography } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import useMediaQuery from 'use-media-antd-query';

const SignIn = () => {
  const hasMounted = useHasMounted();
  const { status, data: session } = useSession();
  const colSize = useMediaQuery();
  const [screenSize, setScreenSize] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setScreenSize(colSize);
    }
  }, [colSize]);

  useEffect(() => {
    if (status === 'authenticated') {
      redirect('/');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session]);

  if (!hasMounted) return <></>;

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Image
        src={`${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/global/VLU-University.webp`}
        alt="dormitory"
        fill
        priority={true}
        style={{ objectFit: 'cover' }}
        rel="stylesheet preload prefetch"
      ></Image>
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          background:
            'linear-gradient(135deg, rgba(215,33,52, 0.5), rgba(0, 0, 0, 0.5))',
        }}
      >
        <Flex
          align="center"
          justify="center"
          style={{
            width: '100%',
            height: '100%',
            flexDirection: 'column',
          }}
        >
          <Typography.Text
            style={{
              color: '#fff',
              fontSize: '22px',
              fontWeight: '700',
              letterSpacing: '1px',
            }}
          >
            TRANG QUẢN LÝ
          </Typography.Text>
          <Typography.Text
            style={{
              color: '#fff',
              fontSize: '40px',
              fontWeight: '700',
              letterSpacing: '2px',
            }}
          >
            KÝ TÚC XÁ
          </Typography.Text>
          <div
            style={{
              justifyContent: 'center',
              marginTop: '30px',
              marginBottom: '30px',
              width: screenSize === 'xs' ? '80%' : '400px',
            }}
          >
            <Card
              style={{
                backgroundColor: 'rgba(0,0,0, 0.6)',
                border: 0,
                borderRadius: '10px',
              }}
              bodyStyle={{
                backgroundColor: 'rgba(0,0,0, 0.5)',
                border: 0,
                borderRadius: '10px',
              }}
            >
              <Flex
                align="center"
                justify="center"
                gap={'20px'}
                style={{ flexDirection: 'column', textAlign: 'center' }}
              >
                <Image
                  quality={100}
                  width={100}
                  height={100}
                  src="/logo.svg"
                  alt="logo"
                />
                <Typography.Text
                  style={{
                    color: '#fff',
                    fontSize: '18px',
                    fontWeight: '600',
                  }}
                >
                  Đăng nhập với tài khoản Văn Lang
                </Typography.Text>
                <Button
                  className="action-buttons"
                  type="default"
                  size={'large'}
                  style={{
                    color: '#fff',
                    backgroundColor: '#d51c29',
                    borderColor: '#d51c29',
                    fontSize: '18px',
                    fontWeight: '600',
                    height: 'auto',
                    width: '100%',
                    padding: '15px 0',
                    letterSpacing: '1px',
                  }}
                  onClick={() =>
                    signIn('azure-ad', {
                      callbackUrl: '/',
                    })
                  }
                >
                  ĐĂNG NHẬP
                </Button>
              </Flex>
            </Card>
          </div>
          <Typography.Text
            style={{
              color: '#fff',
              fontSize: '18px',
              fontWeight: '500',
              textAlign: 'center',
            }}
          >
            © {dayjs().year()} - Bản Quyền Thuộc Ký Túc Xá, Trường Đại học Văn
            Lang.
          </Typography.Text>
        </Flex>
      </div>
    </div>
  );
};

export default SignIn;

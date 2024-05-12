'use client';

import { MenuOutlined } from '@ant-design/icons';
import { Button, Typography } from 'antd';
import { Header } from 'antd/es/layout/layout';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface IProps {
  setIsDrawerOpen?: () => void;
}

const NavigationBar = (props: IProps) => {
  const { setIsDrawerOpen } = props;
  const { status, data: session } = useSession();
  const [role, setRole] = useState<string>('');

  useEffect(() => {
    if (status === 'authenticated') {
      setRole(session.account.role.name);
    }
  }, [status, session]);

  return (
    <Header className="admin-layout">
      <div
        className="vlu-dorm-logo"
        style={{
          position: 'relative',
          display: 'flex',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Link
          href={role === 'Sinh viên' ? '/admin/info' : '/admin/dashboard'}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            quality={100}
            width={45}
            height={45}
            src="/logo.svg"
            alt="logo"
            style={{ cursor: 'pointer' }}
          />
          <Typography
            style={{
              padding: '0px 10px',
              color: '#d72134',
              fontSize: '28px',
              fontWeight: 1000,
              fontFamily: 'sans-serif',
              cursor: 'pointer',
            }}
          >
            VDORM
          </Typography>
        </Link>
      </div>
      {setIsDrawerOpen && (
        <div className="side-bar-trigger-btn">
          <Button icon={<MenuOutlined />} onClick={setIsDrawerOpen} />
        </div>
      )}
    </Header>
  );
};

export default NavigationBar;

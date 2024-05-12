'use client';

import { ClockCircleOutlined } from '@ant-design/icons';
import { Button, Result } from 'antd';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

const Active = () => {
  return (
    <div
      className="active-page"
      style={{ width: '100vw', height: '100vh', position: 'relative' }}
    >
      <Result
        icon={<ClockCircleOutlined style={{ color: '#d71e35' }} />}
        subTitle="Vui lòng đăng xuất và liên hệ quản trị viên để kích hoạt tài khoản !"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          padding: '0px 10px',
        }}
        extra={
          <Button
            type="primary"
            style={{ color: '#fff', backgroundColor: '#d71e35' }}
            onClick={() => signOut({ callbackUrl: `/` })}
          >
            <Link href="/">Đăng xuất</Link>
          </Button>
        }
      />
    </div>
  );
};

export default Active;

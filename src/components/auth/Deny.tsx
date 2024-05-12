'use client';

import { Button, Result } from 'antd';
import Link from 'next/link';

const Deny = () => {
  return (
    <div
      className="deny-page"
      style={{ width: '100vw', height: '100vh', position: 'relative' }}
    >
      <Result
        status="403"
        title="403"
        subTitle="Xin lỗi, bạn không có quyền truy cập tài nguyên này ! Vui lòng quay lại trang chủ."
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
          >
            <Link href="/">Trở về trang chủ</Link>
          </Button>
        }
      />
    </div>
  );
};

export default Deny;

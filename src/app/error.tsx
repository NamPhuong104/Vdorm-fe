'use client';

import { Button, Result } from 'antd';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      className="error-page"
      style={{ width: '100vw', height: '100vh', position: 'relative' }}
    >
      <Result
        status="500"
        title="500"
        subTitle="Xin lỗi, hệ thống đã xảy ra lỗi !"
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
            onClick={() => reset()}
          >
            Thử lại
          </Button>
        }
      />
    </div>
  );
}

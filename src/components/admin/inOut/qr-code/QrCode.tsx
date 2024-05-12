'use client';

import { Flex, Typography } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import Image from 'next/image';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import useMediaQuery from 'use-media-antd-query';

const QrCode = () => {
  const colSize = useMediaQuery();
  const [screenSize, setScreenSize] = useState<string>('');
  const [qrCode, setQRCode] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(5);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setScreenSize(colSize);
    }
  }, [colSize]);

  useEffect(() => {
    generateQRCode();
  }, []);

  useEffect(() => {
    if (timeLeft === -1) {
      generateQRCode();
    }

    const intervalCountdown = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalCountdown);
  });

  useEffect(() => {
    if (timeLeft === -1) setTimeLeft(5);
  }, [timeLeft]);

  useEffect(() => {
    const date = new Date();
    const daysOfWeek = [
      'Chủ nhật',
      'Thứ hai',
      'Thứ ba',
      'Thứ tư',
      'Thứ năm',
      'Thứ sáu',
      'Thứ bảy',
    ];
    const currentDayOfWeek = daysOfWeek[date.getDay()];
    setCurrentDate(currentDayOfWeek);

    const currentTime = dayjs().format('DD/MM/YYYY - HH:mm:ss');
    setCurrentTime(currentTime);
  });

  const generateQRCode = () => {
    QRCode.toDataURL(
      Date.now().toString(),
      {
        width: 400,
        margin: 2,
        color: {
          dark: '#000',
          light: '#FFF',
        },
      },
      (err, url) => {
        if (err) setQRCode('');

        setQRCode(url);
      },
    );
  };

  return (
    <div
      className="qr-code-page"
      style={{
        height: ['lg', 'xl', 'xxl'].includes(screenSize)
          ? 'calc(100vh - 100px)'
          : 'auto',
      }}
    >
      <Typography.Title
        level={['lg', 'xl', 'xxl'].includes(screenSize) ? 2 : 3}
        style={{
          textAlign: 'center',
          marginTop: '30px',
          color: 'red',
          fontWeight: '700',
        }}
      >
        Quét mã khi đi vào hoặc đi ra ký túc xá !
      </Typography.Title>
      {qrCode && ['lg', 'xl', 'xxl'].includes(screenSize) && (
        <Flex
          justify="center"
          align="center"
          gap={50}
          style={{
            height: '90%',
            width: '90%',
            margin: '0 auto',
            textAlign: 'justify',
          }}
        >
          <Image width={400} height={400} src={qrCode} alt="qr-code" />
          <Flex justify="center" style={{ flexDirection: 'column' }}>
            <Typography.Title level={3}>
              {currentDate} - {currentTime}
            </Typography.Title>
            <Typography.Title level={3}>
              QR code sẽ hết hạn và tự động thay đổi sau:{' '}
              {timeLeft === -1 ? 0 : 0}s
            </Typography.Title>
            <Typography.Title level={3}>
              Thời gian giới nghiêm: 05:00:00 - 23:00:00
            </Typography.Title>
            <Typography.Title level={3}>
              * Lưu ý: Nếu sinh viên check in hoặc check out ngoài thời gian
              giới nghiêm sẽ bị lập biên bản vi phạm
            </Typography.Title>
          </Flex>
        </Flex>
      )}
      {qrCode && ['xs', 'sm', 'md'].includes(screenSize) && (
        <Flex
          justify="center"
          align="center"
          gap={50}
          style={{ height: 'auto', width: '100%', flexDirection: 'column' }}
        >
          <Image width={300} height={300} src={qrCode} alt="qr-code" />
          <Flex
            justify="center"
            style={{
              flexDirection: 'column',
              width: '90%',
              textAlign: 'justify',
            }}
          >
            <Typography.Title level={3}>
              {currentDate} - {currentTime}
            </Typography.Title>
            <Typography.Title level={3}>
              QR code sẽ hết hạn và tự động thay đổi sau:{' '}
              {timeLeft === -1 ? 0 : timeLeft}s
            </Typography.Title>
            <Typography.Title level={3}>
              Thời gian giới nghiêm: 05:00:00 - 23:00:00
            </Typography.Title>
            <Typography.Title level={3}>
              * Lưu ý: Nếu sinh viên check in hoặc check out ngoài thời gian
              giới nghiêm sẽ bị lập biên bản vi phạm
            </Typography.Title>
          </Flex>
        </Flex>
      )}
    </div>
  );
};

export default QrCode;

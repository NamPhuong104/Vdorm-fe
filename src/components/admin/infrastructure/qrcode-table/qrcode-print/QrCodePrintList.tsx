'use client';

import { PrinterOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Flex, Image, Space, Typography } from 'antd';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const QrCodePrintList = () => {
  const [data, setData] = useState<IInfrastructureQRCode[]>([]);

  useEffect(() => {
    getDataFromLocalStorage('selectedQrRows');

    const handlePopState = () => {
      localStorage.removeItem('selectedQrRows');
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const getDataFromLocalStorage = (key: any) => {
    try {
      const serializedData: any = localStorage.getItem(key);
      setData(JSON.parse(serializedData));
    } catch (error) {
      console.error('Error retrieving data from localStorage:', error);
      return null;
    }
  };

  return data ? (
    <>
      <Flex
        align="center"
        justify="space-between"
        className="qrcode-breadcrumb"
        style={{ marginBottom: '15px' }}
      >
        <Breadcrumb
          items={[
            {
              title: (
                <Link
                  href={'/admin/infrastructure'}
                  onClick={() => {
                    localStorage.removeItem('selectedQrRows');
                  }}
                >
                  Cơ Sở Vật Chất
                </Link>
              ),
            },
            { title: 'Qr-Code' },
          ]}
        />
        <Button
          className="print-btn"
          type="primary"
          size={'middle'}
          style={{
            padding: '4px 18px',
            fontWeight: '600',
            background: '#1653b5',
            borderColor: '#1653b5',
            color: 'white',
            boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
          }}
          onClick={() => print()}
        >
          IN <PrinterOutlined />
        </Button>
      </Flex>
      <Space style={{ display: 'flex' }} wrap>
        {data.map((i) => {
          return (
            <Flex
              key={i._id}
              justify="center"
              align="center"
              style={{
                padding: '10px 20px',
                background: 'white',
                borderRadius: '10px',
              }}
            >
              <Flex align="center" style={{ flexDirection: 'column' }}>
                <Space>
                  <Image
                    width={30}
                    height={30}
                    src="/logo.svg"
                    alt="logo-vlu"
                    preview={false}
                  />
                  <span
                    style={{
                      fontSize: '20px',
                      fontFamily: 'sans-serif',
                      fontWeight: 700,
                    }}
                  >
                    VLU
                  </span>
                </Space>
                <Image
                  width={100}
                  src={i?.qrCode}
                  alt="infrastructure-qr-code"
                  preview={false}
                />
              </Flex>
              <Flex
                align="center"
                justify="flex-end"
                style={{
                  flexDirection: 'column',
                  fontSize: '15px',
                  fontWeight: 600,
                  height: '100%',
                  paddingTop: '30px',
                }}
              >
                <Typography.Text>{i?.code}</Typography.Text>
                <Typography.Text>{i?.name}</Typography.Text>
                <Typography.Text>{i?.model}</Typography.Text>
              </Flex>
            </Flex>
          );
        })}
      </Space>
    </>
  ) : (
    <></>
  );
};

export default QrCodePrintList;

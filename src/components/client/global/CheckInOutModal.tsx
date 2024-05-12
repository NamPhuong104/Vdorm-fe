'use client';

import { useAxiosAuth } from '@/util/customHook';
import { Modal, notification, Result } from 'antd';
import {
  Html5QrcodeScanner,
  Html5QrcodeScanType,
  Html5QrcodeSupportedFormats,
} from 'html5-qrcode';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface IProps {
  isCheckInOutModalOpen: boolean;
  setIsCheckInOutModalOpen: (value: boolean) => void;
  isOnCamera: boolean;
  setIsOnCamera: (value: boolean) => void;
  cameraType: string;
  fetchInOutList?: () => void;
}

const CheckInOutModal = (props: IProps) => {
  const {
    isCheckInOutModalOpen,
    setIsCheckInOutModalOpen,
    isOnCamera,
    setIsOnCamera,
    cameraType,
    fetchInOutList,
  } = props;
  const { status, data: session } = useSession();
  const axiosAuth = useAxiosAuth();
  const [socket, setSocket] = useState<Socket>();
  const [scanResult, setScanResult] = useState('');

  useEffect(() => {
    const socket: Socket = io(`${process.env.NEXT_PUBLIC_BACKEND_HOST}`);
    setSocket(socket);

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    if (isOnCamera && typeof window !== 'undefined') {
      const html5QrcodeScanner = new Html5QrcodeScanner(
        'reader',
        {
          fps: 10,
          qrbox: { width: 200, height: 200 },
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
          supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
        },
        false,
      );
      const onScanSuccess = (decodedText: any, decodedResult: any) => {
        setScanResult(decodedText);
      };
      const onScanFailure = (error: any) => {
        setScanResult('');
      };
      html5QrcodeScanner.render(onScanSuccess, onScanFailure);

      return () => {
        html5QrcodeScanner.clear();
      };
    }
  }, [isOnCamera]);

  useEffect(() => {
    if (status === 'authenticated' && session.account && scanResult) {
      handleCheckInOut(session.account.email, cameraType, scanResult);
      setIsOnCamera(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, scanResult]);

  const handleCheckInOut = async (
    email: string,
    type: string,
    qrCode: string,
  ) => {
    const data = {
      email,
      type,
      qrCode,
    };

    handleCloseCheckInOutModal();

    try {
      const res: IAxios<IResponse<any>> = await axiosAuth.post(
        `/check-in-out`,
        data,
      );

      if (res.data && res.data.message === 'success') {
        if (cameraType === 'in') {
          socket?.emit('checkInOut', { email, type });
          notification.open({
            message: <Result status="success" title="Check in thành công !" />,
            duration: 2,
          });
        } else {
          socket?.emit('checkInOut', { email, type });
          notification.open({
            message: <Result status="success" title="Check out thành công !" />,
            duration: 2,
          });
        }
        fetchInOutList && fetchInOutList();
      }
    } catch (error: any) {
      if (cameraType === 'in') {
        notification.open({
          message: (
            <Result status="error" title={error?.response?.data?.message} />
          ),
          duration: 2,
        });
      } else {
        notification.open({
          message: (
            <Result status="error" title={error?.response?.data?.message} />
          ),
          duration: 2,
        });
      }
    }
  };

  const handleCloseCheckInOutModal = () => {
    setIsOnCamera(false);
    setIsCheckInOutModalOpen(false);
  };

  return (
    <Modal
      title={cameraType === 'in' ? 'Check In' : 'Check Out'}
      maskClosable={false}
      centered
      open={isCheckInOutModalOpen}
      onCancel={handleCloseCheckInOutModal}
      footer={null}
    >
      <div
        id="reader"
        style={{ width: 'auto', height: 'auto', margin: '0 auto' }}
      ></div>
    </Modal>
  );
};

export default CheckInOutModal;

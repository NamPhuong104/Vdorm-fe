'use client';

import { useAxiosAuth } from '@/util/customHook';
import { Form, Modal, Typography, notification } from 'antd';
import { useState } from 'react';

interface IProps {
  isSendInvoiceEmailModalOpen: boolean;
  setIsSendInvoiceEmailModalOpen: (value: boolean) => void;
}

const SendInvoiceEmailModal = (props: IProps) => {
  const { isSendInvoiceEmailModalOpen, setIsSendInvoiceEmailModalOpen } = props;
  const axiosAuth = useAxiosAuth();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCloseSendInvoiceEmailModal = () => {
    setIsSendInvoiceEmailModalOpen(false);
  };

  const onFinish = async (values: any) => {
    try {
      setIsLoading(true);
      const res = await axiosAuth.get(`/emails/invoice`);

      if (res.data && res.data.message === 'success') {
        notification.success({
          message: 'Gửi email thành công !',
          duration: 2,
        });
        setIsLoading(false);
        handleCloseSendInvoiceEmailModal();
      }
    } catch (error: any) {
      setIsLoading(false);
      notification.error({
        message: 'Gửi email thất bại !',
        description: error?.response?.data?.message,
        duration: 2,
      });
    }
  };

  return (
    <Modal
      title="Gửi email thông báo"
      maskClosable={false}
      centered
      open={isSendInvoiceEmailModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCloseSendInvoiceEmailModal}
      okText="Gửi"
      cancelText="Hủy"
      confirmLoading={isLoading}
    >
      <Form name="send-invoice-email" form={form} onFinish={onFinish}>
        <Typography.Text>
          Bạn có chắc chắn muốn gửi email đến tất cả phòng có hóa đơn chưa thanh
          toán không ?
        </Typography.Text>
      </Form>
    </Modal>
  );
};

export default SendInvoiceEmailModal;

'use client';

import { useAxiosAuth } from '@/util/customHook';
import { Form, Modal, Typography, notification } from 'antd';
import { useState } from 'react';

interface IProps {
  isUpdateManyRegistrationModalOpen: boolean;
  setIsUpdateManyRegistrationModalOpen: (value: boolean) => void;
  fetchArrangeList: () => void;
  fetchRegistrationList: () => void;
}

const UpdateManyRegistrationModal = (props: IProps) => {
  const {
    isUpdateManyRegistrationModalOpen,
    setIsUpdateManyRegistrationModalOpen,
    fetchArrangeList,
    fetchRegistrationList,
  } = props;
  const axiosAuth = useAxiosAuth();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCloseUpdateManyRegistrationModal = () => {
    setIsUpdateManyRegistrationModalOpen(false);
  };

  const onFinish = async (values: any) => {
    try {
      setIsLoading(true);
      const res = await axiosAuth.get(`/registrations/many-status`);

      if (res.data && res.data.message === 'success') {
        notification.success({
          message: 'Cập nhật thành công !',
          duration: 2,
        });
        setIsLoading(false);
        handleCloseUpdateManyRegistrationModal();
        fetchArrangeList();
        fetchRegistrationList();
      }
    } catch (error: any) {
      setIsLoading(false);
      notification.error({
        message: 'Cập nhật thất bại !',
        description: error?.response?.data?.message,
        duration: 2,
      });
    }
  };

  return (
    <Modal
      title="Cập nhật đơn đăng ký"
      maskClosable={false}
      centered
      open={isUpdateManyRegistrationModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCloseUpdateManyRegistrationModal}
      okText="Cập nhật"
      cancelText="Hủy"
      confirmLoading={isLoading}
    >
      <Form name="update-many-registration" form={form} onFinish={onFinish}>
        <Typography.Text>
          {`Bạn có muốn cập nhật tất cả đơn đăng ký có trạng thái "Đang chờ xử
          lý" sang trạng thái "Đang xử lý" không ?`}
        </Typography.Text>
      </Form>
    </Modal>
  );
};

export default UpdateManyRegistrationModal;

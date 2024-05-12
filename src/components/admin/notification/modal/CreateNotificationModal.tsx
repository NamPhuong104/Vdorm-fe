'use client';

import { useAxiosAuth } from '@/util/customHook';
import { DatePicker, Form, Input, Modal, notification } from 'antd';
import locale from 'antd/es/date-picker/locale/vi_VN';
import TextArea from 'antd/es/input/TextArea';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

interface IProps {
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (value: boolean) => void;
  fetchNotificationList: () => void;
}

const CreateNotificationModal = (props: IProps) => {
  const { isCreateModalOpen, setIsCreateModalOpen, fetchNotificationList } =
    props;
  const { data: session } = useSession();
  const axiosAuth = useAxiosAuth();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCloseCreateModal = () => {
    form.resetFields();
    setIsCreateModalOpen(false);
  };

  const onFinish = async (values: any) => {
    const { title, sender, publishDate, content } = values;
    const data = {
      title: title.trim(),
      sender: sender.trim(),
      publishDate: dayjs(publishDate).format('YYYY-MM-DD'),
      content: content.trim(),
    };

    try {
      setIsLoading(true);
      const res = await axiosAuth.post(`/notifications`, data);

      if (res.data && res.data.message === 'success') {
        notification.success({
          message: 'Tạo mới thành công !',
          duration: 2,
        });
        setIsLoading(false);
        handleCloseCreateModal();
        fetchNotificationList();
      }
    } catch (error: any) {
      setIsLoading(false);
      notification.error({
        message: 'Tạo mới thất bại !',
        description: error?.response?.data?.message,
        duration: 2,
      });
    }
  };

  return (
    <Modal
      title="Thêm mới thông báo"
      maskClosable={false}
      centered
      open={isCreateModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCloseCreateModal}
      okText="Lưu"
      cancelText="Hủy"
      confirmLoading={isLoading}
    >
      <Form
        name="create-notification"
        form={form}
        onFinish={onFinish}
        initialValues={{ sender: `${session?.account?.name}` }}
      >
        <Form.Item<INotification> label="Người gửi" name="sender">
          <Input disabled />
        </Form.Item>
        <Form.Item<INotification>
          label="Tiêu đề"
          name="title"
          rules={[{ required: true, message: 'Vui lòng nhập tiêu đề !' }]}
        >
          <Input allowClear placeholder="Nhập tiêu đề" />
        </Form.Item>
        <Form.Item<INotification>
          label="Ngày gửi"
          name="publishDate"
          rules={[
            {
              required: true,
              message: 'Vui lòng chọn ngày gửi !',
            },
          ]}
        >
          <DatePicker
            locale={locale}
            style={{ width: '100%' }}
            format={'DD/MM/YYYY'}
            allowClear
            placeholder="Chọn ngày gửi"
            placement="bottomRight"
          />
        </Form.Item>
        <Form.Item<INotification>
          label="Nội dung"
          name="content"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập nội dung !',
            },
          ]}
        >
          <TextArea allowClear placeholder="Nhập nội dung" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateNotificationModal;

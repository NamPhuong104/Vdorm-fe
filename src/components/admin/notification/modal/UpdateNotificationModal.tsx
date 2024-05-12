'use client';

import { useAxiosAuth } from '@/util/customHook';
import { DatePicker, Form, Input, Modal, notification } from 'antd';
import locale from 'antd/es/date-picker/locale/vi_VN';
import TextArea from 'antd/es/input/TextArea';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

interface IProps {
  isUpdateModalOpen: boolean;
  setIsUpdateModalOpen: (value: boolean) => void;
  notificationUpdateData: null | INotification;
  setNotificationUpdateData: (value: null | INotification) => void;
  fetchNotificationList: () => void;
}

const UpdateNotificationModal = (props: IProps) => {
  const {
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    notificationUpdateData,
    setNotificationUpdateData,
    fetchNotificationList,
  } = props;
  const axiosAuth = useAxiosAuth();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (notificationUpdateData) {
      form.setFieldsValue({
        sender: notificationUpdateData.sender,
        title: notificationUpdateData.title,
        publishDate: dayjs(notificationUpdateData.publishDate),
        content: notificationUpdateData.content,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notificationUpdateData]);

  const handleCloseUpdateModal = () => {
    form.resetFields();
    setIsUpdateModalOpen(false);
    setNotificationUpdateData(null);
  };

  const onFinish = async (values: any) => {
    const { title, sender, publishDate, content } = values;

    const data = {
      _id: notificationUpdateData?._id,
      title: title.trim(),
      sender: sender.trim(),
      publishDate: dayjs(publishDate).format('YYYY-MM-DD'),
      content: content.trim(),
    };

    try {
      setIsLoading(true);
      const res = await axiosAuth.patch(`/notifications`, data);

      if (res.data && res.data.message === 'success') {
        notification.success({
          message: 'Cập nhật thành công !',
          duration: 2,
        });
        setIsLoading(false);
        handleCloseUpdateModal();
        fetchNotificationList();
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
      title="Cập nhật thông báo"
      maskClosable={false}
      centered
      open={isUpdateModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCloseUpdateModal}
      okText="Lưu"
      cancelText="Hủy"
      confirmLoading={isLoading}
    >
      <Form name="update-notification" form={form} onFinish={onFinish}>
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

export default UpdateNotificationModal;

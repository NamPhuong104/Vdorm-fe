'use client';

import { useAxiosAuth } from '@/util/customHook';
import { Form, Input, Modal, notification } from 'antd';
import { useState } from 'react';

interface IProps {
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (value: boolean) => void;
  fetchBranchList: () => void;
}

const CreateBranchModal = (props: IProps) => {
  const { isCreateModalOpen, setIsCreateModalOpen, fetchBranchList } = props;
  const axiosAuth = useAxiosAuth();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCloseCreateModal = () => {
    form.resetFields();
    setIsCreateModalOpen(false);
  };

  const onFinish = async (values: any) => {
    const { name, address, email, phone } = values;
    const data = {
      name: name.trim(),
      address: address.trim(),
      email: email.trim(),
      phone: phone.trim(),
    };

    try {
      setIsLoading(true);
      const res = await axiosAuth.post(`/branches`, data);

      if (res.data && res.data.message === 'success') {
        notification.success({
          message: 'Tạo mới thành công !',
          duration: 2,
        });
        setIsLoading(false);
        handleCloseCreateModal();
        fetchBranchList();
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
      title="Thêm mới ký túc xá"
      maskClosable={false}
      centered
      open={isCreateModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCloseCreateModal}
      okText="Lưu"
      cancelText="Hủy"
      confirmLoading={isLoading}
    >
      <Form name="create-branch" form={form} onFinish={onFinish}>
        <Form.Item<IBranch>
          label="Tên"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên !' }]}
        >
          <Input allowClear placeholder="Nhập tên" />
        </Form.Item>
        <Form.Item<IBranch>
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ !' }]}
        >
          <Input allowClear placeholder="Nhập địa chỉ" />
        </Form.Item>
        <Form.Item<IBranch>
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập email !' },
            {
              type: 'email',
              message: 'Vui lòng nhập đúng định dạng email !',
            },
          ]}
        >
          <Input allowClear placeholder="Nhập email" />
        </Form.Item>
        <Form.Item<IBranch>
          label="Số điện thoại"
          name="phone"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập số điện thoại !',
            },
            {
              pattern: /^[0-9]*$/,
              message: 'Vui lòng nhập đúng định dạng số điện thoại !',
            },
            { min: 10, message: 'Độ dài tối thiếu số điện thoại là 10 số !' },
            { max: 11, message: 'Độ dài tối đa số điện thoại là 11 số !' },
          ]}
        >
          <Input allowClear placeholder="Nhập số điện thoại" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateBranchModal;

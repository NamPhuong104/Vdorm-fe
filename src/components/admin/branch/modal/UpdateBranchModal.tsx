'use client';

import { useAxiosAuth } from '@/util/customHook';
import { Form, Input, Modal, notification } from 'antd';
import { useEffect, useState } from 'react';

interface IProps {
  isUpdateModalOpen: boolean;
  setIsUpdateModalOpen: (value: boolean) => void;
  branchUpdateData: null | IBranch;
  setBranchUpdateData: (value: null | IBranch) => void;
  fetchBranchList: () => void;
}

const UpdateBranchModal = (props: IProps) => {
  const {
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    branchUpdateData,
    setBranchUpdateData,
    fetchBranchList,
  } = props;
  const axiosAuth = useAxiosAuth();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (branchUpdateData) {
      form.setFieldsValue({
        name: branchUpdateData.name,
        address: branchUpdateData.address,
        email: branchUpdateData.email,
        phone: branchUpdateData.phone,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchUpdateData]);

  const handleCloseUpdateModal = () => {
    form.resetFields();
    setIsUpdateModalOpen(false);
    setBranchUpdateData(null);
  };

  const onFinish = async (values: any) => {
    const { name, address, email, phone } = values;

    const data = {
      _id: branchUpdateData?._id,
      name: name.trim(),
      address: address.trim(),
      email: email.trim(),
      phone: phone.trim(),
    };

    try {
      setIsLoading(true);
      const res = await axiosAuth.patch(`/branches`, data);

      if (res.data && res.data.message === 'success') {
        notification.success({
          message: 'Cập nhật thành công !',
          duration: 2,
        });
        setIsLoading(false);
        handleCloseUpdateModal();
        fetchBranchList();
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
      title="Cập nhật ký túc xá"
      maskClosable={false}
      centered
      open={isUpdateModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCloseUpdateModal}
      okText="Lưu"
      cancelText="Hủy"
      confirmLoading={isLoading}
    >
      <Form name="update-branch" form={form} onFinish={onFinish}>
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

export default UpdateBranchModal;

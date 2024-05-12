'use client';

import { useAxiosAuth } from '@/util/customHook';
import { Form, Input, Modal, Select, notification } from 'antd';
import { useState } from 'react';

interface IProps {
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (value: boolean) => void;
  fetchPermissionList: () => void;
  methodOptions: { value: string; label: string }[];
}

const CreatePermissionModal = (props: IProps) => {
  const {
    isCreateModalOpen,
    setIsCreateModalOpen,
    fetchPermissionList,
    methodOptions,
  } = props;
  const axiosAuth = useAxiosAuth();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCloseCreateModal = () => {
    form.resetFields();
    setIsCreateModalOpen(false);
  };

  const onFinish = async (values: any) => {
    const { name, apiPath, method, module } = values;
    const data = {
      name: name.trim(),
      apiPath: apiPath.trim(),
      method: method.trim(),
      module: module.trim(),
    };

    try {
      setIsLoading(true);
      const res = await axiosAuth.post(`/permissions`, data);

      if (res.data && res.data.message === 'success') {
        notification.success({
          message: 'Tạo mới thành công !',
          duration: 2,
        });
        setIsLoading(false);
        handleCloseCreateModal();
        fetchPermissionList();
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

  const filterOption = (
    input: string,
    option?: { label: string; value: string },
  ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  return (
    <Modal
      title="Thêm mới quyền hạn"
      maskClosable={false}
      centered
      open={isCreateModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCloseCreateModal}
      okText="Lưu"
      cancelText="Hủy"
      confirmLoading={isLoading}
    >
      <Form name="create-permission" form={form} onFinish={onFinish}>
        <Form.Item<IPermission>
          label="Tên"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên !' }]}
        >
          <Input allowClear placeholder="Nhập tên" />
        </Form.Item>
        <Form.Item<IPermission>
          label="Đường dẫn"
          name="apiPath"
          rules={[{ required: true, message: 'Vui lòng nhập đường dẫn !' }]}
        >
          <Input allowClear placeholder="Nhập đường dẫn" />
        </Form.Item>
        <Form.Item<IPermission>
          label="Phương thức"
          name="method"
          rules={[{ required: true, message: 'Vui lòng chọn phương thức !' }]}
        >
          <Select
            allowClear
            options={methodOptions}
            placeholder="Chọn phương thức"
            filterOption={filterOption}
            showSearch
          />
        </Form.Item>
        <Form.Item<IPermission>
          label="Module"
          name="module"
          rules={[{ required: true, message: 'Vui lòng nhập module !' }]}
        >
          <Input allowClear placeholder="Nhập module" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreatePermissionModal;

'use client';

import { useAxiosAuth } from '@/util/customHook';
import { Form, Input, Modal, Select, notification } from 'antd';
import { useEffect, useState } from 'react';

interface IProps {
  isUpdateModalOpen: boolean;
  setIsUpdateModalOpen: (value: boolean) => void;
  permissionUpdateData: null | IPermission;
  setPermissionUpdateData: (value: null | IPermission) => void;
  fetchPermissionList: () => void;
  methodOptions: { value: string; label: string }[];
}

const UpdatePermissionModal = (props: IProps) => {
  const {
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    permissionUpdateData,
    setPermissionUpdateData,
    fetchPermissionList,
    methodOptions,
  } = props;
  const axiosAuth = useAxiosAuth();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (permissionUpdateData) {
      form.setFieldsValue({
        name: permissionUpdateData.name,
        apiPath: permissionUpdateData.apiPath,
        method: permissionUpdateData.method,
        module: permissionUpdateData.module,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissionUpdateData]);

  const handleCloseUpdateModal = () => {
    form.resetFields();
    setIsUpdateModalOpen(false);
    setPermissionUpdateData(null);
  };

  const onFinish = async (values: any) => {
    const { name, apiPath, method, module } = values;

    const data = {
      _id: permissionUpdateData?._id,
      name: name.trim(),
      apiPath: apiPath.trim(),
      method: method.trim(),
      module: module.trim(),
    };

    try {
      setIsLoading(true);
      const res = await axiosAuth.patch(`/permissions`, data);

      if (res.data && res.data.message === 'success') {
        notification.success({
          message: 'Cập nhật thành công !',
          duration: 2,
        });
        setIsLoading(false);
        handleCloseUpdateModal();
        fetchPermissionList();
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

  const filterOption = (
    input: string,
    option?: { label: string; value: string },
  ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  return (
    <Modal
      title="Cập nhật quyền hạn"
      maskClosable={false}
      centered
      open={isUpdateModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCloseUpdateModal}
      okText="Lưu"
      cancelText="Hủy"
      confirmLoading={isLoading}
    >
      <Form name="update-permission" form={form} onFinish={onFinish}>
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

export default UpdatePermissionModal;

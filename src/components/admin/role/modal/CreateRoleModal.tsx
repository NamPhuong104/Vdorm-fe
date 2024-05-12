'use client';

import { useAxiosAuth } from '@/util/customHook';
import { Card, Form, Input, Modal, Select, notification } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import PermissionGroup from './PermissionGroup';
import { useState } from 'react';

interface IProps {
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (value: boolean) => void;
  fetchRoleList: () => void;
  isActiveOptions: { value: string; label: string }[];
  permissionListGroupByModule:
    | {
        module: string;
        permissionList: IPermission[];
      }[]
    | null;
  screenSize: string;
}

const CreateRoleModal = (props: IProps) => {
  const {
    isCreateModalOpen,
    setIsCreateModalOpen,
    fetchRoleList,
    isActiveOptions,
    permissionListGroupByModule,
    screenSize,
  } = props;
  const axiosAuth = useAxiosAuth();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    form.resetFields();
  };

  const onFinish = async (values: any) => {
    const { name, description, isActive, permissionList } = values;
    const checkedPermissionList = [];

    if (permissionList) {
      for (const key in permissionList) {
        if (key.match(/^[0-9a-fA-F]{24}$/) && permissionList[key] === true) {
          checkedPermissionList.push(key);
        }
      }
    }

    const data = {
      name: name.trim(),
      description: description.trim(),
      isActive: isActive.toString(),
      permissionList: checkedPermissionList,
    };

    try {
      setIsLoading(true);
      const res = await axiosAuth.post(`/roles`, data);

      if (res.data && res.data.message === 'success') {
        notification.success({
          message: 'Tạo mới thành công !',
          duration: 2,
        });
        setIsLoading(false);
        handleCloseCreateModal();
        fetchRoleList();
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
      title="Thêm mới chức vụ"
      maskClosable={false}
      centered
      width={screenSize === 'xs' ? '100%' : '80%'}
      open={isCreateModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCloseCreateModal}
      okText="Lưu"
      cancelText="Hủy"
      confirmLoading={isLoading}
      style={{ margin: '30px 0px' }}
    >
      <Form name="create-role" form={form} onFinish={onFinish}>
        <Form.Item<IRole>
          label="Tên"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên !' }]}
        >
          <Input allowClear placeholder="Nhập tên" />
        </Form.Item>
        <Form.Item<IRole>
          label="Mô tả"
          name="description"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập mô tả !',
            },
          ]}
        >
          <TextArea
            rows={3}
            placeholder="Nhập mô tả"
            autoSize={{ minRows: 3, maxRows: 3 }}
          />
        </Form.Item>
        <Form.Item<IRole>
          label="Trạng thái"
          name="isActive"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái !' }]}
        >
          <Select
            allowClear
            options={isActiveOptions}
            placeholder="Chọn trạng thái"
          />
        </Form.Item>
        <Card
          title="Danh sách quyền hạn"
          size="small"
          bordered
          style={{ marginBottom: '10px' }}
        >
          <PermissionGroup
            form={form}
            permissionListGroupByModule={permissionListGroupByModule}
          />
        </Card>
      </Form>
    </Modal>
  );
};

export default CreateRoleModal;

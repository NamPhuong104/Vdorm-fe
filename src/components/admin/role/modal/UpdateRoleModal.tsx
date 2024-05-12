'use client';

import { useAxiosAuth } from '@/util/customHook';
import { Card, Form, Input, Modal, Select, notification } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import PermissionGroup from './PermissionGroup';

interface IProps {
  isUpdateModalOpen: boolean;
  setIsUpdateModalOpen: (value: boolean) => void;
  roleUpdateData: null | IRole;
  setRoleUpdateData: (value: null | IRole) => void;
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

const UpdateRoleModal = (props: IProps) => {
  const {
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    roleUpdateData,
    setRoleUpdateData,
    fetchRoleList,
    isActiveOptions,
    permissionListGroupByModule,
    screenSize,
  } = props;
  const axiosAuth = useAxiosAuth();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (roleUpdateData && permissionListGroupByModule?.length) {
      form.setFieldsValue({
        name: roleUpdateData.name,
        description: roleUpdateData.description,
        isActive: roleUpdateData.isActive,
      });
      const rolePermissionList = handlePermissionListGroupByModule(
        roleUpdateData.permissionList,
      );

      permissionListGroupByModule.forEach((x) => {
        let allCheck = true;
        x.permissionList?.forEach((y) => {
          const temp = rolePermissionList.find((z) => z.module === x.module);

          if (temp) {
            const isExist = temp.permissionList.find((k) => k._id === y._id);
            if (isExist) {
              form.setFieldValue(['permissionList', y._id as string], true);
            } else allCheck = false;
          } else {
            allCheck = false;
          }
        });
        form.setFieldValue(['permissionList', x.module], allCheck);
      });

      rolePermissionList.forEach((x) => {
        x.permissionList?.forEach((y) => {
          form.setFieldValue(['permissionList', y._id], true);
        });
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleUpdateData, permissionListGroupByModule]);

  const handlePermissionListGroupByModule = (data: any) => {
    return _(data)
      .groupBy((x) => x.module)
      .map((value, key) => {
        return { module: key, permissionList: value as IPermission[] };
      })
      .value();
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    form.resetFields();
    setRoleUpdateData(null);
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
      _id: roleUpdateData?._id,
      name: name.trim(),
      description: description.trim(),
      isActive: isActive.toString(),
      permissionList: checkedPermissionList,
    };

    try {
      setIsLoading(true);
      const res = await axiosAuth.patch(`/roles`, data);

      if (res.data && res.data.message === 'success') {
        notification.success({
          message: 'Cập nhật thành công !',
          duration: 2,
        });
        setIsLoading(false);
        handleCloseUpdateModal();
        fetchRoleList();
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
      title="Cập nhật chức vụ"
      maskClosable={false}
      centered
      width={screenSize === 'xs' ? '100%' : '80%'}
      open={isUpdateModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCloseUpdateModal}
      okText="Lưu"
      cancelText="Hủy"
      confirmLoading={isLoading}
      style={{ margin: '30px 0px' }}
    >
      <Form name="update-role" form={form} onFinish={onFinish}>
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

export default UpdateRoleModal;

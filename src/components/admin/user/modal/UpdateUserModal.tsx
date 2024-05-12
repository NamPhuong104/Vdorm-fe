'use client';

import { useAxiosAuth } from '@/util/customHook';
import { DatePicker, Form, Input, Modal, Select, notification } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

interface IProps {
  isUpdateModalOpen: boolean;
  setIsUpdateModalOpen: (value: boolean) => void;
  userUpdateData: null | IUser;
  setUserUpdateData: (value: null | IUser) => void;
  fetchUserList: () => void;
  roleList: IRoleOption[];
  userStatusOptions: { value: boolean; label: string }[];
}

const UpdateUserModal = (props: IProps) => {
  const {
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    userUpdateData,
    setUserUpdateData,
    fetchUserList,
    roleList,
    userStatusOptions,
  } = props;
  const axiosAuth = useAxiosAuth();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [roleOptions, setRoleOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    if (userUpdateData) {
      form.setFieldsValue({
        code: userUpdateData.code,
        fullName: userUpdateData.fullName,
        dateOfBirth: dayjs(userUpdateData.dateOfBirth),
        email: userUpdateData.email,
        phone: userUpdateData.phone,
        role: userUpdateData.role._id,
        isActive: userUpdateData.isActive,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userUpdateData]);

  useEffect(() => {
    if (roleList) {
      const roleOptionsClone: { value: string; label: string }[] = [];
      roleList.map((role: IRoleOption) => {
        roleOptionsClone.push({ value: role._id, label: role.name });
      });
      setRoleOptions(roleOptionsClone);
    }
  }, [roleList]);

  const handleCloseUpdateModal = () => {
    form.resetFields();
    setIsUpdateModalOpen(false);
    setUserUpdateData(null);
  };

  const onFinish = async (values: any) => {
    const { code, fullName, dateOfBirth, email, phone, role, isActive } =
      values;
    const dateOfBirthValue = dayjs(dateOfBirth.toString()).format('YYYY-MM-DD');
    const data = {
      _id: userUpdateData?._id,
      code: code.trim(),
      fullName: fullName.trim(),
      dateOfBirth: dateOfBirthValue,
      email: email.trim(),
      phone: phone.trim(),
      role,
      isActive,
    };

    try {
      setIsLoading(true);
      const res = await axiosAuth.patch(`/users`, data);

      if (res.data && res.data.message === 'success') {
        notification.success({
          message: 'Cập nhật thành công !',
          duration: 2,
        });
        setIsLoading(false);
        handleCloseUpdateModal();
        fetchUserList();
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
      title="Cập nhật nhân viên"
      maskClosable={false}
      centered
      open={isUpdateModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCloseUpdateModal}
      okText="Lưu"
      cancelText="Hủy"
      confirmLoading={isLoading}
    >
      <Form name="update-user" form={form} onFinish={onFinish}>
        <Form.Item<IUser>
          label="Mã số"
          name="code"
          rules={[{ required: true, message: 'Vui lòng nhập mã số !' }]}
        >
          <Input allowClear placeholder="Nhập mã số" />
        </Form.Item>
        <Form.Item<IUser>
          label="Họ và tên"
          name="fullName"
          rules={[{ required: true, message: 'Vui lòng nhập họ và tên !' }]}
        >
          <Input allowClear placeholder="Nhập họ và tên" />
        </Form.Item>
        <Form.Item<IUser>
          label="Ngày sinh"
          name="dateOfBirth"
          rules={[{ required: true, message: 'Vui lòng chọn ngày sinh !' }]}
        >
          <DatePicker
            format={'DD-MM-YYYY'}
            inputReadOnly={true}
            placeholder="Chọn ngày sinh"
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item<IUser>
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
          <Input allowClear placeholder="Nhập email" disabled />
        </Form.Item>
        <Form.Item<IUser>
          label="Số điện thoại"
          name="phone"
          rules={[
            { required: true, message: 'Vui lòng nhập số điện thoại !' },
            {
              pattern: /^[0-9]*$/,
              message: 'Vui lòng nhập đúng định dạng số điện thoại !',
            },
            { min: 10, message: 'Độ dài tối thiếu là 10 số !' },
            { max: 11, message: 'Độ dài tối đa là 11 số !' },
          ]}
        >
          <Input allowClear placeholder="Nhập số điện thoại" />
        </Form.Item>
        <Form.Item<IUser>
          label="Chức vụ"
          name="role"
          rules={[{ required: true, message: 'Vui lòng chọn chức vụ !' }]}
        >
          <Select
            allowClear
            options={roleOptions}
            placeholder="Chọn chức vụ"
            filterOption={filterOption}
            showSearch
          />
        </Form.Item>
        <Form.Item<IUser>
          label="Trạng thái"
          name="isActive"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái !' }]}
        >
          <Select
            allowClear
            options={userStatusOptions}
            placeholder="Chọn trạng thái"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateUserModal;

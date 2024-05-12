'use client';

import { useAxiosAuth } from '@/util/customHook';
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Result,
  notification,
} from 'antd';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';

const Information = () => {
  const { data: session } = useSession();
  const axiosAuth = useAxiosAuth();
  const [form] = Form.useForm();
  const [responseStatus, setResponseStatus] = useState<boolean>(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (responseStatus) {
      redirect('/auth/active');
    }
  }, [responseStatus]);

  const handleCloseUpdateModal = () => {
    form.resetFields();
    setIsUpdateModalOpen(false);
  };

  const onFinish = async (values: any) => {
    const { code, fullName, dateOfBirth, email, phone } = values;
    const dateOfBirthValue = dayjs(dateOfBirth.toString()).format('YYYY-MM-DD');
    const data = {
      code: code.trim(),
      fullName: fullName.trim(),
      dateOfBirth: dateOfBirthValue,
      email: email.trim(),
      phone: phone.trim(),
    };

    try {
      const res: IAxios<IResponse<any>> = await axiosAuth.post(
        `/users/new`,
        data,
      );

      if (res.data && res.data.message === 'success') {
        notification.success({
          message: 'Cập nhật thành công !',
          duration: 2,
        });
        handleCloseUpdateModal();
        setResponseStatus(true);
      }
    } catch (error: any) {
      notification.error({
        message: 'Cập nhật thất bại !',
        description: error?.response?.data?.message,
        duration: 2,
      });
    }
  };

  return (
    <div
      className="information-page"
      style={{ width: '100vw', height: '100vh', position: 'relative' }}
    >
      <Result
        status="403"
        title="403"
        subTitle="Xin lỗi, bạn không có quyền truy cập tài nguyên này ! Vui lòng cập nhật thông tin nhân viên."
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          padding: '0px 10px',
        }}
        extra={
          <Button
            type="primary"
            onClick={() => setIsUpdateModalOpen(true)}
            style={{ color: '#fff', backgroundColor: '#d71e35' }}
          >
            Cập nhật
          </Button>
        }
      />
      <Modal
        title="Cập nhật thông tin"
        maskClosable={false}
        centered
        open={isUpdateModalOpen}
        onOk={() => form.submit()}
        onCancel={handleCloseUpdateModal}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form
          name="update-information"
          form={form}
          onFinish={onFinish}
          initialValues={{ email: `${session?.account?.email}` }}
        >
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
            <Input allowClear placeholder="Nhập email nhân viên" disabled />
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
              {
                min: 10,
                message: 'Độ dài tối thiếu số điện thoại là 10 số',
              },
              { max: 11, message: 'Độ dài tối đa số điện thoại là 11 số' },
            ]}
          >
            <Input allowClear placeholder="Nhập số điện thoại nhân viên" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Information;

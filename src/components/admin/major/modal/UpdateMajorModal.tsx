'use client';

import { useAxiosAuth } from '@/util/customHook';
import { Form, Input, Modal, notification } from 'antd';
import { useEffect, useState } from 'react';

interface IProps {
  isUpdateModalOpen: boolean;
  setIsUpdateModalOpen: (value: boolean) => void;
  majorUpdateData: null | IMajor;
  setMajorUpdateData: (value: null | IMajor) => void;
  fetchMajorList: () => void;
}

const UpdateMajorModal = (props: IProps) => {
  const {
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    majorUpdateData,
    setMajorUpdateData,
    fetchMajorList,
  } = props;
  const axiosAuth = useAxiosAuth();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (majorUpdateData) {
      form.setFieldsValue({
        code: majorUpdateData.code,
        name: majorUpdateData.name,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [majorUpdateData]);

  const handleCloseUpdateModal = () => {
    form.resetFields();
    setIsUpdateModalOpen(false);
    setMajorUpdateData(null);
  };

  const onFinish = async (values: any) => {
    const { code, name } = values;
    const data = {
      _id: majorUpdateData?._id,
      code: code.trim(),
      name: name.trim(),
    };

    try {
      setIsLoading(true);
      const res = await axiosAuth.patch(`/majors`, data);

      if (res.data && res.data.message === 'success') {
        notification.success({
          message: 'Cập nhật thành công !',
          duration: 2,
        });
        setIsLoading(false);
        handleCloseUpdateModal();
        fetchMajorList();
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
      title="Cập nhật ngành"
      maskClosable={false}
      centered
      open={isUpdateModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCloseUpdateModal}
      okText="Lưu"
      cancelText="Hủy"
      confirmLoading={isLoading}
    >
      <Form name="update-major" form={form} onFinish={onFinish}>
        <Form.Item<IMajor>
          label="Mã"
          name="code"
          rules={[{ required: true, message: 'Vui lòng nhập mã !' }]}
        >
          <Input allowClear placeholder="Nhập mã" />
        </Form.Item>
        <Form.Item<IMajor>
          label="Tên"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên !' }]}
        >
          <Input allowClear placeholder="Nhập tên" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateMajorModal;

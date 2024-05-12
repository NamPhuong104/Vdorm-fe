'use client';

import { useAxiosAuth } from '@/util/customHook';
import { Form, Input, Modal, Select, notification } from 'antd';
import { useState } from 'react';

interface IProps {
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (value: boolean) => void;
  fetchInvoiceList: () => void;
}

const monthOptions: { value: string; label: string }[] = [
  {
    value: '01',
    label: '01',
  },
  {
    value: '02',
    label: '02',
  },
  {
    value: '03',
    label: '03',
  },
  {
    value: '04',
    label: '04',
  },
  {
    value: '05',
    label: '05',
  },
  {
    value: '06',
    label: '06',
  },
  {
    value: '07',
    label: '07',
  },
  {
    value: '08',
    label: '08',
  },
  {
    value: '09',
    label: '09',
  },
  {
    value: '10',
    label: '10',
  },
  {
    value: '11',
    label: '11',
  },
  {
    value: '12',
    label: '12',
  },
];

const CreateInvoiceModal = (props: IProps) => {
  const { isCreateModalOpen, setIsCreateModalOpen, fetchInvoiceList } = props;
  const axiosAuth = useAxiosAuth();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCloseCreateModal = () => {
    form.resetFields();
    setIsCreateModalOpen(false);
  };

  const onFinish = async (values: any) => {
    const { month, year } = values;
    const data = {
      month,
      year,
    };

    try {
      setIsLoading(true);
      const res = await axiosAuth.post(`/invoice-details/create-many`, data);

      if (res.data && res.data.message === 'success') {
        notification.success({
          message: 'Tạo mới thành công !',
          duration: 2,
        });
        setIsLoading(false);
        handleCloseCreateModal();
        fetchInvoiceList();
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
      title="Thêm mới hóa đơn"
      maskClosable={false}
      centered
      open={isCreateModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCloseCreateModal}
      okText="Lưu"
      cancelText="Hủy"
      confirmLoading={isLoading}
    >
      <Form name="create-invoice" form={form} onFinish={onFinish}>
        <Form.Item
          label="Tháng"
          name="month"
          rules={[{ required: true, message: 'Vui lòng chọn tháng !' }]}
        >
          <Select
            options={monthOptions}
            allowClear
            placeholder="Chọn tháng"
            filterOption={filterOption}
            showSearch
          />
        </Form.Item>
        <Form.Item
          label="Năm"
          name="year"
          rules={[
            { required: true, message: 'Vui lòng nhập năm !' },
            {
              pattern: /^[0-9]*$/,
              message: 'Vui lòng nhập đúng định dạng năm !',
            },
            { min: 4, message: 'Độ dài tối thiếu là 4 số' },
            { max: 4, message: 'Độ dài tối đa là 4 số' },
          ]}
        >
          <Input allowClear placeholder="Nhập năm" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateInvoiceModal;

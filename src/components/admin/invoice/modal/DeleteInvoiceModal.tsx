'use client';

import { useAxiosAuth } from '@/util/customHook';
import { Form, Input, Modal, Select, notification } from 'antd';
import { useState } from 'react';

interface IProps {
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (value: boolean) => void;
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

const DeleteInvoiceModal = (props: IProps) => {
  const { isDeleteModalOpen, setIsDeleteModalOpen, fetchInvoiceList } = props;
  const axiosAuth = useAxiosAuth();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCloseDeleteModal = () => {
    form.resetFields();
    setIsDeleteModalOpen(false);
  };

  const onFinish = async (values: any) => {
    const { month, year } = values;
    const data = {
      month,
      year,
    };

    try {
      setIsLoading(true);
      const res = await axiosAuth.post(`/invoice-details/remove-many`, data);

      if (res.data && res.data.message === 'success') {
        notification.success({
          message: 'Xóa thành công !',
          duration: 2,
        });
        setIsLoading(false);
        handleCloseDeleteModal();
        fetchInvoiceList();
      }
    } catch (error: any) {
      setIsLoading(false);
      notification.error({
        message: 'Xóa thất bại !',
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
      title="Xóa hóa đơn"
      maskClosable={false}
      centered
      open={isDeleteModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCloseDeleteModal}
      okText="Xóa"
      cancelText="Hủy"
      confirmLoading={isLoading}
    >
      <Form name="delete-invoice" form={form} onFinish={onFinish}>
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

export default DeleteInvoiceModal;

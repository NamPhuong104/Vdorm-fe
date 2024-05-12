'use client';

import { useAxiosAuth } from '@/util/customHook';
import { Form, Input, Modal, notification } from 'antd';
import { useState } from 'react';

interface IProps {
  isUpdateElectricityModalOpen: boolean;
  setIsUpdateElectricityModalOpen: (value: boolean) => void;
  electricityUpdateData: null | IInvoiceDetail;
  setElectricityUpdateData: (value: null | IInvoiceDetail) => void;
  fetchInvoiceDetailList: () => void;
  invoiceId: string;
}

const UpdateElectricityModal = (props: IProps) => {
  const {
    isUpdateElectricityModalOpen,
    setIsUpdateElectricityModalOpen,
    electricityUpdateData,
    setElectricityUpdateData,
    fetchInvoiceDetailList,
    invoiceId,
  } = props;
  const axiosAuth = useAxiosAuth();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCloseUpdateModal = () => {
    form.resetFields();
    setIsUpdateElectricityModalOpen(false);
    setElectricityUpdateData(null);
  };

  const onFinish = async (values: any) => {
    const { electricityQuantity } = values;

    const data = {
      month: electricityUpdateData?.month,
      year: electricityUpdateData?.year,
      electricityQuantity,
      invoice: invoiceId,
    };

    try {
      setIsLoading(true);
      const res = await axiosAuth.post(`/invoice-details/electricity`, data);

      if (res.data && res.data.message === 'success') {
        notification.success({
          message: 'Cập nhật thành công !',
          duration: 2,
        });
        setIsLoading(false);
        handleCloseUpdateModal();
        fetchInvoiceDetailList();
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
      title="Thêm thông tin số điện"
      maskClosable={false}
      centered
      open={isUpdateElectricityModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCloseUpdateModal}
      okText="Lưu"
      cancelText="Hủy"
      confirmLoading={isLoading}
    >
      <Form name="update-electricity" form={form} onFinish={onFinish}>
        <Form.Item
          label="Số điện (kWh)"
          name="electricityQuantity"
          rules={[
            { required: true, message: 'Vui lòng nhập số điện !' },
            {
              pattern: /^[0-9]*$/,
              message: 'Vui lòng nhập đúng định dạng số điện !',
            },
          ]}
        >
          <Input allowClear placeholder="Nhập số điện " />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateElectricityModal;

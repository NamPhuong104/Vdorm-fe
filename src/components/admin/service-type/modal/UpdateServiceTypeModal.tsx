'use client';

import { useAxiosAuth } from '@/util/customHook';
import { Form, Input, InputNumber, Modal, Select, notification } from 'antd';
import { useEffect, useState } from 'react';

interface IProps {
  isUpdateModalOpen: boolean;
  setIsUpdateModalOpen: (value: boolean) => void;
  serviceTypeUpdateData: null | IServiceType;
  setServiceTypeUpdateData: (value: null | IServiceType) => void;
  fetchServiceTypeList: () => void;
  branchList: IBranchOption[];
  unitOptions: { value: string; label: string }[];
}

const UpdateServiceTypeModal = (props: IProps) => {
  const {
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    serviceTypeUpdateData,
    setServiceTypeUpdateData,
    fetchServiceTypeList,
    branchList,
    unitOptions,
  } = props;
  const axiosAuth = useAxiosAuth();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [amountOfMoney, setAmountOfMoney] = useState<string>('');
  const [branchNameOptions, setBranchNameOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    if (serviceTypeUpdateData) {
      form.setFieldsValue({
        code: serviceTypeUpdateData.code,
        name: serviceTypeUpdateData.name,
        amountOfMoney: serviceTypeUpdateData.amountOfMoney,
        unit: serviceTypeUpdateData.unit,
        branch: serviceTypeUpdateData.branch._id,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceTypeUpdateData]);

  useEffect(() => {
    if (branchList) {
      const branchNameOptionsClone: { value: string; label: string }[] = [];
      branchList.map((branch: IBranchOption) => {
        branchNameOptionsClone.push({ value: branch._id, label: branch.name });
      });
      setBranchNameOptions(branchNameOptionsClone);
    }
  }, [branchList]);

  const handleCloseUpdateModal = () => {
    form.resetFields();
    setIsUpdateModalOpen(false);
    setServiceTypeUpdateData(null);
  };

  const onFinish = async (values: any) => {
    const { code, name, amountOfMoney, unit, branch } = values;
    const data = {
      _id: serviceTypeUpdateData?._id,
      code: code.trim(),
      name: name.trim(),
      amountOfMoney: amountOfMoney.toString().trim(),
      unit: unit.trim(),
      branch,
    };

    try {
      setIsLoading(true);
      const res = await axiosAuth.patch(`/service-types`, data);

      if (res.data && res.data.message === 'success') {
        notification.success({
          message: 'Cập nhật thành công !',
          duration: 2,
        });
        setIsLoading(false);
        handleCloseUpdateModal();
        fetchServiceTypeList();
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

  const onNumericInputChange = (value: any) => {
    const reg = /^-?\d*(\.\d*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      return value;
    }
    return false;
  };

  const filterOption = (
    input: string,
    option?: { label: string; value: string },
  ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  return (
    <Modal
      title="Cập nhật loại dịch vụ"
      maskClosable={false}
      centered
      open={isUpdateModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCloseUpdateModal}
      okText="Lưu"
      cancelText="Hủy"
      confirmLoading={isLoading}
    >
      <Form name="update-service-type" form={form} onFinish={onFinish}>
        <Form.Item<IServiceType>
          label="Chi nhánh"
          name="branch"
          rules={[{ required: true, message: 'Vui lòng chọn chi nhánh !' }]}
        >
          <Select
            options={branchNameOptions}
            allowClear
            placeholder="Chọn chi nhánh"
            filterOption={filterOption}
            showSearch
          />
        </Form.Item>
        <Form.Item<IServiceType>
          label="Mã"
          name="code"
          rules={[{ required: true, message: 'Vui lòng nhập mã !' }]}
        >
          <Input allowClear placeholder="Nhập mã" />
        </Form.Item>
        <Form.Item<IServiceType>
          label="Tên"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên !' }]}
        >
          <Input allowClear placeholder="Nhập tên" />
        </Form.Item>
        <Form.Item<IServiceType>
          label="Giá (VND)"
          name="amountOfMoney"
          rules={[{ required: true, message: 'Vui lòng nhập giá !' }]}
        >
          <InputNumber
            min={'0'}
            formatter={(value) => {
              return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }}
            onChange={(value) => {
              const parsed = onNumericInputChange(value);
              if (parsed) {
                setAmountOfMoney(parsed);
              }
            }}
            value={amountOfMoney}
            style={{ width: '100%' }}
            placeholder="Nhập giá"
          />
        </Form.Item>
        <Form.Item<IServiceType>
          label="Đơn vị"
          name="unit"
          rules={[{ required: true, message: 'Vui lòng chọn đơn vị !' }]}
        >
          <Select
            options={unitOptions}
            allowClear
            placeholder="Chọn đơn vị"
            filterOption={filterOption}
            showSearch
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateServiceTypeModal;

'use client';

import { useAxiosAuth } from '@/util/customHook';
import { Form, Input, InputNumber, Modal, Select, notification } from 'antd';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface IProps {
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (value: boolean) => void;
  fetchRoomTypeList: () => void;
  branchList: IBranchOption[];
}

const CreateRoomTypeModal = (props: IProps) => {
  const {
    isCreateModalOpen,
    setIsCreateModalOpen,
    fetchRoomTypeList,
    branchList,
  } = props;
  const { status } = useSession();
  const axiosAuth = useAxiosAuth();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [price, setPrice] = useState<string>('');
  const [infrastructureList, setInfrastructureList] = useState<
    IInfrastructureOption[]
  >([]);
  const [branchNameOptions, setBranchNameOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [branchNameSelected, setBranchNameSelected] = useState<string>('');
  const [infrastructureOptions, setInfrastructureOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    if (status === 'authenticated' && branchNameSelected) {
      form.resetFields(['infrastructureList']);
      fetchInfrastructureList(branchNameSelected);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, branchNameSelected]);

  useEffect(() => {
    if (branchList) {
      const branchNameOptionsClone: { value: string; label: string }[] = [];
      branchList.map((branch: IBranchOption) => {
        branchNameOptionsClone.push({ value: branch._id, label: branch.name });
      });
      setBranchNameOptions(branchNameOptionsClone);
    }
  }, [branchList]);

  useEffect(() => {
    if (infrastructureList) {
      const infrastructureOptionsClone: { value: string; label: string }[] = [];
      infrastructureList.map((infrastructure: IInfrastructureOption) => {
        infrastructureOptionsClone.push({
          value: infrastructure._id,
          label: infrastructure.name,
        });
      });
      setInfrastructureOptions(infrastructureOptionsClone);
    }
  }, [infrastructureList]);

  const fetchInfrastructureList = async (branchId: string) => {
    try {
      const res = await axiosAuth.get(`/infrastructures?branch=${branchId}`);
      setInfrastructureList(res?.data?.data?.result as IInfrastructure[]);
    } catch (error) {
      setInfrastructureList([]);
    }
  };

  const handleCloseCreateModal = () => {
    form.resetFields();
    setIsCreateModalOpen(false);
  };

  const onFinish = async (values: any) => {
    const {
      code,
      name,
      numberOfRooms,
      numberOfStudents,
      price,
      branch,
      infrastructureList,
    } = values;
    const data = {
      code: code.trim(),
      name: name.trim(),
      numberOfRooms: +numberOfRooms,
      numberOfStudents: +numberOfStudents,
      price: price.toString().trim(),
      branch,
      infrastructureList,
    };

    try {
      setIsLoading(true);
      const res = await axiosAuth.post(`/room-types`, data);

      if (res.data && res.data.message === 'success') {
        notification.success({
          message: 'Tạo mới thành công !',
          duration: 2,
        });
        setIsLoading(false);
        handleCloseCreateModal();
        fetchRoomTypeList();
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
      title="Thêm mới loại phòng"
      maskClosable={false}
      centered
      open={isCreateModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCloseCreateModal}
      okText="Lưu"
      cancelText="Hủy"
      confirmLoading={isLoading}
    >
      <Form name="create-room-type" form={form} onFinish={onFinish}>
        <Form.Item<IRoomType>
          label="Chi nhánh"
          name="branch"
          rules={[{ required: true, message: 'Vui lòng chọn chi nhánh !' }]}
        >
          <Select
            options={branchNameOptions}
            allowClear
            placeholder="Chọn chi nhánh"
            onChange={(value) => setBranchNameSelected(value)}
            filterOption={filterOption}
            showSearch
          />
        </Form.Item>
        <Form.Item<IRoomType>
          label="Mã"
          name="code"
          rules={[{ required: true, message: 'Vui lòng nhập mã !' }]}
        >
          <Input allowClear placeholder="Nhập mã" />
        </Form.Item>
        <Form.Item<IRoomType>
          label="Tên"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên !' }]}
        >
          <Input allowClear placeholder="Nhập tên" />
        </Form.Item>
        <Form.Item<IRoomType>
          label="Danh sách cơ sở vật chất"
          name="infrastructureList"
          rules={[
            { required: true, message: 'Vui lòng chọn cơ sở vật chất !' },
          ]}
        >
          <Select
            options={infrastructureOptions}
            mode="multiple"
            allowClear
            placeholder="Chọn cơ sở vật chất"
            filterOption={filterOption}
            showSearch
          />
        </Form.Item>
        <Form.Item<IRoomType>
          label="Giá (VND)"
          name="price"
          rules={[{ required: true, message: 'Vui lòng nhập giá  !' }]}
        >
          <InputNumber
            min={'0'}
            formatter={(value) => {
              return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }}
            onChange={(value) => {
              const parsed = onNumericInputChange(value);
              if (parsed) {
                setPrice(parsed);
              }
            }}
            value={price}
            style={{ width: '100%' }}
            placeholder="Nhập giá"
          />
        </Form.Item>
        <Form.Item<IRoomType>
          label="Sức chứa"
          name="numberOfStudents"
          rules={[
            { required: true, message: 'Vui lòng nhập sức chứa !' },
            {
              pattern: /^[0-9]*$/,
              message: 'Vui lòng nhập đúng định dạng sức chứa !',
            },
          ]}
        >
          <Input allowClear placeholder="Nhập sức chứa" />
        </Form.Item>
        <Form.Item<IRoomType>
          label="Số lượng"
          name="numberOfRooms"
          rules={[
            { required: true, message: 'Vui lòng nhập số lượng !' },
            {
              pattern: /^[0-9]*$/,
              message: 'Vui lòng nhập đúng định dạng số lượng !',
            },
          ]}
        >
          <Input allowClear placeholder="Nhập số lượng" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateRoomTypeModal;

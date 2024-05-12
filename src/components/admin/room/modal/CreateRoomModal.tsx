'use client';

import { useAxiosAuth } from '@/util/customHook';
import { Form, Input, Modal, Select, notification } from 'antd';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface IProps {
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (value: boolean) => void;
  fetchRoomList: () => void;
  branchList: IBranchOption[];
  genderOptions: { value: string; label: string }[];
}

const CreateRoomModal = (props: IProps) => {
  const {
    isCreateModalOpen,
    setIsCreateModalOpen,
    fetchRoomList,
    branchList,
    genderOptions,
  } = props;
  const { status } = useSession();
  const axiosAuth = useAxiosAuth();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [roomTypeList, setRoomTypeList] = useState<IRoomTypeOption[]>([]);
  const [serviceTypeList, setServiceTypeList] = useState<IRoomTypeOption[]>([]);
  const [branchNameSelected, setBranchNameSelected] = useState<string>('');
  const [branchNameOptions, setBranchNameOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [roomTypeOptions, setRoomTypeOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [serviceTypeOptions, setServiceTypeOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    if (status === 'authenticated' && branchNameSelected) {
      form.resetFields(['roomType', 'serviceTypeList']);
      fetchRoomTypeList(branchNameSelected);
      fetchServiceTypeList(branchNameSelected);
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
    if (roomTypeList) {
      const roomTypeOptionsClone: { value: string; label: string }[] = [];
      roomTypeList.map((roomType: IRoomTypeOption) => {
        roomTypeOptionsClone.push({
          value: roomType._id,
          label: roomType.name,
        });
      });
      setRoomTypeOptions(roomTypeOptionsClone);
    }
  }, [roomTypeList]);

  useEffect(() => {
    if (serviceTypeList) {
      const serviceTypeOptionsClone: { value: string; label: string }[] = [];
      serviceTypeList.map((serviceType: IServiceTypeOption) => {
        serviceTypeOptionsClone.push({
          value: serviceType._id,
          label: serviceType.name,
        });
      });
      setServiceTypeOptions(serviceTypeOptionsClone);
    }
  }, [serviceTypeList]);

  const fetchRoomTypeList = async (branchId: string) => {
    try {
      const res = await axiosAuth.get(`/room-types?branch=${branchId}`);
      setRoomTypeList(res?.data?.data?.result as IRoomTypeOption[]);
    } catch (error) {
      setRoomTypeList([]);
    }
  };

  const fetchServiceTypeList = async (branchId: string) => {
    try {
      const res = await axiosAuth.get(`/service-types?branch=${branchId}`);
      setServiceTypeList(res?.data?.data?.result as IServiceTypeOption[]);
    } catch (error) {
      setServiceTypeList([]);
    }
  };

  const handleCloseCreateModal = () => {
    form.resetFields();
    setIsCreateModalOpen(false);
  };

  const onFinish = async (values: any) => {
    const { code, gender, roomType, serviceTypeList, branch } = values;
    const data = {
      code: code.trim(),
      gender: gender.trim(),
      roomType,
      serviceTypeList,
      branch,
    };

    try {
      setIsLoading(true);
      const res = await axiosAuth.post(`/rooms`, data);

      if (res.data && res.data.message === 'success') {
        notification.success({
          message: 'Tạo mới thành công !',
          duration: 2,
        });
        setIsLoading(false);
        handleCloseCreateModal();
        fetchRoomList();
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
      title="Thêm mới phòng"
      maskClosable={false}
      centered
      open={isCreateModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCloseCreateModal}
      okText="Lưu"
      cancelText="Hủy"
      confirmLoading={isLoading}
    >
      <Form name="create-room" form={form} onFinish={onFinish}>
        <Form.Item<IRoom>
          label="Chi nhánh"
          name="branch"
          rules={[{ required: true, message: 'Vui lòng chọn chi nhánh !' }]}
        >
          <Select
            allowClear
            options={branchNameOptions}
            placeholder="Chọn chi nhánh"
            onChange={(value) => setBranchNameSelected(value)}
            filterOption={filterOption}
            showSearch
          />
        </Form.Item>
        <Form.Item<IRoom>
          label="Loại phòng"
          name="roomType"
          rules={[{ required: true, message: 'Vui lòng chọn loại phòng !' }]}
        >
          <Select
            allowClear
            options={roomTypeOptions}
            placeholder="Chọn loại phòng"
            filterOption={filterOption}
            showSearch
          />
        </Form.Item>
        <Form.Item<IRoom>
          label="Danh sách dịch vụ"
          name="serviceTypeList"
          rules={[{ required: true, message: 'Vui lòng chọn dịch vụ !' }]}
        >
          <Select
            allowClear
            mode="multiple"
            options={serviceTypeOptions}
            placeholder="Chọn dịch vụ"
            maxTagCount={4}
            filterOption={filterOption}
            showSearch
          />
        </Form.Item>
        <Form.Item<IRoom>
          label="Mã"
          name="code"
          rules={[{ required: true, message: 'Vui lòng nhập mã !' }]}
        >
          <Input allowClear placeholder="Nhập mã" />
        </Form.Item>
        <Form.Item<IRoom>
          label="Giới tính"
          name="gender"
          rules={[{ required: true, message: 'Vui lòng chọn giới tính !' }]}
        >
          <Select
            allowClear
            options={genderOptions}
            placeholder="Chọn giới tính"
            filterOption={filterOption}
            showSearch
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateRoomModal;

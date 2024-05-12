'use client';

import { useAxiosAuth } from '@/util/customHook';
import { Form, Input, Modal, Select, notification } from 'antd';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface IProps {
  isUpdateModalOpen: boolean;
  setIsUpdateModalOpen: (value: boolean) => void;
  roomUpdateData: null | IRoom;
  setRoomUpdateData: (value: null | IRoom) => void;
  fetchRoomList: () => void;
  branchList: IBranchOption[];
  genderOptions: { value: string; label: string }[];
}

const UpdateRoomModal = (props: IProps) => {
  const {
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    roomUpdateData,
    setRoomUpdateData,
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
    if (roomUpdateData) {
      const roomTypeListOptionsClone: { value: string; label: string }[] = [];
      const serviceTypeListOptionsClone: { value: string; label: string }[] =
        [];

      roomTypeListOptionsClone.push({
        value: roomUpdateData.roomType._id,
        label: roomUpdateData.roomType.name,
      });

      roomUpdateData.serviceTypeList.map((serviceType) => {
        serviceTypeListOptionsClone.push({
          value: serviceType._id,
          label: serviceType.name,
        });
      });

      form.setFieldsValue({
        code: roomUpdateData.code,
        gender: roomUpdateData.gender,
        roomType: roomTypeListOptionsClone,
        serviceTypeList: serviceTypeListOptionsClone,
        branch: roomUpdateData.branch._id,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomUpdateData]);

  useEffect(() => {
    if (status === 'authenticated' && roomUpdateData) {
      fetchRoomTypeList(roomUpdateData?.branch?._id);
      fetchServiceTypeList(roomUpdateData?.branch?._id);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, roomUpdateData]);

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

  const handleCloseUpdateModal = () => {
    form.resetFields();
    setIsUpdateModalOpen(false);
    setRoomUpdateData(null);
  };

  const onFinish = async (values: any) => {
    const { code, gender, roomType, serviceTypeList, branch } = values;
    let roomTypeValue = roomType;
    let serviceTypeListValue = serviceTypeList;

    if (typeof roomType === 'object' && roomType[0].value) {
      roomTypeValue = roomType[0].value;
    }

    if (typeof serviceTypeList === 'object' && serviceTypeList[0].value) {
      serviceTypeListValue = [];
      serviceTypeList.map((serviceType: { value: string; label: string }) => {
        serviceTypeListValue.push(serviceType.value);
      });
    }

    const data = {
      _id: roomUpdateData?._id,
      code: code.trim(),
      gender: gender.trim(),
      roomType: roomTypeValue,
      serviceTypeList: serviceTypeListValue,
      branch,
    };

    try {
      setIsLoading(true);
      const res = await axiosAuth.patch(`/rooms`, data);

      if (res.data && res.data.message === 'success') {
        notification.success({
          message: 'Cập nhật thành công !',
          duration: 2,
        });
        setIsLoading(false);
        handleCloseUpdateModal();
        fetchRoomList();
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
      title="Cập nhật phòng"
      maskClosable={false}
      centered
      open={isUpdateModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCloseUpdateModal}
      okText="Lưu"
      cancelText="Hủy"
      confirmLoading={isLoading}
    >
      <Form name="update-room" form={form} onFinish={onFinish}>
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

export default UpdateRoomModal;

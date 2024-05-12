'use client';

import { useAxiosAuth } from '@/util/customHook';
import { DatePicker, Form, Input, Modal, Select, notification } from 'antd';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface IProps {
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (value: boolean) => void;
  fetchRegistrationList: () => void;
  branchList: IBranchOption[];
  majorList: IMajorOption[];
  genderOptions: { value: string; label: string }[];
  hobbyOptions: { value: string; label: string }[];
}

const CreateRegistrationModal = (props: IProps) => {
  const {
    isCreateModalOpen,
    setIsCreateModalOpen,
    fetchRegistrationList,
    branchList,
    majorList,
    genderOptions,
    hobbyOptions,
  } = props;
  const { status } = useSession();
  const axiosAuth = useAxiosAuth();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [roomTypeList, setRoomTypeList] = useState<IRoomTypeOption[]>([]);
  const [branchNameOptions, setBranchNameOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [branchNameSelected, setBranchNameSelected] = useState<string>('');
  const [majorNameOptions, setMajorNameOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [roomTypeOptions, setRoomTypeOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    if (status === 'authenticated' && branchNameSelected) {
      form.resetFields(['roomType']);
      fetchRoomTypeList(branchNameSelected);
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
    if (majorList) {
      const majorNameOptionsClone: { value: string; label: string }[] = [];
      majorList.map((major: IMajorOption) => {
        majorNameOptionsClone.push({ value: major._id, label: major.name });
      });
      setMajorNameOptions(majorNameOptionsClone);
    }
  }, [majorList]);

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

  const fetchRoomTypeList = async (branchId: string) => {
    try {
      const res = await axiosAuth.get(`/room-types?branch=${branchId}`);
      setRoomTypeList(res?.data?.data?.result as IRoomTypeOption[]);
    } catch (error) {
      setRoomTypeList([]);
    }
  };

  const handleCloseCreateModal = () => {
    form.resetFields();
    setIsCreateModalOpen(false);
  };

  const onFinish = async (values: any) => {
    const {
      studentCode,
      fullName,
      gender,
      dateOfBirth,
      course,
      major,
      email,
      phone,
      homeTown,
      hobbyList,
      branch,
      roomType,
    } = values;
    const dateOfBirthValue = dayjs(dateOfBirth.toString()).format('YYYY-MM-DD');
    const data = {
      studentCode: studentCode.trim(),
      fullName: fullName.trim(),
      gender,
      dateOfBirth: dateOfBirthValue,
      course: +course,
      major,
      email: email.trim(),
      phone: phone.trim(),
      homeTown: homeTown.trim(),
      hobbyList,
      branch,
      roomType,
    };

    try {
      setIsLoading(true);
      const res = await axiosAuth.post(`/registrations`, data);

      if (res.data && res.data.message === 'success') {
        notification.success({
          message: 'Tạo mới thành công !',
          duration: 2,
        });
        setIsLoading(false);
        handleCloseCreateModal();
        fetchRegistrationList();
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
      title="Thêm mới đơn đăng ký"
      maskClosable={false}
      centered
      open={isCreateModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCloseCreateModal}
      okText="Lưu"
      cancelText="Hủy"
      confirmLoading={isLoading}
    >
      <Form name="create-registration" form={form} onFinish={onFinish}>
        <Form.Item<IRegistration>
          label="Mã số sinh viên"
          name="studentCode"
          rules={[
            { required: true, message: 'Vui lòng nhập mã số sinh viên !' },
          ]}
        >
          <Input allowClear placeholder="Nhập mã số sinh viên" />
        </Form.Item>
        <Form.Item<IRegistration>
          label="Họ và tên"
          name="fullName"
          rules={[{ required: true, message: 'Vui lòng nhập họ và tên !' }]}
        >
          <Input allowClear placeholder="Nhập họ và tên" />
        </Form.Item>
        <Form.Item<IRegistration>
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
        <Form.Item<IRegistration>
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
        <Form.Item<IRegistration>
          label="Khóa"
          name="course"
          rules={[
            { required: true, message: 'Vui lòng nhập khóa !' },
            {
              pattern: /^[0-9]*$/,
              message: 'Vui lòng nhập đúng định dạng khóa !',
            },
          ]}
        >
          <Input allowClear placeholder="Nhập khóa" />
        </Form.Item>
        <Form.Item<IRegistration>
          label="Ngành"
          name="major"
          rules={[{ required: true, message: 'Vui lòng chọn ngành !' }]}
        >
          <Select
            allowClear
            options={majorNameOptions}
            placeholder="Chọn ngành"
            filterOption={filterOption}
            showSearch
          />
        </Form.Item>
        <Form.Item<IRegistration>
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
          <Input allowClear placeholder="Nhập email" />
        </Form.Item>
        <Form.Item<IRegistration>
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
        <Form.Item<IRegistration>
          label="Quê quán"
          name="homeTown"
          rules={[{ required: true, message: 'Vui lòng nhập quê quán !' }]}
        >
          <Input allowClear placeholder="Nhập quê quán" />
        </Form.Item>
        <Form.Item<IRegistration>
          label="Sở thích"
          name="hobbyList"
          rules={[{ required: true, message: 'Vui lòng chọn sở thích !' }]}
        >
          <Select
            allowClear
            mode="multiple"
            options={hobbyOptions}
            placeholder="Chọn sở thích"
            maxTagCount={3}
            filterOption={filterOption}
          />
        </Form.Item>
        <Form.Item<IRegistration>
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
        <Form.Item<IRegistration>
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
      </Form>
    </Modal>
  );
};

export default CreateRegistrationModal;

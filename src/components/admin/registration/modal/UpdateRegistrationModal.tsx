'use client';

import { useAxiosAuth } from '@/util/customHook';
import { DatePicker, Form, Input, Modal, Select, notification } from 'antd';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface IProps {
  isUpdateModalOpen: boolean;
  setIsUpdateModalOpen: (value: boolean) => void;
  registrationUpdateData: null | IRegistration;
  setRegistrationUpdateData: (value: null | IRegistration) => void;
  fetchRegistrationList: () => void;
  branchList: IBranchOption[];
  majorList: IMajorOption[];
  genderOptions: { value: string; label: string }[];
  hobbyOptions: { value: string; label: string }[];
}

const UpdateRegistrationModal = (props: IProps) => {
  const {
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    registrationUpdateData,
    setRegistrationUpdateData,
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
    if (registrationUpdateData) {
      const roomTypeOptionsClone: { value: string; label: string }[] = [];

      roomTypeOptionsClone.push({
        value: registrationUpdateData.roomType._id,
        label: registrationUpdateData.roomType.name,
      });

      form.setFieldsValue({
        studentCode: registrationUpdateData.studentCode,
        fullName: registrationUpdateData.fullName,
        course: registrationUpdateData.course,
        major: registrationUpdateData.major._id,
        gender: registrationUpdateData.gender,
        dateOfBirth: dayjs(registrationUpdateData.dateOfBirth),
        email: registrationUpdateData.email,
        phone: registrationUpdateData.phone,
        homeTown: registrationUpdateData.homeTown,
        hobbyList: registrationUpdateData.hobbyList,
        status: registrationUpdateData.status,
        branch: registrationUpdateData.branch._id,
        roomType: roomTypeOptionsClone,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registrationUpdateData]);

  useEffect(() => {
    if (status === 'authenticated' && registrationUpdateData) {
      fetchRoomTypeList(registrationUpdateData?.branch?._id);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, registrationUpdateData]);

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

  const handleCloseUpdateModal = () => {
    form.resetFields();
    setIsUpdateModalOpen(false);
    setRegistrationUpdateData(null);
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
    let roomTypeValue = roomType;

    if (typeof roomType === 'object' && roomType[0].value) {
      roomTypeValue = roomType[0].value;
    }

    const data = {
      _id: registrationUpdateData?._id,
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
      roomType: roomTypeValue,
    };

    try {
      setIsLoading(true);
      const res = await axiosAuth.patch(`/registrations`, data);

      if (res.data && res.data.message === 'success') {
        notification.success({
          message: 'Cập nhật thành công !',
          duration: 2,
        });
        setIsLoading(false);
        handleCloseUpdateModal();
        fetchRegistrationList();
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
      title="Cập nhật đơn đăng ký"
      maskClosable={false}
      centered
      open={isUpdateModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCloseUpdateModal}
      okText="Lưu"
      cancelText="Hủy"
      confirmLoading={isLoading}
    >
      <Form name="update-registration" form={form} onFinish={onFinish}>
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
          label="Danh sách sở thích"
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
            disabled
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

export default UpdateRegistrationModal;

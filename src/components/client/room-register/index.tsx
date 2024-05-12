'use client';

import { sheliaFont } from '@/app/fonts/fonts';
import { useAxiosAuth } from '@/util/customHook';
import {
  Button,
  Carousel,
  DatePicker,
  Flex,
  Form,
  Input,
  Select,
  Steps,
  notification,
} from 'antd';
import { CarouselRef } from 'antd/es/carousel';
import locale from 'antd/es/date-picker/locale/vi_VN';
import dayjs from 'dayjs';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import CreateRegistration from './modal/CreateRegistration';

const genderOptions: { value: string; label: string }[] = [
  {
    value: 'Nam',
    label: 'Nam',
  },
  {
    value: 'Nữ',
    label: 'Nữ',
  },
];

const hobbyOptions: { value: string; label: string }[] = [
  {
    value: 'Sách',
    label: 'Sách',
  },
  {
    value: 'Âm nhạc',
    label: 'Âm nhạc',
  },
  {
    value: 'Nghệ thuật',
    label: 'Nghệ thuật',
  },
  {
    value: 'Công nghệ',
    label: 'Công nghệ',
  },
  {
    value: 'Thể thao',
    label: 'Thể thao',
  },
  {
    value: 'Du lịch',
    label: 'Du lịch',
  },
  {
    value: 'Trò chơi',
    label: 'Trò chơi',
  },
  {
    value: 'Nhiếp ảnh',
    label: 'Nhiếp ảnh',
  },
  {
    value: 'Khiêu vũ',
    label: 'Khiêu vũ',
  },
  {
    value: 'Nấu ăn',
    label: 'Nấu ăn',
  },
];

const steps = [
  {
    title: 'Bước 1',
    content: 'First-content',
  },
  {
    title: 'Bước 2',
    content: 'Second-content',
  },
  {
    title: 'Bước 3',
    content: 'Last-content',
  },
];

const RoomRegister = () => {
  const { status, data: session } = useSession();
  const axiosAuth = useAxiosAuth();
  const router = useRouter();
  const [form] = Form.useForm();
  const sliderRef = useRef<CarouselRef | null>(null);
  const [branchList, setBranchList] = useState<IBranchOption[]>([]);
  const [roomTypeList, setRoomTypeList] = useState<IRoomTypeOption[]>([]);
  const [majorList, setMajorList] = useState<IMajorOption[]>([]);
  const [userInfo, setUserInfo] = useState<string[]>([]);
  const [current, setCurrent] = useState<number>(0);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [branch, setBranch] = useState<any>();
  const [branchOptions, setBranchOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [roomTypeOptions, setRoomTypeOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [majorOptions, setMajorOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [items, setItems] = useState<{ key: string; title: string }[]>();

  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn('azure-ad', {
        callbackUrl: '/room-register',
      });
    }
  }, [status]);

  useEffect(() => {
    if (session?.user) {
      setUserInfo(session?.account?.name?.split('-'));
    } else {
      setUserInfo([]);
    }
  }, [session]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchBranchList();
      fetchMajorList();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    if (status === 'authenticated' && branch) {
      fetchRoomTypeList(branch.value);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, branch]);

  useEffect(() => {
    if (status === 'authenticated' && userInfo) {
      form.setFieldsValue({
        studentCode: userInfo[0],
        fullName: userInfo[1],
        email: session.user?.email,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, userInfo]);

  useEffect(() => {
    const itemsClone = steps.map((item) => ({
      key: item.title,
      title: item.title,
    }));
    setItems(itemsClone);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps]);

  useEffect(() => {
    if (branchList) {
      const branchOptionsClone: { value: string; label: string }[] = [];
      branchList.map((branch: IBranchOption) => {
        branchOptionsClone.push({ value: branch._id, label: branch.name });
      });
      setBranchOptions(branchOptionsClone);
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
    if (majorList) {
      const majorOptionsClone: { value: string; label: string }[] = [];
      majorList.map((major: IMajorOption) => {
        majorOptionsClone.push({ value: major._id, label: major.name });
      });
      setMajorOptions(majorOptionsClone);
    }
  }, [majorList]);

  const fetchBranchList = async () => {
    try {
      const res = await axiosAuth.get(`/branches`);
      setBranchList(res?.data?.data?.result as IBranchOption[]);
    } catch (error) {
      setBranchList([]);
    }
  };

  const fetchRoomTypeList = async (branchId: string) => {
    try {
      const res = await axiosAuth.get(`/room-types?branch=${branchId}`);
      setRoomTypeList(res?.data?.data?.result as IRoomTypeOption[]);
    } catch (error) {
      setRoomTypeList([]);
    }
  };

  const fetchMajorList = async () => {
    try {
      const res = await axiosAuth.get(`/majors`);
      setMajorList(res?.data?.data?.result as IMajorOption[]);
    } catch (error) {
      setMajorList([]);
    }
  };

  const filterOption = (
    input: string,
    option?: { label: string; value: string },
  ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const handleNextStep = () => {
    if (current == 0) {
      form
        .validateFields([
          'studentCode',
          'email',
          'fullName',
          'dateOfBirth',
          'gender',
        ])
        .then(() => {
          setCurrent(current + 1);
          if (sliderRef.current) {
            sliderRef.current.next();
          }
        })
        .catch(() => {
          notification.error({
            message: 'Vui lòng điền đầy đủ thông tin !',
            duration: 2,
          });
        });
    }
    if (current == 1) {
      form
        .validateFields(['course', 'major', 'phone', 'homeTown'])
        .then(() => {
          setCurrent(current + 1);
          if (sliderRef.current) {
            sliderRef.current.next();
          }
        })
        .catch(() => {
          notification.error({
            message: 'Vui lòng điền đầy đủ thông tin !',
            duration: 2,
          });
        });
    }
    if (current == 2) {
      form
        .validateFields(['hobbyList', 'branch', 'roomType'])
        .then(() => {
          setIsCreateModalOpen(true);
        })
        .catch(() => {
          notification.error({
            message: 'Vui lòng điền đầy đủ thông tin !',
            duration: 2,
          });
        });
    }
  };

  const handlePreviousStep = () => {
    if (current != 0) {
      setCurrent(current - 1);
      if (sliderRef.current) {
        sliderRef.current.prev();
      }
    }
  };

  const onFinish = async (values: any) => {
    const {
      studentCode,
      fullName,
      email,
      gender,
      dateOfBirth,
      course,
      major,
      phone,
      homeTown,
      hobbyList,
      branch,
      roomType,
    } = values;

    const data = {
      studentCode: studentCode.trim(),
      fullName: fullName.trim(),
      gender: gender.trim(),
      dateOfBirth: dayjs(dateOfBirth.toString()).format('YYYY-MM-DD'),
      course: +course.trim(),
      major: major.value,
      email: email.trim(),
      phone: phone.trim(),
      homeTown: homeTown.trim(),
      hobbyList: hobbyList,
      branch: branch.value,
      roomType: roomType.value,
    };

    try {
      setConfirmLoading(true);
      const res = await axiosAuth.post(`/registrations`, data);
      if (res.data && res.data.message === 'success') {
        notification.success({
          message: 'Tạo mới thành công !',
          duration: 2,
        });
        setConfirmLoading(false);
        setIsCreateModalOpen(false);
        form.resetFields();
        router.push('/admin/registration');
      }
    } catch (error: any) {
      setConfirmLoading(false);
      notification.error({
        message: 'Gửi đơn đăng ký thất bại !',
        description: error?.response?.data?.message,
        duration: 2,
      });
    }
  };

  return (
    <div className={`client-room-register-container ${sheliaFont.variable}`}>
      <div
        className="client-room-register-thumbnail"
        style={{
          backgroundImage: `linear-gradient(to bottom,
                rgba(0, 0, 0, 0.6),
                rgba(0, 0, 0, 0.4)), url(${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/room-register/room-register-01.jpg)`,
        }}
      >
        <div className="client-room-register-thumbnail-title">
          Đăng Ký Phòng
        </div>
      </div>
      <div id="content" className="client-room-register-content">
        <div className="form-container">
          <Steps current={current} items={items} />
          <Form name="create-registration" form={form} onFinish={onFinish}>
            <Carousel
              infinite={false}
              dots={false}
              ref={(slider) => {
                if (slider) {
                  sliderRef.current = slider;
                }
              }}
            >
              <div id="step-1" className="step">
                <Form.Item<IRegistration>
                  label="Mã số sinh viên"
                  name="studentCode"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập mã số sinh viên !',
                    },
                  ]}
                >
                  <Input
                    disabled
                    placeholder="Nhập mã số sinh viên"
                    tabIndex={-1}
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
                  <Input disabled placeholder="Nhập email" tabIndex={-1} />
                </Form.Item>
                <Form.Item<IRegistration>
                  label="Họ và tên"
                  name="fullName"
                  rules={[
                    { required: true, message: 'Vui lòng nhập họ và tên !' },
                  ]}
                >
                  <Input disabled placeholder="Nhập họ và tên" tabIndex={-1} />
                </Form.Item>
                <Form.Item<IRegistration>
                  label="Ngày sinh"
                  name="dateOfBirth"
                  rules={[
                    { required: true, message: 'Vui lòng chọn ngày sinh !' },
                  ]}
                >
                  <DatePicker
                    locale={locale}
                    format={'DD-MM-YYYY'}
                    inputReadOnly={true}
                    placeholder="Chọn ngày sinh"
                    style={{ width: '100%' }}
                    tabIndex={-1}
                  />
                </Form.Item>
                <Form.Item<IRegistration>
                  label="Giới tính"
                  name="gender"
                  rules={[
                    { required: true, message: 'Vui lòng chọn giới tính !' },
                  ]}
                >
                  <Select
                    allowClear
                    options={genderOptions}
                    placeholder="Chọn giới tính"
                    filterOption={filterOption}
                    showSearch
                    tabIndex={-1}
                  />
                </Form.Item>
              </div>
              <div id="step-2" className="step">
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
                  <Input allowClear placeholder="Nhập khóa" tabIndex={-1} />
                </Form.Item>
                <Form.Item<IRegistration>
                  label="Ngành"
                  name="major"
                  rules={[{ required: true, message: 'Vui lòng chọn ngành !' }]}
                >
                  <Select
                    allowClear
                    labelInValue
                    options={majorOptions}
                    placeholder="Chọn ngành"
                    filterOption={filterOption}
                    showSearch
                    tabIndex={-1}
                  />
                </Form.Item>
                <Form.Item<IRegistration>
                  label="Số điện thoại"
                  name="phone"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập số điện thoại !',
                    },
                    {
                      pattern: /^[0-9]*$/,
                      message: 'Vui lòng nhập đúng định dạng số điện thoại !',
                    },
                    { min: 10, message: 'Độ dài tối thiếu là 10 số !' },
                    { max: 11, message: 'Độ dài tối đa là 11 số !' },
                  ]}
                >
                  <Input
                    allowClear
                    placeholder="Nhập số điện thoại"
                    tabIndex={-1}
                  />
                </Form.Item>
                <Form.Item<IRegistration>
                  label="Quê quán"
                  name="homeTown"
                  rules={[
                    { required: true, message: 'Vui lòng nhập quê quán !' },
                  ]}
                >
                  <Input allowClear placeholder="Nhập quê quán" tabIndex={-1} />
                </Form.Item>
              </div>
              <div id="step-3" className="step">
                <Form.Item<IRegistration>
                  label="Danh sách sở thích"
                  name="hobbyList"
                  rules={[
                    { required: true, message: 'Vui lòng chọn sở thích !' },
                  ]}
                >
                  <Select
                    allowClear
                    mode="multiple"
                    options={hobbyOptions}
                    placeholder="Chọn sở thích"
                    maxTagCount={3}
                    filterOption={filterOption}
                    tabIndex={-1}
                  />
                </Form.Item>
                <Form.Item<IRegistration>
                  label="Chi nhánh"
                  name="branch"
                  rules={[
                    { required: true, message: 'Vui lòng chọn chi nhánh !' },
                  ]}
                >
                  <Select
                    allowClear
                    labelInValue
                    options={branchOptions}
                    placeholder="Chọn chi nhánh"
                    onChange={(value) => {
                      setBranch(value);
                      setRoomTypeOptions([]);
                      form.setFieldsValue({
                        roomType: null,
                      });
                    }}
                    filterOption={filterOption}
                    showSearch
                    tabIndex={-1}
                  />
                </Form.Item>
                <Form.Item<IRegistration>
                  label="Loại phòng"
                  name="roomType"
                  rules={[
                    { required: true, message: 'Vui lòng chọn loại phòng !' },
                  ]}
                >
                  <Select
                    allowClear
                    labelInValue
                    options={roomTypeOptions}
                    placeholder="Chọn loại phòng"
                    filterOption={filterOption}
                    showSearch
                    tabIndex={-1}
                  />
                </Form.Item>
              </div>
            </Carousel>
          </Form>
          <Flex className="buttons-container">
            <Button
              disabled={current == 0 ? true : false}
              onClick={handlePreviousStep}
            >
              Trở Về
            </Button>
            <Button onClick={handleNextStep}>Tiếp Theo</Button>
          </Flex>
        </div>
      </div>
      <CreateRegistration
        form={form}
        isConfirmLoading={confirmLoading}
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default RoomRegister;

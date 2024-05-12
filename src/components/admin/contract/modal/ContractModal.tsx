'use client';

import { useAxiosAuth } from '@/util/customHook';
import {
  DatePicker,
  Drawer,
  Form,
  Modal,
  Select,
  Typography,
  notification,
} from 'antd';
import locale from 'antd/es/date-picker/locale/vi_VN';
import Paragraph from 'antd/es/typography/Paragraph';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface IProps {
  modalType: string;
  contractData: IContract | null;
  branchList: null | IBranchOption[];
  setContractData: (value: null | IContract) => void;
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  fetchContractList: () => void;
}

const ContractModal = (props: IProps) => {
  const {
    modalType,
    contractData,
    branchList,
    setContractData,
    isModalOpen,
    setIsModalOpen,
    fetchContractList,
  } = props;
  const { status } = useSession();
  const axiosAuth = useAxiosAuth();
  const [form] = Form.useForm();
  const { Text } = Typography;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [roomList, setRoomList] = useState<IRoom[]>([]);
  const [startDate, setStartDate] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>(null);
  const [serviceTypeList, setServiceTypeList] = useState<string[]>([]);
  const [branchOptions, setBranchOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [branchSelected, setBranchSelected] = useState<string>('');
  const [roomOptions, setRoomOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [roomSelected, setRoomSelected] = useState<string>('');

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
    if (status === 'authenticated' && branchSelected) {
      form.resetFields(['room', 'roomType', 'student']);
      fetchRoomList(branchSelected);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, branchSelected]);

  useEffect(() => {
    if (roomList) {
      const roomOptionsClone: { value: string; label: string }[] = [];
      roomList.map((room: IRoom) => {
        roomOptionsClone.push({ value: room._id, label: room.code });
      });
      setRoomOptions(roomOptionsClone);
    }
  }, [roomList]);

  useEffect(() => {
    if (roomSelected) {
      form.resetFields(['roomType', 'student']);
      const room = roomList.find((room) => room._id === roomSelected);
      const roomTypeClone = {
        value: room?.roomType?._id,
        label: room?.roomType?.name,
      };

      if (room?.roomOwner[0]) {
        const roomOwnerClone = {
          value: room?.roomOwner[0]?._id,
          label: `${room?.roomOwner[0]?.code} - ${room?.roomOwner[0]?.fullName}`,
        };

        form.setFieldsValue({
          roomType: roomTypeClone,
          student: roomOwnerClone,
        });
      } else {
        form.setFieldsValue({
          roomType: roomTypeClone,
        });
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomSelected]);

  useEffect(() => {
    if (modalType === 'edit' && contractData) {
      const roomClone = {
        value: contractData?.room?._id,
        label: contractData?.room?.code,
      };
      const roomTypeClone = {
        value: contractData?.roomType?._id,
        label: contractData?.roomType?.name,
      };
      const studentClone = {
        value: contractData?.student?._id,
        label: `${contractData?.student?.code} - ${contractData?.student?.fullName}`,
      };

      setStartDate(dayjs(contractData.startDate));
      setEndDate(dayjs(contractData.endDate));
      form.setFieldsValue({
        _id: contractData._id,
        createdDate: dayjs(contractData.createdDate),
        startDate: dayjs(contractData.startDate),
        endDate: dayjs(contractData.endDate),
        branch: contractData.branch._id,
        room: roomClone,
        roomType: roomTypeClone,
        student: studentClone,
      });
    } else if (modalType === 'view' && contractData) {
      const serviceTypeListClone: string[] = [];
      contractData.room.serviceTypeList.map(
        (serviceType: { _id: string; name: string }) => {
          serviceTypeListClone.push(serviceType.name);
        },
      );
      setServiceTypeList(serviceTypeListClone);
    } else if (modalType === 'add' && contractData === null) {
      return;
    }
  }, [form, contractData, modalType]);

  const fetchRoomList = async (branchId: string) => {
    try {
      const res = await axiosAuth.get(
        `/rooms?hasContract=false&branch=${branchId}`,
      );
      setRoomList(res?.data?.data?.result as IRoom[]);
    } catch (error) {
      setRoomList([]);
    }
  };

  const onCloseModal = () => {
    form.resetFields();
    setIsModalOpen(false);
    setContractData(null);
    setStartDate(null);
    setEndDate(null);
    setBranchSelected('');
    setRoomOptions([]);
  };

  const onFinish = async (values: any) => {
    if (modalType === 'edit') {
      const { branch, room, roomType, student, startDate, endDate } = values;
      const data = {
        _id: contractData?._id,
        createdDate: dayjs(contractData?.createdDate).format('YYYY-MM-DD'),
        startDate: dayjs(startDate).format('YYYY-MM-DD'),
        endDate: dayjs(endDate).format('YYYY-MM-DD'),
        branch,
        room: room.value,
        roomType: roomType.value,
        student: student.value,
      };

      try {
        setIsLoading(true);
        const res = await axiosAuth.patch(`/contracts`, data);

        if (res?.data && res?.data?.message === 'success') {
          notification.success({
            message: 'Cập nhật thành công !',
            duration: 2,
          });
          setIsLoading(false);
          onCloseModal();
          fetchContractList();
        }
      } catch (error: any) {
        setIsLoading(false);
        notification.error({
          message: 'Cập nhật thất bại !',
          description: error?.response?.data?.message,
          duration: 2,
        });
      }
    } else if (modalType === 'add') {
      const { branch, room, roomType, student, startDate, endDate } = values;
      const data = {
        createdDate: dayjs(new Date()).format('YYYY-MM-DD'),
        startDate: dayjs(startDate).format('YYYY-MM-DD'),
        endDate: dayjs(endDate).format('YYYY-MM-DD'),
        branch,
        room,
        roomType: roomType.value,
        student: student.value,
      };

      try {
        setIsLoading(true);
        const res = await axiosAuth.post(`/contracts`, data);

        if (res.data && res.data.message === 'success') {
          notification.success({
            message: 'Tạo mới thành công !',
            duration: 2,
          });
          setIsLoading(false);
          onCloseModal();
          fetchContractList();
        }
      } catch (error: any) {
        setIsLoading(false);
        notification.error({
          message: 'Tạo mới thất bại !',
          description: error?.response?.data?.message,
          duration: 2,
        });
      }
    }
  };

  const filterOption = (
    input: string,
    option?: { label: string; value: string },
  ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const currencyFormat = (value: any) => {
    return '' + value?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  };

  return (
    <>
      {modalType != 'view' ? (
        <Modal
          title={
            modalType === 'add' ? 'Thêm mới hợp đồng' : 'Cập nhật hợp đồng'
          }
          maskClosable={false}
          centered
          open={isModalOpen}
          onOk={() => form.submit()}
          onCancel={onCloseModal}
          okText="Lưu"
          cancelText="Hủy"
          confirmLoading={isLoading}
        >
          <Form form={form} onFinish={onFinish}>
            <Form.Item<IContract>
              label="Chi nhánh"
              name="branch"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn chi nhánh !',
                },
              ]}
            >
              <Select
                allowClear
                options={branchOptions}
                placeholder="Chọn chi nhánh"
                onChange={(value) => setBranchSelected(value)}
                disabled={modalType === 'edit'}
                filterOption={filterOption}
                showSearch
              />
            </Form.Item>
            <Form.Item<IContract>
              label="Phòng"
              name="room"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn phòng !',
                },
              ]}
            >
              <Select
                allowClear
                options={roomOptions}
                placeholder="Chọn phòng"
                onChange={(value) => setRoomSelected(value)}
                disabled={modalType === 'edit'}
                filterOption={filterOption}
                showSearch
              />
            </Form.Item>
            <Form.Item<IContract>
              label="Loại phòng"
              name="roomType"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn loại phòng !',
                },
              ]}
            >
              <Select disabled />
            </Form.Item>
            <Form.Item<IContract>
              label="Sinh viên"
              name="student"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn phòng đã có sinh viên !',
                },
              ]}
            >
              <Select disabled />
            </Form.Item>
            <Form.Item<IContract>
              label="Ngày vào ở"
              name="startDate"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn ngày vào ở !',
                },
              ]}
            >
              <DatePicker
                locale={locale}
                format="DD/MM/YYYY"
                placeholder="Chọn ngày vào ở"
                disabledDate={(current) => {
                  return dayjs(current).isAfter(endDate);
                }}
                disabled={modalType === 'view' ? true : false}
                onChange={(e: any) => setStartDate(e)}
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Form.Item<IContract>
              label="Ngày ngừng ở"
              name="endDate"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn ngày ngừng ở !',
                },
              ]}
            >
              <DatePicker
                locale={locale}
                format="DD/MM/YYYY"
                placeholder="Chọn ngày ngừng ở"
                disabledDate={(current) => {
                  return (
                    (modalType === 'add' &&
                      dayjs(current).isBefore(startDate)) ||
                    (modalType === 'edit' &&
                      dayjs(current).isBefore(startDate + 1))
                  );
                }}
                disabled={modalType === 'view' ? true : false}
                onChange={(e: any) => setEndDate(e)}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Form>
        </Modal>
      ) : (
        <Drawer
          title="Chi Tiết Hợp Đồng"
          placement="right"
          open={isModalOpen}
          onClose={onCloseModal}
        >
          <div
            className="view-contract"
            style={{ padding: '20px', height: '100%', overflowY: 'auto' }}
          >
            <div
              style={{ borderBottom: '1px solid #000', marginBottom: '10px' }}
            >
              <Paragraph
                strong
                style={{ textAlign: 'center', fontSize: '15px' }}
              >
                Tổng Quan
              </Paragraph>
              <Paragraph>
                <Text strong>Mã hợp đồng: </Text>
                <Text>{contractData?.code}</Text>
              </Paragraph>
              <Paragraph>
                <Text strong>Ngày tạo: </Text>
                <Text>
                  {dayjs(contractData?.createdDate).format('DD/MM/YYYY')}
                </Text>
              </Paragraph>
              <Paragraph>
                <Text strong>Ngày vào ở: </Text>
                <Text>
                  {dayjs(contractData?.startDate).format('DD/MM/YYYY')}
                </Text>
              </Paragraph>
              <Paragraph>
                <Text strong>Ngày ngừng ở: </Text>
                <Text>{dayjs(contractData?.endDate).format('DD/MM/YYYY')}</Text>
              </Paragraph>
              <Paragraph>
                <Text strong>Tình trạng: </Text>
                <Text>{contractData?.status}</Text>
              </Paragraph>
              <Paragraph>
                <Text strong>Trạng thái: </Text>
                <Text>{contractData?.duration}</Text>
              </Paragraph>
            </div>
            <div
              style={{ borderBottom: '1px solid #000', marginBottom: '10px' }}
            >
              <Paragraph
                strong
                style={{ textAlign: 'center', fontSize: '15px' }}
              >
                Chi nhánh
              </Paragraph>
              <Paragraph>
                <Text strong>Tên: </Text>
                <Text>{contractData?.branch?.name}</Text>
              </Paragraph>
              <Paragraph>
                <Text strong>Địa chỉ: </Text>
                <Text>{contractData?.branch?.address}</Text>
              </Paragraph>
            </div>
            <div
              style={{ borderBottom: '1px solid #000', marginBottom: '10px' }}
            >
              <Paragraph
                strong
                style={{ textAlign: 'center', fontSize: '15px' }}
              >
                Loại phòng
              </Paragraph>
              <Paragraph>
                <Text strong>Tên: </Text>
                <Text>{contractData?.roomType?.name}</Text>
              </Paragraph>
              <Paragraph>
                <Text strong>Giá (VND): </Text>
                <Text>{currencyFormat(contractData?.roomType?.price)}</Text>
              </Paragraph>
              <Paragraph>
                <Text strong>Giá bằng chữ: </Text>
                <Text>{contractData?.roomType?.priceInWords}</Text>
              </Paragraph>
            </div>
            <div
              style={{ borderBottom: '1px solid #000', marginBottom: '10px' }}
            >
              <Paragraph
                strong
                style={{ textAlign: 'center', fontSize: '15px' }}
              >
                Phòng
              </Paragraph>
              <Paragraph>
                <Text strong>Mã: </Text>
                <Text>{contractData?.room?.code}</Text>
              </Paragraph>
              <Paragraph>
                <Text strong>Danh sách dịch vụ: </Text>
                <Text>{serviceTypeList.join(', ')}</Text>
              </Paragraph>
            </div>
            <div style={{ marginBottom: '40px' }}>
              <Paragraph
                strong
                style={{ textAlign: 'center', fontSize: '15px' }}
              >
                Sinh viên
              </Paragraph>
              <Paragraph>
                <Text strong>MSSV: </Text>
                <Text>{contractData?.student?.code}</Text>
              </Paragraph>
              <Paragraph>
                <Text strong>Họ và tên: </Text>
                <Text>{contractData?.student?.fullName}</Text>
              </Paragraph>
              <Paragraph>
                <Text strong>Ngành: </Text>
                <Text>{contractData?.student?.major?.name}</Text>
              </Paragraph>
              <Paragraph>
                <Text strong>Ngày sinh: </Text>
                <Text>
                  {dayjs(contractData?.student.dateOfBirth).format(
                    'DD/MM/YYYY',
                  )}
                </Text>
              </Paragraph>
              <Paragraph>
                <Text strong>Giới tính: </Text>
                <Text>{contractData?.student?.gender}</Text>
              </Paragraph>
              <Paragraph>
                <Text strong>Email: </Text>
                <Text>{contractData?.student?.email}</Text>
              </Paragraph>
              <Paragraph>
                <Text strong>Số điện thoại: </Text>
                <Text>{contractData?.student?.phone}</Text>
              </Paragraph>
              <Paragraph>
                <Text strong>Quê quán: </Text>
                <Text>{contractData?.student?.homeTown}</Text>
              </Paragraph>
              <Paragraph>
                <Text strong>Trạng thái: </Text>
                <Text>{contractData?.student?.status}</Text>
              </Paragraph>
            </div>
          </div>
        </Drawer>
      )}
    </>
  );
};

export default ContractModal;

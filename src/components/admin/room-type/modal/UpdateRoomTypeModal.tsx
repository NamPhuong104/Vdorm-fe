'use client';

import { useAxiosAuth } from '@/util/customHook';
import { Form, Input, InputNumber, Modal, Select, notification } from 'antd';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface IProps {
  isUpdateModalOpen: boolean;
  setIsUpdateModalOpen: (value: boolean) => void;
  roomTypeUpdateData: null | IRoomType;
  setRoomTypeUpdateData: (value: null | IRoomType) => void;
  fetchRoomTypeList: () => void;
  branchList: IBranchOption[];
}

const UpdateRoomTypeModal = (props: IProps) => {
  const {
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    roomTypeUpdateData,
    setRoomTypeUpdateData,
    branchList,
    fetchRoomTypeList,
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
  const [infrastructureListOptions, setInfrastructureListOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    if (roomTypeUpdateData) {
      const infrastructureListOptionsClone: { value: string; label: string }[] =
        [];

      roomTypeUpdateData.infrastructureList.map((infrastructure) => {
        infrastructureListOptionsClone.push({
          value: infrastructure._id,
          label: infrastructure.name,
        });
      });

      form.setFieldsValue({
        code: roomTypeUpdateData.code,
        name: roomTypeUpdateData.name,
        numberOfRooms: roomTypeUpdateData.numberOfRooms,
        numberOfStudents: roomTypeUpdateData.numberOfStudents,
        price: roomTypeUpdateData.price,
        branch: roomTypeUpdateData.branch._id,
        infrastructureList: infrastructureListOptionsClone,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomTypeUpdateData]);

  useEffect(() => {
    if (status === 'authenticated' && roomTypeUpdateData) {
      fetchInfrastructureList(roomTypeUpdateData?.branch?._id);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, roomTypeUpdateData]);

  useEffect(() => {
    if (status === 'authenticated' && branchNameSelected) {
      form.resetFields(['infrastructureList', 'serviceTypeList']);
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
      const infrastructureListOptionsClone: { value: string; label: string }[] =
        [];
      infrastructureList.map((infrastructure: IInfrastructureOption) => {
        infrastructureListOptionsClone.push({
          value: infrastructure._id,
          label: infrastructure.name,
        });
      });
      setInfrastructureListOptions(infrastructureListOptionsClone);
    }
  }, [infrastructureList]);

  const fetchInfrastructureList = async (branchId: string) => {
    try {
      const res = await axiosAuth.get(`/infrastructures?branch=${branchId}`);
      setInfrastructureList(res?.data?.data?.result as IInfrastructureOption[]);
    } catch (error) {
      setInfrastructureList([]);
    }
  };

  const handleCloseUpdateModal = () => {
    form.resetFields();
    setIsUpdateModalOpen(false);
    setRoomTypeUpdateData(null);
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
    let infrastructureListValue = infrastructureList;

    if (typeof infrastructureList === 'object' && infrastructureList[0].value) {
      infrastructureListValue = [];
      infrastructureList.map(
        (infrastrucutre: { value: string; label: string }) => {
          infrastructureListValue.push(infrastrucutre.value);
        },
      );
    }

    const data = {
      _id: roomTypeUpdateData?._id,
      code: code.trim(),
      name: name.trim(),
      numberOfRooms: +numberOfRooms,
      numberOfStudents: +numberOfStudents,
      price: price.toString().trim(),
      branch,
      infrastructureList: infrastructureListValue,
    };

    try {
      setIsLoading(true);
      const res = await axiosAuth.patch(`/room-types`, data);

      if (res.data && res.data.message === 'success') {
        notification.success({
          message: 'Cập nhật thành công !',
          duration: 2,
        });
        setIsLoading(false);
        handleCloseUpdateModal();
        fetchRoomTypeList();
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
      title="Cập nhật loại phòng"
      maskClosable={false}
      centered
      open={isUpdateModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCloseUpdateModal}
      okText="Lưu"
      cancelText="Hủy"
      confirmLoading={isLoading}
    >
      <Form name="update-room-type" form={form} onFinish={onFinish}>
        <Form.Item<IRoomType>
          label="Chi nhánh"
          name="branch"
          rules={[{ required: true, message: 'Vui lòng chọn chi nhánh !' }]}
        >
          <Select
            options={branchNameOptions}
            allowClear
            placeholder="Chọn chi nhánh"
            onChange={(value) => {
              setBranchNameSelected(value);
            }}
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
            options={infrastructureListOptions}
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

export default UpdateRoomTypeModal;

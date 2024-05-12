'use client';

import { useAxiosAuth } from '@/util/customHook';
import { Form, Input, InputNumber, Modal, Select, notification } from 'antd';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface IProps {
  isUpdateModalOpen: boolean;
  setIsUpdateModalOpen: (value: boolean) => void;
  maintenanceUpdateData: null | IMaintenance;
  setMaintenanceUpdateData: (value: null | IMaintenance) => void;
  fetchMaintenanceList: () => void;
  branchList: IBranchOption[];
}

const UpdateMaintenanceModal = (props: IProps) => {
  const {
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    maintenanceUpdateData,
    setMaintenanceUpdateData,
    fetchMaintenanceList,
    branchList,
  } = props;
  const { status } = useSession();
  const axiosAuth = useAxiosAuth();
  const [form] = Form.useForm();
  const [roomList, setRoomList] = useState<IRoomOption[]>([]);
  const [amountOfMoney, setAmountOfMoney] = useState<string>('');
  const [branchNameOptions, setBranchNameOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [branchNameSelected, setBranchNameSelected] = useState<string>('');
  const [roomOptions, setRoomOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    if (maintenanceUpdateData) {
      const roomListOptionsClone: { value: string; label: string }[] = [];

      roomListOptionsClone.push({
        value: maintenanceUpdateData.room._id,
        label: maintenanceUpdateData.room.code,
      });

      form.setFieldsValue({
        branch: maintenanceUpdateData.branch._id,
        room: roomListOptionsClone,
        reason: maintenanceUpdateData.reason,
        amountOfMoney: maintenanceUpdateData.amountOfMoney,
        code: maintenanceUpdateData.code,
        company: maintenanceUpdateData.company,
        infrastructureCode: maintenanceUpdateData.infrastructureQrCode.code,
        infrastructureName: maintenanceUpdateData.infrastructureQrCode.name,
        infrastructureModel: maintenanceUpdateData.infrastructureQrCode?.model,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maintenanceUpdateData]);

  useEffect(() => {
    if (status === 'authenticated' && maintenanceUpdateData) {
      fetchRoomList(maintenanceUpdateData?.branch?._id);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, maintenanceUpdateData]);

  useEffect(() => {
    if (status === 'authenticated' && branchNameSelected) {
      form.resetFields(['room']);
      setRoomOptions([]);
      fetchRoomList(branchNameSelected);
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
    if (roomList) {
      const roomOptionsClone: { value: string; label: string }[] = [];
      roomList.map((room: IRoomOption) => {
        roomOptionsClone.push({
          value: room._id,
          label: room.code,
        });
      });
      setRoomOptions(roomOptionsClone);
    }
  }, [roomList]);

  const fetchRoomList = async (branchId: string) => {
    try {
      const res = await axiosAuth.get(`/rooms?branch=${branchId}`);
      setRoomList(res?.data?.data?.result as IRoom[]);
    } catch (error) {
      setRoomList([]);
    }
  };

  const handleCloseUpdateModal = () => {
    form.resetFields();
    setIsUpdateModalOpen(false);
    setMaintenanceUpdateData(null);
  };

  const onFinish = async (values: any) => {
    const { reason, amountOfMoney, company, branch, room } = values;
    let roomValue = room;

    if (typeof room === 'object' && room[0].value) {
      roomValue = room[0].value;
    }

    const data = {
      _id: maintenanceUpdateData?._id,
      reason: reason.trim(),
      amountOfMoney: amountOfMoney.toString(),
      company: company.trim(),
      infrastructureQrCode: maintenanceUpdateData?.infrastructureQrCode?._id,
      branch,
      room: roomValue,
    };

    try {
      const res = await axiosAuth.patch(`/maintenances`, data);

      if (res.data && res.data.message === 'success') {
        notification.success({
          message: 'Cập nhật thành công !',
          duration: 2,
        });
        handleCloseUpdateModal();
        fetchMaintenanceList();
      }
    } catch (error: any) {
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
      title="Cập nhật đơn bảo trì"
      maskClosable={false}
      centered
      open={isUpdateModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCloseUpdateModal}
      okText="Lưu"
      cancelText="Hủy"
    >
      <Form name="update-maintenance" form={form} onFinish={onFinish}>
        <Form.Item<IMaintenance>
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
        <Form.Item<IMaintenance>
          label="Phòng"
          name="room"
          rules={[{ required: true, message: 'Vui lòng chọn phòng !' }]}
        >
          <Select
            options={roomOptions}
            allowClear
            placeholder="Chọn phòng"
            filterOption={filterOption}
            showSearch
          />
        </Form.Item>
        <Form.Item<IMaintenance>
          label="Lí do"
          name="reason"
          rules={[{ required: true, message: 'Vui lòng nhập lí do !' }]}
        >
          <Input allowClear placeholder="Nhập lí do" />
        </Form.Item>
        <Form.Item<IMaintenance>
          label="Chi phí (VND)"
          name="amountOfMoney"
          rules={[{ required: true, message: 'Vui lòng nhập chi phí  !' }]}
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
            placeholder="Nhập chi phí"
          />
        </Form.Item>
        <Form.Item<IMaintenance>
          label="Đơn vị phụ trách"
          name="company"
          rules={[
            { required: true, message: 'Vui lòng nhập đơn vị phụ trách !' },
          ]}
        >
          <Input allowClear placeholder="Nhập đơn vị phụ trách" />
        </Form.Item>
        <Form.Item label="Mã cơ sở vật chất" name="infrastructureCode">
          <Input disabled />
        </Form.Item>
        <Form.Item label="Tên cơ sở vật chất" name="infrastructureName">
          <Input disabled />
        </Form.Item>
        <Form.Item label="Model" name="infrastructureModel">
          <Input disabled />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateMaintenanceModal;

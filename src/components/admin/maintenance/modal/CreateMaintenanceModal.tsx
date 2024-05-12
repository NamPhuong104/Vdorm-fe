'use client';

import { useAxiosAuth } from '@/util/customHook';
import {
  Button,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  notification,
} from 'antd';
import {
  Html5QrcodeScanType,
  Html5QrcodeScanner,
  Html5QrcodeSupportedFormats,
} from 'html5-qrcode';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import HashLoader from 'react-spinners/HashLoader';

interface IProps {
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (value: boolean) => void;
  fetchMaintenanceList: () => void;
  branchList: IBranchOption[];
}

const CreateMaintenanceModal = (props: IProps) => {
  const {
    isCreateModalOpen,
    setIsCreateModalOpen,
    fetchMaintenanceList,
    branchList,
  } = props;
  const { status } = useSession();
  const axiosAuth = useAxiosAuth();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [roomList, setRoomList] = useState<IRoomOption[]>([]);
  const [infrastructureList, setInfrastructureList] = useState<
    IInfrastructureOption[]
  >([]);
  const [infrastructureQRCodeList, setInfrastructureQRCodeList] = useState<
    IInfrastructureQRCodeOption[]
  >([]);
  const [infrastructureQRCode, setInfrastructureQRCode] =
    useState<IInfrastructureQRCode | null>(null);
  const [isScanLoading, setIsScanLoading] = useState<boolean>(false);
  const [isCreateManual, setIsCreateManual] = useState<boolean>(false);
  const [isOnCamera, setIsOnCamera] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState('');
  const [amountOfMoney, setAmountOfMoney] = useState<string>('');
  const [branchNameOptions, setBranchNameOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [branchNameSelected, setBranchNameSelected] = useState<string>('');
  const [infrastructureSelected, setInfrastructureSelected] =
    useState<string>('');
  const [roomOptions, setRoomOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [infrastructureOptions, setInfrastructureOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [infrastructureQRCodeOptions, setInfrastructureQRCodeOptions] =
    useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    if (isOnCamera) {
      const html5QrcodeScanner = new Html5QrcodeScanner(
        'reader',
        {
          fps: 10,
          qrbox: { width: 200, height: 200 },
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
          supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
        },
        false,
      );
      const onScanSuccess = (decodedText: any, decodedResult: any) => {
        setScanResult(decodedText);
      };
      const onScanFailure = (error: any) => {
        setScanResult('');
      };
      html5QrcodeScanner.render(onScanSuccess, onScanFailure);

      return () => {
        html5QrcodeScanner.clear();
      };
    }
  }, [isOnCamera]);

  useEffect(() => {
    if (scanResult) {
      setIsOnCamera(false);
      fetchInfrastructureQRCode(scanResult);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanResult]);

  useEffect(() => {
    if (infrastructureQRCode) {
      form.setFieldsValue({
        infrastructureCode: infrastructureQRCode?.code,
        infrastructureName: infrastructureQRCode?.name,
        infrastructureModel: infrastructureQRCode?.model,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [infrastructureQRCode]);

  useEffect(() => {
    if (status === 'authenticated' && branchNameSelected && scanResult) {
      form.resetFields(['room']);
      setRoomOptions([]);
      fetchRoomList(branchNameSelected);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, branchNameSelected, scanResult]);

  useEffect(() => {
    if (status === 'authenticated' && branchNameSelected && isCreateManual) {
      form.resetFields(['room', 'infrastructure', 'infrastructureQrCode']);
      setRoomOptions([]);
      fetchRoomList(branchNameSelected);
      setInfrastructureOptions([]);
      fetchInfrastructureList(branchNameSelected);
      setInfrastructureQRCodeOptions([]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, branchNameSelected, isCreateManual]);

  useEffect(() => {
    if (infrastructureSelected) {
      fetchInfrastructureQRCodeList(infrastructureSelected);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [infrastructureSelected]);

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

  useEffect(() => {
    if (infrastructureQRCodeList) {
      const infrastructureQRCodeListClone: { value: string; label: string }[] =
        [];
      infrastructureQRCodeList.map(
        (infrastructureQRCode: IInfrastructureQRCodeOption) => {
          infrastructureQRCodeListClone.push({
            value: infrastructureQRCode._id,
            label: infrastructureQRCode.code,
          });
        },
      );
      setInfrastructureQRCodeOptions(infrastructureQRCodeListClone);
    }
  }, [infrastructureQRCodeList]);

  const fetchRoomList = async (branchId: string) => {
    try {
      const res = await axiosAuth.get(`/rooms?branch=${branchId}`);
      setRoomList(res?.data?.data?.result as IRoomOption[]);
    } catch (error) {
      setRoomList([]);
    }
  };

  const fetchInfrastructureList = async (branchId: string) => {
    try {
      const res = await axiosAuth.get(`/infrastructures?branch=${branchId}`);
      setInfrastructureList(res?.data?.data?.result as IInfrastructureOption[]);
    } catch (error) {
      setInfrastructureList([]);
    }
  };

  const fetchInfrastructureQRCodeList = async (infrastructureId: string) => {
    try {
      const res = await axiosAuth.get(
        `/infrastructure-qr-codes?infrastructure=${infrastructureId}`,
      );
      setInfrastructureQRCodeList(
        res?.data?.data?.result as IInfrastructureQRCodeOption[],
      );
    } catch (error) {
      setInfrastructureQRCodeList([]);
    }
  };

  const fetchInfrastructureQRCode = async (infrastructureCode: string) => {
    try {
      setIsScanLoading(true);
      const res = await axiosAuth.get(
        `/infrastructure-qr-codes?code=${infrastructureCode}`,
      );
      setIsScanLoading(false);
      setInfrastructureQRCode(res?.data?.data?.result as IInfrastructureQRCode);
    } catch (error: any) {
      setIsScanLoading(false);
      setInfrastructureQRCode(null);
      setScanResult('');
      notification.error({
        message: 'Quét thất bại !',
        description: error?.response?.data?.message,
        duration: 2,
      });
    }
  };

  const handleCloseCreateModal = () => {
    form.resetFields();
    setIsCreateManual(false);
    setIsOnCamera(false);
    setScanResult('');
    setIsCreateModalOpen(false);
    setInfrastructureQRCode(null);
  };

  const onFinish = async (values: any) => {
    const {
      reason,
      amountOfMoney,
      company,
      branch,
      room,
      infrastructureQrCode,
    } = values;
    const data = {
      reason: reason.trim(),
      amountOfMoney: amountOfMoney.toString(),
      company: company.trim(),
      infrastructureQrCode: infrastructureQRCode?._id ?? infrastructureQrCode,
      branch,
      room,
    };

    try {
      setIsLoading(true);
      const res = await axiosAuth.post(`/maintenances`, data);

      if (res.data && res.data.message === 'success') {
        notification.success({
          message: 'Tạo mới thành công !',
          duration: 2,
        });
        setIsLoading(false);
        handleCloseCreateModal();
        fetchMaintenanceList();
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

  const handleTurnOnCamera = (status: boolean) => {
    if (status) {
      setIsOnCamera(true);
    } else {
      setIsOnCamera(false);
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
      title="Thêm mới đơn bảo trì"
      maskClosable={false}
      centered
      open={isCreateModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCloseCreateModal}
      okText="Lưu"
      cancelText="Hủy"
      confirmLoading={isLoading}
      okButtonProps={{
        style: {
          display:
            (scanResult !== '' && infrastructureQRCode) || isCreateManual
              ? 'inline-block'
              : 'none',
        },
      }}
    >
      {!isCreateManual && !isOnCamera && !scanResult && (
        <Flex
          gap={20}
          align="center"
          justify="center"
          style={{ height: '300px' }}
        >
          <Button
            className="action-buttons"
            type="default"
            size={'middle'}
            style={{
              padding: '4px 18px',
              fontWeight: '600',
              background: 'blue',
              borderColor: 'blue',
              color: 'white',
            }}
            onClick={() => setIsCreateManual(true)}
          >
            Nhập
          </Button>
          <Button
            className="action-buttons"
            type="default"
            size={'middle'}
            style={{
              padding: '4px 18px',
              fontWeight: '600',
              background: 'red',
              borderColor: 'red',
              color: 'white',
            }}
            onClick={() => handleTurnOnCamera(true)}
          >
            Quét
          </Button>
        </Flex>
      )}
      {isCreateManual && (
        <Form name="create-maintenance" form={form} onFinish={onFinish}>
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
          <Form.Item
            label="Cơ sở vật chất"
            name="infrastructure"
            rules={[
              { required: true, message: 'Vui lòng chọn cơ sở vật chất !' },
            ]}
          >
            <Select
              options={infrastructureOptions}
              allowClear
              placeholder="Chọn cơ sở vật chất"
              onChange={(value) => setInfrastructureSelected(value)}
              filterOption={filterOption}
              showSearch
            />
          </Form.Item>
          <Form.Item
            label="Mã cơ sở vật chất"
            name="infrastructureQrCode"
            rules={[
              { required: true, message: 'Vui lòng chọn mã cơ sở vật chất !' },
            ]}
          >
            <Select
              options={infrastructureQRCodeOptions}
              allowClear
              placeholder="Chọn mã cơ sở vật chất"
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
        </Form>
      )}
      {isOnCamera && (
        <div
          id="reader"
          style={{ width: 'auto', height: 'auto', margin: '0 auto' }}
        ></div>
      )}
      {isScanLoading && !infrastructureQRCode && (
        <div style={{ height: '300px', width: '100%' }}>
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <HashLoader color="#d72134" />
          </div>
        </div>
      )}
      {!isOnCamera && scanResult && infrastructureQRCode && (
        <Form
          name="create-maintenance"
          form={form}
          onFinish={onFinish}
          style={{ display: scanResult !== '' ? 'block' : 'none' }}
        >
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
      )}
    </Modal>
  );
};

export default CreateMaintenanceModal;

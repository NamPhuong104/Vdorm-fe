'use client';

import { useAxiosAuth } from '@/util/customHook';
import {
  DatePicker,
  Drawer,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Typography,
  notification,
} from 'antd';
import locale from 'antd/es/date-picker/locale/vi_VN';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface IProps {
  modalType: string;
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  infrastructureData: null | IInfrastructure;
  setInfrastructureData: (value: null | IInfrastructure) => void;
  fetchInfrastructureList: () => void;
  branchList: null | IBranchOption[];
}

const InfrastructureModal = (props: IProps) => {
  const {
    modalType,
    isModalOpen,
    setIsModalOpen,
    infrastructureData,
    setInfrastructureData,
    fetchInfrastructureList,
    branchList,
  } = props;
  const { Text, Paragraph } = Typography;
  const { status } = useSession();
  const axiosAuth = useAxiosAuth();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [infrastructureTypeList, setInfrastructureTypeList] = useState<
    IInfrastructureTypeOption[]
  >([]);
  const [branchSelected, setBranchSelected] = useState<string>('');
  const [branchOptions, setBranchOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [infrastructureTypeOptions, setInfrastructureTypeOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    if (status === 'authenticated' && branchSelected) {
      form.resetFields(['infrastructureType']);
      fetchInfrastructureTypeList(branchSelected);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, branchSelected]);

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
    if (infrastructureTypeList) {
      const infrastructureTypeOptionsClone: { value: string; label: string }[] =
        [];
      infrastructureTypeList.map(
        (infrastructureType: IInfrastructureTypeOption) => {
          infrastructureTypeOptionsClone.push({
            value: infrastructureType._id,
            label: infrastructureType.name,
          });
        },
      );
      setInfrastructureTypeOptions(infrastructureTypeOptionsClone);
    }
  }, [infrastructureTypeList]);

  useEffect(() => {
    if (modalType === 'edit' && infrastructureData) {
      const infrastructureTypeOptionsClone: { value: string; label: string }[] =
        [];

      infrastructureTypeOptionsClone.push({
        value: infrastructureData.infrastructureType._id,
        label: infrastructureData.infrastructureType.name,
      });

      form.setFieldsValue({
        code: infrastructureData.code,
        name: infrastructureData.name,
        model: infrastructureData.model,
        quantity: infrastructureData.quantity,
        price: infrastructureData.price,
        importDate: dayjs(infrastructureData.importDate),
        expirationDate: dayjs(infrastructureData.expirationDate),
        branch: infrastructureData.branch._id,
        infrastructureType: infrastructureTypeOptionsClone,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalType, infrastructureData]);

  useEffect(() => {
    if (
      status === 'authenticated' &&
      modalType === 'edit' &&
      infrastructureData
    ) {
      fetchInfrastructureTypeList(infrastructureData?.branch?._id);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, modalType, infrastructureData]);

  const fetchInfrastructureTypeList = async (branchId: string) => {
    try {
      const res = await axiosAuth.get(
        `/infrastructure-types?branch=${branchId}`,
      );
      setInfrastructureTypeList(
        res?.data?.data?.result as IInfrastructureTypeOption[],
      );
    } catch (error) {
      setInfrastructureTypeList([]);
    }
  };

  const handleCloseModal = () => {
    if (modalType !== 'view') {
      form.resetFields();
    }
    setIsModalOpen(false);
    setInfrastructureData(null);
    setInfrastructureTypeList([]);
    setInfrastructureTypeOptions([]);
  };

  const onFinish = async (values: any) => {
    const {
      code,
      name,
      model,
      quantity,
      price,
      importDate,
      expirationDate,
      branch,
      infrastructureType,
    } = values;

    if (modalType === 'add') {
      const data = {
        code: code.trim(),
        name: name.trim(),
        model: model ? model.trim() : '',
        quantity: quantity,
        price: price.toString(),
        importDate: dayjs(importDate).format('YYYY-MM-DD'),
        expirationDate: dayjs(expirationDate).format('YYYY-MM-DD'),
        branch,
        infrastructureType,
      };

      try {
        setIsLoading(true);
        const res = await axiosAuth.post(`/infrastructures`, data);

        if (res.data && res.data.message === 'success') {
          notification.success({
            message: 'Tạo mới thành công !',
            duration: 2,
          });
          setIsLoading(false);
          handleCloseModal();
          fetchInfrastructureList();
        }
      } catch (error: any) {
        setIsLoading(false);
        notification.error({
          message: 'Tạo mới thất bại !',
          description: error?.response?.data?.message,
          duration: 2,
        });
      }
    } else if (modalType === 'edit') {
      let infrastructureTypeValue = infrastructureType;

      if (
        typeof infrastructureType === 'object' &&
        infrastructureType[0].value
      ) {
        infrastructureTypeValue = infrastructureType[0].value;
      }

      const data = {
        _id: infrastructureData?._id,
        code: code.trim(),
        name: name.trim(),
        model: model ? model.trim() : '',
        quantity: quantity,
        price: price.toString(),
        importDate: dayjs(importDate).format('YYYY-MM-DD'),
        expirationDate: dayjs(expirationDate).format('YYYY-MM-DD'),
        branch,
        infrastructureType: infrastructureTypeValue,
      };

      try {
        setIsLoading(true);
        const res = await axiosAuth.patch(`/infrastructures`, data);

        if (res.data && res.data.message === 'success') {
          notification.success({
            message: 'Cập nhật thành công !',
            duration: 2,
          });
          setIsLoading(false);
          handleCloseModal();
          fetchInfrastructureList();
        }
      } catch (error: any) {
        setIsLoading(false);
        notification.error({
          message: 'Cập nhật thất bại !',
          description: error?.response?.data?.message,
          duration: 2,
        });
      }
    }
  };

  const currencyFormat = (value: any) => {
    return '' + value?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  };

  const filterOption = (
    input: string,
    option?: { label: string; value: string },
  ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  return (
    <>
      {modalType === 'add' || modalType === 'edit' ? (
        <Modal
          title={
            modalType === 'add'
              ? 'Thêm mới cơ sở vật chất'
              : 'Cập nhật cơ sở vật chất'
          }
          maskClosable={false}
          centered
          open={isModalOpen}
          onOk={() => form.submit()}
          onCancel={handleCloseModal}
          okText="Lưu"
          cancelText="Hủy"
          confirmLoading={isLoading}
        >
          <Form form={form} onFinish={onFinish}>
            <Form.Item<IInfrastructure>
              label="Chi nhánh"
              name="branch"
              rules={[{ required: true, message: 'Vui lòng chọn chi nhánh !' }]}
            >
              <Select
                allowClear
                options={branchOptions}
                placeholder="Chọn chi nhánh"
                onChange={(value) => setBranchSelected(value)}
                filterOption={filterOption}
                showSearch
              />
            </Form.Item>
            <Form.Item<IInfrastructure>
              label="Mã"
              name="code"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập mã !',
                },
                {
                  pattern: /^[A-Za-z0-9\s_-]*$/u,
                  message: 'Không được chứa ký tự đặt biệt !',
                },
              ]}
            >
              <Input allowClear placeholder="Nhập mã" />
            </Form.Item>
            <Form.Item<IInfrastructure>
              label="Tên"
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập tên !',
                },
                {
                  pattern: /^[A-Za-zÀ-ỹ\s]*$/u,
                  message: 'Không được chứa ký tự đặt biệt !',
                },
              ]}
            >
              <Input allowClear placeholder="Nhập tên" />
            </Form.Item>
            <Form.Item<IInfrastructure>
              label="Model"
              name="model"
              rules={[
                {
                  pattern: /^[A-Za-z0-9\s_.-]*$/u,
                  message: 'Không được chứa ký tự đặt biệt !',
                },
              ]}
            >
              <Input allowClear placeholder="Nhập model" />
            </Form.Item>
            <Form.Item<IInfrastructure>
              label="Loại"
              name="infrastructureType"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn loại !',
                },
              ]}
            >
              <Select
                allowClear
                options={infrastructureTypeOptions}
                placeholder="Chọn loại"
                filterOption={filterOption}
                showSearch
              />
            </Form.Item>
            <Flex gap={10}>
              <Form.Item<IInfrastructure>
                label="Số lượng"
                name="quantity"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số lượng !',
                  },
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  placeholder="Nhập số lượng"
                />
              </Form.Item>
              <Form.Item<IInfrastructure>
                label="Giá (VND)"
                name="price"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập giá !',
                  },
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  placeholder="Nhập giá"
                />
              </Form.Item>
            </Flex>
            <Form.Item<IInfrastructure>
              label="Ngày nhập hàng"
              name="importDate"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn ngày nhập hàng !',
                },
              ]}
            >
              <DatePicker
                allowClear
                locale={locale}
                format="DD/MM/YYYY"
                style={{ width: '100%' }}
                placeholder="Chọn ngày nhập hàng"
              />
            </Form.Item>
            <Form.Item<IInfrastructure>
              label="Ngày hết hạn"
              name="expirationDate"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn ngày hết hạn !',
                },
              ]}
            >
              <DatePicker
                allowClear
                locale={locale}
                format="DD/MM/YYYY"
                style={{ width: '100%' }}
                placeholder="Chọn ngày hết hạn"
              />
            </Form.Item>
          </Form>
        </Modal>
      ) : (
        <Drawer
          title="Thông tin cơ sở vật chất"
          placement="right"
          open={isModalOpen}
          onClose={handleCloseModal}
        >
          <div
            className="view-infrastructure"
            style={{ padding: '20px', height: '100%', overflowY: 'auto' }}
          >
            <Paragraph>
              <Text strong>Chi nhánh: </Text>
              <Text>{infrastructureData?.branch?.name}</Text>
            </Paragraph>
            <Paragraph>
              <Text strong>Mã: </Text>
              <Text>{infrastructureData?.code}</Text>
            </Paragraph>
            <Paragraph>
              <Text strong>Tên: </Text>
              <Text>{infrastructureData?.name}</Text>
            </Paragraph>
            {infrastructureData?.model && (
              <Paragraph>
                <Text strong>Model: </Text>
                <Text>{infrastructureData?.model}</Text>
              </Paragraph>
            )}
            <Paragraph>
              <Text strong>Loại: </Text>
              <Text>{infrastructureData?.infrastructureType?.name}</Text>
            </Paragraph>
            <Paragraph>
              <Text strong>Số lượng: </Text>
              <Text>{infrastructureData?.quantity}</Text>
            </Paragraph>
            <Paragraph>
              <Text strong>Giá (VND): </Text>
              <Text>{currencyFormat(infrastructureData?.price)}</Text>
            </Paragraph>
            <Paragraph>
              <Text strong>Ngày nhập hàng: </Text>
              <Text>
                {dayjs(infrastructureData?.importDate).format('DD/MM/YYYY')}
              </Text>
            </Paragraph>
            <Paragraph>
              <Text strong>Ngày hết hạn: </Text>
              <Text>
                {dayjs(infrastructureData?.expirationDate).format('DD/MM/YYYY')}
              </Text>
            </Paragraph>
            <Paragraph style={{ marginBottom: '40px' }}>
              <Text strong>Trạng thái: </Text>
              <Text>{infrastructureData?.status}</Text>
            </Paragraph>
          </div>
        </Drawer>
      )}
    </>
  );
};

export default InfrastructureModal;

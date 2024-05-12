'use client';

import { useAxiosAuth } from '@/util/customHook';
import {
  Drawer,
  Form,
  Input,
  Modal,
  Select,
  Typography,
  notification,
} from 'antd';
import { useEffect, useState } from 'react';

interface IProps {
  modalType: string;
  infrastructureTypeData: null | IInfrastructureType;
  branchList: null | IBranchOption[];
  setInfrastructureTypeData: (value: null | IInfrastructureType) => void;
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  fetchInfrastructureTypesList: () => void;
}

const InfrastructureTypesModal = (props: IProps) => {
  const {
    modalType,
    infrastructureTypeData,
    branchList,
    setInfrastructureTypeData,
    isModalOpen,
    setIsModalOpen,
    fetchInfrastructureTypesList,
  } = props;
  const axiosAuth = useAxiosAuth();
  const [form] = Form.useForm();
  const { Text, Paragraph } = Typography;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const branchOptions = branchList?.map((branch) => {
    return {
      value: branch._id,
      label: branch.name,
    };
  });

  useEffect(() => {
    if (
      (modalType === 'view' && infrastructureTypeData) ||
      (modalType === 'edit' && infrastructureTypeData)
    ) {
      form.setFieldsValue({
        _id: infrastructureTypeData._id,
        code: infrastructureTypeData.code,
        name: infrastructureTypeData.name,
        branch: infrastructureTypeData.branch?._id,
      });
    }
  }, [form, infrastructureTypeData, modalType]);

  const onCloseModal = () => {
    if (!(modalType === 'view')) {
      form.resetFields();
    }
    setIsModalOpen(false);
    setInfrastructureTypeData(null);
  };

  const onFinish = async (value: any) => {
    if (modalType === 'edit') {
      const data = {
        _id: form.getFieldValue('_id'),
        code: value.code.trim(),
        name: value.name.trim(),
        branch: value.branch,
      };

      try {
        setIsLoading(true);
        const res = await axiosAuth.patch(`/infrastructure-types`, data);

        if (res.data && res.data.message === 'success') {
          notification.success({
            message: 'Cập nhật thành công !',
            duration: 2,
          });
          setIsLoading(false);
          onCloseModal();
          fetchInfrastructureTypesList();
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
      const data = {
        code: value.code.trim(),
        name: value.name.trim(),
        branch: value.branch,
      };

      try {
        setIsLoading(true);
        const res = await axiosAuth.post(`/infrastructure-types`, data);

        if (res.data && res.data.message === 'success') {
          notification.success({
            message: 'Tạo mới thành công !',
            duration: 2,
          });
          setIsLoading(false);
          onCloseModal();
          fetchInfrastructureTypesList();
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

  return (
    <>
      {modalType === 'add' || modalType === 'edit' ? (
        <Modal
          title={
            modalType === 'add'
              ? 'Thêm mới loại cơ sở vật chất'
              : 'Cập nhật loại cơ sở vật chất'
          }
          open={isModalOpen}
          maskClosable={false}
          centered
          onOk={() => form.submit()}
          onCancel={onCloseModal}
          okText="Lưu"
          cancelText="Hủy"
          confirmLoading={isLoading}
        >
          <Form form={form} onFinish={onFinish}>
            <Form.Item<IInfrastructureType>
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
                placeholder="Chọn chi nhánh"
                allowClear
                options={branchOptions}
                filterOption={filterOption}
                showSearch
              />
            </Form.Item>
            <Form.Item<IInfrastructureType>
              label="Mã"
              name="code"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập mã !',
                },
              ]}
            >
              <Input placeholder="Nhập mã" allowClear />
            </Form.Item>
            <Form.Item<IInfrastructureType>
              label="Tên"
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập tên !',
                },
              ]}
            >
              <Input placeholder="Nhập tên" allowClear />
            </Form.Item>
          </Form>
        </Modal>
      ) : (
        <Drawer
          title="Thông tin loại cơ sở vật chất"
          placement="right"
          open={isModalOpen}
          onClose={onCloseModal}
        >
          <div
            className="view-infrastructure-type"
            style={{ padding: '20px', height: '100%', overflowY: 'auto' }}
          >
            <Paragraph>
              <Text strong>Chi nhánh: </Text>
              <Text>{infrastructureTypeData?.branch?.name}</Text>
            </Paragraph>
            <Paragraph>
              <Text strong>Mã: </Text>
              <Text>{infrastructureTypeData?.code}</Text>
            </Paragraph>
            <Paragraph style={{ marginBottom: '40px' }}>
              <Text strong>Tên: </Text>
              <Text>{infrastructureTypeData?.name}</Text>
            </Paragraph>
          </div>
        </Drawer>
      )}
    </>
  );
};

export default InfrastructureTypesModal;

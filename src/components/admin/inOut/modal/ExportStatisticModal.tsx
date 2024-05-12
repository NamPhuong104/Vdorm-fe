'use client';

import { DatePicker, Form, Modal, Select } from 'antd';
import vi from 'antd/es/date-picker/locale/vi_VN';
import dayjs from 'dayjs';
import queryString from 'query-string';
import { useEffect, useState } from 'react';

interface IProps {
  isExportStatisticModalOpen: boolean;
  setIsExportStatisticModalOpen: (value: boolean) => void;
  branchList: IBranchOption[];
}

const ExportStatisticModal = (props: IProps) => {
  const {
    isExportStatisticModalOpen,
    setIsExportStatisticModalOpen,
    branchList,
  } = props;
  const [form] = Form.useForm();
  const [branchOptions, setBranchOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    if (branchList) {
      const branchOptionsClone: { value: string; label: string }[] = [];
      branchOptionsClone.push({ value: 'Tất cả', label: 'Tất cả' });
      branchList.map((branch: IBranchOption) => {
        branchOptionsClone.push({ value: branch._id, label: branch.name });
      });
      setBranchOptions(branchOptionsClone);
    }
  }, [branchList]);

  const handleCloseUpdateModal = () => {
    form.resetFields();
    setIsExportStatisticModalOpen(false);
  };

  const onFinish = async (values: any) => {
    const { branch, time } = values;
    const query = {
      branch,
      time: dayjs(time).format('YYYY-MM-DD').toString(),
    };
    const param = queryString.stringify(query);

    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/check-in-out/statistic/export?${param}`;

    handleCloseUpdateModal();
  };

  return (
    <Modal
      title="Xuất file thống kê danh sách vào/ra"
      maskClosable={false}
      centered
      open={isExportStatisticModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCloseUpdateModal}
      okText="Lưu"
      cancelText="Hủy"
    >
      <Form name="export-statistic-in-out" form={form} onFinish={onFinish}>
        <Form.Item
          label="Chi nhánh"
          name="branch"
          rules={[{ required: true, message: 'Vui lòng chọn chi nhánh !' }]}
        >
          <Select
            options={branchOptions}
            allowClear
            placeholder="Chọn chi nhánh"
          />
        </Form.Item>
        <Form.Item
          label="Thời gian"
          name="time"
          rules={[{ required: true, message: 'Vui lòng chọn thời gian !' }]}
        >
          <DatePicker
            allowClear
            placeholder="Chọn thời gian"
            style={{ width: '100%' }}
            format={'DD/MM/YYYY'}
            locale={vi}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ExportStatisticModal;

'use client';

import { useAxiosAuth } from '@/util/customHook';
import {
  DatePicker,
  DatePickerProps,
  Drawer,
  Form,
  Input,
  Modal,
  Select,
  Typography,
  notification,
} from 'antd';
import locale from 'antd/es/date-picker/locale/vi_VN';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import utcPlugin from 'dayjs/plugin/utc';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface IProps {
  modalType: string;
  violationData: null | IViolation;
  branchList: null | IBranchOption[];
  handlerList: null | IUserOption[];
  setViolationData: (value: null | IViolation) => void;
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  fetchViolationList: () => void;
  violationLevelOptions: { value: string; label: string }[];
}

dayjs.extend(utcPlugin);

const ViolationModal = (props: IProps) => {
  const {
    modalType,
    violationData,
    branchList,
    handlerList,
    setViolationData,
    isModalOpen,
    setIsModalOpen,
    fetchViolationList,
    violationLevelOptions,
  } = props;
  const { Text, Paragraph } = Typography;
  const { status } = useSession();
  const axiosAuth = useAxiosAuth();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [studentList, setStudentList] = useState<IStudentOption[]>([]);
  const [branchOptions, setBranchOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [handlerOptions, setHandlerOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [studentOptions, setStudentOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [branchSelected, setBranchSelected] = useState<string>('');

  useEffect(() => {
    if (modalType === 'edit' && violationData) {
      const students = violationData?.studentList.map((s) => {
        return modalType === 'edit' ? s._id : `${s.code} - ${s.fullName}`;
      });
      form.setFieldsValue({
        _id: violationData._id,
        reason: violationData.reason,
        level: violationData.level,
        studentList: students,
        branch: violationData.branch?._id,
        dateOfViolation: dayjs(violationData.dateOfViolation).utcOffset(0),
        handler: violationData.handler?._id,
        note: violationData.note,
      });
    } else if (modalType === 'add' && violationData === null) {
      form.setFieldValue('note', '');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, violationData, modalType]);

  useEffect(() => {
    if (status === 'authenticated' && violationData && modalType === 'edit') {
      fetchStudentList(violationData?.branch?._id);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, violationData, modalType]);

  useEffect(() => {
    if (status === 'authenticated' && branchSelected) {
      form.resetFields(['studentList']);
      fetchStudentList(branchSelected);
    }

    if (!branchSelected) {
      form.resetFields(['studentList']);
      setStudentList([]);
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
    if (handlerList) {
      const handlerOptionsClone: { value: string; label: string }[] = [];
      handlerList.map((handler: IUserOption) => {
        handlerOptionsClone.push({
          value: handler._id,
          label: `${handler.code} - ${handler.fullName}`,
        });
      });
      setHandlerOptions(handlerOptionsClone);
    }
  }, [handlerList]);

  useEffect(() => {
    if (studentList) {
      const studentOptionsClone: { value: string; label: string }[] = [];
      studentList.map((student: IStudentOption) => {
        studentOptionsClone.push({
          value: student._id,
          label: `${student.code} - ${student.fullName}`,
        });
      });
      setStudentOptions(studentOptionsClone);
    }
  }, [studentList]);

  const fetchStudentList = async (branch: string) => {
    try {
      const res = await axiosAuth.get(`/student-profiles?branch=${branch}`);
      setStudentList(res?.data?.data?.result as IStudentOption[]);
    } catch (error) {
      setStudentList([]);
    }
  };

  const onOk = (value: DatePickerProps['value']) => {
    form.setFieldValue('dateOfViolation', value);
  };

  const onCloseModal = () => {
    if (!(modalType === 'view')) {
      form.resetFields();
    }
    setIsModalOpen(false);
    setViolationData(null);
  };

  const filterOption = (
    input: string,
    option?: { label: string; value: string },
  ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const onFinish = async (value: any) => {
    if (modalType === 'edit') {
      const data = {
        _id: form.getFieldValue('_id'),
        reason: value.reason,
        dateOfViolation: dayjs(value.dateOfViolation).format(
          'YYYY-MM-DD[T]HH:mm:00.000[Z]',
        ),
        level: value.level,
        status: value.status,
        note: value.note,
        studentList: value.studentList,
        handler: value.handler,
        branch: value.branch,
      };

      try {
        setIsLoading(true);
        const res = await axiosAuth.patch(`/violations`, data);

        if (res.data && res.data.message === 'success') {
          notification.success({
            message: 'Cập nhật thành công !',
            duration: 2,
          });
          setIsLoading(false);
          onCloseModal();
          fetchViolationList();
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
        reason: value.reason,
        dateOfViolation: dayjs(value.dateOfViolation).format(
          'YYYY-MM-DD[T]HH:mm:00.000[Z]',
        ),
        level: value.level,
        note: value.note,
        studentList: value.studentList,
        handler: value.handler,
        branch: value.branch,
      };

      try {
        setIsLoading(true);
        const res = await axiosAuth.post(`/violations`, data);

        if (res.data && res.data.message === 'success') {
          notification.success({
            message: 'Tạo mới thành công !',
            duration: 2,
          });
          setIsLoading(false);
          onCloseModal();
          fetchViolationList();
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

  return (
    <>
      {modalType === 'add' || modalType === 'edit' ? (
        <Modal
          title={modalType === 'add' ? 'Thêm mới vi phạm' : 'Cập nhật vi phạm'}
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
            <Form.Item<IViolation>
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
                onChange={(value) => setBranchSelected(value)}
                filterOption={filterOption}
                showSearch
              />
            </Form.Item>
            <Form.Item<IViolation>
              label="Lý do"
              name="reason"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập lý do !',
                },
                {
                  pattern: /^[A-Za-zÀ-ỹ0-9\s]+$/,
                  message:
                    'Chữ cái đầu viết hoa và không được chứa ký tự đặt biệt',
                },
              ]}
            >
              <Input placeholder="Nhập lý do" allowClear />
            </Form.Item>
            <Form.Item<IViolation>
              label="Thời gian"
              name="dateOfViolation"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn thời gian !',
                },
              ]}
            >
              <DatePicker
                locale={locale}
                placeholder="Chọn thời gian"
                style={{ width: '100%' }}
                showTime={{ format: 'HH:mm' }}
                onOk={onOk}
                format={'DD/MM/YYYY HH:mm'}
                allowClear
              />
            </Form.Item>
            <Form.Item<IViolation>
              label="Mức độ"
              name="level"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn mức độ !',
                },
              ]}
            >
              <Select
                placeholder="Chọn mức độ"
                allowClear
                options={violationLevelOptions}
                filterOption={filterOption}
                showSearch
              />
            </Form.Item>
            <Form.Item<IViolation>
              label="Sinh viên vi phạm"
              name="studentList"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn sinh viên !',
                },
              ]}
            >
              <Select
                mode="multiple"
                placeholder="Chọn sinh viên"
                allowClear
                filterOption={filterOption}
                options={studentOptions}
                maxTagCount={4}
              />
            </Form.Item>
            <Form.Item<IViolation>
              label="Người phụ trách"
              name="handler"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn người phụ trách !',
                },
              ]}
            >
              <Select
                placeholder="Chọn người phụ trách"
                options={handlerOptions}
                allowClear
                filterOption={filterOption}
                showSearch
              />
            </Form.Item>
            <Form.Item<IViolation>
              label="Ghi chú"
              name="note"
              rules={[
                {
                  pattern:
                    /^[A-ZÀ-ỹ][A-Za-zÀ-ỹ\s]*(?:[.,]\s?[A-Za-zÀ-ỹ\s]*)*$/u,
                  message:
                    'Chữ cái đầu viết hoa và không được chứa ký tự đặt biệt',
                },
              ]}
            >
              <Input placeholder="Nhập ghi chú" allowClear />
            </Form.Item>
          </Form>
        </Modal>
      ) : (
        <Drawer
          title="Thông tin vi phạm"
          placement="right"
          open={isModalOpen}
          onClose={onCloseModal}
        >
          <div
            className="view-violation"
            style={{ padding: '20px', height: '100%', overflowY: 'auto' }}
          >
            <Paragraph>
              <Text strong>Chi nhánh: </Text>
              <Text>{violationData?.branch?.name}</Text>
            </Paragraph>
            <Paragraph>
              <Text strong>Lý do: </Text>
              <Text>{violationData?.reason}</Text>
            </Paragraph>
            {violationData?.note && (
              <Paragraph>
                <Text strong>Ghi chú: </Text>
                <Text>{violationData?.note}</Text>
              </Paragraph>
            )}
            <Paragraph>
              <Text strong>Thời gian vi phạm: </Text>
              <Text>
                {dayjs(violationData?.dateOfViolation)
                  .utcOffset(0)
                  .format('DD/MM/YYYY - HH:mm')}
              </Text>
            </Paragraph>
            <Paragraph>
              <Text strong>Mức độ: </Text>
              <Text>{violationData?.level}</Text>
            </Paragraph>
            <Paragraph>
              <Text strong>Trạng thái: </Text>
              <Text>{violationData?.status}</Text>
            </Paragraph>
            <Paragraph>
              <Text strong>Người phụ trách: </Text>
              <Text>
                {violationData?.handler &&
                  `${violationData?.handler?.code} - ${violationData?.handler?.fullName}`}
              </Text>
            </Paragraph>
            <Paragraph style={{ marginBottom: '40px' }}>
              <Text strong>Danh sách sinh viên: </Text>
              <Text>
                {violationData?.studentList
                  ?.map((student) => {
                    return `${student.code} - ${student.fullName}`;
                  })
                  .join(', ')}
              </Text>
            </Paragraph>
          </div>
        </Drawer>
      )}
    </>
  );
};

export default ViolationModal;
